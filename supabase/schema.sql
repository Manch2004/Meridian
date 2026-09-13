-- Meridian support ticket system + user profiles + AI chat + staff/admin
-- access: schema + RLS + storage bucket, backed by Supabase Auth
-- (auth.uid()) ownership.
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / ON CONFLICT/
-- DROP POLICY IF EXISTS / CREATE OR REPLACE), including as an upgrade over
-- earlier versions of this file.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- User profiles
--
-- public.profiles is a 1:1 extension of auth.users (id shared as both PK and
-- FK) for app-facing profile data that doesn't belong in Supabase's own
-- auth.users table. A row is created automatically for every new signup via
-- the on_auth_user_created trigger below -- there is no client INSERT policy,
-- so a profile can only come into existence through that trigger, never by a
-- client posting an arbitrary row (which would let someone claim another
-- user's id). email is copied in at creation time purely as a denormalized
-- convenience (e.g. so the admin panel can list users without needing
-- service-role access to auth.users); id/email/created_at/role are then
-- frozen by the protect_profile_immutable_fields trigger so a user can
-- update their own username/avatar_url but not reassign their row's
-- identity or grant themselves staff access.
--
-- This table is defined before tickets/AI chat because public.is_staff()
-- (used by their staff RLS policies) reads from it, and a SQL-language
-- function is validated against the catalog at CREATE FUNCTION time -- it
-- has to exist first.
--
-- role has no self-service way to change: to grant staff access, a project
-- admin runs this directly in the SQL Editor (auth.role() there is not
-- 'authenticated', so the immutable-fields trigger below doesn't block it):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- 'support' and 'admin' currently grant identical ticket access via
-- is_staff() -- the two-tier naming is reserved for when staff-management
-- features need to distinguish them.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text,
  username text unique check (username is null or char_length(username) between 3 and 24),
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'support', 'admin'))
);

-- Upgrade path if an earlier version of this table already exists without role.
alter table public.profiles add column if not exists role text not null default 'user' check (role in ('user', 'support', 'admin'));

alter table public.profiles enable row level security;

drop policy if exists "users can view their own profile" on public.profiles;
create policy "users can view their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Lets the admin ticket-reassignment picker list every support/admin
-- profile to assign a ticket to -- without this, is_staff() would only see
-- the caller's own row (the plain "own profile" policy above) and could
-- never build a list of *other* staff.
drop policy if exists "staff can view all profiles" on public.profiles;
create policy "staff can view all profiles"
on public.profiles
for select
to authenticated
using (public.is_staff());

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Keep id/email/created_at/role immutable and updated_at fresh when a
-- request comes from the normal authenticated client, regardless of what
-- values it sends for those columns. The auth.role() = 'authenticated'
-- guard means a direct SQL Editor / service-role update (used to grant
-- staff access, see above) is never blocked by this trigger.
create or replace function public.protect_profile_immutable_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'authenticated' then
    new.id := old.id;
    new.email := old.email;
    new.created_at := old.created_at;
    new.role := old.role;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_protect_immutable_fields on public.profiles;
create trigger profiles_protect_immutable_fields
before update on public.profiles
for each row execute function public.protect_profile_immutable_fields();

-- Backfill: create a profile for any existing auth.users row that predates
-- this migration (e.g. accounts created while testing Login/Signup before
-- this table existed).
insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Checks the caller's own profiles.role. security definer so it isn't
-- itself blocked by profiles' RLS; every staff-facing policy below is built
-- on this.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('support', 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  meridian_username text,
  name text,
  email text,
  category text not null check (category in (
    'Account & Verification',
    'Deposit',
    'Withdrawal',
    'Staking',
    'Bonuses & Points',
    'Referral System',
    'Meridian Fund',
    'Technical Problems',
    'Security',
    'Other'
  )),
  status text not null default 'Open' check (status in (
    'Open',
    'In Progress',
    'Waiting for User',
    'Resolved',
    'Closed'
  )),
  assigned_to text,
  language text check (language in ('en', 'hy', 'ru'))
);

-- Upgrade path if the earlier (pre-auth) version of this table already
-- exists without user_id: adds the column, but leaves it nullable since a
-- NOT NULL backfill would require picking an owner for pre-existing rows.
alter table public.tickets add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Upgrade path if an earlier version of this table has user_id as NOT NULL
-- (tickets tied to an account only). The Contact Support form now also
-- accepts submissions with no Meridian account (user_id null), identified
-- instead by the contact email the visitor typed in -- so the column has to
-- allow null.
alter table public.tickets alter column user_id drop not null;

