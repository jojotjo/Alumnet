// Import the required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User'); // Import the User model
require('dotenv').config(); // Load environment variables from .env file

// Create an instance of Express
const app = express();

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI, { // Use MONGODB_URI from .env
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// User registration route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// About route
app.get('/about', (req, res) => {
    res.send('<h1>About Page</h1><p>This is the About page.</p>');
});

// Other route
app.get('/other', (req, res) => {
    res.send('<h1>Other Page</h1><p>This is another page.</p>');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});