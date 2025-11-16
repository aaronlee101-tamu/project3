const express  = require('express');
const path = require('path');      

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');

const customer = require('./routes/customer'),
      cashier = require('./routes/cashier');

app.use('/', customer);
app.use('/cashier', cashier); 

const manager = require('./routes/manager')
app.use('/manager', manager)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});