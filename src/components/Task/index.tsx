import { Task as TaskType, TaskStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { BiCheckbox, BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";
import { getNewStatus } from "../../utils/helpers";
import { trpc } from "../../utils/trpc";
interface TaskInterface {
  task: TaskType;
}

const statusIcon = {
  [TaskStatus.TO_DO]: <BiCheckbox size={24} color="#737373" />,
  [TaskStatus.DOING]: <BiCheckboxMinus size={24} color="#0284c7" />,
  [TaskStatus.DONE]: <BiCheckboxChecked size={24} color="#15803d" />,
};

export const Task = ({ task }: TaskInterface) => {
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const { mutate: updateTask } = trpc.task.updateTask.useMutation({
    async onSuccess() {
      utils.task.getTasksByUserId.invalidate({
        userId: (session?.user?.id as string) || "", // query params
      });
    },
  });

  const handleUpdateTask = async (
    taskId: string,
    currentStatus: TaskStatus
  ) => {
    updateTask({
      params: { taskId },
      body: { status: getNewStatus(currentStatus) as TaskStatus },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="cursor-pointer flex gap-2 items-center"
          onClick={() => handleUpdateTask(task.id, task.status)}
        >
          {statusIcon[task.status]}
          <p className="w-16">{task.status?.replace("_", " ")}</p>
        </div>
        <p>{task.title}</p>
      </div>
    </div>
  );
};
