import {DateTime} from 'luxon';
export const pickupZone='Europe/Amsterdam';
export type PickupHour={day:number;opens:string;closes:string;closed:boolean};
export function pickupDays(hours:PickupHour[],closures:string[],settings:{lead_minutes:number|null;interval_minutes:number|null},now:DateTime=DateTime.now(),count=15){
 if(!now.isValid)return [];const current=now.setZone(pickupZone),cutoff=current.plus({minutes:settings.lead_minutes??0}),interval=settings.interval_minutes??30,days:{date:string;times:string[]}[]=[];
 if(!Number.isInteger(interval)||interval<5||interval>240)return days;
 for(let i=0;i<count;i++){const date=current.plus({days:i}).startOf('day'),iso=date.toISODate()!,h=hours.find(h=>h.day===date.weekday);if(!h||h.closed||closures.includes(iso))continue;const times:string[]=[];
 // Advance local wall-clock minutes, so DST changes cannot shift opening hours.
 const [oh,om]=h.opens.split(':').map(Number),[ch,cm]=h.closes.split(':').map(Number);
 for(let minute=oh*60+om;minute<ch*60+cm;minute+=interval){const wall=iso+'T'+String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0');const start=DateTime.fromISO(wall,{zone:pickupZone});if(start.toFormat("yyyy-MM-dd'T'HH:mm")!==wall)continue;if(start>current&&start>=cutoff)times.push(start.toUTC().toISO()!);}
 if(times.length)days.push({date:iso,times});
 }return days;
}
