import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dccirpngkozsexrzuzgy.supabase.co'
const SUPABASE_KEY = 'sb_publishable_AkQHbgiNMpUmhtJWjvRSsQ_YsyMe5ew'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)