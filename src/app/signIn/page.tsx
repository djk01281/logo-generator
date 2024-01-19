"use client";
import { api } from "../../trpc/server";
import { useRouter } from "next/navigation";
import SignInForm from "./SignInForm";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  return (
    <>
      <main className="mt-12 flex min-h-[80vh] flex-col items-center font-serif font-bold">
        <SignInForm />
      </main>
    </>
  );
}
