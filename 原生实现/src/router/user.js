const { login } = require('./../controller/user');
const { SuccessModel, ErrorModel } = require('./../modle/resModle');
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method;
    // 登录
    if (method === 'POST' && res.path === '/api/user/login') {
        const { username, password } = req.body
        const result = login(username, password);
        return result.then((data) => {
            if (data.username) {
                req.session.username = data.username;
                req.session.realname = data.realname;
                set(req.sessionId, req.session)
                return new SuccessModel();
            } else {
                return new ErrorModel('登录失败');
            }
        })
    }
}

module.exports = {
    handleUserRouter
}