const { 
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog } = require('./../controller/blog');
const { SuccessModel, ErrorModel } = require('./../modle/resModle');

// 统一登录验证
const loginCheck = (req) => {
    if (!req.session || !req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;
    
    if (method === 'GET' && res.path === '/api/blog/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';

        if (req.query.isadmin) {
            // 管理员
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                // 尚未登录
                return loginCheckResult;
            }
            // 强制查询自己的博客
            author = req.session.username;
        }


        const result = getList(author, keyword);
        return result.then((listResult) => {
            return new SuccessModel(listResult);
        })
    }

    if (method === 'GET' && res.path === '/api/blog/detail') {
        const result = getDetail(id);
        return result.then((deatilData) => {
            return new SuccessModel(deatilData);
        })
    }

    if (method === 'POST' && res.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 尚未登录
            return loginCheckResult
        }
        const author = req.session.username;
        req.body.author = author;
        const result = newBlog(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        })
    }

    if (method === 'POST' && res.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 尚未登录
            return loginCheckResult
        }
        const result = updateBlog(id, req.body);
        return result.then((value) => {
            if (value) {
                return new SuccessModel();
            } else {
                return new ErrorModel('更新失败');
            }
        })
    }

    if (method === 'POST' && res.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 尚未登录
            return loginCheckResult
        }
        const author = req.session.username;
        const result = deleteBlog(id, author);
        return result.then((value) => {
            if (value) {
                return new SuccessModel();
            } else {
                return new ErrorModel('删除失败');
            }
        })
    }
}

module.exports = {
    handleBlogRouter
}