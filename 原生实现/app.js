const { handleUserRouter } = require('./src/router/user');
const { handleBlogRouter } = require('./src/router/blog');
const querystring = require('querystring');

// session数据
const SESSION_DATA = {}

const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

// 用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }
        let postData = '';
        req.on('data', (chunk) => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return
            }
            resolve(JSON.parse(postData));
        })
    });
    return promise;
}

let serverHandle = (req, res) => {

    // 返回格式为json
    res.setHeader('Content-type', 'application/json')
    
    // 获取path
    const url = req.url;
    res.path = url.split('?')[0];

    // 获取query
    req.query = querystring.parse(url.split('?')[1])

    // 获取cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        let key = arr[0].trim();
        let val = arr[1].trim();
        req.cookie[key] = val
    });

    //解析session
    let userId = req.cookie.userid;
    let needSetCookie = false;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        } 
        req.session = SESSION_DATA[userId];
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`; // 随机生成userid
        SESSION_DATA[userId] = {};
        req.session = SESSION_DATA[userId];
    }
    
    getPostData(req).then((data) => {
        req.body = data
        // 处理 User 路由
        const userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then((userData) => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`);
                }
                res.end(JSON.stringify(userData));
            })
            return;
        }

        // 处理 Blog 路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then((blogData) => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`);
                }
                res.end(JSON.stringify(blogData));
            })
            return;
        }

        // 未命中路由返回404
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 not found');
        res.end();
    })

}

module.exports = {
    serverHandle
}