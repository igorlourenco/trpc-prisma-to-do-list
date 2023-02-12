import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import { getNewStatus } from "../utils/helpers";
import { trpc } from "../utils/trpc";

const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  dueDate: z.string().transform((str) => new Date(str).toISOString()),
});

export type CreateTaskInput = TypeOf<typeof createTaskSchema>;

interface SessionData {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id?: string | null | undefined;
}

const Dashboard = () => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const utils = trpc.useContext();
  const { data: tasksQuery } = trpc.task.getTasksByUserId.useQuery({
    userId: (session?.user?.id as string) || "",
    // dueDate: "2023-02-20",
  });

  const { mutate: createTask, isLoading } = trpc.task.createTask.useMutation({
    async onSuccess() {
      utils.task.getTasksByUserId.invalidate({
        userId: (session?.user?.id as string) || "", // query params
      });
    },
  });

  const { mutate: updateTask } = trpc.task.updateTask.useMutation({
    async onSuccess() {
      utils.task.getTasksByUserId.invalidate({
        userId: (session?.user?.id as string) || "", // query params
      });
    },
  });

  const onSubmit: SubmitHandler<CreateTaskInput> = (data) => {
    createTask({
      userId: session?.user?.id as string,
      dueDate: new Date(data.dueDate).toISOString(),
      title: data.title,
      description: data.description,
    });
  };

  const handleUpdateTask = async (
    taskId: string,
    currentStatus: TaskStatus
  ) => {
    updateTask({
      params: { taskId },
      body: { status: getNewStatus(currentStatus) },
    });
  };

  return (
    <Box>
      Signed in as {session?.user?.email} <br />
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("title")} placeholder="Title" />

        {errors.title && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.title?.message}
          </p>
        )}

        <Input {...register("description")} placeholder="Description" />

        {errors.description && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.description?.message}
          </p>
        )}

        <Input type="date" {...register("dueDate")} placeholder="Date" />

        {errors.dueDate && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.dueDate?.message}
          </p>
        )}

        <Button type="submit" isLoading={isLoading}>
          Send
        </Button>
      </Stack>
      <Stack p={4}>
        <Text>{tasksQuery?.results} </Text>
        {tasksQuery?.tasks.map((task) => (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            key={task.id}
          >
            <Flex
              cursor="pointer"
              onClick={() => handleUpdateTask(task.id, task.status)}
            >
              {task.status} {typeof task.status}
            </Flex>
            <Flex>{task.title}</Flex>
            <Flex>{task.dueDate}</Flex>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
