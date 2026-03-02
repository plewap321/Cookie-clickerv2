import { createClient } from '@supabase/supabase-js';

const supabaseUrl ='https://mwuhoxzqwxcamydkryqw.supabase.co';
const supabaseKey = 'sb_publishable_6QzSOiHXfXDEg5VlYQsAWQ_pJfnqfAb';

export const supabase = createClient(supabaseUrl, supabaseKey);