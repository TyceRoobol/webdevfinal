"use client";

import dynamic from "next/dynamic";
import {useEffect, useState} from 'react';
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import { useMonaco } from "@monaco-editor/react";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false, // Disable SSR for Monaco
});
import { addNote, updateNote } from '../_services/notes_services';

const defaultCss = `
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    padding: 0;
    background-color: #f9f9f9;
  }
  h1, h2, h3, h4 {
    color: #333;
  }
  p {
    line-height: 1.6;
    color: #555;
  }
  code {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
  }
  ul, ol {
    margin-left: 20px;
  }
  a {
    color: #007bff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export default function NoteEditor() {
    const router = useRouter();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useUserAuth();
    const [newNote, setNewNote] = useState(true);
    const [editorContent, setEditorContent] = useState("");

    const { noteId } = router.query || {};

    useEffect(() => {
        if (noteId) {
          const userId = user.uid; 
          setNewNote(false);
          setLoading(true);
          
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

      const handleNoteChange = () => {

      }

      const handleEditorChange = (newValue, e) => {
        setEditorContent(newValue);
      }

    return(
        <main>
          <div>
            {newNote ? 
            <div>
              <h1>Create Note</h1>
              <textarea 
                onChange={handleNoteChange} 
                placeholder="Write your note here..." 
                rows="10" 
                cols="50"
              />
              <MonacoEditor 
                height="400px"
                language="html"
                onChange={handleEditorChange}
                theme="vs-dark"
                value={editorContent}
              />
            </div>
            : 
            <div>
              <h1>Edit Note</h1>
              <textarea 
                value={note.noteText} 
                onChange={handleNoteChange()} 
                placeholder="Write your note here..." 
                rows="10" 
                cols="50"
              />
              <MonacoEditor 
                height="400px"
                language="html"
                value={note.monacoText}
                onChange={handleEditorChange()}
                theme="vs-dark"
              />
            </div>
            }
          </div>
          <div>
            <h2>Preview</h2>
            <div
              style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflow: "auto" }}
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          </div>
          <button onClick={() => handleClick()}>Save Note</button>
        </main>
    );
}