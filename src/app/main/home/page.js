"use client";

import {useEffect, useState} from 'react';
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { user } = useUserAuth();
    const router = useRouter();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const loadNotes = async () => {
            if (user.id && user) {
                try {
                    const fetchedNotes = await getNotes(user.uid);
                    setNotes(fetchedNotes);
                } catch (error) {
                    console.error("failed to get notes:", error)
                }
            }
        };

        if (!user) {
            router.push("../");
        } else {
            loadNotes();
        }
    }, [user, router]);

    return(
        <div>
            <h1>Welcome {user.email}</h1>
            <div>
                <h2>My Notes</h2>
                <button onClick={() => router.push("../notes")}>New Note</button>
                <ul>
                    {notes.map((note) => (
                        <li key={note.id}>
                            <Link href={{ pathname: '/notes', query: { noteId: note.id }}}>
                                <a>{note.title}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}