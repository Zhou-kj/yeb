const express = require('express')
const router = express.Router()
const salaryHandler = require('../router_handler/salary')
const { route } = require('./user')

router.get('/salary/sob', salaryHandler.getSalary)

router.post('/salary/sob', salaryHandler.addSalary)

router.put('/salary/sob', salaryHandler.updateSalary)

router.delete('/salary/sob', salaryHandler.delSalary)

// 获取员工账套
router.get('/salary/sobcfg', salaryHandler.getMySalary)

// 修改员工账套
router.put('/salary/sobcfg', salaryHandler.updateMySalary)

module.exports = router