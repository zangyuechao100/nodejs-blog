const env = process.env.NODE_ENV // 环境变量

//配置
let MYSQL_CONF = {};

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'zangyuechao100',
        database: 'myblog'
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'zangyuechao100',
        database: 'myblog'
    }
}

module.exports = {
    MYSQL_CONF
}