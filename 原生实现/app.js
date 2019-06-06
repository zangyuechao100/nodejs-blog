const { handleUserRouter } = require('./src/router/user');
const { handleBlogRouter } = require('./src/router/blog');
const querystring = require('querystring');
let serverHandle = (req, res) => {

    // 返回格式为json
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    // 获取path
    const url = req.url;
    res.path = url.split('?')[0];

    // 获取query
    req.query = querystring.parse(url.split('?')[1])

    // 处理 User 路由
    const userData = handleUserRouter(req, res);
    if (userData) {
        res.end(JSON.stringify(userData));
        return;
    }

    // 处理 Blog 路由
    const blogData = handleBlogRouter(req, res);
    if (blogData) {
        res.end(JSON.stringify(blogData));
        return;
    }

    // 未命中路由返回404
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 not found');
    res.end();

}

module.exports = {
    serverHandle
}