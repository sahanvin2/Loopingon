import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getJobs = async (includeClosed = false) => {
  return await prisma.jobPosition.findMany({
    where: includeClosed ? undefined : { isOpen: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getJobById = async (id: string) => {
  return await prisma.jobPosition.findUnique({
    where: { id },
  });
};

export const createJob = async (data: any) => {
  return await prisma.jobPosition.create({
    data,
  });
};

export const updateJob = async (id: string, data: any) => {
  return await prisma.jobPosition.update({
    where: { id },
    data,
  });
};

export const deleteJob = async (id: string) => {
  return await prisma.jobPosition.delete({
    where: { id },
  });
};

export const toggleJobStatus = async (id: string, isOpen: boolean) => {
  return await prisma.jobPosition.update({
    where: { id },
    data: { isOpen },
  });
};
