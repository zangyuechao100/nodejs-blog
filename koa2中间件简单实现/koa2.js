const http = require('http');

// 组合中间件
function compose (middlewareList) {
    return function (ctx) {
        function dispatch (i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1))
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        dispatch(0)
    }
}

class KoaLike {
    constructor () {
        this.middlewareList = []
    }

    use (fn) {
        this.middlewareLis.push(fn)
        return this
    }

    createContext (req, res) {
        const ctx = {
            req,
            res
        }
        return ctx
    }

    handleRequest (ctx, fn) {
        return fn(ctx)
    }

    callback () {
        const fn = compose(this.middlewareList)
        
        return (req, res) => {
            const ctx = this.createContext(req, res)
            this.handleRequest(ctx, fn)
        }
    }

    listen (...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = KoaLike