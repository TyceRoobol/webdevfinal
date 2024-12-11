/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../../_utils/auth-context";
import { useRouter } from "next/router";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false, // Disable SSR for Monaco
});
import styles from "../../styles/NoteEditor.module.css";
import { fetchNote, addNote, updateNote } from "../../_services/notes_services";

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
  const { user } = useUserAuth();
  const iframeRef = useRef(null);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState(true);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [cssEditorContent, setCssEditorContent] = useState("");
  const [activeTab, setActiveTab] = useState("html");

  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const { noteId } = router.query;
      setNoteId(noteId);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (noteId) {
      console.log("Router query:", router.query);
      console.log("Note ID:", noteId);

      const userId = user.uid;
      setNewNote(false);
      setLoading(true);

      const loadNote = async () => {
        try {
          const noteData = await fetchNote(userId, noteId);
          setNote(noteData);
          setNoteTitle(noteData.title || "");
          setNoteContent(noteData.text || "");
          setEditorContent(noteData.monacoText || "");
          setCssEditorContent(noteData.cssText || "");
        } catch (error) {
          setError("Failed to fetch note");
        } finally {
          setLoading(false);
        }
      };

      loadNote();
    }
  }, [noteId]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      iframeDocument.open();
      iframeDocument.write(`
        <style>${cssEditorContent}</style>
        ${editorContent}
      `);
      iframeDocument.close();
    }
  }, [editorContent, cssEditorContent]);

  const handleNoteChange = (e) => {
    setNoteContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setNoteTitle(e.target.value);
  };

  const handleEditorChange = (newValue, e) => {
    setEditorContent(newValue);
  };

  const handleCssChange = (newValue, e) => {
    setCssEditorContent(newValue);
  };

  const handleClick = () => {
    if (newNote) {
      const noteToAdd = {
        text: noteContent,
        title: noteTitle,
        monacoText: editorContent,
        cssText: cssEditorContent,
      };
      addNote(user.uid, noteToAdd);
      router.push("/home");
    } else {
      updateNote(
        user.uid,
        noteId,
        noteContent,
        editorContent,
        cssEditorContent,
        noteTitle
      );
      router.push("/home");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.leftPane}>
        <h1 className={styles.title}>
          {newNote ? "Create Note" : "Edit Note"}
        </h1>
        <input
          type="text"
          value={noteTitle}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className={styles.input}
        />
        <textarea
          value={noteContent}
          onChange={handleNoteChange}
          placeholder="Write your note here..."
          rows="10"
          cols="50"
          className={styles.textarea}
        />
      </div>
      <div className={styles.rightPane}>
        <h2 className={styles.title}>Preview</h2>
        <iframe ref={iframeRef} className={styles.iframe}></iframe>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "html" ? styles.tabButtonActive : ""
            }`}
            onClick={() => setActiveTab("html")}
          >
            HTML
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "css" ? styles.tabButtonActive : ""
            }`}
            onClick={() => setActiveTab("css")}
          >
            CSS
          </button>
        </div>
        {activeTab === "html" && (
          <MonacoEditor
            height="400px"
            language="html"
            value={editorContent}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        )}
        {activeTab === "css" && (
          <MonacoEditor
            height="400px"
            language="css"
            value={cssEditorContent}
            onChange={handleCssChange}
            theme="vs-dark"
          />
        )}
        <button onClick={handleClick} className={styles.button}>
          Save Note
        </button>
      </div>
    </main>
  );
}
