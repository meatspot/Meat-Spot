import {NextRequest,NextResponse} from 'next/server';
import {configured,createServerSupabase} from '@/lib/supabase/server';
import {validLocale} from '@/lib/i18n';
import {safeNext} from '@/lib/http';
export async function GET(request:NextRequest){const raw=request.nextUrl.searchParams.get('locale')??'nl',locale=validLocale(raw)?raw:'nl';if(!configured())return NextResponse.redirect(new URL('/'+locale+'/account?error=unavailable',request.url));const next=safeNext(request.nextUrl.searchParams.get('next'),locale);const db=await createServerSupabase();const callback=new URL('/auth/callback',process.env.APP_URL??request.url);callback.searchParams.set('locale',locale);callback.searchParams.set('next',next);const {data,error}=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback.toString()}});if(error||!data.url)return NextResponse.redirect(new URL('/'+locale+'/account?error=login',request.url));return NextResponse.redirect(data.url);}
