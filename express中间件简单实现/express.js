const slice = Array.prototype.slice;
const http = require('http');
class ExpressLike {

    constructor () {
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register (path) {
        const info = {}
        if (typeof path === 'string') {
            // 路径
            info.path = path
            // 中间件
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    use () {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get () {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post () {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    // 匹配中间件
    match (method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }
        // 获取routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        curRoutes.forEach(routeInfo => {
            if (url.inexOf(routeInfo.path) === 0) {
                stack = stack.concat(routeInfo.stack)
            }
        })

        return stack
    }

    // 核心next机制
    handle (req, res, stack) {
        const next = () => {
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        next();
    }

    callback () {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(JSON.stringify(data))
            }

            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(method, url)
            this.handle(req, res, resultList)
        }
    }

    listen (...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

}


module.exports = () => {
    return new ExpressLike
}