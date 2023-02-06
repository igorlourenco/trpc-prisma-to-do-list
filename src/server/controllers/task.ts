import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  CreateTaskInput,
  FilterQueryInput,
  ParamsInput,
  UpdateTaskInput,
} from "../schema/task";

const prisma = new PrismaClient();

export const createTaskController = async ({
  input,
}: {
  input: CreateTaskInput;
}) => {
  try {
    const task = await prisma.task.create({
      data: {
        text: input.text,
        userId: input.userId,
      },
    });

    return {
      status: "success",
      data: {
        task,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Task with that text already exists.",
        });
      }
    }
    throw error;
  }
};

export const updateTaskController = async ({
  paramsInput,
  input,
}: {
  paramsInput: ParamsInput;
  input: UpdateTaskInput["body"];
}) => {
  try {
    const updatedNote = await prisma.task.update({
      where: { id: paramsInput.taskId },
      data: input,
    });

    return {
      status: "success",
      note: updatedNote,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Task with that text already exists",
        });
      }
    }
    throw error;
  }
};

export const findTaskController = async ({
  paramsInput,
}: {
  paramsInput: ParamsInput;
}) => {
  try {
    const note = await prisma.task.findFirst({
      where: { id: paramsInput.taskId },
    });

    if (!note) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task with that ID not found",
      });
    }

    return {
      status: "success",
      note,
    };
  } catch (error) {
    throw error;
  }
};

export const findAllTasksController = async ({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) => {
  try {
    const page = filterQuery.page || 1;
    const limit = filterQuery.limit || 10;
    const skip = (page - 1) * limit;

    const notes = await prisma.task.findMany({
      skip,
      take: limit,
      where: {
        userId: filterQuery.userId,
      },
    });

    return {
      status: "success",
      results: notes.length,
      notes,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteTaskController = async ({
  paramsInput,
}: {
  paramsInput: ParamsInput;
}) => {
  try {
    await prisma.task.delete({ where: { id: paramsInput.taskId } });

    return {
      status: "success",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task with that ID not found",
        });
      }
    }
    throw error;
  }
};