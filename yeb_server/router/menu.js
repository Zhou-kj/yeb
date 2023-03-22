const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入导航菜单路由处理函数模块
const menuHandler = require('../router_handler/menu')

// 导航菜单
router.get('/system/cfg/menu', menuHandler.initMenu)

// 将路由共享出去
module.exports = router