/*Problem 2: Check if Today is a Weekend
Problem:
Write a function isWeekend() that returns true if today is Saturday or Sunday.
Explanation:
getDay() returns a number from 0 to 6 representing Sunday to Saturday. */

function isWeekend() {
    const today = new Date();
    const day = today.getDay();
    return day === 0 || day === 6;
}
console.log(isWeekend());