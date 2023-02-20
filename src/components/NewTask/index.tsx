import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import { getDate } from "../../utils/helpers";
import { errorToast, successToast } from "../../utils/toast";
import { trpc } from "../../utils/trpc";
import { Input } from "../general/Input";

const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
});

export type CreateTaskInput = TypeOf<typeof createTaskSchema>;

export const NewTask = () => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const utils = trpc.useContext();

  const today = getDate();

  const tomorrow = useMemo(() => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    return getDate(day);
  }, [today]);

  const [dueDate, setDueDate] = useState(today);
  const { mutate: createTask, isLoading } = trpc.task.createTask.useMutation({
    async onSuccess() {
      utils.task.getTasksByUserId.invalidate({
        userId: (session?.user?.id as string) || "", // query params
      });
      reset();
      successToast("Task created successfully");
    },
    async onError(e: any) {
      console.log({ e });
    },
  });

  useEffect(() => {
    if (errors.title && errors.title?.message) {
      errorToast(errors.title?.message);
    }
    console.log("entra");
  }, [errors]);

  const onSubmit: SubmitHandler<CreateTaskInput> = (data) => {
    createTask({
      userId: session?.user?.id as string,
      dueDate: new Date(dueDate).toISOString(),
      title: data.title,
    });
  };
  return (
    <form
      className={clsx("flex gap-2 w-2/3")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input placeholder="Title" {...register("title")} />

      <select
        className={clsx(
          "w-1/4 bg-gray-100 border-none rounded-md py-2 px-4 block appearance-none indent-[25%]",
          "focus:ring-2 ring-gray-300 outline-none"
        )}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      >
        <option value={today}>Today</option>
        <option value={tomorrow}>Tomorrow</option>
      </select>
      <button
        className={clsx(
          "w-1/4 block bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
        )}
        type="submit"
      >
        Send (&#9166;)
      </button>
    </form>
  );
};
