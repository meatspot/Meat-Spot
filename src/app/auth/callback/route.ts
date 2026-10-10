import {NextRequest,NextResponse} from 'next/server';
import {configured,createServerSupabase} from '@/lib/supabase/server';
import {validLocale} from '@/lib/i18n';
import {safeNext} from '@/lib/http';
export async function GET(request:NextRequest){const raw=request.nextUrl.searchParams.get('locale')??'nl',locale=validLocale(raw)?raw:'nl';if(!configured())return NextResponse.redirect(new URL('/'+locale+'/account?error=unavailable',request.url));const code=request.nextUrl.searchParams.get('code');if(code){const db=await createServerSupabase();const {error}=await db.auth.exchangeCodeForSession(code);if(!error){await db.rpc('bootstrap_admin');return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get('next'),locale),process.env.APP_URL??request.url));}}return NextResponse.redirect(new URL('/'+locale+'/account?error=login',request.url));}
