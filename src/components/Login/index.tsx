import { clsx } from "clsx";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div>
        <button className={"p-2"} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <>
      <button
        className={clsx("p-2")}
        onClick={() => router.push("/auth/signin")}
      >
        Sign in
      </button>
    </>
  );
};
