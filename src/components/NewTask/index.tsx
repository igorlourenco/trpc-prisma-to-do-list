import { Badge, Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import { getDate } from "../../utils/helpers";
import { trpc } from "../../utils/trpc";

const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});

export type CreateTaskInput = TypeOf<typeof createTaskSchema>;

export const NewTask = () => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const utils = trpc.useContext();

  const today = getDate();

  const tomorrow = useMemo(() => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    console.log(getDate(day));
    return getDate(day);
  }, [today]);

  const [dueDate, setDueDate] = useState(today);

  const { mutate: createTask, isLoading } = trpc.task.createTask.useMutation({
    async onSuccess() {
      utils.task.getTasksByUserId.invalidate({
        userId: (session?.user?.id as string) || "", // query params
      });
    },
  });

  const onSubmit: SubmitHandler<CreateTaskInput> = (data) => {
    createTask({
      userId: session?.user?.id as string,
      dueDate: new Date(dueDate).toISOString(),
      title: data.title,
      description: data.description,
    });
  };
  return (
    <Stack>
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("title")} placeholder="Title" />

        {errors.title && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.title?.message}
          </p>
        )}

        <Textarea {...register("description")} placeholder="Description" />

        {errors.description && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.description?.message}
          </p>
        )}

        <Flex gap={2}>
          <Badge
            cursor="pointer"
            onClick={() => setDueDate(today)}
            colorScheme={dueDate === today ? "green" : "gray"}
          >
            Today
          </Badge>
          <Badge
            cursor="pointer"
            onClick={() => setDueDate(tomorrow)}
            colorScheme={dueDate === tomorrow ? "green" : "gray"}
          >
            Tomorrow
          </Badge>
        </Flex>

        <Button type="submit" isLoading={isLoading}>
          Send
        </Button>
      </Stack>
    </Stack>
  );
};
