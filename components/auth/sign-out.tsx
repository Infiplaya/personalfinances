"use client";

import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

export function SignOut() {
  return (
    <button
      onClick={() => {
        signOut({callbackUrl: "/?signedOut=true"});
      }}
    >
      Sign Out
    </button>
  );
}
