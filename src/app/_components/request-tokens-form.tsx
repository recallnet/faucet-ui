"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestTokens, RequestTokensState } from "@/client-actions";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

const initialState: RequestTokensState = {};

export default function RequestTokensForm() {
  const [state, formAction] = useFormState(requestTokens, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state.result) {
      toast({
        title: "Success!",
        description: (
          <span>
            RECALL sent in txn {state.result.txHash.slice(0, 6)}...
            {state.result.txHash.slice(-6)}
          </span>
        ),
      });
    }
  }, [state, toast]);

  return (
    <form className="flex flex-col items-center gap-2" action={formAction}>
      <FormContents />
    </form>
  );
}

function FormContents() {
  const { pending } = useFormStatus();
  const [tsResponse, setTsResponse] = useState<string | null>(null);

  return (
    <>
      <Input
        type="text"
        name="address"
        placeholder="Enter wallet address (0x...)"
        size={48}
        pattern="^0x[0-9a-fA-F]{40}$"
        title="Provide a valid EVM address"
        required
        className="bg-primary-foreground"
      />
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TS_SITE_KEY || ""}
        options={{ size: "normal" }}
        onSuccess={setTsResponse}
        onExpire={() => setTsResponse(null)}
      />
      <Button type="submit" disabled={pending || !tsResponse} size="default">
        {pending && <Loader2 className="mr-2 size-5 animate-spin" />}
        Request RECALL
      </Button>
    </>
  );
}
