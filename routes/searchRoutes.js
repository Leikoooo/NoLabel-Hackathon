const Router = require('express');
const router = new Router();

const searchController = require('../controllers/searchController.js');

router.get('/', searchController.searchByTag); 

module.exports = router;