const router = require('express').Router();
const course = require('../persistence/course');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now()+ path.extname(file.originalname));
      }
    })
     
    const upload = multer({ storage: storage })

router.get('/get', course.getAllCourses)
      .get('/find',course.validateFilter,course.findCourse)
      .get('/findByDate',course.validateDate,course.findByDate)
      .get('/getDocs',course.getDoucument)
      .post('/save',course.saveCourse)
      .post('/saveDocument/', upload.single('courseDocument'),course.saveDocument)
      .post('/deleteDocument',course.deleteDocument)
      .put('/update',course.updateCourse)
      .delete('/delete',course.deleteCourse);

module.exports = router;