import 'server-only';
import {createServerSupabase,configured} from './supabase/server';
import type {Product,Category} from './types';
export async function productsByIds(ids?:string[]){if(!configured()||ids?.length===0)return [];const db=await createServerSupabase();const all:Product[]=[];for(let offset=0;;offset+=500){let query=db.from('products').select('*').in('status',['published','showcase']).order('created_at',{ascending:false}).order('id');if(ids)query=query.in('id',ids);const {data,error}=await query.range(offset,offset+499);if(error)throw new Error('CATALOG_UNAVAILABLE');all.push(...(data??[]) as Product[]);if(!data||data.length<500)break;}return all;}
export async function getCategories(){if(!configured())return [];const db=await createServerSupabase();const all:Category[]=[];for(let offset=0;;offset+=500){const {data,error}=await db.from('categories').select('*').eq('published',true).order('sort_order').order('id').range(offset,offset+499);if(error)throw new Error('CATALOG_UNAVAILABLE');all.push(...(data??[]) as Category[]);if(!data||data.length<500)break;}return all;}
export async function getProduct(slug:string){if(!configured())return null;const db=await createServerSupabase();const {data,error}=await db.from('products').select('*').eq('slug',slug).in('status',['published','showcase']).maybeSingle();if(error)throw new Error('CATALOG_UNAVAILABLE');return data as Product|null;}

export async function getCatalogPage(locale:import('./i18n').Locale,q:string,slug:string,page:number,categories:Category[]){
 if(!configured())return {products:[] as Product[],hasMore:false};
 const db=await createServerSupabase();let query=db.from('products').select('*').in('status',['published','showcase']).order('created_at',{ascending:false}).order('id');
 if(q)query=query.ilike('translations->'+locale+'->>name','%'+q.replace(/[%_]/g,'')+'%');
 if(slug){const selected=categories.find(c=>c.slug===slug);if(!selected)return {products:[] as Product[],hasMore:false};const ids=new Set([selected.id]);let changed=true;while(changed){changed=false;for(const c of categories)if(c.parent_id&&ids.has(c.parent_id)&&!ids.has(c.id)){ids.add(c.id);changed=true;}}query=query.in('category_id',[...ids]);}
 const {data,error}=await query.range((page-1)*24,page*24);if(error)throw new Error('CATALOG_UNAVAILABLE');return {products:(data??[]).slice(0,24) as Product[],hasMore:(data??[]).length>24};
}
