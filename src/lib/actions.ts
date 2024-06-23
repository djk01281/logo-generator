"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { error } from "console";

export async function AddFreeCredits() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not found" };
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 1,
    },
  });
  return { success: true, error: null };
}
