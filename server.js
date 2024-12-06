const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Import dotenv to access environment variables

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for posts (personal blog-related titles)
let posts = [
  { id: 1, title: "My First Blog Post: The Journey Begins", body: "Welcome to my personal blog! In this post, I'll share my journey of starting a blog and why I decided to take this step. I hope to inspire others who are thinking about sharing their thoughts online." },
  { id: 2, title: "Why Blogging Changed My Life", body: "Blogging has been an incredible outlet for my thoughts and creativity. In this post, I’ll discuss how blogging has impacted my life, both personally and professionally, and why everyone should try it." },
  { id: 3, title: "The Importance of Consistency in Blogging", body: "One of the key lessons I've learned as a blogger is the importance of consistency. In this post, I’ll share why consistency matters, how to stay on track, and how I manage to write regularly." },
  { id: 4, title: "How I Gained My First 100 Blog Followers", body: "Reaching my first 100 followers on my blog was a huge milestone. In this post, I’ll share the strategies I used to gain my first 100 readers and the lessons I learned along the way." },
  { id: 5, title: "Tips for Writing Engaging Content", body: "Creating content that resonates with readers is a crucial skill for any blogger. In this post, I’ll offer my tips for writing engaging and shareable blog posts that keep readers coming back for more." },
  { id: 6, title: "What I've Learned About SEO for Bloggers", body: "Search Engine Optimization (SEO) is essential for driving traffic to your blog. In this post, I’ll share the basics of SEO that every blogger should know and how to optimize blog content for better visibility." },
  { id: 7, title: "Overcoming Writer's Block as a Blogger", body: "Every blogger faces writer's block at some point. In this post, I’ll discuss how I tackle writer's block, stay inspired, and keep producing content even when I’m feeling stuck." },
  { id: 8, title: "How to Monetize Your Blog Successfully", body: "Monetizing a blog can be a rewarding venture if done correctly. In this post, I’ll explore different ways to monetize a blog, from affiliate marketing to sponsored posts, and share tips for making your blog profitable." }
];

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';  // Load secret key from environment variable

// In-memory storage for users
let users = [
  { username: 'VenuPrasad', password: 'VenuPrasad@123' }
];

// POST Route for User Login (JWT token generation)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token if credentials are valid
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// GET Route to List All Posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// GET Route to Get a Single Post by ID
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// POST Route to Create a New Post (Without Authentication for everyone)
app.post('/api/posts', (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }

  // Create and store the new post
  const newPost = { id: posts.length + 1, title, body };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// POST Route to Create a New Post (With Authentication)
app.post('/api/posts/auth', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const newPost = { id: posts.length + 1, title, body };
    posts.push(newPost);
    res.status(201).json(newPost);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
