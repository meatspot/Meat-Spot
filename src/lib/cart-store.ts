'use client';
import {useMemo,useSyncExternalStore} from 'react';
import type {CartLine} from './types';
const key='meat-spot-cart-v1',empty='{"v":1,"lines":[]}';
const subscribe=(callback:()=>void)=>{window.addEventListener('storage',callback);window.addEventListener('meat-spot-cart',callback);return ()=>{window.removeEventListener('storage',callback);window.removeEventListener('meat-spot-cart',callback);};};
const snapshot=()=>{try{return localStorage.getItem(key)??empty;}catch{return empty;}};
export function readCart(raw:string):CartLine[]{try{const data=JSON.parse(raw);if(data.v!==1||!Array.isArray(data.lines))return [];const seen=new Set<string>();return data.lines.filter((l:CartLine)=>{if(!l||typeof l.productId!=='string'||!/^[a-f0-9-]{36}$/i.test(l.productId)||!Number.isInteger(l.quantity)||l.quantity<1||l.quantity>100000||seen.has(l.productId))return false;seen.add(l.productId);return true;}).slice(0,40).map((l:CartLine)=>({productId:l.productId,quantity:l.quantity}));}catch{return [];}}
function write(lines:CartLine[]){localStorage.setItem(key,JSON.stringify({v:1,lines}));window.dispatchEvent(new Event('meat-spot-cart'));}
export function useCart(){const raw=useSyncExternalStore(subscribe,snapshot,()=>empty);const lines=useMemo(()=>readCart(raw),[raw]);return {lines,add:(productId:string,quantity:number)=>{const current=readCart(snapshot()).filter(l=>l.productId!==productId);write([...current,{productId,quantity}]);},update:(productId:string,quantity:number)=>write(readCart(snapshot()).map(l=>l.productId===productId?{productId,quantity}:l)),remove:(id:string)=>write(readCart(snapshot()).filter(l=>l.productId!==id)),clear:()=>write([])};}
