import {createClient} from '@supabase/supabase-js';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,secret=process.env.SUPABASE_SECRET_KEY,ref=process.env.MEAT_SPOT_PROJECT_REF,owner=process.env.OWNER_ADMIN_EMAIL;
if(!url||!secret||!ref||!owner)throw new Error('Required private setup environment is incomplete');
if(ref==='nnhixorravjljzqtqqkh'||new URL(url).hostname!==ref+'.supabase.co')throw new Error('Project identity mismatch');
const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const items=[
 {slug:'kip',names:['Kip','الدجاج','Chicken','Tavuk'],image:'chicken.webp',unit:'kg'},
 {slug:'vlees',names:['Vlees','اللحوم','Meat','Et'],image:'meat.webp',unit:'kg'},
 {slug:'vis',names:['Vis','السمك','Fish','Balık'],image:'fish.webp',unit:'kg'},
 {slug:'spiesjes',names:['Spiesjes','الأسياخ','Skewers','Şiş'],image:'skewers.webp',unit:'piece'},
 {slug:'kippenvleugels',names:['Kippenvleugels','أجنحة الدجاج','Chicken wings','Tavuk kanat'],image:'wings.webp',unit:'kg'},
 {slug:'ribstukken',names:['Ribstukken','قطع الأضلاع','Rib pieces','Kaburga parçaları'],image:'ribs.webp',unit:'kg'},
];
const locales=['nl','ar','en','tr'];
for(const [sort,item] of items.entries()){
 const translations=Object.fromEntries(locales.map((locale,i)=>[locale,{name:item.names[i],description:''}]));
 const category=await db.from('categories').upsert({slug:item.slug,published:false,sort_order:sort,translations},{onConflict:'slug',ignoreDuplicates:true});if(category.error)throw new Error('Category setup failed');
 const read=await db.from('categories').select('id').eq('slug',item.slug).single();if(read.error)throw new Error('Category lookup failed');
 const product=await db.from('products').upsert({slug:item.slug+'-assortiment',category_id:read.data.id,status:'draft',available:false,unit_type:item.unit,price_minor:null,min_quantity_base:item.unit==='kg'?100:1,step_quantity_base:item.unit==='kg'?100:1,translations,images:['/images/'+item.image]},{onConflict:'slug',ignoreDuplicates:true});if(product.error)throw new Error('Product setup failed');
}
const result=await db.rpc('configure_owner',{p_email:owner});if(result.error)throw new Error('Owner setup failed');
console.log('Draft catalogue created without replacing existing records. Review names, units, quantities and prices before publishing.');
