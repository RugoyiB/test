'use strict';

// ############################################# //
// ##### Server Setup for User Management API #####
// ############################################# //

// Importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 3000; // Default port set to 3000

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
mongoose.connect('mongodb+srv://Temp1:Temp807@cluster0.rg3zipx.mongodb.net/UserList', {
    useNewUrlParser: true, // Use the new URL parser instead of the deprecated one
    useUnifiedTopology: true // Use the new server discovery and monitoring engine
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log('User API Server is running on port ' + port);
    });
})
.catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error('Error connecting to MongoDB:', error);
});


// ############################################# //
// ##### User Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = mongoose.Schema;

// Create a Schema object for the User model
// This schema defines the structure of user documents in the MongoDB collection.
const userSchema = new Schema({
    ID: { type: Number, required: true  },
    Email: { type: String, required: true  },
    Username: { type: String }
});

// Create a Mongoose model from the userSchema.
// This model provides an interface to interact with the 'users' collection in MongoDB.
// Mongoose automatically pluralizes "User" to "users" for the collection name.
const User = mongoose.model("User", userSchema);


// ############################################# //
// ##### User API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle user-related routes.
const router = express.Router();

// Mount the router middleware at the '/api/users' path.
// All routes defined on this router will be prefixed with '/api/users'.
app.use('/api/users', router);

// Route to get all users from the database.
// Handles GET requests to '/api/users/'.
router.route("/")
    .get(async (req, res) => { // Added async
        try {
            const users = await User.find(); // Added await
            res.json(users);
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to get a specific user by its ID.
// Handles GET requests to '/api/users/:id'.
router.route("/:id")
    .get(async (req, res) => { // Added async
        try {
            const user = await User.findById(req.params.id); // Added await
            res.json(user);
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to add a new user to the database.
// Handles POST requests to '/api/users/add'.
router.route("/add")
    .post(async (req, res) => { // Added async
        // Extract attributes from the request body.
        const ID = req.body.ID;
        const Email = req.body.Email;
        const Username = req.body.Username;

        // Create a new User object using the extracted data.
        const newUser = new User({
            ID,
            Email,
            Username
        });

        try {
            await newUser.save(); // Added await
            res.json("User added!");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to update an existing user by its ID.
// Handles PUT requests to '/api/users/update/:id'.
router.route("/update/:id")
    .put(async (req, res) => { // Added async
        try {
            const user = await User.findById(req.params.id); // Added await
            if (!user) {
                return res.status(404).json("Error: User not found");
            }

            // Update the user's attributes with data from the request body.
            user.ID = req.body.ID;
                user.Email = req.body.Email;
                user.Username = req.body.Username;

            await user.save(); // Added await
            res.json("User updated!");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to delete a user by its ID.
// Handles DELETE requests to '/api/users/delete/:id'.
router.route("/delete/:id")
    .delete(async (req, res) => { // Added async
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id); // Added await
            if (!deletedUser) {
                return res.status(404).json("Error: User not found");
            }
            res.json("User deleted.");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });