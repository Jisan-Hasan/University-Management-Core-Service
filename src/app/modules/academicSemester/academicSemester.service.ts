import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { AcademicSemesterSearchableFields } from './academicSemester.constant';
import { IAcadmicSemesterFilterRequest } from './academicSemester.interface';

const insertIntoDB = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({ data: payload });

  return result;
};

const getAllFromDB = async (
  filters: IAcadmicSemesterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(filters);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicSemesterSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [sortBy]: sortOrder as Prisma.SortOrder,
          }
        : { createdAt: 'desc' },
  });

  const total = await prisma.academicSemester.count({
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

export const AcademicSemesterService = {
  insertIntoDB,
  getAllFromDB,
};
