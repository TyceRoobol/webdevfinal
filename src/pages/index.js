"use client";

import { useState } from "react";
import { useUserAuth } from "./main/_utils/auth-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  const handleLogin = async (e) => {
    try {
      await gitHubSignIn();
      if (user) {
        router.push("/home");
      }
    } catch (error) {
      console.error("Failed to sign in with GitHub", error);
    }
  };

  const handleLogout = async (e) => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      {!user ? (
        <button onClick={handleLogin}>Login with GitHub</button>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => router.push("/home")}>Go to home page</button>
        </div>
      )}
    </div>
  );
}
