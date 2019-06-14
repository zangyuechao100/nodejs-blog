const { 
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog } = require('./../controller/blog');
const { SuccessModel, ErrorModel } = require('./../modle/resModle');

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;
    
    if (method === 'GET' && res.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
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
        const author = 'zhangsan';
        req.body.author = author; // 假数据，等到开发完登录后在完善
        const result = newBlog(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        })
    }

    if (method === 'POST' && res.path === '/api/blog/update') {
        const result = updateBlog(id, req.body);
        return result.then((value) => {
            if (value) {
                return new SuccessModel();
            } else {
                return new ErrorModel('更新失败');
            }
        })
    }

    if (method === 'POST' && res.path === '/api/blog/delete') {
        const author = 'zhangsan'; // 假数据，等到开发完登录后在完善
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