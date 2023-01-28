import { Stack } from "@chakra-ui/react";
import { Provider } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";

const SignIn = ({ providers }) => {
  return (
    <Stack backgroundColor="red.200	">
      {Object.values(providers).map((provider: Provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </Stack>
  );
};

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default SignIn;
