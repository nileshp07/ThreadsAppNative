const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

// Database Password : VAQQ0zRUcLhr4V48

mongoose
	.connect(
		'mongodb+srv://Nilesh:VAQQ0zRUcLhr4V48@cluster0.r7rgcpt.mongodb.net/',
		{}
	)
	.then(() => console.log('DB connected successfully!'))
	.catch((err) => {
		console.log('Error connecting to mongodb database :(', err);
	});

app.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});

const User = require('./models/user');
const Post = require('./models/post');

// API ENDPOINTS

// Register a user in the database
app.post('/register', async (req, res) => {
	try {
		const {name, email, password} = req.body;

		const existingUser = await User.findOne({email});
		if (existingUser) {
			res.status(400).json({message: 'Email already registered.'});
		}

		// Create a new user
		const newUser = new User({name, email, password});

		// Generate and store the verificatino token
		newUser.verificationToken = crypto.randomBytes(20).toString('hex');

		// Save the user to the database
		await newUser.save();

		// Send the verification email to the user
		sendVerificationEmail(newUser.email, newUser.verificationToken);

		res.status(200).json({
			message:
				'Registration Successfully. Please check your email for verification.',
		});
	} catch (error) {
		console.log('error registering user', error);
		res.status(500).json({message: 'There was an error registering you.'});
	}
});

const sendVerificationEmail = async (email, verificationToken) => {
	// 1) Create a transporter
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '522nilesh.parmar105@gmail.com',
			pass: 'decq jdky aooi bvzu',
		},
	});

	// 2) Compose the email message
	const mailOptions = {
		from: 'John Holan, Threads',
		to: email,
		subject: 'Email Verification',
		text: `Please click on the following link to verify your email: http://192.168.0.104:3000/verify/${verificationToken}`,
	};

	// 3) Send email
	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.log('Error sending verification email.', error);
	}
};

app.get('/verify/:token', async (req, res) => {
	try {
		const token = req.params.token;

		const user = await User.findOne({verificationToken: token});
		if (!user) {
			return res.status(400).json({message: 'Invalid Token.'});
		}

		user.verified = true;
		user.verificationToken = undefined;
		await user.save();

		res.status(200).json({message: 'Email verified successfully.'});
	} catch (error) {
		console.log('Error getting token', error);
		res.status(500).json({message: 'Email verification failed.'});
	}
});

const secretkey = 'superSecretJWTKey';

app.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;

		const user = await User.findOne({email});
		if (!user) {
			res.status(404).json({message: 'Invalid email'});
		}

		if (user.password !== password) {
			res.status(404).json({message: 'Invalid password.'});
		}

		const token = jwt.sign({userId: user._id}, secretkey);

		res.status(200).json({token});
	} catch (error) {
		console.log('Error Logging in.', error);
		res.status(500).json({message: 'Login Failed.'});
	}
});

// Get all users except the logged in user
app.get('/user/:userId', (req, res) => {
	try {
		const loggedInUser = req.params.userId;

		User.find({_id: {$ne: loggedInUser}})
			.then((users) => {
				res.status(200).json(users);
			})
			.catch((error) => {
				console.log('Error: ', error);
				res.status(500).json({message: 'Error.'});
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({message: 'Error getting the users.'});
	}
});

// Follow a particular user
app.post('/follow', async (req, res) => {
	const {currentUserId, selectedUserId} = req.body;
	try {
		await User.findByIdAndUpdate(selectedUserId, {
			$push: {followers: currentUserId},
		});
		res.sendStatus(200);
	} catch (error) {
		console.log('Error:', error);
		res.status(500).json({message: 'Error following a user.'});
	}
});

// Unfollow a particular user
app.post('/users/unfollow', async (req, res) => {
	const {currentUserId, selectedUserId} = req.body;
	try {
		await User.findByIdAndUpdate(selectedUserId, {
			$pull: {followers: currentUserId},
		});
		res.status(200).json({message: 'Unfollowed successfully'});
	} catch (error) {
		console.log('Error:', error);
		res.status(500).json({message: 'Error unfollowing a user.'});
	}
});

// Create a new post in the backend
app.post('/create-post', async (req, res) => {
	try {
		const {content, userId} = req.body;

		const newPostData = {
			user: userId,
		};

		if (content) {
			newPostData.content = content;
		}

		const newPost = new Post(newPostData);

		await newPost.save();

		res.status(200).json({message: 'Post saved successfully.'});
	} catch (error) {
		console.log(error);
		res.status(500).json({message: 'Error creating  post.'});
	}
});

//endpoint for liking a particular post
app.put('/posts/:postId/:userId/like', async (req, res) => {
	const postId = req.params.postId;
	const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID

	try {
		const post = await Post.findById(postId).populate('user', 'name');

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{$addToSet: {likes: userId}}, // Add user's ID to the likes array
			{new: true} // To return the updated post
		);

		if (!updatedPost) {
			return res.status(404).json({message: 'Post not found'});
		}
		updatedPost.user = post.user;

		res.json(updatedPost);
	} catch (error) {
		console.error('Error liking post:', error);
		res.status(500).json({message: 'An error occurred while liking the post'});
	}
});

//endpoint to unlike a post
app.put('/posts/:postId/:userId/unlike', async (req, res) => {
	const postId = req.params.postId;
	const userId = req.params.userId;

	try {
		const post = await Post.findById(postId).populate('user', 'name');

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{$pull: {likes: userId}},
			{new: true}
		);

		updatedPost.user = post.user;

		if (!updatedPost) {
			return res.status(404).json({message: 'Post not found'});
		}

		res.json(updatedPost);
	} catch (error) {
		console.error('Error unliking post:', error);
		res
			.status(500)
			.json({message: 'An error occurred while unliking the post'});
	}
});

//endpoint to get all the posts
app.get('/get-posts', async (req, res) => {
	try {
		const posts = await Post.find()
			.populate('user', 'name')
			.sort({createdAt: -1});

		res.status(200).json(posts);
	} catch (error) {
		res
			.status(500)
			.json({message: 'An error occurred while getting the posts'});
	}
});

// Get the current logged in user
app.get('/profile/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		return res.status(200).json({user});
	} catch (error) {
		res.status(500).json({message: 'Error while getting the profile'});
	}
});
