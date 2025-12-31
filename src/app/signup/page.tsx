"use client";
import * as React from 'react';
import { Component } from 'react';
import { useEffect, useState } from 'react';
import { SingupUser as user } from "@/types"
export default function Signup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const submitHandler = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
    }

        return (
            <>
                <div>
                    <h1>Signup</h1>
                    <form onSubmit={submitHandler} method='POST'>

                        <label>Username</label><input type='text' name='username' required={true} onChange={(e) => setUsername(e.target.value)} />
                        <label>Email</label><input type='email' name='email' required={true} onChange={(e) => setEmail(e.target.value)} />
                        <label>Password</label><input type='password' name='password' required={true} onChange={(e) => setPassword(e.target.value)} />
                        <label>Confirm Password</label><input type='password' name='confirmPassword' required={true} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type='submit'>SignUp</button>
                    </form>
                </div>
            </>
        )
    }