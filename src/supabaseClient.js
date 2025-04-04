import { createClient } from "@supabase/supabase-js";

const supaUrl = import.meta.env.VITE_SUPA_URL;
const supaKey = import.meta.env.VITE_SUPA_KEY;

export const supabase = createClient(supaUrl, supaKey);
