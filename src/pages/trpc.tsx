import { trpc } from "../utils/trpc";

export default function TRPC() {
  const hello = trpc.hello.get.useQuery({ name: "client" });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
