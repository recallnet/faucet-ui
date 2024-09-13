import { signInEmail } from "@/actions";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SignInEmail() {
  return (
    <form action={signInEmail} className="flex items-center gap-2">
      <Input
        type="text"
        name="email"
        placeholder="Email"
        className="bg-primary-foreground"
      />
      <Button type="submit">Sign in with email</Button>
    </form>
  );
}
