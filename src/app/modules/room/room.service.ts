import { Room } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insetIntoDB = async (payload: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data: payload,
    include: {
      building: true,
    },
  });

  return result;
};

export const RoomService = {
  insetIntoDB,
};
