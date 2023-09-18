const controller = require('./backend');
const { isLoggedin, isAdmin } = require('../../middlewares/authentication');
const { Router } = require('express');
const router = Router();

router.post('/subcategories', isLoggedin, isAdmin, controller.add_subcategory);
router.get('/subcategories/:parent_id', controller.get_subcategories);
router.put('/subcategories', isLoggedin, isAdmin, controller.update_subcategory);
router.delete('/subcategories', isLoggedin, isAdmin, controller.delete_subcategory);

module.exports = router;