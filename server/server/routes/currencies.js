const express = require("express");
const router = express.Router();
const Currencies = require("../models/Currencies");

// POST CURRENCIES

router.post('/', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .send({ message: "Currencies content can not be empty" });
    }
    const newCurrencies = new Currencies(req.body)

    newCurrencies.save().then(currencies => {
        return res.status(201).json({ currencies: currencies })
    }).catch(error => {
        return res.status(500).send({
            message: "Problem creating currencies",
            error: error,
        })
    })
})


// MODIFY CURRENCIES

router.put('/', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .send({ message: "Currencies content can not be empty" });
    }
    const newCurrencies = new Currencies(req.body)

    await Currencies.findOneAndDelete({ type: "MUR" }, (error, doc) => {
        if (doc) {
            newCurrencies.save().then(currencies => {
                return res.status(201).json({ currencies: currencies })
            }).catch(error => {
                return res.status(500).send({
                    message: "Problem creating currencies",
                    error: error,
                })
            })
        }

    })
})

module.exports = router;
