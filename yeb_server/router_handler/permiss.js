const db = require('../db/index')
const qs = require('querystring')

exports.addPermiss = (req, res) => {
    const sql = 'insert into t_role (name, nameZh) values (?, ?)'
    const data = req.body
    if (!data.name.startsWith('ROLE_')) {
        data.name = 'ROLE_' + data.name
    }
    db.query(sql, [data.name, data.nameZh], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('添加失败！')
        }
        res.cc('添加成功！', 0)
    })
}

exports.delPermiss = (req, res) => {
    const sql = 'delete from t_role where id=?'
    const temp = req.url.split('?')[1]
    const message = qs.parse(temp)
    db.query(sql, [message.id], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('删除失败！')
        }
        res.cc('删除成功！', 0)
    })
}

exports.getPermiss = (req, res) => {
    const sql = 'select * from t_role'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('获取角色信息失败！')
        }
        res.send(results)
    })
}

exports.getAllPermiss = (req, res) => {
    const sql = 'SELECT mid FROM t_menu_role  WHERE rid = ?'
    const temp = req.url.split('?')[1]
    const message = qs.parse(temp)
    db.query(sql, [message.rid], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('获取角色id失败')
        }
        let re = []
        for (let i = 0; i < results.length; i++) {
            re.push(results[i].mid)
        }
        res.send(re)
    })
}

exports.getAllMenus = (req, res) => {
    const sql = ' SELECT m1.id AS id1, m1.`name` AS name1, m2.id AS id2, m2.`name` AS name2, m3.id AS id3, m3.`name` AS name3 FROM t_menu m1, t_menu m2, t_menu m3 WHERE m1.id = m2.parentId AND m2.id = m3.parentId AND m3.enabled = true'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('获取所有菜单失败')
        }
        // res.send(results)
        let temp1 = {
            id: results[0].id1,
            name: results[0].name1,
            children: [
                {
                    id: results[0].id2,
                    name: results[0].name2,
                    children: [
                        {
                            id: results[0].id3,
                            name: results[0].name3,
                            children: []
                        }
                    ]
                }
            ]
        }
        let temp = []
        temp.push(temp1)
        for (let i = 1; i < results.length; i++) { // temp1.children[temp1.children.length].children[temp1.children[temp1.children.length].children.length]
            let temp3 = {
                id: results[i].id3,
                name: results[i].name3,
                children: []
            }
            if (temp1.children[temp1.children.length - 1].id == results[i].id2) {
                temp1.children[temp1.children.length - 1].children.push(temp3)
            } else {
                let temp2 = {
                    id: results[i].id2,
                    name: results[i].name2,
                    children: []
                }
                temp2.children.push(temp3)
                temp1.children.push(temp2)
            }
        }
        res.send(temp)
    })
}


exports.updatePermiss = (req, res) => {
    const sql1 = 'delete from t_menu_role where rid = ?'
    const sql2 = 'insert into t_menu_role (mid, rid) values (?, ?)'
    const data = req.body
    db.query(sql1, [data.rid], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('删除失败！')
        }
        // console.log(data.mids)
        // mids = [11, 12, 13]
        data.mids.forEach(item => {
            db.query(sql2, [item, data.rid], function (err) {
                if (err) {
                    console.log(err)
                    return res.cc('更新失败')
                }
            })
        })
        res.cc('更新成功！', 0)
    })
}

// SELECT
// m1.id AS id1,
// m1.`name` AS name1,
// m2.id AS id2,
// m2.`name` AS name2,
// m3.id AS id3,
// m3.`name` AS name3
// FROM
// t_menu m1,
// t_menu m2,
// t_menu m3
// WHERE
// m1.id = m2.parentId
// AND
// m2.id = m3.parentId
// AND
// m3.enabled = true