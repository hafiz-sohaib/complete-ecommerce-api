const controller = require('./backend');
const { isLoggedin, isAdmin } = require('../../middlewares/authentication');
const { Router } = require('express');
const router = Router();

router.post('/categories', isLoggedin, isAdmin, controller.add_category);
router.get('/categories', controller.get_categories);
router.put('/categories', isLoggedin, isAdmin, controller.update_category);
router.delete('/categories', isLoggedin, isAdmin, controller.delete_category);

module.exports = router;