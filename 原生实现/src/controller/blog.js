const getList = (author, keyword) => {
    // 先返回假数据（格式是正确的）
    return [
        {
            id: 1,
            title: '文章A',
            content: '内容A',
            author: 'zhangsan',
            createTime: 1559812329932
        },
        {
            id: 2,
            title: '文章B',
            content: '内容B',
            author: 'lisi',
            createTime: 1559812354854
        }
    ]
}

const getDetail = (id) => {
    return {
        id: 2,
        title: '文章B',
        content: '内容B',
        author: 'lisi',
        createTime: 1559812354854
    }
}

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title content等属性
    return {
        id: 3 // 表示新建博客，插入到数据表里面的id
    }
}

const updateBlog = (id, blogData = {}) => {
    // id是更新博客的id
    // blogData是一个博客对象，包含title content等属性
    return true
}

const deleteBlog = (id) => {
    // id是删除博客的id
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}