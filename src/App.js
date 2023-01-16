import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { async } from "@firebase/util";

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCXHQv3IZOCnc7panq1INu3NJLXcKgTGGw",
  authDomain: "superchat-5014a.firebaseapp.com",
  projectId: "superchat-5014a",
  storageBucket: "superchat-5014a.appspot.com",
  messagingSenderId: "742565423516",
  appId: "1:742565423516:web:a11e0b79e51f37ab3f8059",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chat App</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

//!  Sign In
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  );
}
//! Sign Out
function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

// ! ChatRoom
function ChatRoom() {
  const dummy = useRef(null);
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "uid" });

  const [formValue, setFormValuel] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValuel("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  // profile img

  //

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValuel(e.target.value)}
          required
        />
        <button type="submit">send</button>
      </form>
    </>
  );
}

// ! ChatMessage
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  console.log(photoURL);

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

export default App;
