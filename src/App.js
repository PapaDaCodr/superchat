import react, { useRef } from 'react';
import './App.css';

import firebase, { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useSignInWithGoogle, useState } from 'react-firebase-hooks/auth';
import {useCollectionData}from 'react-firebase-hooks/firestore';
import {useAuthState}from 'react-firebase-hooks/auth';

firebase.initializeApp({
  apiKey: "AIzaSyDRp-TTY5AV4dTGMilnf8Ta3IIVQjwPsmA",
  authDomain: "fir-uper-chat.firebaseapp.com",
  projectId: "fir-uper-chat",
  storageBucket: "fir-uper-chat.appspot.com",
  messagingSenderId: "210372727491",
  appId: "1:210372727491:web:d419d87efa2b0875218876",
  measurementId: "G-J4XP7KJ90G"
})
const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {
  const[user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
     
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.SignInWithPopup(provider); 
  }
  
  return(
     <button onClick={useSignInWithGoogle}>Sign In With Google</button>
     )
}

function SignOut() {
  return auth.currentUser &&(
  <button onClick= {() => auth.SignOut()}> Sign Out </button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const[messages] = useCollectionData(query, {idField: 'id'});
  const[formValue, setFormValue] = useState('');

  const dummy = useRef;

  const sendMessage = async(e) => {
      
    e.preventDefault();
    const{uid} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.serverTimestamp,
      uid,
    })

    setFormValue('');
  }


  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>) }
      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit">Submit &copy</button>

      </form>

    </>
  )
}

function ChatMessage(props){
  const {text, uid} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
    <div className= { 'message ${messageClass}'}>
      <p>{text}</p>
      </div>
    </>
    )
}

export default App;
