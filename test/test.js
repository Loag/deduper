const dedup = require('../lib/core')();

let dataset = [
  { 
   l1: 'foo',
   l2: 'bar',
   l3: 'baz',
   c1: 'some value'},
  {
   l1: 'foo',
   l2: 'bar',
   l3: 'baz',
  },
  {
   l1: 'foo',
   l2: 'bar',
   l3: 'baz',
  },
  {
   l1: 'bar',
   l2: 'bar',
   l3: 'bar',
  }
];

console.log(dedup.find(dataset, ['l1', 'l2', 'l3']));
console.log(dedup.merge(dataset, dedup.find(dataset, ['l1', 'l2', 'l3'])));