import {createHash} from 'node:crypto';
import type {CartLine,Product,Quote} from './types';
import type {Locale} from './i18n';
export function basis(unit:Product['unit_type']){return unit==='kg'?1000:1;}
export function lineTotal(price:number,quantity:number,unit:Product['unit_type']){if(!Number.isSafeInteger(price)||price<0||!Number.isSafeInteger(quantity)||quantity<=0)throw new Error('Invalid price or quantity');const denominator=BigInt(basis(unit));const amount=(BigInt(price)*BigInt(quantity)+denominator/2n)/denominator;if(amount>BigInt(Number.MAX_SAFE_INTEGER))throw new Error('Amount overflow');return Number(amount);}
export function effectivePrice(product:Product,now:number){if(product.price_minor===null)throw new Error('Unpriced product');return product.offer_price_minor!==null&&product.offer_until&&Date.parse(product.offer_until)>now?product.offer_price_minor:product.price_minor;}
export function quoteProducts(lines:CartLine[],products:Product[],locale:Locale,now=Date.now()):Quote{
 const seen=new Set<string>();const result=lines.map(line=>{if(seen.has(line.productId))throw new Error('Duplicate product');seen.add(line.productId);const p=products.find(p=>p.id===line.productId);if(!p||p.status!=='published'||!p.available||p.price_minor===null)throw new Error('Product unavailable');if(!Number.isInteger(line.quantity)||line.quantity<p.min_quantity_base||(line.quantity-p.min_quantity_base)%p.step_quantity_base!==0)throw new Error('Invalid quantity');const price=effectivePrice(p,now);return {...line,name:p.translations[locale]?.name??p.translations.nl?.name??p.slug,unit:p.unit_type,unitPrice:price,lineTotal:lineTotal(price,line.quantity,p.unit_type),image:p.images[0]??null};});
 const total=result.reduce((n,l)=>n+l.lineTotal,0);if(!Number.isSafeInteger(total)||total>100000000)throw new Error('Order too large');
 const fingerprint=createHash('sha256').update(JSON.stringify(result.map(l=>({id:l.productId,q:l.quantity,p:l.unitPrice,u:l.unit,total:l.lineTotal})).sort((a,b)=>a.id.localeCompare(b.id)))).digest('hex');
 return {lines:result,total,fingerprint};
}
export const transitions:Record<string,readonly string[]>={submitted:['confirmed','cancelled'],confirmed:['ready','cancelled'],ready:['completed','cancelled'],completed:[],cancelled:[]};
export const canTransition=(from:string,to:string)=>transitions[from]?.includes(to)??false;
