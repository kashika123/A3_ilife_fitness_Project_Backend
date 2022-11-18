const express = require("express");
const router = express.Router();
const Order = require("../models/Order")
const Auth = require('../middlewares/auth')
const Cart = require('../models/ShoppingCart')

router.post('/', Auth, async (req, res) => {
    const owner = req.user._id
    const paypalId = req.body.paypalId
    try {
        const cart = await Cart.findOne({ userId: owner }).populate("products.productId").exec()
        const order = new Order()
        order.payed = false
        order.delivery = false
        order.userId = owner
        order.shoppingCart = cart.products
        order.paypalId = paypalId
        order.save().then((cart) => {
            res.status(201).json({ cart })

        }).catch(err => {
            return res.status(500).send({
                message: "Problem creating CART",
                error: err,
            });
        })

    } catch (error) {
    }
})

router.put('/', Auth, async (req, res) => {
    console.log(req.body)
    const paypalId = req.body.paypalId
    console.log(paypalId)
    Order.findOne({ paypalId: paypalId }).then(order => {
        if (order) {
            order.payed = true
            order.save().then(order => {
                return res.send(201)
            })
        }
    })
})


module.exports = router;