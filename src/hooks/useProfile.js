import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { supabase } from "../lib/supabaseClient";

export default function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    setProfile(undefined);

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, loading: profile === undefined };
}