-- A ticket must be traceable to *someone*: either an account (user_id) or a
-- contact email typed into the anonymous Contact Support form. Named (rather
-- than inline in the create table above) so it applies the same way to a
-- table that already existed before this constraint was introduced.
alter table public.tickets drop constraint if exists tickets_user_id_or_email_check;
alter table public.tickets add constraint tickets_user_id_or_email_check
  check (user_id is not null or (email is not null and length(trim(email)) > 0));

create index if not exists tickets_user_id_idx on public.tickets(user_id);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  created_at timestamptz not null default now(),
  sender_type text not null check (sender_type in ('user', 'support')),
  message text not null,
  attachment_url text
);

create index if not exists ticket_messages_ticket_id_idx on public.ticket_messages(ticket_id);

-- Bump the ticket's updated_at whenever a message is added, so both the
-- customer's My Tickets list and the staff admin queue can sort by most
-- recently active first.
create or replace function public.touch_ticket_on_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tickets set updated_at = now() where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists ticket_messages_touch_ticket on public.ticket_messages;
create trigger ticket_messages_touch_ticket
after insert on public.ticket_messages
for each row execute function public.touch_ticket_on_new_message();

-- Keep the fields a client shouldn't be able to reassign (id, owner,
-- created_at, and the requester's submitted contact details) frozen when a
-- request comes in through the normal authenticated client -- this is what
-- lets the staff UPDATE policy below safely grant staff write access to
-- `status`/`assigned_to`/`category` without also handing them the ability
-- to reassign a ticket to a different owner. The auth.role() = 'authenticated'
-- guard means a direct SQL Editor / service-role update is never blocked by
-- this trigger.
create or replace function public.protect_ticket_immutable_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'authenticated' then
    new.id := old.id;
    new.user_id := old.user_id;
    new.created_at := old.created_at;
    new.meridian_username := old.meridian_username;
    new.name := old.name;
    new.email := old.email;
    new.language := old.language;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists tickets_protect_immutable_fields on public.tickets;
create trigger tickets_protect_immutable_fields
before update on public.tickets
for each row execute function public.protect_ticket_immutable_fields();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Ownership is proven via Supabase Auth: every ticket is tied to the
-- authenticated user who created it (user_id = auth.uid()), and messages/
-- attachments inherit access through the ticket they belong to. Anonymous
-- (logged-out) requests are not allowed to create or read tickets -- a user
-- must be signed in first. Staff (public.is_staff()) additionally get
-- read access to every ticket/message, write access to a ticket's
-- status/assigned_to (see protect_ticket_immutable_fields above for what
-- stays off-limits even to staff), and can post sender_type = 'support'
-- messages on any ticket.
-- ---------------------------------------------------------------------------

alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

drop policy if exists "anyone can create a ticket" on public.tickets;
drop policy if exists "users can create their own ticket" on public.tickets;
create policy "users can create their own ticket"
on public.tickets
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'Open'
  and assigned_to is null
);

-- Contact Support also accepts a ticket from a visitor with no Meridian
-- account -- identified only by the email they typed into the form
-- (user_id stays null). There is no anonymous SELECT/UPDATE policy: an
-- anonymous submitter can't read their ticket back through this app (no
-- session to prove ownership with), so follow-up happens over email/staff
-- reply rather than My Tickets. Practically, the ticket_id UUID doubles as
-- an unguessable token -- the same trust model the storage policies below
-- already use for ticket folders.
drop policy if exists "anonymous can create a ticket with a contact email" on public.tickets;
create policy "anonymous can create a ticket with a contact email"
on public.tickets
for insert
to anon
with check (
  user_id is null
  and email is not null
  and length(trim(email)) > 0
  and status = 'Open'
  and assigned_to is null
);

drop policy if exists "users can view their own tickets" on public.tickets;
create policy "users can view their own tickets"
on public.tickets
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "staff can view all tickets" on public.tickets;
create policy "staff can view all tickets"
on public.tickets
for select
to authenticated
using (public.is_staff());

drop policy if exists "staff can update any ticket" on public.tickets;
create policy "staff can update any ticket"
on public.tickets
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "anyone can add a user message to an existing ticket" on public.ticket_messages;
drop policy if exists "users can add a message to their own ticket" on public.ticket_messages;
create policy "users can add a message to their own ticket"
on public.ticket_messages
for insert
to authenticated
with check (
  sender_type = 'user'
  and exists (
    select 1 from public.tickets t
    where t.id = ticket_id and t.user_id = auth.uid()
  )
);

drop policy if exists "users can view messages on their own ticket" on public.ticket_messages;
create policy "users can view messages on their own ticket"
on public.ticket_messages
for select
to authenticated
using (
  exists (
    select 1 from public.tickets t
    where t.id = ticket_id and t.user_id = auth.uid()
  )
);

