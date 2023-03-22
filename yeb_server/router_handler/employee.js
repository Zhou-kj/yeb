const db = require('../db/index')
const qs = require('querystring')
const fs = require('fs')
// const download = require('download')
// 获取员工信息
exports.getEmp = (req, res) => { // AND if(?!='', e.beginDate BETWEEN ? AND ?, 1=1)
    // , data.beginDateScope, data.beginDateScope.length, data.beginDateScope[0], data.beginDateScope[1]
    const sql = "SELECT e.*, n.id AS nid, n.`name` AS nname, p.id AS pid, p.`name` AS pname, d.id AS did, d.`name` AS dname, j.id AS jid, j.`name` AS jname, pos.id AS posid, pos.`name` AS posname FROM t_employee e, t_nation n, t_politics_status p, t_department d, t_joblevel j, t_position pos WHERE e.nationId = n.id AND e.politicId = p.id AND e.departmentId = d.id AND e.departmentId = d.id AND e.jobLevelId = j.id AND e.posId = pos.id AND if(?!='',e.`name` LIKE CONCAT('%',?,'%'),1=1) AND if(?!='',e.politicId =?,1=1)  AND if(?!='',e.nationId =?,1=1) AND if(?!='',e.jobLevelId =?,1=1) AND if(?!='',e.posId =?,1=1) AND if(?!='',e.engageForm =?,1=1) AND if(?!='',e.departmentId =?,1=1) ORDER BY e.id"
    const temp = req.url.split('?')[1]
    const message = qs.parse(temp)
    const pag = message.currentPage
    const size = parseInt(message.size)
    const data = {
        name: message.name,
        politicId: message.politicId,
        nationId: message.nationId,
        jobLevelId: message.jobLevelId,
        posId: message.posId,
        engageForm: message.engageForm,
        departmentId: message.departmentId,
        beginDateScope: message.beginDateScope
    }
    let re = []
    db.query(sql, [data.name, data.name, data.politicId, data.politicId, data.nationId, data.nationId, data.jobLevelId, data.jobLevelId, data.posId, data.posId, data.engageForm, data.engageForm, data.departmentId, data.departmentId], function (err, results) {
        if (err) {
            // return res.cc('员工资料获取失败！')
            return res.cc(err)
        }
        let temp = []
        for (let i = 0; i < results.length; i++) {
            results[i].birthday = results[i].birthday.toJSON().slice(0, 10)
            results[i].beginDate = results[i].beginDate.toJSON().slice(0, 10)
            results[i].conversionTime = results[i].conversionTime.toJSON().slice(0, 10)
            results[i].beginContract = results[i].beginContract.toJSON().slice(0, 10)
            results[i].endContract = results[i].endContract.toJSON().slice(0, 10)
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

// 删除员工信息
exports.delEmp = (req, res) => {
    const sql = 'delete from t_employee where id = ?'
    db.query(sql, [req.body.id], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('删除失败！')
        }
        res.cc('删除成功！', 0)
    })
}

// 添加员工
exports.addEmp = (req, res) => {
    const sql = 'INSERT into t_employee (name, gender, birthday, idCard, wedlock, nationId, nativePlace, politicId, email, phone, address, departmentId, jobLevelId, posId, engageForm, tiptopDegree, specialty, school, beginDate, workState, workID, contractTerm, conversionTime, notWorkDate, beginContract, endContract, workAge, salaryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const data = req.body
    db.query(sql, [data.name, data.gender, data.birthday, data.idCard, data.wedlock, data.nationId, data.nativePlace, data.politicId, data.email, data.phone, data.address, data.departmentId, data.jobLevelId, data.posId, data.engageForm, data.tiptopDegree, data.specialty, data.school, data.beginDate, data.workState, data.workID, data.contractTerm, data.conversionTime, data.notWorkDate, data.beginContract, data.endContract, data.workAge, data.salaryId], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('添加失败！')
            // return res.cc(data)
        }
        res.cc('添加成功！', 0)
    })
}

// 更新员工信息
exports.editEmp = (req, res) => {
    const sql = 'UPDATE t_employee set name = ?, gender = ?, birthday = ?, idCard = ?, wedlock = ?, nationId = ?, nativePlace = ?, politicId = ?, email = ?, phone = ?, address = ?, departmentId = ?, jobLevelId = ?, posId = ?, engageForm = ?, tiptopDegree = ?, specialty = ?, school = ?, beginDate = ?, workState = ?, workID = ?, contractTerm = ?, conversionTime = ?, notWorkDate = ?, beginContract = ?, endContract = ?, workAge = ?, salaryId = ? WHERE id = ?'
    const data = req.body
    db.query(sql, [data.name, data.gender, data.birthday, data.idCard, data.wedlock, data.nationId, data.nativePlace, data.politicId, data.email, data.phone, data.address, data.departmentId, data.jobLevelId, data.posId, data.engageForm, data.tiptopDegree, data.specialty, data.school, data.beginDate, data.workState, data.workID, data.contractTerm, data.conversionTime, data.notWorkDate, data.beginContract, data.endContract, data.workAge, data.salaryId, data.id], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('更新失败！')
            // return res.cc(data)
        }
        res.cc('更新成功！', 0)
    })
}

// 导出数据
exports.downloadEmp = (req, res) => {
    // let url = req.url
    // const re = await download(url);
    // // 确保文件夹存在
    // if (!fs.existsSync('dist')) {
    //     fs.mkdirSync('dist');
    // }
    // fs.writeFileSync('dist/foo.jpg', re);


    var name = '员工数据.txt'
    var path = __dirname + '/' + name
    var f = fs.createReadStream(path)
    f.pipe(res)
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',// 告诉浏览器这是一个二进制文件
        'content-disposition': 'attachment; filename=' + name// 告诉浏览器这是一个需要下载的文件
    })
    // console.log('2222')
}

// 获取所有民族
exports.getNation = (req, res) => {
    const sql = 'select * from t_nation'
    db.query(sql, function (err, results) {
        if (err) {
            return console.log(err)
        }
        res.send(results)
    })
}

// 获取所有职称
exports.getJobLevel = (req, res) => {
    const sql = 'select * from t_jobLevel'
    db.query(sql, function (err, results) {
        if (err) {
            return console.log(err)
        }
        res.send(results)
    })
}

// 获取政治面貌
exports.getPoliticsstatus = (req, res) => {
    const sql = 'select * from t_politics_status'
    db.query(sql, function (err, results) {
        if (err) {
            return console.log(err)
        }
        res.send(results)
    })
}

// 获取职位
exports.getPositions = (req, res) => {
    const sql = 'select * from t_position'
    db.query(sql, function (err, results) {
        if (err) {
            return console.log(err)
        }
        res.send(results)
    })
}

// 获取最大工号
exports.getWorkId = (req, res) => {
    const sql = 'select workID from t_employee order by id desc limit 1'
    db.query(sql, function (err, results) {
        if (err) {
            return console.log(err)
        }
        const re = parseInt(results[0].workID) + 1
        res.send({
            data: re
        })
    })
}



