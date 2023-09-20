/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import { ISemesterRegistrationFilterRequest } from './semesterRegistration.interface';

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

const getAllFromDB = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    include: {
      academicSemester: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.semesterRegistration.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  // Check if semester registration exists
  const isExists = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });
  // If not exists throw error
  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  // UPCOMING to ONGOING check
  if (
    payload.status &&
    isExists.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can only change status to ongoing'
    );
  }

  // ONGOING to ENDED check
  if (
    payload.status &&
    isExists.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can only change status to ended'
    );
  }

  // Update Semester Registration
  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

export const SemesterRegistrationService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteByIdFromDB,
  updateOneInDB,
};
