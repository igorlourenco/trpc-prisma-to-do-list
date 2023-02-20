import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import { getDate } from "../../utils/helpers";
import { trpc } from "../../utils/trpc";
import { Input } from "../general/Input";

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
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("title")} placeholder="Title" />

        {errors.title && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.title?.message}
          </p>
        )}

        <textarea {...register("description")} placeholder="Description" />

        {errors.description && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.description?.message}
          </p>
        )}

        <div>
          <span onClick={() => setDueDate(today)}>Today</span>
          <span onClick={() => setDueDate(tomorrow)}>Tomorrow</span>
        </div>

        <button type="submit">Send</button>
      </form>
    </div>
  );
};
