import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

const insertIntoDB = async (
  payload: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  // check availability of room
  await OfferedCourseClassScheduleUtils.checkRoomAvailable(payload);

  const result = await prisma.offeredCourseClassSchedule.create({
    data: payload,
    include: {
      offeredCourseSection: true,
      semesterRegistration: true,
      faculty: true,
      room: true,
    },
  });

  return result;
};

export const OfferedCourseClassScheduleService = {
  insertIntoDB,
};
