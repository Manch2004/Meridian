// Centralized external / action links for the site.
// Update the values here once the real destinations are known — every
// component that needs them imports from this file instead of hardcoding.

export const TELEGRAM_URL = "https://t.me/meridian_placeholder"; // TODO: replace with real URL

export const OPEN_APP_URL = "#"; // TODO: replace with real URL

// Base URL of the meridian-ai-backend service (sibling project). Set via
// VITE_API_URL in .env — localhost for dev, the deployed backend URL in
// production.
export const AI_CHAT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
