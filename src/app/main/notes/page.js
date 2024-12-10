"use client";

import {useEffect, useState} from 'react';
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import MonacoEditor from 'react-monaco-editor';
import { addNote, updateNote } from '../_services/notes_services';

export default function NoteEditor() {
    const router = useRouter();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useUserAuth();
    const [newNote, setNewNote] = useState(true);

    const { noteId } = router.query;

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

      const handleClick = () => {
        if (newNote) {
          addNote();
        } else {
          updateNote();
        }
      }

    return(
        <main>
          <h1>{NewNote ? "Create New Note" : "Edit Note"}</h1>
          <div>
            <textarea 
              value={noteText} 
              onChange={handleNoteChange} 
              placeholder="Write your note here..." 
              rows="10" 
              cols="50"
            />
            <button onClick={() => handleClick()}>Save Note</button>
          </div>
        </main>
    );
}