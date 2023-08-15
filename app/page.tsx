import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";


export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="max-w-lg mx-auto py-24">
      great emptiness
    </main>
  );
}
