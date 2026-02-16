const express = require('express');
const blogController = require('../controllers/blogcontroller.js');
const router = express.Router();

router.get('/', blogController.blog_index);

router.post('/', blogController.blog_index);

router.get('/:id', blogController.blog_get_id);

router.delete('/:id', blogController.blog_delete);

module.exports = router;