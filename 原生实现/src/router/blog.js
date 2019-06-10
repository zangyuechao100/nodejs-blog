const { 
    getList,
    getDetail,
    newBlog,
    updateBlog } = require('./../controller/blog');
const { SuccessModel, ErrorModel } = require('./../modle/resModle');

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;
    
    if (method === 'GET' && res.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const listData = getList(author, keyword);
        return new SuccessModel(listData);
    }

    if (method === 'GET' && res.path === '/api/blog/detail') {
        const deatilData = getDetail(id);
        return new SuccessModel(deatilData);
    }

    if (method === 'POST' && res.path === '/api/blog/new') {
        const data = newBlog(req.body);
        return new SuccessModel(data);
    }

    if (method === 'POST' && res.path === '/api/blog/update') {
        const result = updateBlog(id, req.body);
        if (result) {
            return new SuccessModel();
        } else {
            return new ErrorModel('更新失败');
        }
    }

    if (method === 'POST' && path === '/api/blog/delete') {
        return {
            msg: '这是删除博客的接口'
        }
    }
}

module.exports = {
    handleBlogRouter
}