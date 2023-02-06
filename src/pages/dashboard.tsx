import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const Index = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <Box>
      Signed in as {session?.user?.email} <br />
    </Box>
  );
};

export default Index;
