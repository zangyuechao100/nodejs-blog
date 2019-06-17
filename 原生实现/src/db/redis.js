const redis = require('redis');
const { REDIS_CONF } = require('./../conf/db'); 

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

redisClient.on('error', err => {
    console.log(err);
})

function set (key, value) {
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    redisClient.set(key, value, redis.print);
}

function get (key) {
    let promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            }
            if (val == null) {
                resolve(null);
            }

            try {
                resolve(JSON.parse(val));
            } catch (e) {
                resolve(val);
            }
        });
    })
    return promise;
}

module.exports = {
    set,
    get
}