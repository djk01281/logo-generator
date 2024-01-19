import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default function Home() {
  return (
    <>
      <main className=" flex min-h-[90vh] w-full flex-col items-center justify-center bg-white font-sans ">
        <div className="absolute h-5/6 w-5/6 sm:w-[36rem]">
          <div className="relative h-full w-full">
            <div className="absolute left-4 top-24 h-1/4 w-1/2 rounded-full bg-purple-300 opacity-50 mix-blend-multiply blur-2xl filter sm:h-64 sm:w-64 sm:blur-3xl"></div>
            <div className="absolute right-4 top-24 h-1/4 w-1/2 rounded-full bg-yellow-300 opacity-50 mix-blend-multiply blur-2xl filter sm:h-64 sm:w-64 sm:blur-3xl"></div>
            <div className="absolute left-1/2 top-48 h-1/4 w-1/2 -translate-x-1/2 transform rounded-full bg-pink-300 opacity-50 mix-blend-multiply blur-2xl filter sm:h-64 sm:w-64 sm:blur-3xl"></div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1
            className={`inset-0 mb-12 mt-12 flex flex-col items-center gap-4 font-serif text-6xl font-extrabold text-black  sm:flex-row sm:text-[80px]`}
          >
            <div className="text-[hsl(280,100%,70%)]">Logo</div>{" "}
            <div>Generator</div>
          </h1>
          <div
            className={`sans text-l itallic inset-0 flex origin-top transform flex-col  items-center gap-2 font-medium  text-slate-700 transition transition-transform duration-300`}
          >
            Create logos in one place with ease
          </div>
          <div>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

async function AuthShowcase() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-[128px] flex-col items-center justify-start gap-4">
      {session?.user && (
        <>
          <Link
            href="/generate"
            className={` inset-0 origin-top-left transform rounded-md bg-blue-500  px-6 py-3 text-center font-medium text-white no-underline  transition   hover:translate-y-[-2px] hover:border-[1px] hover:border-violet-500 hover:bg-violet-500`}
          >
            Generate Logo
          </Link>
        </>
      )}
      {!session?.user && (
        <Link
          href="/signIn"
          className={` inset-0 origin-top-left transform rounded-md bg-blue-500  px-6 py-3 text-center font-medium text-white no-underline  transition hover:translate-y-[-2px] hover:border-[1px] hover:border-violet-500 hover:bg-violet-500`}
        >
          Get Started
        </Link>
      )}
    </div>
  );
}
