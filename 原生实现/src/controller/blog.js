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

module.exports = {
    getList
}