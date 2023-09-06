const slugify = require('slugify');
const Categories = require('../../models/categories');
const { errorHandler } = require('../../utils/utils');



// ==================== Add New Category ====================
exports.add_category = async (request, response) => {
    try {
        let resp = {};

        if (Array.isArray(request.body)) {
            const bulkData = await Promise.all(request.body.map(async data => {
                const exist = await Categories.findOne({ category_name: data.category_name });
                if (exist) return response.json({ message: "This Category Already Exists", status: "error" });
                return { ...data, category_slug: data.category_name ? slugify(data.category_name).toLowerCase() : undefined };
            }));

            await Categories.insertMany(bulkData);
            resp = { message: "Categories Successfully Added", status: "success" };
        } else {
            const data = { ...request.body, category_slug: request.body.category_name ? slugify(request.body.category_name).toLowerCase() : undefined };
            await Categories.create(data);
            resp = { message: "Category Successfully Added", status: "success" };
        }

        response.json(resp);
    } catch (error) {
        const errors = errorHandler(error, "categories");
        response.json({ message: errors, status: "error" });
    }
}





// ==================== Get Categories ====================
exports.get_categories = async (request, response) => {
    try {
        const { search, sort, order, ...filters } = request.query;
        const query = {};

        if (search) {
            query.category_name = { $regex: search, $options: 'i' };
        }
        
        const sortOptions = sort || 'category_name';
        const sortOrder = order || 'asc';

        const categories = await Categories.find({ ...query, ...filters }).sort({ [sortOptions]: sortOrder === 'desc' ? -1 : 1 }).select('-__v').exec();
        response.json({ categories });
    } catch (error) {
        console.error(error);
        response.json({ message: 'Something Went Wrong', status: 'error' });
    }
};





// ==================== Update Category ====================
exports.update_category = async (request, response) => {
    try {
        let resp = {};

        if (Array.isArray(request.body)) {
            const bulkData = request.body;
            const updates = [];

            for (const data of bulkData) {
                const exist = await Categories.findOne({ _id: { $nin: data.category_id }, category_name: data.category_name });
                if (exist) return response.json({ message: "This Category Already Exists", status: "error" });
                const updatedData = {...data, category_slug: data.category_name ? slugify(data.category_name).toLowerCase() : undefined};
                updates.push(Categories.findByIdAndUpdate(data.category_id, updatedData));
            }

            await Promise.all(updates);
            resp = { message: "Categories Successfully Updated", status: "success" };
        } else {

            const exist = await Categories.findOne({ _id: { $nin: request.body.category_id }, category_name: request.body.category_name });
            if (exist) return response.json({ message: "This Category Already Exists", status: "error" });
            const data = {...request.body, category_slug: request.body.category_name ? slugify(request.body.category_name).toLowerCase() : undefined};
            await Categories.findByIdAndUpdate(request.body.category_id, data);
            resp = { message: "Category Successfully Updated", status: "success" };
        }

        response.json(resp);
    } catch (error) {
        console.error(error);
        response.json({ message: "Something Went Wrong", status: "error" });
    }
};





// ==================== Delete Category ====================
exports.delete_category = async (request, response) => {
    try {
        const multiple_ids = request.body.category_id;
        const single_id = request.body.category_id;

        if (Array.isArray(multiple_ids) && multiple_ids.length !== 0) {
            const result = await Categories.deleteMany({ _id: { $in: multiple_ids } });

            if (result.deletedCount > 0) return response.json({ message: 'Categories Successfully Deleted', status: 'success' });
            return response.json({ message: 'No matching categories found for deletion', status: 'error' });
        }else{
            await Categories.findByIdAndDelete(single_id);
            response.json({ message: "Category Successfully Deleted", status: "success" });
        }
    } catch (error) {
        console.error(error);
        response.json({ message: 'The given ID isn\'t found', status: 'error' });
    }
}