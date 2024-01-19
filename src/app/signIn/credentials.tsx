import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { api } from "../../trpc/react";

export default function Credentials() {
  const [email, setEmail] = useState("");
  const isValidatedMutation = api.user.isValidated.useMutation();
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const param = router.query.email as string;
    if (!param) {
      void router.push("/");
    } else {
      void checkUserAsync(param);
      setEmail(param);
    }
  }, [router.isReady]);
  console.log(email);

  const checkUserAsync = async (email: string) => {
    const result = await isValidatedMutation.mutateAsync({ email: email });
    if (!result) {
      void router.push("/");
    }
  };

  const [password, setPassword] = useState("");
  const registerMutation = api.register.register.useMutation();
  const signInWithEmail = async () => {
    await registerMutation.mutateAsync({ email: email, password: password });
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    console.log(result);
    await router.push({
      pathname: "/",
    });
  };

  const signInHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    void signInWithEmail();
  };
  return (
    <>
      <main className="flex min-h-[80vh] flex-col items-center justify-center font-serif font-bold">
        <div>
          <h1 className="mb-20 text-center font-serif text-5xl font-extrabold tracking-tight text-black ">
            Sign In with Email
          </h1>

          <div className="mb-10">
            <form className="flex flex-col items-center gap-2">
              <div className="w-64 items-start">
                <label className="text-sm font-semibold">Password</label>
              </div>
              <input
                placeholder="Enter Password"
                className="w-64 rounded-[6px] border-[1px] border-[#eaeaea] p-[12px] font-sans text-[14px] font-normal outline-none ring-black focus:border-black focus:ring-0 focus:ring-offset-0 "
                type="password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                onClick={signInHandler}
                className="w-64 rounded-md bg-[#171717] px-10 py-3 font-medium text-white no-underline transition hover:bg-[#383838]"
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
