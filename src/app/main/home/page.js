"use client";

import {useEffect, useState} from 'react';
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import { getNotes } from '../_services/notes_services';
import Link from 'next/link';

export default function HomePage() {
    const { user } = useUserAuth();
    const router = useRouter();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const loadNotes = async () => {
            if (user.uid && user) {
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
                <ul>
                    {notes.map((note) => (
                        <li key={note.id}>
                            <Link href={{ pathname: '/notes', query: { noteId: note.id }}}>
                                {note.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button onClick={() => router.push("/main/notes")}>New Note</button>
            </div>
        </div>
    );
}