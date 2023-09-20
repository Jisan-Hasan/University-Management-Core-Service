import {
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (
  payload: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegUpComingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegUpComingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already and ${isAnySemesterRegUpComingOrOngoing.status} registration`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

export const semesterRegistrationService = {
  insertIntoDB,
};
