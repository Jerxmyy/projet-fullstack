import { createClient } from "@supabase/supabase-js";

const supaUrl = process.env.SUPA_AURL;
const supaKey = process.env.SUPA_KEY;

export const supabase = createClient(supaUrl, supaKey);
