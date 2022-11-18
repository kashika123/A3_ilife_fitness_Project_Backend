const mongoose = require("mongoose")

const currenciesSchema = new mongoose.Schema(
    {
        rate: {
            type: String
        },
        type: {
            type: String,
            unique: true,
            default: "MUR"
        }
    },
    { timestamps: true }

)

const currenciesModel = mongoose.model("Currencies", currenciesSchema);

// export
module.exports = currenciesModel;
