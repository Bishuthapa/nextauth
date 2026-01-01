"use client";
import * as React from 'react';
import { Component } from 'react';
import { useEffect, useState } from 'react';
import { SingupUser as user } from "@/types"
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function Signup() {

    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [buttonDisable, setButtonDisable] = useState(true);
    const [loading, setLoading] = useState(false);


    const submitHandler = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setLoading(true);

        router.push('/login');
        
    }

    try{
        

    }catch(e){
        console.log(e);
    }

        return (
            <>
                <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black text-white" >
                    <h1>Signup</h1>
                    <form onSubmit={submitHandler} method='POST'>

                        <label>Username</label><input type='text' name='username' required={true} onChange={(e) => setUsername(e.target.value)} />
                        <label>Email</label><input type='email' name='email' required={true} onChange={(e) => setEmail(e.target.value)} />
                        <label>Password</label><input type='password' name='password' required={true} onChange={(e) => setPassword(e.target.value)} />
                        <label>Confirm Password</label><input type='password' name='confirmPassword' required={true} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type='submit' >SignUp</button>
                    </form>
                </div>
            </>
        )
    }