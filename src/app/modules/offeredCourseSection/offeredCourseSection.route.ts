import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseSectionValidation.create),
  OfferedCourseSectionController.insertIntoDB
);

router.get('/', OfferedCourseSectionController.getAllFromDB);
router.get('/:id', OfferedCourseSectionController.getByIdFromDB);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseSectionValidation.update),
  OfferedCourseSectionController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.deleteByIdFromDB
);

export const OfferedCourseSectionRoutes = router;
