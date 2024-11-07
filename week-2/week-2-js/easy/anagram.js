/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
*/

function isAnagram(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  if(len1 !== len2){
    return false;
  }

  const a = str1.split('').sort().join('');
  const b = str2.split('').sort().join('');

  return a === b;
}

// console.log(isAnagram('silent','listen'));
// console.log(isAnagram('apple','apples'));

module.exports = isAnagram;
