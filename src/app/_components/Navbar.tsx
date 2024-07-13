"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Just_Another_Hand } from "next/font/google";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { RedirectToUserProfile } from "@clerk/nextjs";

const just = Just_Another_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-just_another_hand",
});

export default function Navbar() {
  const [gradientColors, setGradientColors] = useState(getRandomColors());
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();
  const { user } = useUser();

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
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="absoulte fixed top-0 z-10 flex w-full justify-between  border-[#ebebeb] bg-white p-[24px] font-serif">
      <Link
        className={` ${just.className} z-10 flex items-center justify-center rounded-xl bg-red-400 px-2 pt-1 text-center text-[20px] leading-snug text-white`}
        href="/"
      >
        LOGOAI
      </Link>

      <SignedIn>
        <div
          ref={ref}
          className=" h-[40px] w-[40px] cursor-pointer overflow-clip rounded"
        >
          {user && (
            <Image
              onClick={handleProfileClick}
              src={user?.imageUrl ?? ""}
              alt="Profile Image"
              width={40}
              height={40}
            ></Image>
          )}
        </div>
        {opened && (
          <div className="r absolute right-[24px]  top-[80px] z-50 flex flex-col justify-center gap-2 rounded-md border-[1px] border-[#e0e0e0] bg-white p-4 font-sans text-[14px] text-[#666666] shadow-sm ">
            <div className="mb-1.5">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
            {/* <Link
              href={`/history?id=${session?.user.id}`}
              onClick={() => {
                // void router.push(`/history?id=${session?.user.id}`);
                setOpened(false);
              }}
            >
              {" "}
              History
            </Link> */}
            <Link
              href={"/profile"}
              onClick={() => {
                // void router.push(`/history?id=${session?.user.id}`);
                setOpened(false);
              }}
            >
              Account Settings
            </Link>
            <SignOutButton>
              <button className=" mt-2 h-[32px] w-full rounded-md border-[1px] border-black bg-[#171717] px-[12px] font-sans text-[14px] text-white  no-underline transition hover:border-[#383838] hover:bg-[#383838]">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="ml-auto h-[32px] rounded-md border-[1px] border-black bg-[#171717] px-[12px] font-sans text-[14px] text-white  no-underline transition hover:border-[#383838] hover:bg-[#383838] ">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}

export function Logo() {
  return (
    <Link
      className={` ${just.className} z-10 flex h-full items-center justify-center rounded-xl bg-red-400 px-2 pt-1 text-center text-[20px] leading-snug text-white`}
      href="/"
    >
      LOGOAI
    </Link>
  );
}
