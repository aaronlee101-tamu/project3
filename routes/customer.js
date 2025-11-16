const express = require('express');
const pool = require('../db');

const router = express.Router();
router.get('/', (req, res) => {
    res.render('index', {page:'index'});
});
router.get('/item-selection', (req, res) => {
    const orderId = req.query.orderId || 0;
    res.render('item-selection', {page:'item-selection', orderId});
});

router.get('/menu-items', async (req, res) => {
    try {
        const kioskFunctions = require('../public/functions/kiosk/getEntrees')(pool);
        const { getEntreeNames } = kioskFunctions; 
        const entreeNames = await getEntreeNames();
        const mealType = req.query.item || "Plate";


        res.render('menu-items', {
            page:'menu-items', 
            entreeNames: entreeNames,
            mealType: mealType,

        });
    } catch (error) {
        console.error("Error retrieving menu items:", error.message);
        res.status(500).send("Failed to load menu items.");
    }
});

router.get('/drinks', (req, res) => {
    res.render('drinks', {
        page: 'drinks'
    });
});

router.get('/appetizers', (req, res) => {
    res.render('apps', {
        page: 'apps'
    });
});

router.post('/start-order', async (req, res) => {
    const { employee_id, total_cost, } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO orders (employee_id, total_cost, time_stamp) VALUES ($1, $2, NOW()) RETURNING order_id',
            [employee_id, total_cost]
        );
        const orderId = result.rows[0].order_id;
        res.json({ orderId });
    } catch (error) {
        console.error('Error starting order:', error);
        res.status(500).json({ error: 'Failed to start order' });
    }
});
router.post('/order-entry', (req, res) => {
    entry = req.body;
    
    console.log('Received order entry:', req.body);
    if (!req.body || !req.body.menuItems) {
        console.error('Invalid order entry data');
        return res.status(400).send('Invalid order entry data');
    }

    res.render('order-details', { entry: req.body });
});

router.get('/get-price', async (req, res) => {
    const mealType = req.query.item || "Plate";
    try {
        const priceResult = await pool.query(
            'Select price from menuprice where size=$1',
            [mealType]
        );
        res.json({ price: priceResult.rows[0].price });
    } catch (error) {
        console.error("Error retrieving price:", error.message);
        res.status(500).send("Failed to retrieve price.");
    }
});

router.post('/finalize-order', async (req, res) => {
    const entry = req.body;
    try {
        const orderResult = await pool.query(
            'UPDATE orders SET total_cost = $1 WHERE order_id = $2 RETURNING *',
            [entry.price, entry.orderId]
        );
        
        if (entry.menuItems && entry.menuItems.length > 0) {
            const insertPromises = entry.menuItems.map(item => {
                return pool.query(
                    'insert into orderentry (order_id, menuitem_id, size, price) values ($1, $2, $3, $4)',
                    [entry.orderId, item.id, entry.size, entry.price]
                );
            });
            await Promise.all(insertPromises);
        }
        if (entry.menuItems && entry.menuItems.length > 0) {
            const items = [];
            const menItem = entry.menuItems.map(item => {
                items.push(" " + item.name);
            });
            const compOrder = await pool.query(
                'insert into completedorders (order_id, menuitem, size) values ($1, $2, $3)',
                [entry.orderId, items.toString(), entry.size]);
        }
        
        res.json({ success: true, order: orderResult.rows[0] });

    } catch (error) {
        console.error('Error finalizing order:', error);
        res.status(500).json({ error: 'Failed to finalize order' });
    }
});

module.exports = router;