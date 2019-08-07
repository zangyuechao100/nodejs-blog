const env = process.env.NODE_ENV // 环境变量

//配置
let MYSQL_CONF = {};
let REDIS_CONF = {};

if (env === 'dev') {

    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {

    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'zangyuechao100',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
