import test from 'node:test';
import assert from 'node:assert/strict';
import {selectionVisuals} from '../src/lib/showcase';
import type {Product} from '../src/lib/types';
const product=(slug:string,status:Product['status']='published'):Product=>({id:slug,slug,status,category_id:'category',available:false,unit_type:'kg',price_minor:null,min_quantity_base:100,step_quantity_base:100,offer_price_minor:null,offer_until:null,images:[],translations:{nl:{name:slug,description:''}}});
test('home selection retains products beyond the first page and includes new owner products',()=>{
 const products=[...Array.from({length:30},(_,i)=>product('new-'+i)),product('rundvlees')];
 const visuals=selectionVisuals(products,'nl');
 assert.equal(visuals.filter(v=>v.product).length,31);
 assert.equal(visuals.find(v=>v.slug==='rundvlees')?.product?.slug,'rundvlees');
 assert.ok(visuals.find(v=>v.slug==='new-29'));
 assert.equal(new Set(visuals.map(v=>v.slug)).size,visuals.length);
});
test('archived base products do not create invalid guide links, while real guides remain',()=>{
 const visuals=selectionVisuals([product('rundvlees','archived'),product('kip-assortiment','draft')],'ar');
 assert.equal(visuals.some(v=>v.slug==='rundvlees'),false);
 assert.equal(visuals.some(v=>v.slug==='kip-assortiment'),false);
 assert.ok(visuals.find(v=>v.slug==='ribeye'));
});
