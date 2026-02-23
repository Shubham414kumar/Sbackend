const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single course with lessons
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const lessons = await Lesson.find({ courseId: req.params.id }).sort('order');
        res.json({ course, lessons });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a course (Admin only ideally)
exports.createCourse = async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Add lesson to course
exports.addLesson = async (req, res) => {
    const lesson = new Lesson(req.body);
    try {
        const newLesson = await lesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a course (and its lessons)
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Delete all lessons associated with this course
        await Lesson.deleteMany({ courseId: course._id });

        // Delete the course itself
        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: 'Course and associated lessons deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a single lesson
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
