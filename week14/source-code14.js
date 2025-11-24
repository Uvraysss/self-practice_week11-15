/*Problem 1: Find the Largest Number in an Array
Problem:
Write a function findMax(arr) that receives an array of numbers and returns the largest number in the array.*/

function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
console.log(findMax([3, 8, 2, 10, 5]));

/*Problem 2: Count Vowels in a String
Problem:
Write a function countVowels(str) that returns how many vowels (a, e, i, o, u) appear in a given string.*/

function countVowels(str) {
    const vowels = "aeiouAEIOU";
    let count = 0;
    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    return count;
}
console.log(countVowels("Hello World"));

/*Problem 3: Reverse a String
Problem:
Write a function reverseString(str) that returns the string reversed.*/

function reverseString(str) {
    return str.split("").reverse().join("");
}
console.log(reverseString("JavaScript"));

/*Problem 4: Sum All Numbers from 1 to N
Problem:
Write a function sumToN(n) that returns the total sum from 1 to n.*/

function sumToN(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
console.log(sumToN(10));

/*Problem 5: Check if a Number is Prime
Problem:
Write a function isPrime(num) that returns true if the number is a prime number.*/

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}
console.log(isPrime(17));