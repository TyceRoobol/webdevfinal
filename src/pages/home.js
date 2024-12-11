"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "./main/_utils/auth-context";
import { getNotes } from "./main/_services/notes_services";
export default function HomePage() {
  const router = useRouter();
  const { user, firebaseSignOut } = useUserAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      if (user && user.uid) {
        try {
          const fetchedNotes = await getNotes(user.uid);
          setNotes(fetchedNotes);
        } catch (error) {
          console.error("failed to get notes:", error);
        }
      }
      setLoading(false);
    };

    if (user) {
      loadNotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading && user !== undefined) {
      setAuthLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h2>My Notes</h2>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={{ pathname: "/notes", query: { noteId: note.id } }}>
                {note.title}
              </Link>
            </li>
          ))}
          <button onClick={() => router.push("/main/notes")}>New Note</button>
        </ul>
      </div>
    </div>
  );
}
