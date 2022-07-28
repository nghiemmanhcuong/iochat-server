const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
var post = process.env.PORT || 5005;

const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js');
const postRoute = require('./routes/postRoute.js');
const uploadRoute = require('./routes/uploadRoute.js');
const chatRoute = require('./routes/chatRoute.js');
const messageRoute = require('./routes/messageRoute.js');

dotenv.config();
app.use(express.json());
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());

app.use('/public', express.static('public'));

mongoose.connect(
    'mongodb+srv://nghiemmanhcuong:' +
        process.env.DB_PASSWORD +
        '@linder.wjrxi.mongodb.net/?retryWrites=true&w=majority',
);

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://nghiemmanhcuong:' +
                process.env.DB_PASSWORD +
                '@linder.wjrxi.mongodb.net/?retryWrites=true&w=majority',
        );
        console.log('database connect successfull!');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

connectDB();

app.listen(post, () => {
    console.log('server runing in post ' + post);
});

// routes
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/upload', uploadRoute);
app.use('/chat', chatRoute);
app.use('/message', messageRoute);
