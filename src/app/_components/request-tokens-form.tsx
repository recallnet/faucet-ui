"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestTokens, RequestTokensState } from "@/actions";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react";
import Link from "next/link";

const initialState: RequestTokensState = {};

export default function RequestTokensForm() {

  const [state, formAction] = useFormState(requestTokens, initialState)
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({title: "Error", description: state.error, variant: "destructive"});
    }
    if (state.result) {
      toast({
        title: "Success!",
        description: <span>tHOKU sent in txn <Link href={state.result.txUrl}>{state.result.txHash.slice(0, 6)}...{state.result.txHash.slice(-6)}</Link></span>,
      });
    }
  }, [state, toast])


  return (
    <form className="flex flex-col gap-2 items-center" action={formAction}>
      <FormContents />
    </form>
  );
}

function FormContents() {
  const status = useFormStatus();

  return (
    <>
      <Input
        type="text"
        name="address"
        placeholder="Enter your wallet address (0x...)"
        size={48}
        pattern="^0x[0-9a-fA-F]{40}$"
        title="Provide a valid Ethereum address"
        required
      />
      <Button type="submit" disabled={status.pending}>
        {status.pending && (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        )}
        Request tHOKU
      </Button>
    </>
  )
}
