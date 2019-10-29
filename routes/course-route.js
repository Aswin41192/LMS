const router = require('express').Router();
const course = require('../persistence/course');

router.get('/get', course.getAllCourses)
      .get('/find',course.validateFilter,course.findCourse)
      .get('/findByDate',course.validateDate,course.findByDate)
      .post('/save',course.saveCourse)
      .post('/saveDocument/',course.saveDocument)
      .post('/deleteDocument',course.deleteDocument)
      .put('/update',course.updateCourse)
      .delete('/delete',course.deleteCourse);

module.exports = router;