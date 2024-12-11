"use client";

import { useState } from "react";
import { useUserAuth } from "./_utils/auth-context";
import { useRouter } from "next/navigation";
import styles from "../pages/styles/landingstyles.module.css";

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
    <div className={styles.landingContainer}>
      <h1 className={styles.title}>Welcome to the App</h1>
      {!user ? (
        <button className={styles.loginButton} onClick={handleLogin}>
          Login with GitHub
        </button>
      ) : (
        <div className={styles.buttonContainer}>
          <div className={styles.homeButtonContainer}>
            <button
              className={styles.homeButton}
              onClick={() => router.push("/home")}
            >
              Go to Home Page
            </button>
          </div>
          <div className={styles.logoutButtonContainer}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


