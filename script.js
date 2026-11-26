
const form = document.querySelector("#expense-section form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const tableBody = document.querySelector("#expense-table-section tbody");

// Load saved expenses or use the sample expenses in your HTML
let expenses = JSON.parse(localStorage.getItem("myExpenses")) || 
    Array.from(tableBody.querySelectorAll("tr")).map(row => {
        const cells = row.querySelectorAll("td");
        return {
            name: cells[0].textContent,
            amount: Number(cells[1].textContent.replace(/[^0-9.]/g, "")),
            category: cells[2].textContent,
            date: cells[3].textContent
        };
    });

function saveExpenses() {
    localStorage.setItem("myExpenses", JSON.stringify(expenses));
}

function displayExpenses() {
    tableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");

        const values = [
            expense.name,
            "Ksh. " + Number(expense.amount).toLocaleString("en-KE"),
            expense.category,
            expense.date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = () => editExpense(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.style.backgroundColor = "#dc2626";
        deleteButton.style.marginLeft = "5px";
        deleteButton.onclick = () => deleteExpense(index);

        actions.append(editButton, deleteButton);
        row.appendChild(actions);

        tableBody.appendChild(row);
    });

    const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount), 0
    );

    document.getElementById("total-expenses").textContent =
        "Total Expenses: Ksh. " + total.toLocaleString("en-KE");
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    const newExpense = {
        name: name,
        amount: amount,
        category: category,
        date: new Date().toISOString().split("T")[0]
    };

    expenses.push(newExpense);

    saveExpenses();
    displayExpenses();

    form.reset();

    alert("Expense added successfully!");
});

function deleteExpense(index) {
    if (confirm("Are you sure you want to delete this expense?")) {
        expenses.splice(index, 1);
        saveExpenses();
        displayExpenses();
    }
}

function editExpense(index) {
    const expense = expenses[index];

    const newName = prompt("Enter expense name:", expense.name);
    if (newName === null) return;

    const newAmount = prompt("Enter amount:", expense.amount);
    if (newAmount === null) return;

    if (!newName.trim() || !Number.isFinite(Number(newAmount)) ||
        Number(newAmount) <= 0) {
        alert("Please enter valid details.");
        return;
    }

    expense.name = newName.trim();
    expense.amount = Number(newAmount);

    saveExpenses();
    displayExpenses();
    alert("Expense updated successfully!");
}

saveExpenses();
displayExpenses();
