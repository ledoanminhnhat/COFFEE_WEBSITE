const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const productRoutes = require('./routes/productRoutes'); 
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'project.html'));
});

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes); 
app.use('/api/carts', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});