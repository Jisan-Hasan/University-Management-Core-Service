import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (
  payload: OfferedCourseSection
): Promise<OfferedCourseSection> => {
  // Check if the offeredCourseId exists
  const isExistsOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
  });
  //   If not, throw an error
  if (!isExistsOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OfferedCourse does not exist');
  }

  //   add semesterRegistrationId with the payload
  payload.semesterRegistrationId = isExistsOfferedCourse.semesterRegistrationId;

  const result = await prisma.offeredCourseSection.create({
    data: payload,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDB,
};
