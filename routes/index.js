const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const passport = require('../config/passport')
// const admin = require('./modules/admin')
// const tweets = require('./modules/tweets')
const users = require('./modules/users')
// const followships = require('./modules/followships')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
// const { authenticated } = require('../middleware/auth')

// router.use('/api/admin', admin)
// router.use('/api/tweets', authenticated, tweets)
// router.use('/api/followships', authenticated, followships)
router.use('/api/users', users)
// router.post('/api/users', userController.signUp)
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn) 

// router.use('/', generalErrorHandler)
=======
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const followships = require('./modules/followships')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/api/admin', admin)
// router.use('/api/tweets', authenticated, tweets)
// router.use('/api/followships', authenticated, followships)
// router.use('/api/users', users)
// router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 Post

router.use('/', generalErrorHandler)
>>>>>>> master

module.exports = router
