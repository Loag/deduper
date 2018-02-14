const crypto = require('crypto');

class Dedup {
  constructor(options) {

  }
  
  // return duplicates
  find(input, fields) {
    if(varType(input) !== 'array') throw 'input must be array';
    if(varType(fields) !== 'array') throw 'fields must be array';
    let check = {};
    let dupes = [];
    for (let [index, obj] of input.entries()) {
      let tmpkey= ''; // our full string to hash
      for (let key of fields) {
        let r = obj[key].toLowerCase();
        tmpkey += r.split(' ').join(''); // remove spaces
      }
      // remove symbols and extra spaces
      tmpkey = tmpkey.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      tmpkey = tmpkey.replace(/\s{2,}/g,"");
      // tmpkey here to crypto
      const hash = crypto.createHmac('sha256', '')
                   .update(tmpkey)
                   .digest('base64');
      if (varType(check[hash]) === 'array') {
        check[hash].push(index);
      } else {
        check[hash] = [index];
      }
    }
    for (let key of Object.keys(check)) {
      if (check[key].length > 1) {
        dupes.push(check[key]);
      }
    }
    // check should only contain duplicates here
    return dupes;
  }

  merge(input, duplicates) { // input is array of objs, duplicates is array of arrays of dupe indexes
    let dataset = input.slice(0);
    for (let dupes of duplicates) { // get array of dupe index
      let toMerge = [];
      for (let index of dupes) { // get single index from array
        toMerge.push(input[index]); // get object from input 

        remove(dataset, input[index]); // remove object from dataset
      }
      // create the new merged object here with the toMerge array
      let count = 0;
      let map = {};
      for (let obj of toMerge) {
        if (Object.keys(obj).length > count) {
          count = Object.keys(obj).length;
          map = Object.assign({}, obj);
        }
      }

      // clear all fields
      for (let key of Object.keys(map)) {
        map[key] = '';
      }
      // now here we have map which is all the keys we need
      // but their values are empty
      
      // so we have our objects to merge together and our
      // map object to place their values on. so go through
      // objects, then their keys, then place it on the correct
      // value

      for (let obj of toMerge) {
        for (let key of Object.keys(obj)) {
          // i guess this stuff really isnt necessary 
          if (!(map[key])) {
            map[key] = obj[key]; // this will obviously place the values from the last object on the mapped one
          }
        }
      }
      dataset.push(map);
    }
    return dataset;
  }
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
      array.splice(index, 1);
  }
}

function varType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

function create(options) {
  return new Dedup(options);
}

module.exports = create;
