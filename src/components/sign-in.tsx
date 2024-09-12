"use client";

import { signIn } from "@/actions";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  return (
    <form action={signIn}>
      <FormContents />
    </form>
  );
}

function FormContents() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.gitHub className="mr-2 size-4" />
      )}
      Sign in with GitHub
    </Button>
  );
}
