const express = require("express");
const router = express.Router();
const Cart = require('../models/ShoppingCart')
const Currencies = require('../models/Currencies')
const Product = require('../models/Product')
const Auth = require('../middlewares/auth')


//GET A CART -------------------------------------------------------------------------------
router.get('/', Auth, async (req, res) => {


    const owner = req.user._id

    try {

        const cart = await Cart.findOne({ userId: owner }).populate("products.productId").exec()
        res.send(cart)
        if (cart && cart.products.length > 0) {
            res.status(200).send(cart)
        } else {
            res.send(null)
        }
    } catch (error) {
        res.status(500).send()
    }
})

//ADD A PRODUCT TO CART -------------------------------------------------------------------------------
router.post('/', Auth, async (req, res) => {


    try {

        const murValue = await Currencies.findOne({ type: 'MUR' })

        // get userID
        const owner = req.user._id
        const dataCart = req.body


        const [{ productId, quantity }] = dataCart.products

        const cart = await Cart.findOne({ userId: owner })
        const product = await Product.findOne({ _id: productId })

        // product doesn't exist
        if (!product) {

            res.status(404).send({ message: "product not found" })
        }

        //getPrice
        const price = product.promotionPrice != undefined && product.promotionPrice > 0 ? product.promotionPrice : product.normalPrice;

        // check if cart exists for this user
        if (cart) {
            const itemIndex = cart.products.findIndex(product => product.productId == productId)

            //check if product is already in cart
            if (itemIndex > -1) {
                const product = cart.products[itemIndex]
                product.quantity = quantity
                product.price = price
                cart.products[itemIndex] = product
                cart.totalPrice = cart.products.reduce((acc, current) => {
                    return acc + current.quantity * current.price
                }, 0)
                cart.totalPriceUSD = (cart.totalPrice * murValue.rate).toFixed(2)
                await cart.save()
                res.status(200).send(cart)

            } else {
                cart.products.push({ productId, quantity, price })
                cart.totalPrice = cart.products.reduce((acc, current) => {
                    return acc + current.quantity * current.price
                }, 0)
                cart.totalPriceUSD = (cart.totalPrice * murValue.rate).toFixed(2)
                await cart.save()
                res.status(200).send(cart)

            }
        } else {
            // validate request
            if (Object.keys(dataCart).length === 0) {
                return res
                    .status(400)
                    .send({ message: "Product content can not be empty" });
            }

            const newCart = Cart(dataCart)
            newCart.products[0].price = price
            newCart.totalPrice = price * quantity
            newCart.totalPriceUSD = (newCart.totalPrice * murValue.rate).toFixed(2)

            newCart.userId = owner
            newCart.save().then((cart) => {
                // success!
                return res.status(201).json({ cart: cart });
            }).catch(err => {
                return res.status(500).send({
                    message: "Problem creating CART",
                    error: err,
                });
            })
        }
    } catch (err) {
        console.log(err)
    }
})

//DELETE A PRODUCT TO CART -------------------------------------------------------------------------------
router.delete('/', Auth, async (req, res) => {
    const owner = req.user._id
    const productId = req.body.productId
    try {
        const murValue = await Currencies.findOne({ type: 'MUR' })

        const cart = await Cart.findOne({ userId: owner });
        const itemIndex = cart.products.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            const item = cart.products[itemIndex]
            cart.totalPrice -= item.quantity * item.price
            if (cart.totalPrice < 0) {
                cart.totalPrice = 0
            }
            cart.products.splice(itemIndex, 1)
            cart.totalPrice = cart.products.reduce((acc, current) => {
                return acc + current.quantity * current.price
            }, 0)

            cart.totalPriceUSD = (cart.totalPrice * murValue.rate).toFixed(2)

            await cart.save()
            res.status(200).send()
        } else {
            res.status(404).send("item not found")
        }
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/delete', Auth, async (req, res) => {
    const owner = req.user._id

    try {
        await Cart.deleteOne({ userId: owner })
        res.status(201).send()

    } catch (err) {
        console.log(err)
    }



})

module.exports = router;
