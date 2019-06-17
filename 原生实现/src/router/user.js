const { login } = require('./../controller/user');
const { SuccessModel, ErrorModel } = require('./../modle/resModle');

const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

const handleUserRouter = (req, res) => {
    const method = req.method;
    // 登录
    if (method === 'GET' && res.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password);
        return result.then((data) => {
            if (data.username) {
                req.session.username = data.username;
                req.session.realname = data.realname;
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