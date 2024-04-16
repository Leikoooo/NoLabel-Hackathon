const Router = require('express');
const router = new Router();
const userRouter = require('./userRoutes');
const profileRouter = require('./profileRoutes');
const userController = require('../controllers/userController.js');
const searchRouter = require('./searchRoutes');

const {body} = require('express-validator');

router.use('/user', userRouter);
router.use('/profile', profileRouter);
router.use('/search', searchRouter);


router.post('/registration', body('email').isEmail(), body('password').isLength({min: 3, max: 32}), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
// router.get('/activate/:link', userController.activate);


module.exports = router;
