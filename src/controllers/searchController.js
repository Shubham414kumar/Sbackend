const Course = require('../models/Course');
const Vacancy = require('../models/Vacancy');
const Book = require('../models/Book');
const PYQ = require('../models/PYQ');

exports.unifiedSearch = async (req, res) => {
    try {
        const { q, type = 'all', limit = 10 } = req.query;

        if (!q) {
            return res.json([]);
        }

        const results = [];
        const searchRegex = { $regex: q, $options: 'i' };

        // Define search tasks
        const tasks = [];

        if (type === 'all' || type === 'course') {
            tasks.push(
                Course.find({
                    $or: [
                        { title: searchRegex },
                        { category: searchRegex }
                    ]
                }).limit(limit).lean().then(docs => docs.map(d => ({
                    id: d._id,
                    title: d.title,
                    subtitle: `${d.category} • ${d.class} Class`,
                    type: 'course',
                    icon: '📚',
                    route: `/courses/${d._id}`
                })))
            );
        }

        if (type === 'all' || type === 'vacancy') {
            tasks.push(
                Vacancy.find({
                    $or: [
                        { title: searchRegex },
                        { postName: searchRegex },
                        { examCategory: searchRegex }
                    ]
                }).limit(limit).lean().then(docs => docs.map(d => ({
                    id: d._id,
                    title: d.title,
                    subtitle: `${d.examCategory} • ${d.postName || 'Job Listing'}`,
                    type: 'vacancy',
                    icon: '🏛️',
                    route: `/vacancy/${d._id}`
                })))
            );
        }

        if (type === 'all' || type === 'study' || type === 'pyq') {
            tasks.push(
                Book.find({
                    $or: [
                        { title: searchRegex },
                        { subject: searchRegex }
                    ]
                }).limit(limit).lean().then(docs => docs.map(d => ({
                    id: d._id,
                    title: d.title,
                    subtitle: `${d.subject} • ${d.class} Class`,
                    type: 'study',
                    icon: '📖',
                    route: '/study/books'
                })))
            );
            
            tasks.push(
                PYQ.find({
                    $or: [
                        { title: searchRegex },
                        { exam: searchRegex }
                    ]
                }).limit(limit).lean().then(docs => docs.map(d => ({
                    id: d._id,
                    title: d.title,
                    subtitle: `${d.exam} • ${d.year}`,
                    type: 'pyq',
                    icon: '📝',
                    route: '/study/pyq'
                })))
            );
        }

        const allResults = await Promise.all(tasks);
        const flattened = allResults.flat();

        res.json(flattened);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Error performing search' });
    }
};
