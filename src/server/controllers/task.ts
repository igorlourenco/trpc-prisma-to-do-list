import { Prisma, PrismaClient, Task } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getDate } from "../../utils/helpers";
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
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
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
      data: {
        updatedAt: new Date(),
        ...input,
      },
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
    const task = await prisma.task.findFirst({
      where: { id: paramsInput.taskId },
    });

    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task with that ID not found",
      });
    }

    return {
      status: "success",
      task,
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
    const tasks: Task[] = await prisma.task.findMany({
      where: {
        userId: filterQuery.userId,
        dueDate: {
          equals: filterQuery.dueDate || getDate(new Date()),
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      status: "success",
      results: tasks.length,
      tasks,
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
