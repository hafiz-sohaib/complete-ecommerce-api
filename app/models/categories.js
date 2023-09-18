const mongoose = require('mongoose');
const { isSlug } = require('validator');

const CategoriesSchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
            required: [true, "Category name is required"],
            unique: [true, "Category is already taken"]
        },
        category_slug: {
            type: String,
            validate: [isSlug, "Invalid category slug"]
        },
        category_status: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('categories', CategoriesSchema);