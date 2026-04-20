import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse
} from '../controllers/courseController.js';
import upload from '../utils/multer.js';

const router = express.Router();

// Create + Get creator courses
router.route('/')
  .post(isAuthenticated, upload.single("file"),createCourse)
  .get(isAuthenticated, getCreatorCourses);

  router.route("/search")
    .get(isAuthenticated,searchCourse)


// ✅ FIRST: static route (VERY IMPORTANT)
router.route('/published-courses')
  .get( getPublishedCourse);

// Lecture routes
router.route('/:courseId/lecture')
  .post(isAuthenticated, createLecture)
  .get(isAuthenticated, getCourseLecture);

router.route('/:courseId/lecture/:lectureId')
  .post(isAuthenticated, editLecture);

router.route('/lecture/:lectureId')
  .delete(isAuthenticated, removeLecture)
  .get(isAuthenticated, getLectureById);

// ✅ LAST: dynamic route
router.route('/:courseId')
  .get(isAuthenticated, getCourseById)
  .put(isAuthenticated, upload.single("file"), editCourse)
  .patch(isAuthenticated, togglePublishCourse)
  .delete(isAuthenticated, removeCourse);

export default router;