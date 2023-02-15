import { Flex, Stack } from "@chakra-ui/react";
import { Task as TaskType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { NewTask } from "../components/NewTask";
import { Task } from "../components/Task";
import { trpc } from "../utils/trpc";

const Dashboard = () => {
  const { data: session } = useSession();

  const { data: tasksQuery } = trpc.task.getTasksByUserId.useQuery({
    userId: (session?.user?.id as string) || "",
  });

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      w="100vw"
    >
      <NewTask />

      <Stack gap={4} p={4}>
        {tasksQuery?.tasks.map((task) => (
          <Task key={task.id} task={task as any as TaskType} />
        ))}
      </Stack>
    </Flex>
  );
};

export default Dashboard;
