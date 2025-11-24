/*Problem 2: Filter Table Rows (Event + Logic)
Problem:
You have a table of user names and an input field to filter names:
When typing text, only rows that include the typed name should be displayed. */

const search = document.getElementById('search');
const rows = document.querySelectorAll('table tr');

search.addEventListener('input', () => {
    const term = search.value.toLowerCase();
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
})