import { SignIn } from "@/components/sign-in";
import { db } from "@/db";
import { users } from "@/db/schema/auth";
export const runtime = "edge";

export default async function Home() {
  const usersQuery = await db.select().from(users);
  return (
    <main>
      hello, world
      {JSON.stringify(usersQuery)}
      <SignIn />
    </main>
  );
}
