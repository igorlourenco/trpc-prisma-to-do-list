import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import { trpc } from "../utils/trpc";

const createTaskSchema = z.object({
  text: z.string().min(1).max(100),
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
    limit: 1000,
  });

  const { mutate: createTask, isLoading } = trpc.task.createTask.useMutation({
    async onSuccess(data: any) {
      utils.task.getTasksByUserId.invalidate({
        userId: (session?.user?.id as string) || "",
      });
    },
  });

  const onSubmit: SubmitHandler<CreateTaskInput> = (data) => {
    createTask({ userId: session?.user?.id as string, ...data });
  };

  return (
    <Box>
      Signed in as {session?.user?.email} <br />
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("text")} placeholder="Title" />

        {errors.text && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.text?.message}{" "}
          </p>
        )}

        <Button type="submit" isLoading={isLoading}>
          Send
        </Button>
      </Stack>
      <Stack>
        <Text>{tasksQuery?.results} </Text>
        {tasksQuery?.tasks.map((task) => (
          <Box key={task.id}>{task.text}</Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
