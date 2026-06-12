import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get headers with auth token
export const getAuthHeaders = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      apikey: supabaseAnonKey,
    };
  } catch (err) {
    console.error("Error getting auth headers:", err);
    return {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    };
  }
};
