const { exec, escape } = require('./../db/mysql')
const xss = require('xss');

const getList = async (author, keyword) => {
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
    return await exec(sql); 
}

const getDetail = async (id) => {
    let sql = `select * from blogs where id=${id}`;
    const rows = await exec(sql);
    return rows[0];
}

const newBlog = async (blogData = {}) => {
    const title = xss(blogData.title);
    const content = blogData.content;
    const author = blogData.author;
    const createTime = Date.now();
    let sql = 
        `insert into blogs (title, content, createtime, author) values 
        ('${title}', '${content}', ${createTime}, '${author}')`;
    const insertData = await exec(sql)
    return  {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    let sql = `update blogs set title='${title}', content='${content}' where id=${id}`;
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true;
    } else {
        return false;
    }
}

const deleteBlog = async (id, author) => {
    id = escape(id);
    author = escape(author);
    let sql = `delete from blogs where id=${id} and author=${author}`;
    const deleteData = await exec(sql)
    if (deleteData.affectedRows > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}