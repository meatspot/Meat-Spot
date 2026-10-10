import {NextRequest,NextResponse} from 'next/server';
import {createServerSupabase} from '@/lib/supabase/server';
import {HttpError} from '@/lib/auth';import {sameOrigin,apiError} from '@/lib/http';
import {validLocale} from '@/lib/i18n';
export async function POST(request:NextRequest){try{sameOrigin(request);const form=await request.formData();const raw=String(form.get('locale')??'nl'),locale=validLocale(raw)?raw:'nl';const db=await createServerSupabase();const {error}=await db.auth.signOut();if(error)throw new HttpError(503,'SIGNOUT_FAILED');return NextResponse.redirect(new URL('/'+locale,request.url),{status:303});}catch(e){return apiError(e);}}
