import { db } from "../_utils/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

export const getNotes = async (userId) => {
  const notes = [];
  const q = query(collection(db, `users/${userId}/notes`));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() });
  });
  return notes;
};

export const addNote = async (userId, note) => {
  const docRef = await addDoc(collection(db, `users/${userId}/notes`), note);
  return docRef.id;
};

export const fetchNote = async (userId, noteId) => {
  try {
    const noteRef = doc(db, `users/${userId}/notes`, noteId); // Create a reference to the specific note document
    console.log("Note Reference Path:", noteRef.path); // Log the document path
    const noteSnapshot = await getDoc(noteRef); // Fetch the document snapshot
    console.log(noteSnapshot);
    if (noteSnapshot.exists()) {
      return { id: noteSnapshot.id, ...noteSnapshot.data() };
    } else {
      throw new Error("Note not found");
    }
  } catch (error) {
    console.error("Failed to fetch note:", error);
    throw error;
  }
};

export const updateNote = async (
  userId,
  noteId,
  noteText,
  monacoText,
  cssText,
  noteTitle
) => {
  try {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(noteRef, {
      text: noteText,
      monacoText: monacoText,
      cssText: cssText,
      title: noteTitle,
    });
    console.log("Note successfully updated!");
  } catch (error) {
    console.error("Error updating note: ", error);
    throw new Error("Failed to update note");
  }
};
