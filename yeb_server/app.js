// 导入express模块
const express = require('express')
const bodyParser = require('body-parser')
// 创建express的服务器实例
const app = express()
// 导入cors中间件
const cors = require('cors')
// 导入配置文件
const config = require('./config')
// 导入解析token的中间件
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
// const global = require('./global/index.js/index')


// 将cors中间件注册为全局中间件
app.use(cors())
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// 响应数据的中间件
app.use(function (req, res, next) {
    res.cc = function (me, status = 1) {
        res.send({
            status,
            message: me instanceof Error ? me.message : me,
        })
    }
    next()
})

// app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: ['/login', '/logout'] }))

const db = require('./db/index')
// app.use(function (req, res, next) {
//     var url = req.url
//     console.log("url:", url)
//     // 所有url所需要的角色信息
//     const menus = global.menus
//     let needRoles = []
//     let flag = false
//     menus.forEach(element => {
//         let temp = element.url.split('/')[1] == url.split('/')[1] && element.url.split('/')[2] == url.split('/')[2]
//         if (temp) {
//             needRoles.push(element.rname)
//             flag = true
//         }
//     })
//     if (!flag) {
//         next()
//         return
//     }
//     console.log("menus:", needRoles, url)
//     const sqlstr = 'SELECT r.id, r.`name`, r.nameZh FROM t_role AS r LEFT JOIN t_admin_role AS ar ON r.id = ar.rid WHERE ar.adminId = ?'
//     const usermessage = req.headers.authorization.slice(7) // 删除不属于token值
//     jwt.verify(usermessage, config.jwtSecretKey, function (err, data) {
//         db.query(sqlstr, [data.id], function (err, results) {
//             // 执行sql语句失败
//             if (err) {
//                 console.log(err)
//             }
//             let flag1 = false
//             console.log("roles:", results, url)
//             for (let i = 0; i < needRoles.length; i++) {
//                 console.log(needRoles[i], "///", i, url)
//                 for (let j = 0; j < results.length; j++) {
//                     if (needRoles[i] === results[j].name) {
//                         flag1 = true
//                     }
//                 }
//             }
//             if (flag1) {
//                 next()
//                 return
//             } else {
//                 return res.cc("权限不足，请联系管理员！")
//             }
//         })
//     })
// })

// 导入并使用用户路由模块
const userRouter = require('./router/user')
// 导入并使用导航菜单路由模块
const menuRouter = require('./router/menu')

const empRouter = require('./router/employee')
const sysBasic = require('./router/sysBasic')
const salary = require('./router/salary')
const permiss = require('./router/permiss')

app.use(empRouter)
app.use(userRouter)
app.use(menuRouter)
app.use(sysBasic)
app.use(salary)
app.use(permiss)

const webSocktServer = require('ws').Server
const ws = new webSocktServer({ port: 3000 })
let clients = [] // 已连接的客户端

ws.on('connection', function (client) {
    client.on('message', function (msg) {
        const temp = JSON.parse(msg)
        if (temp.token) {
            const usermessage = temp.token.slice(7)
            jwt.verify(usermessage, config.jwtSecretKey, function (err, data) {
                if (err) {
                    client.send('401')
                } else {
                    client.username = data.username
                    client.fromname = data.name
                    clients.push(client)
                }
            })
        } else {
            const mes = new Object()
            mes.from = client.username
            mes.to = temp.to
            mes.date = new Date()
            mes.content = temp.content
            mes.fromname = client.fromname
            console.log(mes)
            for (let c of clients) {
                if (c.username == mes.to) {
                    c.send(JSON.stringify(mes))
                }
            }
        }
    })
})
ws.on('close', () => {
    console.log('客户端已关闭连接')
})



// 错误级别中间件
app.use(function (err, req, res, next) {
    // 捕获身份认证失败的错误
    if (err.status === 401) {
        res.send("身份认证失败，请重新登录！")
    }
})


// 调用app.listen方法，指定端口号并启动web服务器
app.listen(8081, function () {
    // const sql = ' SELECT m.*, r.id AS rid, r.`name` AS rname, r.nameZh AS rnameZh FROM t_menu m, t_menu_role mr, t_role r WHERE m.id = mr.mid and r.id = mr.rid ORDER BY m.id'
    // db.query(sql, function (err, results) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     global.menus = results
    //     // console.log(global.menus)
    // })
    console.log('yeb server running at hhttp://127.0.0.1:8081')
})
