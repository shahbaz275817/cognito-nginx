const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/authMiddleware');
const logsController = require('../controllers/logs')

router.get('/hello', authMiddleware.Validate, authController.simple_hello);

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/verify', authController.verify);
router.post('/auth/validate', authController.validate_token);


router.post('/logs/accesslogs',authMiddleware.Validate, logsController.accessLogs)
router.post('/logs/errorlogs',authMiddleware.Validate, logsController.errorLogs)


module.exports = router;
