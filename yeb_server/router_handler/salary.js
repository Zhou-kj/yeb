const db = require('../db/index')
const qs = require('querystring')

exports.getSalary = (req, res) => {
    const sql = 'select * from t_salary'
    db.query(sql, function (err, results) {
        if (err) {
            return res.cc('工资账套获取失败！')
        }
        for (let i = 0; i < results.length; i++) {
            results[i].createDate = results[i].createDate.toJSON().slice(0, 10)
        }
        res.send(results)
    })
}

exports.updateSalary = (req, res) => {
    const sql = 'update t_salary set basicSalary=?, bonus=?, lunchSalary=?, trafficSalary=?, pensionBase=?, pensionPer=?, medicalBase=?, medicalPer=?, accumulationFundBase=?, accumulationFundPer=?, name=? where id=?'
    const data = req.body
    db.query(sql, [data.basicSalary, data.bonus, data.lunchSalary, data.trafficSalary, data.pensionBase, data.pensionPer, data.medicalBase, data.medicalPer, data.accumulationFundBase, data.accumulationFundPer, data.name, data.id], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('修改失败！')
        }
        res.cc('修改成功！', 0)
    })
}

exports.delSalary = (req, res) => {
    const sql = 'delete from t_salary where id=?'
    const data = req.body
    db.query(sql, [data.id], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('删除失败！')
        }
        res.cc('删除成功！', 0)
    })
}

exports.addSalary = (req, res) => {
    const sql = 'insert into t_salary (basicSalary, bonus, lunchSalary, trafficSalary, pensionBase, pensionPer, medicalBase, medicalPer, accumulationFundBase, accumulationFundPer, name) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const data = req.body
    console.log(data.basicSalary)
    db.query(sql, [data.basicSalary, data.bonus, data.lunchSalary, data.trafficSalary, data.pensionBase, data.pensionPer, data.medicalBase, data.medicalPer, data.accumulationFundBase, data.accumulationFundPer, data.name], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('添加失败！')
        }
        res.cc('添加成功！', 0)
    })
}

// 获取员工账套
exports.getMySalary = (req, res) => {
    const sql = 'SELECT e.*, p.`name` AS pname, s.name AS sname, s.id as sid, s.basicSalary AS sbasicSalary, s.bonus AS sbonus, s.lunchSalary AS slunchSalary, s.trafficSalary AS strafficaSalary, s.pensionBase AS spensionBase, s.pensionPer AS spensionPer, s.medicalBase AS smedicalBase, s.medicalPer AS smedicalPer, s.accumulationFundBase AS saccumulationFundBase, s.accumulationFundPer AS saccumulationPer FROM t_employee e LEFT JOIN t_salary s ON e.salaryId = s.id LEFT JOIN t_position p ON e.posId = p.id ORDER BY e.id'
    const temp = req.url.split('?')[1]
    const message = qs.parse(temp)
    const pag = message.currentPage
    const size = parseInt(message.size)
    let re = []
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('获取员工账套失败！')
        }
        let temp = []
        for (let i = 0; i < results.length; i++) {
            temp.push(results[i])
            if (temp.length == size) {
                re.push(temp)
                temp = []
            }
        }
        if (temp.length > 0) {
            re.push(temp)
        }
        res.send({
            total: results.length,
            data: re[pag - 1]
        })
    })
}

// 修改员工账套
exports.updateMySalary = (req, res) => {
    const sql = 'update t_employee set salaryId=? where id=?'
    const data = req.body
    console.log(data)
    db.query(sql, [data.salaryId, data.id], function (err, results) {
        if (err) {
            return res.cc('修改员工账套失败！')
        }
        res.cc('修改成功！', 0)
    })
}