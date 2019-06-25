const { exec, escape } = require('./../db/mysql')
const xss = require('xss');

const getList = (author, keyword) => {
    // 先返回假数据（格式是正确的）
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        author = escape(author)
        sql += `and author=${author} `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc`;
    // 返回promise
    return exec(sql); 
}

const getDetail = (id) => {
    let sql = `select * from blogs where id=${id}`;
    return exec(sql).then((rows) => {
        return rows[0];
    })
}

const newBlog = (blogData = {}) => {
    const title = xss(blogData.title);
    const content = blogData.content;
    const author = blogData.author;
    const createTime = Date.now();
    let sql = 
        `insert into blogs (title, content, createtime, author) values 
        ('${title}', '${content}', ${createTime}, '${author}')`;
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId
        };
    })
}

const updateBlog = (id, blogData = {}) => {
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    let sql = `update blogs set title='${title}', content='${content}' where id=${id}`;
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    })
}

const deleteBlog = (id, author) => {
    id = escape(id);
    author = escape(author);
    let sql = `delete from blogs where id=${id} and author=${author}`;
    return exec(sql).then((deleteData) => {
        if (deleteData.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}