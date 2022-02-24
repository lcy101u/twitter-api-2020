const express = require('express')
const router = express.Router()
const passport = ('../config/passport')

const userController = ('../controllers/user-controller')

router.post('api/signin', userController.signIn)

moudle.exports = router