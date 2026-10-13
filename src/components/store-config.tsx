'use client';import {createContext,useContext} from 'react';import {whatsappNumber} from '@/lib/controls';
const StoreContext=createContext('');export function StoreConfig({phone,children}:{phone:string;children:React.ReactNode}){return <StoreContext.Provider value={whatsappNumber(phone)}>{children}</StoreContext.Provider>;}export const useStoreWhatsapp=()=>useContext(StoreContext);
