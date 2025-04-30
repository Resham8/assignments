/*
  Write a function `findLargestElement` that takes an array of numbers and returns the largest element.
  Example:
  - Input: [3, 7, 2, 9, 1]
  - Output: 9
*/

function findLargestElement(numbers) {
    let MAX = -Infinity;    

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > MAX) {
            MAX = numbers[i];
        }        
    }
    return MAX;
}

// console.log(findLargestElement([-1,0,-6,-7]));

module.exports = findLargestElement;