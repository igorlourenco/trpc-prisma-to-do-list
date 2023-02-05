import { Button, Flex, Stack } from "@chakra-ui/react";
import { Provider } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";

const SignIn = ({ providers }) => {
  return (
    <Flex w="100vw" minH="100vh" alignItems="center" justifyContent="center">
      <Stack
        alignItems="center"
        backgroundColor="gray.50"
        p="4"
        rounded="md"
        shadow="md"
        w={["100%", "60%", "40%", "25%"]}
      >
        <Stack alignItems="center">
          {Object.values(providers).map((provider: Provider) => (
            <Button
              key={provider.name}
              width="100%"
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Flex>
  );
};

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}

export default SignIn;
