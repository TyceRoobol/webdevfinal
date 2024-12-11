"use client";

import { useRouter } from "next/navigation";
import { useUserAuth } from "./_utils/auth-context";
import { getNotes, deleteNote } from "./_services/notes_services";
import { useState, useEffect } from "react";
import styles from "../pages/styles/homestyles.module.css";

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
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting...</div>;
  }

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(user.uid, noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      alert("Note successfully deleted!");
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome {user.email}</h1>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
      <div className={styles.notesSection}>
        <h2 className={styles.subHeader}>My Notes</h2>
        <ul className={styles.notesList}>
          {notes.map((note) => (
            <li key={note.id} className={styles.noteItem}>
              <button
                className={styles.noteButton}
                onClick={() =>
                  router.push(`/main/notes/page?noteId=${note.id}`)
                }
              >
                {note.title}
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(note.id)}
              >
                Delete Note
              </button>
            </li>
          ))}
        </ul>
        <button
          className={styles.newNoteButton}
          onClick={() => router.push("/main/notes/page")}
        >
          New Note
        </button>
      </div>
    </div>
  );
}
