const { handleUserRouter } = require('./src/router/user');
const { handleBlogRouter } = require('./src/router/blog');
const querystring = require('querystring');
const { get, set } = require('./src/db/redis');
const { access } = require('./src/util/log')

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

    access(`${req.method}  --  ${req.url}  --  ${req.headers['user-agent']}  --  ${Date.now()}`)

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
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis 中的 session 值
        set(userId, {});
    }
    // 获取 session
    req.sessionId = userId;
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值;
            set(req.sessionId, {});
            // 设置 session
            req.session = {};
        } else {
            // 设置 session
            req.session = sessionData;
        }
        // 处理 post data
        return getPostData(req);
    }).then(postData => {
        req.body = postData;
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