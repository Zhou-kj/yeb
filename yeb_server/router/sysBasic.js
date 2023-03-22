const express = require('express')
// 创建路由对象
const router = express.Router()
const sysBasic = require('../router_handler/sysBasic')

// 职位添加
router.post('/system/basic/pos', sysBasic.addPostion)

// 职位更新
router.put('/system/basic/pos', sysBasic.updatePosition)

// 职位删除
router.delete('/system/basic/pos', sysBasic.deletePosition)

// 批量删除
router.delete('/system/basic/posd', sysBasic.deletePositions)

// 查询所有职位
router.get('/system/basic/pos', sysBasic.getPosition)

// 查询所有职称
router.get('/system/basic/joblevel', sysBasic.getJobLevel)

// 添加职称
router.post('/system/basic/joblevel', sysBasic.addJobLevel)

// 删除职称
router.delete('/system/basic/joblevel', sysBasic.deleteJobLevel)

// 更新职称
router.put('/system/basic/joblevel', sysBasic.updateJobLevel)

// 批量删除职称
router.delete('/system/basic/joblevels', sysBasic.deleteJobLevels)

// 查询所有部门
router.get('/system/basic/department', sysBasic.getDepartments)

// 新增部门
router.post('/system/basic/department', sysBasic.addDepartment)

// 删除部门
router.delete('/system/basic/department', sysBasic.deleteDepartment)


// 将路由共享出去
module.exports = router