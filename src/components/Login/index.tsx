import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  console.log(session?.user);

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => router.push("/auth/signin")}>Sign in</button>
    </>
  );
};
