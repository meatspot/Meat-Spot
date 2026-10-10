import 'server-only';
import {cache} from 'react';
import {configured,createServerSupabase} from './supabase/server';
export class HttpError extends Error{constructor(public status:number,public code:string){super(code);}}
export const currentUser=cache(async()=>{if(!configured())return null;const db=await createServerSupabase();const {data,error}=await db.auth.getUser();return error||!data.user?.email_confirmed_at||!data.user.identities?.some(identity=>identity.provider==='google')?null:data.user;});
export async function requireUser(){const user=await currentUser();if(!user)throw new HttpError(401,'UNAUTHENTICATED');return user;}
export async function isAdmin(){const user=await currentUser();if(!user)return false;const db=await createServerSupabase();const {data,error}=await db.rpc('current_user_is_admin');return !error&&data===true;}
export async function requireAdmin(){const user=await requireUser();if(!await isAdmin())throw new HttpError(403,'FORBIDDEN');return user;}
