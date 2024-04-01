"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Just_Another_Hand } from "next/font/google";

const just = Just_Another_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-just_another_hand",
});

export default function Navbar() {
  const [gradientColors, setGradientColors] = useState(getRandomColors());
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();
  function getRandomColors() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `${color1}, ${color2}`;
  }
  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  const [gradientAngle, setGradientAngle] = useState(getRandomAngle());

  function getRandomAngle() {
    // Generate a random angle between 0 and 360 degrees
    return Math.floor(Math.random() * 360);
  }

  const handleProfileClick = () => {
    setOpened(!opened);
  };
  const router = useRouter();

  const ref = useRef<HTMLDivElement | null>(null);
  const signOutAndRedirect = async () => {
    await signOut();
  };
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked element is outside the ref
    if (ref.current && !ref.current.contains(event.target as Node)) {
      // Do something when a click happens outside the ref
      setOpened(false);
    }
  };
  const [sigendIn, setSignedIn] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (session) {
      setSignedIn(true);
      console.log(session);
    } else {
      void router.push("/");
    }
  }, [session, router]);
  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current !== null &&
        !profileRef.current?.contains(target)
      ) {
        setOpened(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleSignOut = () => {
    void signOutAndRedirect();
  };
  console.log(session);
  return (
    <div className="absoulte fixed top-0 z-10 flex w-full justify-between  border-[#ebebeb] bg-white p-[24px] font-serif">
      <Link
        className={` ${just.className} flex items-center justify-center rounded-xl bg-red-400 px-1.5 pt-1 text-center text-[15px] leading-snug text-white`}
        href="/"
      >
        LOGOAI
      </Link>
      {!sigendIn ? (
        <button
          onClick={() => {
            void router.push("signIn");
          }}
          className="ml-auto h-[32px] rounded-md border-[1px] border-black bg-[#171717] px-[12px] font-sans text-[14px] text-white  no-underline transition hover:border-[#383838] hover:bg-[#383838] "
        >
          Sign In
        </button>
      ) : (
        <div ref={profileRef} className="h-[28px] w-[28px]  rounded ">
          <svg
            width="28px"
            height="28px"
            viewBox="0 0 80 80"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full hover:cursor-pointer"
            onClick={handleProfileClick}
          >
            <defs>
              <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="g">
                <stop stop-color="#06a0f9" offset="0%"></stop>
                <stop stop-color="#f906a0" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <rect
                id="Rectangle"
                fill="url(#g)"
                x="0"
                y="0"
                width="80"
                height="80"
              ></rect>
            </g>
          </svg>
          {opened && (
            <div className="r absolute right-[24px]  top-[64px] z-50 flex flex-col justify-center gap-2 rounded-md border-[1px] border-[#e0e0e0] bg-white p-4 font-sans text-[14px] text-[#666666] shadow-sm ">
              <div className="mb-1.5">{session?.user.email}</div>
              <Link
                href={`/history?id=${session?.user.id}`}
                onClick={() => {
                  // void router.push(`/history?id=${session?.user.id}`);
                  setOpened(false);
                }}
              >
                {" "}
                History
              </Link>
              <Link
                href={"/profile"}
                onClick={() => {
                  // void router.push(`/history?id=${session?.user.id}`);
                  setOpened(false);
                }}
              >
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className=" mt-2 h-[32px] w-full rounded-md border-[1px] border-black bg-[#171717] px-[12px] font-sans text-[14px] text-white  no-underline transition hover:border-[#383838] hover:bg-[#383838]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
