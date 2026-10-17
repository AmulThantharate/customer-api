const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const customers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
];

app.get('/', (req, res) => {
    res.json({
        application: 'customer-api',
        version: '1.0.0',
        status: 'OK',
    });
});

app.get('/customers', (req, res) => {
    res.json(customers);
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Customer API listening on port ${port}`);
    });
}

module.exports = app;
