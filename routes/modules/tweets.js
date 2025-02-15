const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.post('/:id/like', likeController.postTweetLike)
router.post('/:id/unlike', likeController.postTweetUnlike)
router.get('/:id/replies', replyController.getReplies)
router.post('/:id/replies', replyController.postReplies)

router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)

module.exports = router
