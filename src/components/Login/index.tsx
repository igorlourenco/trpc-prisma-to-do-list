import { Button } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <>
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => router.push("/auth/signin")}>Sign in</Button>
    </>
  );
};
