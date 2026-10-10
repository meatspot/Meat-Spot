import 'server-only';
import {createClient} from '@supabase/supabase-js';
export function serviceClient(){if(!process.env.SUPABASE_SECRET_KEY||!process.env.NEXT_PUBLIC_SUPABASE_URL)throw new Error('SERVICE_NOT_CONFIGURED');return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});}
