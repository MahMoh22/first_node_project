// const express = require('express');
// const multer = require('multer');
// const app = express();
// const port = 3000;

// // Configure multer to store files in memory or on disk
// const upload = multer({ storage: multer.memoryStorage() });

// // Use .any() to accept all fields and files
// app.post('/submit-form', upload.any(), (req, res) => {
//   console.log('Form fields:', req.body);  // Text fields
//   console.log('Files:', req.files);       // Uploaded files (if any)

//   res.send('Form data received with multer!');
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });



const express = require('express');
const app = express();
const port = 3000;
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://mahmoudmabbass010:fgxC1b4TSiobT4ta@cluster0.jpchtkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
const Article = require('./models/article');

//app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/sum/:num1/:num2', (req, res) => {
    const num1 = parseInt(req.params.num1);
    const num2 = parseInt(req.params.num2);
    const sum = num1 + num2;
    res.send(`The sum of ${num1} and ${num2} is ${sum}`);
});
app.post('/sayHello', (req, res) => {
    console.log(req);
    const name = req.body.name;
    const age = req.query.age;
    
    res.render('home.ejs', { name, age }); 
    // res.send(`Hello ${name}, your age is ${age}`);
});
app.get('/articles', async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
    //res.render('articles', { articles });
});
app.post('/articles', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description
    });
    await article.save();
    res.redirect('/');
});
app.delete('/delete', (req, res) => {
    res.send('deleted sucsessfully');
});
app.listen(port, () => {
    console.log(`I'm listening at http://localhost:${port}`);
});
