const express = require('express')
const empHandler = require('../router_handler/employee')

const router = express.Router()

// 获取员工信息
router.get('/employee/basic', empHandler.getEmp)

// 删除员工信息
router.delete('/employee/basic', empHandler.delEmp)

// 添加员工
router.post('/employee/basic', empHandler.addEmp)

// 更新员工信息
router.put('/employee/basic', empHandler.editEmp)

// 导出数据
router.post('/employee/basic/export', empHandler.downloadEmp)

// 获取所有民族
router.get('/system/basic/nation', empHandler.getNation)

// 获取政治面貌
router.get('/system/basic/politicsstatus', empHandler.getPoliticsstatus)

// 获取职位
router.get('/system/basic/positions', empHandler.getPositions)

// 获取职称
router.get('/system/basic/jobLevel', empHandler.getJobLevel)

// 获取最大工号
router.get('/system/basic/workId', empHandler.getWorkId)


module.exports = router