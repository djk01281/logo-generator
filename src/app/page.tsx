import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import Navbar from "./_components/Navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import BackgroundVideo from "next-video/background-video";
import sample from "../../videos/LandingPage-zoomed.mp4";

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <main className=" relative flex   w-full flex-col items-center justify-center bg-white font-sans ">
        <div className="absolute h-full  w-5/6 sm:w-[36rem]">
          <div className="relative h-full w-full">
            <div className="absolute left-4 top-36 h-[37.5%] w-[75%] rounded-full bg-purple-300 opacity-50 mix-blend-multiply blur-[30px] filter sm:h-[24rem] sm:w-[24rem] sm:blur-[40px]"></div>
            <div className="absolute right-4 top-36 h-[37.5%] w-[75%] rounded-full bg-yellow-300 opacity-50 mix-blend-multiply blur-[30px] filter sm:h-[24rem] sm:w-[24rem] sm:blur-[40px]"></div>
            <div className="absolute left-1/2 top-60 h-[37.5%] w-[75%] -translate-x-1/2 transform rounded-full bg-pink-300 opacity-50 mix-blend-multiply blur-[30px] filter sm:h-[24rem] sm:w-[24rem] sm:blur-[40px]"></div>
          </div>
        </div>
        <div className="mt-32 flex w-full items-center justify-center ">
          <div className="container  flex w-2/3 flex-col items-center justify-center gap-12 px-4 py-16 ">
            <div
              className={`font-bricolage mt-12 flex flex-col  items-center justify-center font-serif text-[60px] font-extrabold text-black  sm:flex-row sm:text-[60px]`}
            >
              <div className="font-bricolage relative flex flex-col leading-none">
                <svg
                  className="absolute left-0 top-0 -translate-x-12 -translate-y-3/4 -rotate-12"
                  width="120"
                  height="120"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M122 256.491C128.401 255.021 135.689 155.505 137.425 155.505C139.513 155.505 140.235 168.803 140.51 169.935C143.226 181.226 149.779 194.176 159.019 198.786C170.207 204.365 189.929 164.92 192.955 154.546C193.035 154.272 195.726 141.143 196.812 142.044C207.535 150.959 203.525 211.324 240.773 205.519C263.127 202.036 272.621 146.033 277.023 148.777C278.608 149.763 275.536 174.171 275.481 175.704C274.467 203.538 277.792 230.818 277.792 258.414C233.368 252.531 187.86 249.709 144.104 258.414"
                    stroke="#ffd400"
                    stroke-opacity="0.9"
                    stroke-width="16"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className=" text-[#2f303c]">All-in-one solution</span>
                <span className="text-[#2f303c]">
                  for your <span className="text-slate-400"> next logo</span>
                </span>
              </div>
            </div>
            <div
              className={`sans text-l mb-8  flex w-2/3 flex-col  items-center justify-center gap-6 font-[geist] font-medium text-[#5c5b61]`}
            >
              <div className="w-2/3 font-[just]">
                Elevate your brand with effortless logo design using our
                AI-powered, in-browser logo generator.
              </div>
              <AuthShowcase />
            </div>
          </div>
        </div>
        <div>
          <BackgroundVideo src={sample}></BackgroundVideo>
        </div>
      </main>
    </>
  );
}

