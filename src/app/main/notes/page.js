"use client";

import {useEffect, useState} from 'react';
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";

export default function NoteEditor() {
    const router = useRouter();
    const { noteId } = router.query;
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useUserAuth();
    const [newNote, setNewNote] = useState(true);

    useEffect(() => {
        if (noteId) {
          const userId = user.uid; 
          setNewNote(false);
          
          // Fetch the note by ID
          const loadNote = async () => {
            try {
              const noteData = await fetchNote(userId, noteId);
              setNote(noteData);
            } catch (error) {
              setError("Failed to fetch note");
            } finally {
              setLoading(false);
            }
          };
    
          loadNote();
        }
      }, [noteId]);
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }

    return(
        <main>
          <h1>{isNewNote ? "Create New Note" : "Edit Note"}</h1>
        </main>
    );
}