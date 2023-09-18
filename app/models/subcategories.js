const mongoose = require('mongoose');
const { isSlug } = require('validator');

const SubcategoriesSchema = new mongoose.Schema(
    {
        parent_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            required: [true, "Parent Category ID is required"]
        },
        subcategory_name: {
            type: String,
            required: [true, "Category name is required"],
            unique: [true, "Category is already taken"]
        },
        subcategory_slug: {
            type: String,
            validate: [isSlug, "Invalid category slug"]
        },
        subcategory_status: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        }        
    },
    { timestamps: true }
);


module.exports = mongoose.model('subcategories', SubcategoriesSchema);