drop policy if exists "staff can view all ticket messages" on public.ticket_messages;
create policy "staff can view all ticket messages"
on public.ticket_messages
for select
to authenticated
using (public.is_staff());

drop policy if exists "staff can add a support message to any ticket" on public.ticket_messages;
create policy "staff can add a support message to any ticket"
on public.ticket_messages
for insert
to authenticated
with check (sender_type = 'support' and public.is_staff());

-- Mirrors "anonymous can create a ticket with a contact email" above: the
-- Contact Support form inserts the ticket's opening message in the same
-- request, before the visitor has any session to prove ownership with.
drop policy if exists "anonymous can add the initial message to an anonymous ticket" on public.ticket_messages;
create policy "anonymous can add the initial message to an anonymous ticket"
on public.ticket_messages
for insert
to anon
with check (
  sender_type = 'user'
  and exists (
    select 1 from public.tickets t
    where t.id = ticket_id and t.user_id is null
  )
);

-- ---------------------------------------------------------------------------
-- Storage: ticket-attachments bucket
--
-- Private bucket (public = false). Uploads/downloads must land in a folder
-- named after a ticket the requesting user owns, e.g.
-- "<ticket_id>/screenshot.png". Staff can view (but not upload into) any
-- ticket's folder.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('ticket-attachments', 'ticket-attachments', false)
on conflict (id) do nothing;

drop policy if exists "anyone can upload an attachment into an existing ticket folder" on storage.objects;
drop policy if exists "users can upload an attachment into their own ticket folder" on storage.objects;
create policy "users can upload an attachment into their own ticket folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1 from public.tickets t
    where t.id::text = (storage.foldername(name))[1] and t.user_id = auth.uid()
  )
);

drop policy if exists "users can view attachments in their own ticket folder" on storage.objects;
create policy "users can view attachments in their own ticket folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1 from public.tickets t
    where t.id::text = (storage.foldername(name))[1] and t.user_id = auth.uid()
  )
);

drop policy if exists "staff can view any ticket attachment" on storage.objects;
create policy "staff can view any ticket attachment"
on storage.objects
for select
to authenticated
using (bucket_id = 'ticket-attachments' and public.is_staff());

-- Mirrors the anonymous ticket/message policies above: an anonymous Contact
-- Support submission can still attach a screenshot, uploaded into that same
-- (ownerless) ticket's folder. No anonymous SELECT policy -- same reasoning
-- as tickets/ticket_messages, the visitor has no session to read it back
-- with through this app.
drop policy if exists "anonymous can upload an attachment into an anonymous ticket folder" on storage.objects;
create policy "anonymous can upload an attachment into an anonymous ticket folder"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1 from public.tickets t
    where t.id::text = (storage.foldername(name))[1] and t.user_id is null
  )
);

-- ---------------------------------------------------------------------------
-- AI chat
--
-- Mirrors the tickets/ticket_messages ownership model: a conversation
-- belongs to the user who started it (user_id = auth.uid()), and messages
-- inherit access through their conversation. Only role = 'user' messages can
-- be inserted by the client -- 'assistant' and 'system' messages are meant
-- to be written by a future server-side edge function (using the service
-- role, which bypasses RLS) once it actually calls the LLM, the same way
-- support-authored ticket_messages are deferred to server-side/admin
-- access. There is no UPDATE/DELETE policy yet for conversations or
-- messages (matching the current tickets table) -- renaming/deleting a
-- conversation can be added once the chat UI's actual needs are known.
-- ---------------------------------------------------------------------------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text
);

create index if not exists conversations_user_id_idx on public.conversations(user_id);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  created_at timestamptz not null default now(),
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null
);

create index if not exists chat_messages_conversation_id_idx on public.chat_messages(conversation_id);

alter table public.conversations enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "users can create their own conversation" on public.conversations;
create policy "users can create their own conversation"
on public.conversations
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can view their own conversations" on public.conversations;
create policy "users can view their own conversations"
on public.conversations
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "users can add a user message to their own conversation" on public.chat_messages;
create policy "users can add a user message to their own conversation"
on public.chat_messages
for insert
to authenticated
with check (
  role = 'user'
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

drop policy if exists "users can view messages in their own conversation" on public.chat_messages;
create policy "users can view messages in their own conversation"
on public.chat_messages
for select
to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

-- Bump the parent conversation's updated_at whenever a message is added, so
-- conversations can be listed most-recently-active first.
create or replace function public.touch_conversation_on_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists chat_messages_touch_conversation on public.chat_messages;
create trigger chat_messages_touch_conversation
after insert on public.chat_messages
for each row execute function public.touch_conversation_on_new_message();
