// Run: node --test tests/astronomy-regression.test.cjs
// Deterministic unit tests for the observatory's horizon-window and overlap logic.
// These use synthetic altitudes, not external ephemeris reference values.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
function extract(name,next){const start=html.indexOf('function '+name+'(');const end=html.indexOf('function '+next+'(',start);assert.ok(start>=0&&end>start,'function source found: '+name);return html.slice(start,end)}
const source=extract('intervals','overlap')+extract('overlap','day');
function run(altitude,start=0,end=86400000){const ctx={altitude,sunTarget:()=>0};vm.createContext(ctx);vm.runInContext(source,ctx);return {intervals:(body='Mars')=>ctx.intervals(body,start,end),overlap:(a,b)=>ctx.overlap(a,b)}}
test('always below horizon: no windows',()=>{const v=run(()=>-5).intervals();assert.equal(v.total,0);assert.equal(v.rises.length,0);assert.equal(v.sets.length,0)});
test('always above horizon: full day, no rise or set',()=>{const v=run(()=>5).intervals();assert.equal(v.total,86400000);assert.equal(v.rises.length,0);assert.equal(v.sets.length,0)});
test('single rise and set: 6h through 18h',()=>{const v=run(t=>t>=21600000&&t<64800000?10:-10).intervals();assert.ok(Math.abs(v.total-43200000)<60000);assert.equal(v.rises.length,1);assert.equal(v.sets.length,1)});
test('rise in final partial sampling interval is retained',()=>{const v=run(t=>t>=86340000?10:-10).intervals();assert.equal(v.rises.length,1);assert.ok(v.total>0&&v.total<120000)});
test('set in final partial sampling interval is retained',()=>{const v=run(t=>t>=86340000?-10:10).intervals();assert.equal(v.sets.length,1);assert.ok(v.total<86400000)});
test('overlap computes intersections and excludes touching endpoints',()=>{const {overlap}=run(()=>1);const w=overlap([[0,10],[20,30]],[[5,20],[30,40]]);assert.deepEqual(JSON.parse(JSON.stringify(w)),[[5,10]])});
test('DST local day lengths reflect timezone transitions',()=>{const script="const bounds=k=>{let [y,m,d]=k.split('-').map(Number);return [new Date(y,m-1,d).getTime(),new Date(y,m-1,d+1).getTime()]};console.log((bounds('2026-03-08')[1]-bounds('2026-03-08')[0])/3600000,(bounds('2026-11-01')[1]-bounds('2026-11-01')[0])/3600000)";const {execFileSync}=require('node:child_process');const result=execFileSync(process.execPath,['-e',script],{env:{...process.env,TZ:'America/New_York'},encoding:'utf8'}).trim();assert.equal(result,'23 25')});
