const slugify = require('slugify');
const Categories = require('../../models/categories');
const { errorHandler } = require('../../utils/utils');


// ==================== Add New Category ====================
exports.add_category = async (request, response) => {
    try {
        const data = { ...request.body, category_slug: request.body.category_name ? slugify(request.body.category_name).toLowerCase() : undefined};
        await Categories.create(data);
        response.json({message: "Category Successfully Added", status: "success"});
    } catch (error) {
        const errors = errorHandler(error, "categories");
        response.json({message: errors, status: "error"});
    }
}





// ==================== Get Categories ====================
exports.get_categories = async (request, response) => {
    try {
        let query = {};

        if (request.query && request.query.search) {
            query['category_name'] = {$regex: request.query.search, $options: "i"};
        }else{
            query = request.query;
        }

        const categories = await Categories.find(query);
        response.json({ categories });
    } catch (error) {
        console.log(error);
        response.json({message: "Something Went Wrong", status: "error"});
    }
}





// ==================== Add New Category ====================
exports.update_category = async (request, response) => {
    try {
        const id = request.body.category_id;

        const exist = await Categories.findOne({ _id: { $nin: id }, category_name: request.body.category_name});
        if (exist) return response.json({ message: "Category name is taken", status: "error" });

        const data = { ...request.body, category_slug: request.body.category_name ? slugify(request.body.category_name).toLowerCase() : undefined};
        await Categories.findByIdAndUpdate(id, data);
        response.json({message: "Category Successfully Updated", status: "success"});
    } catch (error) {
        console.log(error);
        response.json({message: "Something Went Wrong", status: "error"});
    }
}





// ==================== Add New Category ====================
exports.delete_category = async (request, response) => {
    try {
        await Categories.findByIdAndDelete(request.body.category_id);
        response.json({message: "Category Successfully Deleted", status: "success"});
    } catch (error) {
        console.log(error);
        response.json({message: "Something Went Wrong", status: "error"});
    }
}