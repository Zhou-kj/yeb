const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 注册新用户
router.post('/register', userHandler.regUser)

// 登录
router.post('/login', userHandler.login)

// 获取用户信息
router.get('/admin/info', userHandler.getInfo)

// 注销登录
router.post('/logout', userHandler.logOut)

// 获取所有管理员
router.post('/chat/admin', userHandler.getAdmin)

// 将路由共享出去
module.exports = router