import { GetServerSidePropsContext } from "next";
import { getProviders, signIn } from "next-auth/react";

const SignIn = ({ providers }: any) => {
  return (
    <div>
      <div>
        <div>
          {Object.values(providers).map((provider: any) => (
            <button key={provider.name} onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}

export default SignIn;
