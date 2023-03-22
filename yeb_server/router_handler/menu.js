// 导入数据库操作模块
const db = require('../db/index')

const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 导航菜单的处理函数
exports.initMenu = (req, res) => {
    const sql = 'SELECT DISTINCT m1.*, m2.id AS id2, m2.url AS url2, m2.path AS path2, m2.component AS component2, m2.`name` AS name2, m2.iconCls AS iconCls2, m2.keepAlive AS keepAlive2, m2.requireAuth AS requireAuth2, m2.parentId AS parentId2, m2.enabled AS enabled2 FROM t_menu m1, t_menu m2, t_admin_role ar, t_menu_role mr WHERE m1.id = m2.parentId AND m2.id = mr.mid AND mr.rid = ar.rid AND ar.adminId = ? AND m2.enabled = TRUE'
    const usermessage = req.headers.authorization.slice(7) // 删除不属于token值
    jwt.verify(usermessage, config.jwtSecretKey, function (err, data) {
        // 如果token失效直接返回
        if (err) {
            return res.send({
                status: 401,
                message: 'token失效，请重新登录！'
            })
        } else {
            db.query(sql, [data.id], function (err, results) {
                if (err) {
                    return res.cc(err)
                } else if (results.length == 0) {
                    return res.cc('发生未知错误，请稍后重试！')
                } else {
                    const message = new Array()
                    const t = new Array()
                    results.forEach(item => {
                        const temp = item
                        const child = { // 作为children中的元素
                            id: temp['id2'],
                            url: temp['url2'],
                            path: temp['path2'],
                            component: temp['component2'],
                            name: temp['name2'],
                            iconCls: temp['iconCls2'],
                            keepAlive: temp['keepAlive2'],
                            requireAuth: temp['requireAuth2'],
                            enabled: temp['enabled2']
                        }
                        delete temp['id2']
                        delete temp['url2']
                        delete temp['path2']
                        delete temp['component2']
                        delete temp['name2']
                        delete temp['iconCls2']
                        delete temp['keepAlive2']
                        delete temp['requireAuth2']
                        delete temp['enabled2']
                        if (t.indexOf(item['id']) != -1) {
                            const temp1 = message.pop()

                            temp1.children.push(child)
                            message.push(temp1)
                        } else {
                            t.push(item['id'])
                            temp.children = new Array()
                            temp.children.push(child)
                            message.push(temp)
                        }
                    })
                    res.send(message)
                }
            })
        }

    })
}


// 权限管理 
/* exports.getRole = (req, res) => {
    const sql = 'SELECT m.*, r.id AS rid, r.name AS rname, r.nameZh AS rnameZh FROM t_menu m, t_menu_role mr, t_role r WHERE m.id = mr.mid and r.id = mr.rid ORDER BY m.id'
    db.query(sql, function (err, results) {
        if (err) {
            return res.cc(err)
        }
        results.forEach(menu => {
            if (menu.url === req.url) {

            }
        })

    })
}
 */