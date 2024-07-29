const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Course = require('../models/courseModel');

const signup = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

const getUserRole = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      res.status(200).json({ role: user.role });
    } catch (error) {
      console.error('Error fetching user role:', error);
      res.status(500).json({ error: 'Error fetching user role' });
    }
};
  
const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  };

  const getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('enrolledCourses');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.enrolledCourses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Error fetching enrolled courses' });
    }
};

const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.userId;

    console.log('Course ID:', courseId); // Log the course ID
    console.log('User ID:', userId); // Log the user ID
  

    try {
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        user.enrolledCourses.push(course._id);
        await user.save();

        res.status(200).json({ message: 'Enrolled in course successfully' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ error: 'Error enrolling in course' });
    }
};

  
module.exports = { signup, login, getUserRole, getUserProfile, getEnrolledCourses, enrollInCourse };
  