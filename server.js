const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

let dailyLimit = {};
let expenses = [];


app.post('/setLimit', (req, res) => {
    const {limit, date} = req.body;
    dailyLimit[date] = limit;
    res.status(200).send(`Daily limit ${date} set to ${limit}`);
});

app.get('/getLimit', (req, res) => {
    const {date} = req.body;
    if (dailyLimit[date]) {
        res.status(200).send(dailyLimit[date]);
    } else {
        res.status(400).send('No limit on this date');
    }
});

app.post('/searchExpenses', (req, res) => {
    const {date} = req.body;
    const filteredExpenses = expenses.filter(expense => expense.date === date);
    res.send(filteredExpenses);
});

app.post('/createExpense', (req, res) => {
    const {name, amount, date} = req.body;
    const thisDaySum = expenses
        .filter(expense => expense.date === date)
        .map(expense => Number(expense.amount))
        .reduce((partialSum, a) => partialSum + a, 0);

    if (!name || !amount || !date) {
        res.status(400).send('Not all required fields have been provided');
    } else if (dailyLimit[date] && amount + thisDaySum > dailyLimit[date]) {
        res.status(400).send('Expense exceeds daily limit');
    } else {
        const newExpense = {name, amount, date};
        expenses.push(newExpense);
        res.send(`Expense added: ${JSON.stringify(newExpense)}`);
    }
});

app.get('/getExpenses', (req, res) => {
    res.status(200).send(expenses);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
