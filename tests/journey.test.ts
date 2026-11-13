import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getJourneyState } from '../src/lib/journey';
test('entering the process chapter from either direction never selects a negative step',()=>{
 for(const position of [2.999847897,2.99991,2.999999,3,3.000001]){
  const state=getJourneyState(position);
  assert.equal(state.chapter,3);
  assert.equal(state.processStep,0);
  assert.ok(state.fraction>=0);
 }
});
test('all positions across chapter boundaries keep process steps within the six-item workflow',()=>{
 for(let chapter=0;chapter<=6;chapter++)for(const offset of [-.00005,0,.00005,.3,.68,.99]){
  const state=getJourneyState(chapter+offset);
  assert.ok(state.chapter>=0&&state.chapter<=6);
  assert.ok(state.processStep>=0&&state.processStep<=5);
 }
});
test('nonfinite and out-of-range scroll inputs are bounded',()=>{
 assert.equal(getJourneyState(Number.NaN).chapter,0);
 assert.equal(getJourneyState(-5).progress,0);
 assert.equal(getJourneyState(100).chapter,6);
});

test("subpixel anchor rounding still opens the intended chapter",()=>{
 for(let chapter=1;chapter<=6;chapter++){
  const state=getJourneyState((chapter*974*1.35-.5)/(974*1.35));
  assert.equal(state.chapter,chapter);
  assert.equal(state.fraction,0);
 }
});
