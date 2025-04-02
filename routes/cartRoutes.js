const express = require('express');
const pool = require('../db'); 

const router = express.Router();

// Get cart items for a specific user
router.get('/items/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Get the user's cart ID
        const [carts] = await pool.query(
            'SELECT cart_id FROM carts WHERE user_id = ?',
            [userId]
        );

        if (carts.length === 0) {
            return res.json({ items: [], totals: { subtotal: 0, shipping: 30000, total: 30000 } });
        }

        const cartId = carts[0].cart_id;

        // Get all items in the cart with product details
        const [items] = await pool.query(
            `SELECT ci.cart_item_id, ci.quantity, p.product_id, p.name, p.price, p.image_url,
                    (p.price * ci.quantity) AS item_total
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + Number(item.item_total), 0);
        const shipping = 30000; // Fixed shipping cost
        const total = subtotal + shipping;

        res.json({
            items: items,
            totals: {
                subtotal: subtotal,
                shipping: shipping,
                total: total,
            },
        });
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get cart ID for a specific user
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [carts] = await pool.query(
            'SELECT cart_id FROM carts WHERE user_id = ?', 
            [userId]
        );

        if (carts.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.json({ cart_id: carts[0].cart_id });
    } catch (err) {
        console.error('Error getting cart ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Add item to cart
router.post('/items', async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    try {
        // Validate input
        if (!cart_id || !product_id || !quantity) {
            return res.status(400).json({ error: 'Invalid request payload' });
        }

        // Check if the product already exists in the cart
        const [existingItems] = await pool.query(
            'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cart_id, product_id]
        );

        if (existingItems.length > 0) {
            // Product already exists in cart, update quantity
            const newQuantity = existingItems[0].quantity + quantity;
            
            await pool.query(
                'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
                [newQuantity, existingItems[0].cart_item_id]
            );
            
            res.status(200).json({ message: 'Item quantity updated successfully' });
        } else {
            // Product doesn't exist in cart, add new item
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cart_id, product_id, quantity]
            );
            
            res.status(201).json({ message: 'Item added to cart successfully' });
        }
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Update item quantity in cart
router.put('/items/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    try {
        await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
            [quantity, itemId]
        );

        res.json({ message: 'Cart item updated successfully' });
    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove item from cart
router.delete('/items/:itemId', async (req, res) => {
    const itemId = req.params.itemId;

    try {
        await pool.query(
            'DELETE FROM cart_items WHERE cart_item_id = ?',
            [itemId]
        );

        res.json({ message: 'Cart item removed successfully' });
    } catch (err) {
        console.error('Error removing cart item:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
