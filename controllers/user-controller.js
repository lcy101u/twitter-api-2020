const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const userController = {

  signUp: (req, res, next) => {
    const {
      account,
      name,
      email,
      password,
      checkPassword
    } = req.body
    if (password !== checkPassword) throw new Error('密碼兩次輸入不同')
    // console.log(email + name)
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })])
      .then(([email, account]) => {
        if (email) throw new Error('email 已重複註冊！')
        if (account) throw new Error('account 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({ account, password: hash, name, email })
      })
      .then(registerUser => {
        const user = registerUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body

    if (!account || !password) { throw new Error('所有欄位都要填寫') }
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) { throw new Error('帳號不存在!') }
        if (user.role === 'admin') throw new Error('帳號不存在！')
        return Promise.all([bcrypt.compare(password, user.password), user])
      })
      .then(([isMatched, user]) => {
        if (!isMatched) { throw new Error('密碼錯誤') }
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.json({ status: 'success', token, user: userData })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('帳號不存在')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = Number(req.params.id)
    const { name, introduction, avatar, cover } = req.body
    if (!name) throw new Error('名字為必填！')
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        return user.update({ name, introduction, avatar, cover })
      })
      .then(updatedUser => res.status(200).json({ user: updatedUser }))
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId),
      Tweet.findAll({
        where: { userId: userId },
        attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error('帳號不存在！')
        if (!tweets) throw new Error('使用者沒有任何推文!')
        return res.status(200).json(tweets)
      })

      .catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId),
      Reply.findAll({
        where: { UserId: userId },
        attributes: ['id', 'comment', 'createdAt', 'tweetId'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        }]
      })
    ])
      .then(([user, replies]) => {
        if (!user) { throw new Error('帳號不存在!') }
        if (!replies) throw new Error('使用者沒有回覆任何推文!')
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    const userId = Number(req.params.id)
    return Like.findAll({
      where: { userId: userId },
      attributes: ['id', 'createdAt', 'TweetId'],
      order: [['createdAt', 'DESC']],
      include: [{
        model: Tweet,
        attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }]
      }]
    })
      .then(userLikes => {
        if (!userLikes) throw new Error('使用者並未喜歡任何推文!')
        return res.status(200).json(userLikes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const userId = Number(req.params.id)
    return User.findByPk(userId, {
      include: [{
        model: User,
        as: 'Followings',
        include: 'Followship'
      }],
      attributes: ['name', 'account', 'avatar', 'introduction', 'createdAt']
    })
      .then(userFollowings => {
        if (!userFollowings) throw new Error('使用者並未追蹤任何人!')
        return res.status(200).json(userFollowings)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const userId = Number(req.params.id)
    return Followship.findAll({
      where: {
        followingId: userId
      }
    })
      .then(userFollowers => {
        if (!userFollowers) throw new Error('使用者並未被任何人追蹤!')
        return res.status(200).json(userFollowers)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
