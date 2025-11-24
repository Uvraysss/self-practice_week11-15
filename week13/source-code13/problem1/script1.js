/*Problem 1: Dynamic To-Do List (Event + DOM)
Problem:
Create a To-Do List on a web page:
There is an input field for adding tasks and an “Add” button.
When clicking “Add,” the task should appear as a list item with a “Delete” button.
Clicking “Delete” removes the task from the list. */

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

addBtn.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if(!task) return;

    const li = document.createElement('li');
    li.textContent = task;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => li.remove());

    li.appendChild(delBtn);
    taskList.appendChild(li);

    taskInput.value = '';
});