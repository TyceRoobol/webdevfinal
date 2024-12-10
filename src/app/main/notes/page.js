"use client";

import dynamic from "next/dynamic";
import React, {useEffect, useState} from 'react';
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
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [editorContent, setEditorContent] = useState("");
    const [cssEditorContent, setCssEditorContent] = useState("");

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
              setNoteTitle(noteData.title || "");
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

      const handleNoteChange = (e) => {
        setNoteContent(e.target.value);
      }

      const handleTitleChange = (e) => {
        setNoteTitle(e.target.value);
      };

      const handleEditorChange = (newValue, e) => {
        setEditorContent(newValue);
      }

      const handleCssChange = (newValue, e) => {
        setCssEditorContent(newValue);
      }

      const generatePreviewCss = () => {
        const userCss = cssEditorContent || "";
        return `
          <style>
            ${defaultCss}  /* Default styles */
          </style>
          <style>
            ${userCss}     /* User-defined styles */
          </style>
        `;
      };

      const generatePreview = () => {
        return `
          ${generatePreviewCss()}
          ${editorContent}
        `;
      };
      
      const iframeRef = React.createRef();

  const updateIframe = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(generatePreview());
      doc.close();
    }
  };

  useEffect(() => {
    updateIframe();
  }, [editorContent, cssEditorContent]);

  const handleClick = () => {
    if (newNote) {
      addNote({
        title: noteTitle,
        content: noteContent,
        html: editorContent,
        css: cssEditorContent,
      });
    } else {
      updateNote({
        noteId: noteId,
        title: noteTitle,
        content: noteContent,
        html: editorContent,
        css: cssEditorContent,
      });
    }
  };

    return(
        <main>
          <button onClick={() => router.push("/main/home")}>Exit without saving</button>
          <div>
            {newNote ? 
            <div>
              <h1>Create Note</h1>
              <label htmlFor="note-title">Note Title:</label>
              <input
                id="note-title"
                type="text"
                placeholder="Enter note title"
                value={noteTitle}
                onChange={handleTitleChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <textarea 
                onChange={handleNoteChange} 
                placeholder="Write your note here..." 
                value={noteContent}
                rows="10" 
                cols="50"
              />
              <h2>html</h2>
              <MonacoEditor 
                height="400px"
                language="html"
                onChange={handleEditorChange}
                theme="vs-dark"
                value={editorContent}
              />
              <h2>Css</h2>
              <MonacoEditor
                height="400px"
                language="css"
                onChange={handleCssChange}
                theme="vs-dark"
                value={cssEditorContent}
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
              <h2>html</h2>
              <MonacoEditor 
                height="400px"
                language="html"
                value={note.monacoText}
                onChange={handleEditorChange()}
                theme="vs-dark"
              />
              <h2>Css</h2>
              <MonacoEditor
                height="400px"
                language="css"
                onChange={handleCssChange}
                theme="vs-dark"
                value={cssEditorContent}
              />
            </div>
            }
          </div>
          <div>
            <h2>Preview</h2>
            <iframe
              ref={iframeRef}
              style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "300px",
              width: "100%",
            }}
          ></iframe>
          </div>
          <button onClick={() => handleClick()}>Save Note</button>
        </main>
    );
}