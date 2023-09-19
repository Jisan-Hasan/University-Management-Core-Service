import { Building } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: payload,
  });

  return result;
};

export const BuildingService = {
  insertIntoDB,
};
