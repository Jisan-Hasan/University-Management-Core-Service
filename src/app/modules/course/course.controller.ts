import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './course.service';
import { courseFilterableFields } from './course.constant';
import { paginationFields } from '../../../constants/pagination';
import pick from '../../../shared/pick';
import { Course } from '@prisma/client';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await CourseService.getAllFromDB(filters, options);

  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const CourseController = {
  insertIntoDB,
  getAllFromDB,
};
