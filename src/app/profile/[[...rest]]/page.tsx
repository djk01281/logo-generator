// export default function Profile() {
//   return (
//     <>
//       <main className="flex min-h-[80vh] flex-col justify-center font-sans font-bold">
//         <div>
//           <h1 className="mb-20 mt-36 text-center font-serif text-5xl font-extrabold tracking-tight text-black ">
//             Account Settings
//           </h1>
//           <div className="p-8 sm:flex sm:flex-col sm:items-center">
//             <div className="mb-10 flex flex-col gap-4 rounded border-[1px] border-[#ebebeb] p-4 font-sans font-normal sm:w-2/3">
//               <div className="flex flex-col gap-2 text-[#171717] ">
//                 <div className="text-[20px] font-semibold">Password</div>
//                 <div className="text-[14px]">Change your account password.</div>
//                 <input
//                   placeholder="********"
//                   className="w-full resize-none rounded-[6px] border-[1px] border-[#eaeaea] p-[12px] text-[14px] font-normal outline-none ring-black focus:border-black focus:ring-0 focus:ring-offset-0"
//                 ></input>
//                 <div className="flex items-center justify-center">
//                   <button className=" mt-2 h-[32px] rounded-md border-[1px] border-black bg-[#171717] px-[12px] font-sans text-[14px] text-white  no-underline transition hover:border-[#383838] hover:bg-[#383838]">
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-10 flex flex-col gap-4 rounded border-[1px] border-[#fdd9d8] p-4 font-sans font-normal sm:w-2/3">
//               <div className="flex flex-col gap-2 text-[#171717]">
//                 <div className="text-[20px] font-semibold">Delete Account</div>
//                 <div className="text-[14px]">
//                   Permanently remove your Personal Account and all of its
//                   contents. This action is not reversible, so please continue
//                   with caution.
//                 </div>

//                 <div className="flex items-center justify-center">
//                   <button className=" mt-2 h-[32px] rounded-md border-[1px] border-[#fdd9d8] bg-[#DA2F35] px-[12px] font-sans text-[14px] text-white  no-underline transition hover:border-[#fdd9d8] hover:bg-[#ae292f]">
//                     Delete Account
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  return <UserProfile path="/profile" />;
}
