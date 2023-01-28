import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

import { AppProps } from "next/app";
import theme from "../theme";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
