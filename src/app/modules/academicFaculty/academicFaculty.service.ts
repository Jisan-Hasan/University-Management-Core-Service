import { AcademicFaculty } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });

  return result;
};

export const AcademicFacultyService = {
  insertIntoDB,
};
