import RequestTokensForm from "./_components/request-tokens-form";

export default function Home() {
  return (
    <main className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gradient-to-bl from-gray-200 via-fuchsia-200 to-stone-100">
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">Hoku Network</span>
        <span className="text-sm text-muted-foreground font-medium">Testnet faucet</span>
      </div>
      <RequestTokensForm />
    </main>
  );
}
