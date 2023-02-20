import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <>
      <button onClick={() => router.push("/auth/signin")}>Sign in</button>
    </>
  );
};
