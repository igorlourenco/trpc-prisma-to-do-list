import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
