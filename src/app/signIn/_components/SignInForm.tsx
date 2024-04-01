"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../trpc/react";

export default function SignInForm() {
  const handleEmailSignInClick = (event: React.MouseEvent) => {
    event.preventDefault();
    void emailSignIn(email);
  };
  const { data: sessionData } = useSession();
  const [email, setEmail] = useState("");

  const router = useRouter();

  if (sessionData) {
    void router.push("/");
  }

  const findMutation = api.user.isValidated.useMutation();
  const verificationMutation = api.register.sendVerification.useMutation();
  async function emailSignIn(email: string) {
    const result = await findMutation.mutateAsync({ email: email });
    if (result) {
      router.push(`/signIn/credentials?email=${email}`);
    } else {
      await verificationMutation.mutateAsync({
        email: email,
      });
      router.push(`/signIn/email?email=${email}`);
    }
  }

  return (
    <div className="mt-24 font-sans">
      <h1 className="mb-[10vh] text-center font-serif text-5xl font-extrabold tracking-tight text-black ">
        Sign In to Continue
      </h1>
      <div className="mb-10 flex flex-col items-center gap-2">
        <button
          className="flex w-64 gap-2 rounded rounded-md border-[1px] border-black bg-white px-6 py-3  font-medium no-underline transition hover:bg-blue-200"
          onClick={
            sessionData
              ? () => {
                  void signOut();
                }
              : () => void signIn("google")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="-3 0 262 262"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              fill="#4285F4"
            />
            <path
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              fill="#34A853"
            />
            <path
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              fill="#FBBC05"
            />
            <path
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              fill="#EB4335"
            />
          </svg>
          <div>{sessionData ? "Sign out" : "Continue with Google"}</div>
        </button>
      </div>

      <div className="mb-10 flex items-center">
        <div className="flex-grow border-t border-black"></div>
        <span className="mx-4 flex-shrink font-bold text-black">OR</span>
        <div className="flex-grow border-t border-black"></div>
      </div>
      <div className="mb-10">
        <form className="flex flex-col items-center gap-2">
          <div className="w-64 items-start">
            <label className="text-sm font-medium">Continue with Email</label>
          </div>
          <input
            placeholder="Enter Email"
            className="w-64 rounded-[6px] border-[1px] border-[#eaeaea] p-[12px] font-sans text-[14px] font-normal outline-none ring-black focus:border-black focus:ring-0 focus:ring-offset-0 "
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            onClick={handleEmailSignInClick}
            className="w-64 rounded-md bg-[#171717] px-10 py-3 font-medium text-white no-underline transition hover:bg-[#383838]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
