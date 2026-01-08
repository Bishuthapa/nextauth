"use client";
export default function SignupPage(){
  const submitHandler = 

  return (
    <div>
      <h1 className="text-2xl font-bold">Signup Page</h1>
      <p>Signup form will go here.</p>
      <form method="POST" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Username">
        </input>
        <input
          type="email"
          placeholder="Email">
        </input>
        <input
          type="password"
          placeholder="Password">
        </input>
        <button type="submit">Sign Up</button>
      </form>

    </div>
  );
}