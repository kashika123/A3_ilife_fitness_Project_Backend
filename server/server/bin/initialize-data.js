const ProductModel = require("../models/Product");
const CategoryModel = require("../models/Category");
const CurrenciesModel = require('../models/Currencies')
const { connectMongoose } = require("../services/db");

const SEED_CATEGORIES = [
    {
        img: "localstorage/category-images/accesories.jpg",
        name: 'Fitness Accessories',
        description: 'This is used for working out'
    },

    {
        img: "localstorage/category-images/cardio.jpg",
        name: 'Cardio Equipments',
        description: 'This is used for Ping pong'
    },

    {
        img: "localstorage/category-images/strength.jpg",
        name: 'Weight Training ',
        description: 'This is used for Ping pong'
    }
];

const CURRENCIES = { type: "MUR", rate: 0.023 }

const SEED_PRODUCTS = [
    {
        "img": "localstorage/product-images/bench exercise.jpg",
        "name": "Bench item",
        "normalPrice": 250,
        "categoryIndex": 0, //index from seed categories
        "promotionPrice": 140
    },
    {
        "img": "localstorage/product-images/boxing gloves.jpg",
        "name": "Boxing glove",
        "normalPrice": 100,
        "categoryIndex": 1, //index from seed categories
        "promotionPrice": 75
    },
    {
        "img": "localstorage/product-images/cross trainer.jpg",
        "name": "Cross trainer",
        "normalPrice": 200,
        "categoryIndex": 2, //index from seed categories
        "promotionPrice": 150
    },
    {
        "img": "localstorage/product-images/plates.jpg",
        "name": "Plates",
        "normalPrice": 150,
        "categoryIndex": 2, //index from seed categories
        "promotionPrice": 98
    },
    {
        "img": "localstorage/product-images/protein shake.jpg",
        "name": "Protein shake",
        "normalPrice": 250,
        "categoryIndex": 2, //index from seed categories
        "promotionPrice": 200
    },
    {
        "img": "localstorage/product-images/treadmill.jpg",
        "name": "Treadmill",
        "normalPrice": 250,
        "categoryIndex": 2, //index from seed categories
        "promotionPrice": 200
    },
]

/**
 * @description Launch data initialization of products and categories and insert into database ( mongo )
 */
const initializeData = async () => {

    // connection
    await connectMongoose();
    // data seeding

    console.log('Initializing server data now');

    try {
        const savedCategories = [];
        for (category of SEED_CATEGORIES) {
            console.log('one cat');
            const newCategory = new CategoryModel(category);
            await newCategory.save();
            savedCategories.push(newCategory)
        }

        const newCurrencies = new CurrenciesModel(CURRENCIES)
        await newCurrencies.save()

        const savedProducts = [];
        for (product of SEED_PRODUCTS) {
            console.log('one cat');

            // setup products:

            const formattedProduct = {
                img: product.img,
                name: product.name,
                normalPrice: product.normalPrice,
                categoryId: savedCategories[product.categoryIndex],
                promotionPrice: product.promotionPrice
            };

            const newProduct = new ProductModel(formattedProduct);
            await newProduct.save();
            savedProducts.push(newProduct)
        }



        console.log('saved savedCategories:', savedCategories);
    } catch (error) {
        console.error(error)
        throw error;
    }


    console.log('init of products');
}

initializeData();
