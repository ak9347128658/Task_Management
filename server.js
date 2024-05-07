const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');


dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.get('/', (req, res) => {
    // res.status(404);
    // throw new Error('This is an unhandled error');
 res.status(200).json({ message: 'Welcome to the application.' });
});

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(taskRoutes);





app.use(errorHandler); // Error handling middleware
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
