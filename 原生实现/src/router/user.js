const { loginCheck } = require('./../controller/user');
const { SuccessModel, ErrorModel } = require('./../modle/resModle');

const handleUserRouter = (req, res) => {
    const method = req.method;

    if (method === 'POST' && res.path === '/api/user/login') {
        const { username, password } = req.body
        const result = loginCheck(username, password);
        if (result) {
            return new SuccessModel();
        } else {
            return new ErrorModel('登录失败');
        }
    }
}

module.exports = {
    handleUserRouter
}