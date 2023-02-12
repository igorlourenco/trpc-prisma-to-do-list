import { Button, Stack } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <Stack w="100vw" h="100vh" alignItems="center" justifyContent="centers">
        <Button onClick={() => signOut()}>Sign out</Button>
      </Stack>
    );
  }
  return (
    <>
      <Button onClick={() => router.push("/auth/signin")}>Sign in</Button>
    </>
  );
};
