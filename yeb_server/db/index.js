// 导入mysql模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'yeb',
})

// 向外共享 db 数据库对象
module.exports = db