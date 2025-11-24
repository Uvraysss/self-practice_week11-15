/*Problem 3: Countdown Timer (Logic + setInterval)
Problem:
Create a countdown timer starting from 10 seconds:
Display the remaining time every second.
When time reaches 0, display "Time's up!". */

let time = 10;
const timer = setInterval(() => {
    console.log(time);
    time--;
    if(time < 0) {
        clearInterval(timer);
        console.log("Time's up!");
    }
}, 1000);