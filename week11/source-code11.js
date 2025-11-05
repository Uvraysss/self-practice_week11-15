// Synchronous programming
console.log("starting...")
console.log("working...")
console.log("ending...")

// Asynchronous programming
console.log("starting...")
setTimeout(() => console.log("working#2..."), 5000)
console.log("ending...")

//ตัวอย่างการไม่จัดการกับ promise ที่จะสร้างปัญหาให้กับโปรแกรม
function doSomething(hasResource) {
    return new Promise((resolve, reject) => {
    setTimeout(() => (hasResource ? resolve("done") : reject("fail")), 5000)
  })
}

/*// no handle prommise
console.log("starting...")
const workStatus = doSomething(false)
console.log(workStatus)
console.log("ending...")
//starting...
// Promise { <pending> }
// ending...
//fail, throw exception*/


/*/ handle prommise - 2 ways (1) .then().catch(), (2.) async-await()
//1) .then().catch()
console.log("starting...")

// กรณี true
doSomething(true).then((result) => {
    console.log("working...")
    console.log(`work status= ${result}`)
    console.log("ending...")
}).catch((error) => {
    console.log(error)
})

// กรณี false
doSomething(false).then((result) => {
    console.log("working...")
    console.log(`work status= ${result}`)
    console.log("ending...")
}).catch((error) => {
    console.log(error)
})*/

//2. async-await()
// เมื่อไรใช้ await ต้องสร้างฟังก์ชันและกำหนด async เพราะ await ไม่สามารถอยู่ลอย ๆ ได้
async function working2() {
    console.log("starting...")
    try {
        const workStatus = await doSomething(true)
        console.log(workStatus)
        console.log("ending...")
    } catch (error) {
        console.log(error)
    }
}
working2()

async function working2() {
    console.log("starting...")
    try {
        const workStatus = await doSomething(false)
        console.log(workStatus)
        console.log("ending...")
    } catch (error) {
        console.log(error)
    }
}
working2()

// Practice
/*Exercise 1 — Predict the Output (Basic)
    console.log('A');
    setTimeout(() => console.log('B'), 0);
    Promise.resolve().then(() => console.log('C'));
    console.log('D');
Question:
What will be printed in the console, and why? 

Ans : 
A
D
C
B */

/*Exercise 2 — Convert .then() Chain to async/await
    doSomething(true)
    .then(res => {
        console.log('res =', res);
        return doSomething(true);
    })
    .then(res2 => {
        console.log('res2 =', res2);
    })
    .catch(err => console.log(err));
    
Question:
Rewrite this code using async/await syntax to achieve the same result. */

async function run() {
    try {
    const res = await doSomething(true)
    console.log('res =', res)
    const res2 = await doSomething(true)
    console.log('res2 =', res2)
  } catch (err) {
    console.log(err);
  }
}
run()

/*Exercise 3 — Run Promises Sequentially in a Loop
Question:
    Given:
    function task(n) {
    return new Promise(resolve => setTimeout(() => resolve(n), n * 500));
    }
    const tasks = [1, 2, 3];
Run each task sequentially (one after another) and collect all results into an array. */

function task(n) {
  return new Promise((resolve) => setTimeout(() => resolve(n), n * 500))
}

async function runSequential(tasks) {
  const results = []
  for (const t of tasks) {
    const r = await task(t)  
    results.push(r)
  }
  return results
}
runSequential([1,2,3]).then(res => console.log(res))
