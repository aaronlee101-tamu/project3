const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    const { rows } = await db.query('SELECT * FROM completedorders ORDER BY order_id DESC');
    const orders = { orders: rows };
    res.render('cashier', orders);
});

router.post('/mark-complete', async (req, res) => {
    
    const orderId = req.body;
    console.log(orderId);

    try {
        await db.query('DELETE FROM completedorders WHERE order_id = $1', [orderId.orderId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking order as complete:', error);
        res.status(500).json({ success: false, error: 'Failed to mark order as complete' });
    }
});

module.exports = router;