const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async(req, res) => {
    res.render('manager_views/managerView'); 
}); 

router.get('/inventory', async(req, res) => {
    try{
        const result = await db.query("SELECT * FROM inventory ORDER BY item_id");
        res.render('manager/inventory', { inventory: result.rows});
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error loading inventory"); 

    }
});

router.post('/inventory/update', async(req, res) => {
    const{item_id, quantity} = req.body;

    try{
        await db.query(
            "UPDATE inventory SET quantity = $1 WHERE item_id = $2", 
            [quantity, item_id]
        );
        res.redirect('/manager/inventory');
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error updating inventory");

    }
}); 

router.post('/inventory/add', async(req, res) => {
    const{item_name, quantity, unit} = req.body;

    try{
        await db.query(
            "INSERT INTO inventory (itemname, quantity, unit) VALUES ($1, $2, $3)", 
            [item_name, quantity, unit]
        );
        res.redirect('/manager/inventory');
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error adding inventory item");

    }
});

router.post('/inventory/delete', async(req, res) => {
    const{item_id} = req.body;

    try{
        await db.query(
            "DELETE FROM inventory WHERE item_id = $1", 
            [item_id]
        );
        res.redirect('/manager/inventory');
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error deleting inventory item");

    }
});

module.exports = router;