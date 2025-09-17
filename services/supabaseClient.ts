
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vftriozekaxmyslaxprp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdHJpb3pla2F4bXlzbGF4cHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTQ5MTIsImV4cCI6MjA3MzU5MDkxMn0.YNrXZA_ih5vnmU9HBkmPmMArTIGd680lTUhVzyClT9M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
