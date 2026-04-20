import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dccirpngkozsexrzuzgy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjY2lycG5na296c2V4cnp1emd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjM0MDUsImV4cCI6MjA5MjA5OTQwNX0.odL6XemcZ2m6C77vZpGvZgw27lurjoyw_otX97-NNFQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)