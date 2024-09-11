import SignIn from "@/components/sign-in";
import RequestTokensForm from "./_components/request-tokens-form";
import { auth } from "@/auth";
import { UserNav } from "@/components/user-nav";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-bl from-gray-200 via-fuchsia-200 to-stone-100">
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">Hoku Network</span>
        <span className="text-sm font-medium text-muted-foreground">
          Testnet faucet
        </span>
      </div>
      {session?.user ? (
        <>
          <RequestTokensForm />
          <UserNav user={session.user} className="absolute right-4 top-4" />
        </>
      ) : (
        <SignIn />
      )}
    </main>
  );
}
