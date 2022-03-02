const express = require('express')
const { getRepliedTweets } = require('../../controllers/user-controller')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// router.use('/users', users)
// router.post('/signIn', userController.signIn)
router.post('/', userController.signUp)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated,
  upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUser)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/:id/likes', authenticated, userController.getLikes)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)

// router.use('/', apiErrorHandler)

module.exports = router
