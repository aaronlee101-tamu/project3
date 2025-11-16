const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    orderNumber = 0;
    const newOrder = await db.query('INSERT INTO orders (employee_id, time_stamp) VALUES ($1, $2)', [103, new Date()]);
    res.render('item-selection');
});

module.exports = router;