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
        },
        parent_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            validate: {
                validator: function (value) {
                    return !this._id.equals(value);
                },
                message: 'A category cannot be its own parent.'
            },
            default: null
        },        
    },
    { timestamps: true }
);


module.exports = mongoose.model('categories', CategoriesSchema);