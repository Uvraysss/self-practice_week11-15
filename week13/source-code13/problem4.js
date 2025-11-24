/*Problem 4: Display Current Date and Time
Problem:
Write a JavaScript code to display the current date and time in the format "YYYY-MM-DD HH:MM:SS".
Explanation:
getMonth() starts from 0, so we add 1 to get the correct month.
padStart(2,'0') ensures numbers are always 2 digits. */

const now = new Date();
const formatted = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
console.log(formatted);