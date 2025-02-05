// Import the required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User'); // Import the User model
require('dotenv').config(); // Load environment variables from .env file

// Create an instance of Express
const app = express();



const mainRouter = require('./routes/path')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(express.static('./public'));
app.use(express.json());

app.use('/api/v1',mainRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Set the port for the server
const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();