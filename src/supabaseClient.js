import { createClient } from "@supabase/supabase-js";

const supaUrl = "SUPA_URL";
const supaKey = "SUPA_KEY";

export const supabase = createClient(supaUrl, supaKey);
