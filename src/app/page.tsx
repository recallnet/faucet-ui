import RequestTokensForm from "./_components/request-tokens-form";
import Image from "next/image";
import logo from "@/public/recall.svg";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-300 p-4">
      <div className="flex flex-col items-center">
        <Image
          src={logo}
          alt="Recall Logo"
          width={7238}
          height={1620}
          className="max-w-80"
        />
        <span className="text-base font-medium text-muted-foreground">
          Testnet faucet
        </span>
      </div>
      <RequestTokensForm />
    </main>
  );
}
