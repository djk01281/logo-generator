"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { api } from "../../trpc/react";

export default function Credentials() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const param = searchParams.get("email");
    if (!param) {
      void router.push("/");
    } else {
      setEmail(param);
    }
  }, [router]);

  const registerMutation = api.register.register.useMutation();
  const signInWithEmail = async () => {
    await registerMutation.mutateAsync({
      email: email,
      password: password,
    });
  };
  const signInHandler = (event: React.MouseEvent) => {
    void signInWithEmail();
  };
  return (
    <>
      <main className="flex flex-col  justify-center font-serif font-bold">
        <div>
          <h1 className="mb-20 text-center font-serif text-5xl font-extrabold tracking-tight text-black">
            Sign In with Email
          </h1>

          <div className="mb-10">
            <form className="flex flex-col items-center gap-2">
              <div className="w-64 items-start">
                <label className="text-sm">Password</label>
              </div>
              <input
                placeholder="Enter Password"
                className="w-64 rounded-md border-2 border-black px-4 py-3 font-semibold  "
                type="password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                onClick={signInHandler}
                className="w-64 rounded-md bg-[#171717] px-10 py-3 font-normal text-white no-underline transition hover:bg-[#383838]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
