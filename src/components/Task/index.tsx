import { Flex, Text } from "@chakra-ui/react";
import { Task as TaskType, TaskStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { getNewStatus } from "../../utils/helpers";
import { trpc } from "../../utils/trpc";

interface TaskInterface {
  task: TaskType;
}

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
    <Flex
      gap={4}
      alignItems="center"
      justifyContent="space-between"
      key={task.id}
    >
      <Text
        fontWeight="semibold"
        color="gray.600"
        cursor="pointer"
        onClick={() => handleUpdateTask(task.id, task.status)}
      >
        {task.status?.replace("_", " ")}
      </Text>
      <Flex>{task.title}</Flex>
    </Flex>
  );
};
