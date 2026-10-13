import type {Metadata} from 'next';import {headers} from 'next/headers';import {validLocale} from '@/lib/i18n';import './globals.css';
import './redesign.css';
import './request-design.css';import './control-design.css';
export const metadata:Metadata={metadataBase:new URL(process.env.APP_URL??'http://localhost:3000'),title:{default:'MEAT SPOT — Slagerij Veendam',template:'%s | MEAT SPOT'},description:'MEAT SPOT, Veenlustplein 11, Veendam.',icons:{icon:'/images/logo.jpeg'},verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined}};
export default async function RootLayout({children}:{children:React.ReactNode}){const raw=(await headers()).get('x-app-locale')??'nl',locale=validLocale(raw)?raw:'nl';return <html data-scroll-behavior="smooth" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><body>{children}</body></html>;}

