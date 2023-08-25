const controller = require('./backend');
const { Router } = require('express');
const router = Router();

router.post('/auth/register', controller.register);
router.post('/auth/login', controller.login);
router.post('/auth/logout', controller.logout);
router.post('/auth/forgot-password', controller.reset_password_token);
router.get('/auth/reset-password/:token', controller.reset_password);

module.exports = router;