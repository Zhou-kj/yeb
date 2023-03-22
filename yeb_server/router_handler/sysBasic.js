// 导入数据库操作模块
const db = require('../db/index')


// 添加职位
exports.addPostion = (req, res) => {
    const sql = 'INSERT into t_position (name) VALUES (?)'
    const name = req.body.name
    db.query(sql, [name], function (err, results) {
        if (err) {
            return res.cc('添加失败！')
        }
        res.cc('添加成功！', 0)
    })
}

// 更新职位
exports.updatePosition = (req, res) => {
    const sql = 'UPDATE t_position set name = ? WHERE id = ?'
    const message = req.body
    db.query(sql, [message.name, message.id], function (err, resutls) {
        if (err) {
            return res.cc('修改失败！')
        }
        res.cc('修改成功！', 0)
    })
}

// 删除职位
exports.deletePosition = (req, res) => {
    const sql = 'DELETE from t_position WHERE id = ?'
    const id = req.body.id
    db.query(sql, [id], function (err, results) {
        if (err) {
            return res.cc('删除失败！')
        }
        res.cc('删除成功！', 0)
    })
}

// 批量删除职位
exports.deletePositions = (req, res) => {
    const sql = 'DELETE from t_position WHERE id = ?'
    const pos = req.body
    pos.forEach(element => {
        db.query(sql, [element.id], function (err, results) {
            if (err) {
                return res.cc('批量删除失败！')
            }
        })
    })
    res.cc('批量删除成功！', 0)
}

// 获取职位信息
exports.getPosition = (req, res) => {
    const sql = 'SELECT * from t_position'
    db.query(sql, function (err, results) {
        if (err) {
            return res.cc('数据库职位信息获取失败！')
        }
        res.send(results)
    })
}



// 添加职称
exports.addJobLevel = (req, res) => {
    const sql = 'INSERT into t_joblevel (name, titleLevel) VALUES (?, ?)'
    const message = req.body
    db.query(sql, [message.name, message.titleLevel], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('添加失败！')
        }
        res.cc('添加成功！', 0)
    })
}

// 更新职称
exports.updateJobLevel = (req, res) => {
    const sql = 'UPDATE t_joblevel set name = ?, titleLevel = ?, enabled = ? WHERE id = ?'
    const message = req.body
    message.enabled = message.enabled ? 1 : 0
    db.query(sql, [message.name, message.titleLevel, message.enabled, message.id], function (err, resutls) {
        if (err) {
            return res.cc('修改失败！')
        }
        res.cc('修改成功！', 0)
    })
}

// 删除职称
exports.deleteJobLevel = (req, res) => {
    const sql = 'DELETE from t_joblevel WHERE id = ?'
    const id = req.body.id
    db.query(sql, [id], function (err, results) {
        if (err) {
            return res.cc('删除失败！')
        }
        res.cc('删除成功！', 0)
    })
}

// 批量删除职称
exports.deleteJobLevels = (req, res) => {
    const sql = 'DELETE from t_joblevel WHERE id = ?'
    const pos = req.body
    pos.forEach(element => {
        db.query(sql, [element.id], function (err, results) {
            if (err) {
                return res.cc('批量删除失败！')
            }
        })
    })
    res.cc('批量删除成功！', 0)
}

// 获取职称信息
exports.getJobLevel = (req, res) => {
    const sql = 'SELECT * from t_joblevel'
    db.query(sql, function (err, results) {
        if (err) {
            return res.cc('数据库职称信息获取失败！')
        }
        res.send(results)
    })
}

// 获取部门信息
exports.getDepartments = (req, res) => {
    const sql = 'select * from t_department'
    let re = []
    db.query(sql, function (err, results) {
        if (err) {
            return res.cc('获取部门信息失败')
        }
        let resultData = getDepart(results, '-1')
        res.send(resultData)
    })
    function getDepart(dataList, pid) {
        let resultList = []
        for (const map of dataList) {
            let bid = map['id']
            let parentId = map['parentId']
            if (parentId == pid) {
                const data = map
                let childrenList = getDepart(dataList, bid)
                if (childrenList) {
                    data['children'] = childrenList
                }
                resultList.push(data)
            }
        }
        return resultList
    }
}

// 新增部门
exports.addDepartment = (req, res) => {
    const sql = 'INSERT into t_department (name, parentId) VALUES (?, ?)'
    const sql1 = 'select * from t_department where id = ?'
    const sql2 = 'UPDATE t_department set isParent = 1 WHERE id = ?'
    const sql3 = 'UPDATE t_department set depPath = ? WHERE id = ?'
    const data = req.body
    db.query(sql1, [data.parentId], function (err, results1) {
        if (err) {
            return res.cc('添加失败！')
        }
        const tempPath = results1[0].depPath
        db.query(sql2, [data.parentId], function (err, results2) {
            if (err) {
                return res.cc('添加失败！')
            }
            db.query(sql, [data.name, data.parentId], function (err, results) {
                if (err) {
                    return res.cc('添加失败！')
                }
                const path = tempPath + '.' + results.insertId
                db.query(sql3, [path, results.insertId], function (err, results3) {
                    if (err) {
                        return res.cc('添加失败！')
                    }
                    res.cc('添加成功！', 0)
                })
            })
        })
    })
}

// 删除部门 
exports.deleteDepartment = (req, res) => {
    const sql = 'DELETE from t_department WHERE id = ?'
    const sql1 = 'select * from t_department where id = ?'
    db.query(sql1, [req.body.id], function (err, results1) {
        if (err) {
            return res.cc('删除失败！')
        }
        if (results1[0].isParent) {
            return res.cc('目前该部门下仍存在子部门，无法删除！')
        }
        db.query(sql, [req.body.id], function (err, results) {
            if (err) {
                return res.cc('删除失败！')
            }
            res.cc('删除成功！', 0)
        })
    })
}

