"use client";
import {useState} from "react";

export default function SignUp() {
    return(
        <div>
            <form>
                <input placeholder="UserName"></input>
                <input placeholder="Password"></input>
                <input placeholder="Confirm Password"></input>
                <button type="submit" placeholder="Create Account" />
            </form>
        </div>
    );
}