const express = require('express')
const authenticateUserRole = require('../middleware/roleAuthentication');

const router = express.Router()
const { create, index, update, show, destroy, indexList, clone } = require('../controllers/trainingController');

router.route('/').post( authenticateUserRole, create).get(index)

router.route('/list').get(indexList)

router.route('/:trainingId').get(show).delete(destroy).put(update).post(clone)

module.exports = router
