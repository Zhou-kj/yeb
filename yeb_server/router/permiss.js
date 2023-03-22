const express = require('express')
const router = express.Router()
const permissHandler = require('../router_handler/permiss')

router.post('/system/basic/permiss', permissHandler.addPermiss)

router.delete('/system/basic/permiss', permissHandler.delPermiss)

router.get('/system/basic/permiss', permissHandler.getPermiss)

router.get('/system/basic/permiss/mid', permissHandler.getAllPermiss)

router.get('/system/basic/permiss/menus', permissHandler.getAllMenus)

router.put('/system/basic/permiss', permissHandler.updatePermiss)

module.exports = router