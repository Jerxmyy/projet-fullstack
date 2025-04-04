import { createClient } from "@supabase/supabase-js";

const supaUrl = "https://qvonhyxawuzkqaaihsbs.supabase.co";
const supaKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b25oeXhhd3V6a3FhYWloc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NzMsImV4cCI6MjA1ODk4ODc3M30.T8_69hU42d03wlhhBo8VL4n2qSLxwQ87AIDg6xGksFw";

export const supabase = createClient(supaUrl, supaKey);
