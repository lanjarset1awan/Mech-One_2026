import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import ws from "ws";

dotenv.config();

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is missing! Using SUPABASE_ANON_KEY (Row Level Security policies will apply).");
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    supabaseKey,
    {
        realtime: {
            transport: ws,
        },
    }
);

export default supabase;