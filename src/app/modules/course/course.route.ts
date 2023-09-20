import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidation.create),
  CourseController.insertIntoDB
);

router.get('/', CourseController.getAllFromDB);
// router.get('/:id', CourseController.getByIdFromDB);

export const CourseRoutes = router;