async function AuthShowcase() {
  const session = await getServerAuthSession();

  // TODO : Only allow signed in users to access the editor

  return (
    <div className="flex h-[128px] w-2/3  flex-col items-center justify-start  gap-4">
      <SignedIn>
        <div className="relative flex flex-row items-center gap-4">
          <Link
            href="/editorNew"
            className={` mt-6 transform rounded-md bg-[#f87171] px-10 py-3 text-center text-sm font-semibold text-white  no-underline transition hover:bg-red-300`}
          >
            Try For Free
          </Link>
          {/* <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 1400.000000 1400.000000"
            preserveAspectRatio="xMidYMid meet"
            className="rotate-180"
          >
            <g
              transform="translate(0.000000,1400.000000) scale(0.100000,-0.100000)"
              fill="#94a3b8"
              stroke="none"
            >
              <path
                d="M9802 13730 c-96 -13 -168 -37 -267 -88 -72 -37 -108 -64 -180 -137
-50 -49 -105 -116 -124 -148 -64 -109 -110 -272 -111 -393 0 -77 27 -216 56
-290 99 -245 347 -446 579 -469 511 -49 826 -116 1525 -321 228 -67 518 -168
639 -222 51 -23 54 -22 -109 -52 -245 -45 -638 -139 -995 -236 -1086 -298
-2076 -682 -2880 -1117 -652 -352 -1167 -691 -1602 -1053 -564 -469 -1069
-1113 -1352 -1726 l-52 -114 -87 -28 c-124 -40 -345 -128 -496 -198 -1037
-480 -2050 -1384 -2828 -2523 -435 -638 -813 -1402 -1038 -2100 -181 -561
-280 -1032 -325 -1558 -12 -132 -13 -200 -6 -242 47 -290 314 -489 596 -445
197 30 373 182 430 370 10 36 19 123 25 250 25 517 95 939 240 1440 458 1581
1550 3118 2820 3970 177 119 394 242 398 226 2 -7 -8 -80 -22 -162 -14 -82
-30 -203 -37 -269 -17 -177 -14 -552 6 -720 57 -481 299 -979 657 -1350 188
-195 378 -335 617 -454 312 -154 645 -221 958 -193 76 7 177 21 226 32 202 44
451 147 614 253 384 249 681 684 812 1191 165 634 33 1305 -356 1804 -220 282
-504 486 -919 661 -265 111 -556 182 -869 211 -60 6 -110 12 -112 14 -5 4 148
219 247 346 265 340 749 835 1130 1154 829 696 2119 1258 3290 1436 305 46
796 85 991 78 l96 -3 -75 -130 c-124 -215 -271 -502 -504 -983 -121 -252 -288
-592 -371 -757 -82 -165 -172 -352 -200 -415 -45 -101 -51 -123 -51 -186 -1
-62 3 -77 29 -120 75 -120 242 -150 348 -63 19 16 68 75 108 131 189 267 461
581 720 833 85 83 303 280 484 440 589 517 804 725 928 897 73 103 164 266
235 425 33 72 75 151 94 175 86 106 121 206 121 343 0 122 -38 238 -110 332
-42 55 -187 133 -603 323 -268 122 -411 195 -522 267 -88 57 -424 291 -600
419 -809 590 -1734 1175 -1940 1230 -70 18 -199 25 -276 14z m-3356 -6781
c215 -20 438 -68 584 -126 181 -72 360 -217 482 -392 82 -117 162 -318 198
-494 116 -574 -86 -1148 -488 -1387 -318 -189 -660 -149 -1013 117 -273 205
-478 515 -536 807 -24 119 -23 489 1 656 36 249 95 475 179 685 l52 130 70 6
c124 10 359 9 471 -2z"
              />
            </g>
          </svg> */}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="relative flex">
          <SignInButton mode="modal">
            <button
              className={` mt-6 transform rounded-md bg-[#f87171] px-10 py-3 text-center text-sm font-semibold text-white  no-underline transition hover:bg-red-300`}
            >
              Try For Free
            </button>
          </SignInButton>
          {/* <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 1400.000000 1400.000000"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-x-full top-0 -translate-y-1/3 translate-x-1 rotate-180"
          >
            <g
              transform="translate(0.000000,1400.000000) scale(0.100000,-0.100000)"
              fill="#94a3b8"
              stroke="none"
            >
              <path
                d="M9802 13730 c-96 -13 -168 -37 -267 -88 -72 -37 -108 -64 -180 -137
-50 -49 -105 -116 -124 -148 -64 -109 -110 -272 -111 -393 0 -77 27 -216 56
-290 99 -245 347 -446 579 -469 511 -49 826 -116 1525 -321 228 -67 518 -168
639 -222 51 -23 54 -22 -109 -52 -245 -45 -638 -139 -995 -236 -1086 -298
-2076 -682 -2880 -1117 -652 -352 -1167 -691 -1602 -1053 -564 -469 -1069
-1113 -1352 -1726 l-52 -114 -87 -28 c-124 -40 -345 -128 -496 -198 -1037
-480 -2050 -1384 -2828 -2523 -435 -638 -813 -1402 -1038 -2100 -181 -561
-280 -1032 -325 -1558 -12 -132 -13 -200 -6 -242 47 -290 314 -489 596 -445
197 30 373 182 430 370 10 36 19 123 25 250 25 517 95 939 240 1440 458 1581
1550 3118 2820 3970 177 119 394 242 398 226 2 -7 -8 -80 -22 -162 -14 -82
-30 -203 -37 -269 -17 -177 -14 -552 6 -720 57 -481 299 -979 657 -1350 188
-195 378 -335 617 -454 312 -154 645 -221 958 -193 76 7 177 21 226 32 202 44
451 147 614 253 384 249 681 684 812 1191 165 634 33 1305 -356 1804 -220 282
-504 486 -919 661 -265 111 -556 182 -869 211 -60 6 -110 12 -112 14 -5 4 148
219 247 346 265 340 749 835 1130 1154 829 696 2119 1258 3290 1436 305 46
796 85 991 78 l96 -3 -75 -130 c-124 -215 -271 -502 -504 -983 -121 -252 -288
-592 -371 -757 -82 -165 -172 -352 -200 -415 -45 -101 -51 -123 -51 -186 -1
-62 3 -77 29 -120 75 -120 242 -150 348 -63 19 16 68 75 108 131 189 267 461
581 720 833 85 83 303 280 484 440 589 517 804 725 928 897 73 103 164 266
235 425 33 72 75 151 94 175 86 106 121 206 121 343 0 122 -38 238 -110 332
-42 55 -187 133 -603 323 -268 122 -411 195 -522 267 -88 57 -424 291 -600
419 -809 590 -1734 1175 -1940 1230 -70 18 -199 25 -276 14z m-3356 -6781
c215 -20 438 -68 584 -126 181 -72 360 -217 482 -392 82 -117 162 -318 198
-494 116 -574 -86 -1148 -488 -1387 -318 -189 -660 -149 -1013 117 -273 205
-478 515 -536 807 -24 119 -23 489 1 656 36 249 95 475 179 685 l52 130 70 6
c124 10 359 9 471 -2z"
              />
            </g>
          </svg> */}
        </div>
      </SignedOut>
    </div>
  );
}
