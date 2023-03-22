// 导入数据库操作模块
const db = require('../db/index')
// 导入密码加密模块
const bcrypt = require('bcryptjs')
// 导入这个包来生成token字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')


// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 判断数据是否合法
    const sql = 'select * from t_admin where username=?'
    db.query(sql, [userinfo.username], function (err, results) {
        // 执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
    })
    // 对用户的密码进行bcrypt加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    const sqlstr = 'insert into t_admin set ?'
    db.query(sqlstr, { username: userinfo.username, password: userinfo.password }, function (err, results) {
        // 执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        // sql语句执行成功，但影响行数不为1
        if (results.affectedRows !== 1) {
            return res.cc('注册新用户失败，请稍后再试！')
        }
        // 注册成功
        res.cc('注册成功！', 0)
    })
}
// 登录用户的处理函数
exports.login = (req, res) => {
    // res.cc('登录成功！', 0)
    // 接收表单数据
    const userinfo = req.body
    // 判断用户数据是否正确
    const sql = 'select * from t_admin where username=?'
    db.query(sql, [userinfo.username], function (err, results) {
        // 执行sql语句失败
        if (err) {
            return res.cc(err)
        } else if (results.length == 0) {
            return res.cc('用户名错误，请重试！')
        } else {
            // 将用户输入的密码与数据库中加密的密码进行比对
            const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
            // 如果比对结果等于false，则密码错误
            if (!compareResult) {
                return res.cc('密码错误，请重试！')
            }

            const user = { ...results[0], password: '' }
            // 生成token字符串
            const tokenStr = jwt.sign(user, config.jwtSecretKey, {
                expiresIn: '1h', // token字符串有效时间1h
            })
            res.send({
                status: 0,
                message: '登录成功！',
                // 直接拼接上Bearer前缀
                token: 'Bearer ' + tokenStr,
            })
        }
    })
}

// 获取用户信息处理函数
exports.getInfo = (req, res) => {
    const sql = 'select * from t_admin where username=?'

    const usermessage = req.headers.authorization.slice(7) // 删除不属于token值
    jwt.verify(usermessage, config.jwtSecretKey, function (err, data) {
        db.query(sql, [data.username], function (err, results) {
            // 执行sql语句失败
            if (err) {
                return res.cc(err)
            } else {
                results[0].password = ''
                return res.send(results[0])
            }
        })
    })
}

// 注销登录处理函数
exports.logOut = (req, res) => {
    res.send({
        status: 0,
        message: '注销成功！'
    })
}

// 获取所有操作员
exports.getAdmin = (req, res) => {
    const sql = 'select * from t_admin where id != ?'
    const temp = req.body
    db.query(sql, [temp.id], function (err, results) {
        if (err) {
            console.log(err)
            return res.cc('获取管理员信息失败')
        }
        results.forEach(item => {
            item.password = null
        })
        res.send(results)
    })
}