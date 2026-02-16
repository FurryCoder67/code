const blog_index = (req, res) => {
    const blog = new Blog(req.body);
    res.redirect('/blogs');
};
const blog_details = (req, res) => {

};
const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
};
const blog_get_id = (req, res) => {
    const id = req.params.id;
};
const blog_delete = (req, res) => {
    const id = req.params.id;
};
module.exports = { blog_index, blog_details, blog_create_get, blog_get_id, blog_delete };