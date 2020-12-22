const express = require('express');
const courseController = require('../controllers/course.controller');

const router = express.Router();



router.post('/create-course', courseController.createNewCourse);
router.get('/courses', courseController.getAllCourses);
router.put('/courses', courseController.updateCourseOutlineAndContent);
router.get('/outline/:id', courseController.getCourseOutline);
// router.get('/outline/:id/:outlineId', courseController.getOutlineVideos);
router.get('/image/:course_alias/:id', courseController.getImage);
router.get('/video/:id', courseController.getCourseVideos);
router.get('/video/:course_alias/:outline_alias/:id', courseController.getVideo);

// router.get('/', courseController.getAllCourses);
// router.get('/outline', courseController.getAllCourseOutline);
// router.get('/photoUrl/:id', courseController.getImage);
// router.get('/videos/:outline', courseController.getCourseVideos);
// router.get('/video/:outline/:id', courseController.getVideo);

module.exports = router;
