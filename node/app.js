const express = require('express');
const morgan = require('morgan');
const blogRoutes = require('./routes/blogroute.js');
const blogController = require('./controllers/blogcontroller.js');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for requests
app.listen(3000);

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    const blogs = [
        { title: 'I eat Yoshi', snippet: 'He was yummy' },
        { title: 'I eat Mario', snippet: 'He was yummy' },
        { title: 'I eat Bowser', snippet: 'He was yummy' },
    ];
    res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});


app.get('/blogs/create', blogController.blog_create_get);

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});