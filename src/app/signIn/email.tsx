import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Email() {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const email = router.query.email;
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center font-serif font-bold">
        <div className="flex flex-col items-center">
          <h1 className="mb-20 text-center font-serif text-5xl font-extrabold tracking-tight text-black ">
            One Last Step ...
          </h1>
          <div className="mb-8 text-center font-sans font-medium">
            Click on the link in the email to Log In with {email}
          </div>
          <div className="mb-8 rounded border-2 border-black p-12 shadow-xl">
            <div className="justify-content  flex flex-row">
              <div className="mr-4 flex flex-col items-end text-sm font-normal text-slate-400">
                <p>From</p>
                <p>To</p>
                <p>Subject</p>
              </div>
              <div className="flex flex-col items-start text-sm font-normal">
                <p>LogoAI@gmail.com</p>
                <p>{email}</p>
                <p>Log In to LogoAI</p>
              </div>
            </div>
          </div>

          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            className="relative mb-16 w-52 rounded-md border-[1px] border-black bg-white px-10 py-3 font-sans font-medium no-underline transition hover:bg-red-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={24}
              width={24}
              viewBox="52 42 88 66"
              className="absolute left-6"
            >
              <path
                fill="#4285f4"
                d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"
              />
              <path
                fill="#34a853"
                d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"
              />
              <path
                fill="#fbbc04"
                d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"
              />
              <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
              <path
                fill="#c5221f"
                d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"
              />
            </svg>
            <span className="ml-7">Open Gmail</span>
          </a>
          <div className="flex flex-col items-center gap-2 font-bold"></div>
          <div className="flex gap-1 text-xs font-normal">
            <Link href="" className="text-blue-500">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="" className="text-blue-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
