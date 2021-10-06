//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect into mongodb
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

// Create schema and instance Scheme for using mongoose encryption.
const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

// Define mongoose encryption for encryption password
userSchema.plugin(encrypt, {
	secret: process.env.SECRET,
	encryptedFields: ['password'],
});

// Use userSchema
const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/register', (req, res) => {
	res.render('register');
});

// Get data from user for register
app.post('/register', (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password,
	});
	newUser.save((err) => (!err ? res.render('secrets') : console.log(err)));
});

// Get data from user for login
app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ email: username, password }, (err, foundUser) => {
		if (!err) {
			if (foundUser) {
				if (foundUser.password === password) {
					res.render('secrets');
				}
			}
		} else {
			console.log(err);
		}
	});
});

app.listen(3000, (err) => {
	if (!err) {
		console.log('Succesfully running server on port 3000');
	} else {
		console.log(err);
	}
});
