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

export async function deductCredits() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not found" };
  }
  const credits = user.publicMetadata?.credits;

  if (typeof credits === "number" && credits < 1) {
    return { success: false, error: "Not enough credits" };
  }

  if (typeof credits !== "number") {
    return { success: false, error: "Not enough credits" };
  }
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: credits - 1,
    },
  });
  return { success: true, error: null };
}
