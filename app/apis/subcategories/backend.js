const slugify = require('slugify');
const mongoose = require('mongoose');
const Subcategories = require('../../models/subcategories');
const { errorHandler } = require('../../utils/utils');



// ==================== Add New Category ====================
exports.add_subcategory = async (request, response) => {
    try {
        let resp = {};

        if (Array.isArray(request.body)) {
            const bulkData = await Promise.all(request.body.map(async data => {
                const exist = await Subcategories.findOne({ parent_category_id: data.parent_category_id, subcategory_name: data.subcategory_name });
                if (exist) return response.json({ message: "This Subcategory Already Exists", status: "error" });
                return { ...data, subcategory_slug: data.subcategory_name ? slugify(data.subcategory_name).toLowerCase() : undefined };
            }));

            await Subcategories.insertMany(bulkData);
            resp = { message: "Subcategories Successfully Added", status: "success" };
        } else {
            const exist = await Subcategories.findOne({ parent_category_id: request.body.parent_category_id, subcategory_name: request.body.subcategory_name });
            if (exist) return response.json({ message: "This Subcategory Already Exists", status: "error" });
            const data = { ...request.body, subcategory_slug: request.body.subcategory_name ? slugify(request.body.subcategory_name).toLowerCase() : undefined };
            await Subcategories.create(data);
            resp = { message: "Subcategory Successfully Added", status: "success" };
        }

        response.json(resp);
    } catch (error) {
        const errors = errorHandler(error, "subcategories");
        response.json({ message: errors, status: "error" });
    }
}





// ==================== Get Categories ====================
exports.get_subcategories = async (request, response) => {
    try {
        const { search, sort, order, ...filters } = request.query;
        const { parent_id } = request.params;
        const query = {};

        if (!parent_id) return response.json({ message: 'Parent category ID is required', status: 'error' });
        if (!mongoose.Types.ObjectId.isValid(parent_id)) return response.json({ message: 'The given parent category ID is invalid', status: 'error' });

        if (search) {
            query.subcategory_name = { $regex: search, $options: 'i' };
        }

        const sortOptions = sort || 'subcategory_name';
        const sortOrder = order || 'asc';

        const subcategories = await Subcategories.find({ parent_category_id: parent_id, ...query, ...filters }).sort({ [sortOptions]: sortOrder === 'desc' ? -1 : 1 }).select('-__v').exec();
        response.status(200).json({ subcategories });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internel Server Error', status: 'error' });
    }
};





// ==================== Update Category ====================
exports.update_subcategory = async (request, response) => {
    try {
        let resp = {};

        if (Array.isArray(request.body)) {
            const bulkData = request.body;
            const updates = [];

            for (const data of bulkData) {
                const exist = await Subcategories.findOne({ _id: { $nin: data.category_id }, category_name: data.category_name });
                if (exist) return response.json({ message: "This Category Already Exists", status: "error" });
                const updatedData = {...data, category_slug: data.category_name ? slugify(data.category_name).toLowerCase() : undefined};
                updates.push(Subcategories.findByIdAndUpdate(data.category_id, updatedData));
            }

            await Promise.all(updates);
            resp = { message: "Categories Successfully Updated", status: "success" };
        } else {

            const exist = await Subcategories.findOne({ _id: { $nin: request.body.category_id }, category_name: request.body.category_name });
            if (exist) return response.json({ message: "This Category Already Exists", status: "error" });
            const data = {...request.body, category_slug: request.body.category_name ? slugify(request.body.category_name).toLowerCase() : undefined};
            await Subcategories.findByIdAndUpdate(request.body.category_id, data);
            resp = { message: "Category Successfully Updated", status: "success" };
        }

        response.json(resp);
    } catch (error) {
        console.error(error);
        response.json({ message: "Something Went Wrong", status: "error" });
    }
};





// ==================== Delete Category ====================
exports.delete_subcategory = async (request, response) => {
    try {
        const multiple_ids = request.body.subcategory_id;
        const single_id = request.body.subcategory_id;

        if (Array.isArray(multiple_ids) && multiple_ids.length !== 0) {
            const result = await Subcategories.deleteMany({ _id: { $in: multiple_ids } });

            if (result.deletedCount > 0) return response.json({ message: 'Subcategories Successfully Deleted', status: 'success' });
            return response.json({ message: 'No matching subcategories found for deletion', status: 'error' });
        }else{
            await Subcategories.findByIdAndDelete(single_id);
            response.json({ message: "Subcategory Successfully Deleted", status: "success" });
        }
    } catch (error) {
        console.error(error);
        response.json({ message: 'The given ID isn\'t found', status: 'error' });
    }
}