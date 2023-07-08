const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://muthaarm:MphGsN0bSlM0OjII@cluster0.evbx7nk.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error));

// Define a schema for a TODO item
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Display all the TODO items
app.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.render('index', { todos });
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

// Add a new TODO item
app.post('/add', async (req, res) => {
  const todo = new Todo({
    task: req.body.task,
    completed: false
  });

  try {
    await todo.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

// Update the completion status of a TODO item
app.post('/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

// Delete a TODO item
app.post('/delete/:id', async (req, res) => {
  try {
    await Todo.findByIdAndRemove(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
