const mongoose = require('mongoose');
const utils = require('../utils/response-utils');
const moment = require('moment');

const CourseDocumentSchema = mongoose.Schema({
    name: {
        type: String
    },
    path: {
        type: String,
        default: ""
    }
});

const CourseSchema = mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    schedule: {
        type: Date,
        required: true
    },
    maxRegistrationLimit: {
        type: Number
    },
    courseDocuments: [CourseDocumentSchema]
});

const CourseModel = mongoose.model('Course', CourseSchema);

let Course = {};

Course.getAllCourses = async (req, res) => {
    const courses = await CourseModel.find().sort({
        courseTitle: 1
    });
    res.json(utils.makeSuccessResponse(courses));
}

Course.saveCourse = async (req, res) => {
    try {
        const courseToSave = req.body;
        courseToSave.schedule = moment(courseToSave.schedule, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const course = await CourseModel.create(courseToSave);
        res.json(utils.makeSuccessResponse(course));
    } catch (error) {
        console.log('Error saving course', error);
        res.json(utils.makeFailureResponse('Failed to Save Course'));
    }
}

Course.updateCourse = async (req, res) => {
    try {
        const courseToUpdate = req.body;
        courseToUpdate.schedule = moment(courseToUpdate.schedule, 'DD-MM-YYYY').format('YYYY-MM-DD');
        await CourseModel.updateOne({
            _id: courseToUpdate._id
        }, courseToUpdate);
        res.json(utils.makeSuccessResponse(courseToUpdate));
    } catch (error) {
        console.log('Error saving course', error);
        res.status(500).json(utils.makeFailureResponse('Failed to Update Course'));
    }
}

Course.deleteCourse = async (req, res) => {
    try {
        const course = req.body;
        await CourseModel.deleteOne({
            _id: course._id
        });
        res.status(200).json(utils.makeSuccessResponse({
            message: 'Successfully Deleted User'
        }));
    } catch (error) {
        console.log('Error Deleting Course', error);
        res.status(500).json(utils.makeFailureResponse('Failed to Delete Course'));
    }
}

Course.findCourse = async (req, res) => {
    try {
        const filter = req.query.filter;
        const regex = new RegExp('.*' + filter, 'i');
        const query = {
            $or: [{
                    "courseTitle": regex
                },
                {
                    "description": regex
                }
            ]
        }
        const courses = await CourseModel.find(query);
        res.status(200).json(utils.makeSuccessResponse(courses));
    } catch (error) {
        console.log('Error Finding Course', error);
        res.status(500).json(utils.makeFailureResponse('Failed to Find Course'));
    }
}

Course.findByDate = async (req, res) => {
    try {
        const filter = req.query.filter;
        const date = moment(filter, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const courses = await CourseModel.find({
            "schedule": date
        });
        res.status(200).json(utils.makeSuccessResponse(courses));
    } catch (error) {
        console.log('Error Finding Course', error);
        res.status(500).json(utils.makeFailureResponse('Failed to Find Course, kindly enter a valid date in DD-MM-YYYY format'));
    }
}

Course.validateDate = async (req, res, next) => {
    try {
        const filter = req.query.filter;
        moment(filter, 'DD-MM-YYYY').format('YYYY-MM-DD');
        next();

    } catch (error) {
        res.status(400).json(utils.makeFailureResponse('Invalid Date'));
        return;
    }
}

Course.validateFilter = async (req, res, next) => {
    utils.validateFilter(req.query.filter) ? next() : res.status(400).json(utils.makeFailureResponse('Invalid filter value'));
}

Course.saveDocument = async (req, res) => {
    try {
        const courseRequest = req.body;
        console.log('Course', courseRequest['courseDocument']);

        let course = await CourseModel.findById(courseRequest._id);
        console.log('From DB', course);
        course.courseDocuments.push(courseRequest['courseDocument']);
        await CourseModel.create(course);
        res.status(200).json(utils.makeSuccessResponse('Document added successfully!'));
    } catch (error) {
        console.log('Error while adding document to the course', error);
        res.status(500).json(utils.makeFailureResponse('Error while adding document to the course'));
    }
}

Course.deleteDocument = async(req,res) =>{
    try {
        const courseRequest = req.body;
        let course = await CourseModel.findById(courseRequest._id);
        await course.courseDocuments.id(courseRequest['courseDocument']._id).remove();
        await CourseModel.create(course);
        res.status(200).json(utils.makeSuccessResponse({"message":"Document removed successfully"}));
        
    } catch (error) {
        console.log('Error while removing the course document');
        res.status(500).json(utils.makeFailureResponse('Error while removing the course document'));     
    }
}

module.exports = Course;