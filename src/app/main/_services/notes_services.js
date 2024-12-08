import {db} from "../_utils/firebase"
import { collection, getDocs, addDoc, query } from "firebase/firestore";

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