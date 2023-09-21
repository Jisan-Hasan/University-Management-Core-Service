import { OfferedCourseClassSchedule } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { hasTimeConflict } from '../../../shared/utils';

const checkRoomAvailable = async (payload: OfferedCourseClassSchedule) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: payload.dayOfWeek,
        room: {
          id: payload.roomId,
        },
      },
    });

  const existingSlots = alreadyBookedRoomOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlot = {
    startTime: payload.startTime,
    endTime: payload.endTime,
    dayOfWeek: payload.dayOfWeek,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Room already booked');
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
};
