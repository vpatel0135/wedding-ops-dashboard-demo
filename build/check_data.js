const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const src = path.join(__dirname, '..', 'src');
const load = (file, expr) => vm.runInNewContext(fs.readFileSync(path.join(src, file), 'utf8') + '\n' + expr);
const d = load('data.js', 'weddingData');
const p = load('planning.js', 'planningSeed');
const ids = new Set();
for (const key of ['events','timelineItems','people','vendors','venues','teams','contacts','assignments']) {
  for (const item of d[key]) { assert(!ids.has(item.id), 'duplicate ID'); ids.add(item.id); }
}
for (const row of [...d.events, ...d.timelineItems]) {
  if(row.eventId) assert(ids.has(row.eventId), 'event reference');
  if(row.venueId) assert(ids.has(row.venueId), 'venue reference');
  for(const id of [...(row.ownerTeamIds||[]), ...(row.vendorIds||[])]) assert(ids.has(id), 'ownership reference');
}
for(const row of d.assignments) { assert(ids.has(row.assigneeId)); assert(ids.has(row.targetId)); }
for(const team of d.teams) for(const id of team.memberIds) assert(ids.has(id));
for(const task of p.tasks) { assert(ids.has(task.ownerId)); assert(ids.has(task.scopeEventId)); }
assert(d.timelineItems.length === 135);
assert(d.events.length === 6);
assert(d.events.every(e => e.lens === null));
assert(d.timelineItems.every(t => !t.audioTracks));
assert([...d.people,...d.vendors,...d.venues,...d.contacts].every(x => !x.phone));
console.log('Fixture checks passed: 6 events, 135 timeline items; linked records resolve; private integrations absent.');
