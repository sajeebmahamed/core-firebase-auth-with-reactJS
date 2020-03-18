import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();


function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);

      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn : false,
        name : '',
        email : '',
        photo : '',
        error : '',
        password : '',
        isValid : false
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }  
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);
        const createdUser = { ...user };
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    else{
      console.log("is not valid", user);
    }
    event.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p> Welcome {user.name} </p>
          <p>Your email is {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }

      <h1>Simple Authentication</h1>
      <form onSubmit={createAccount}>
        <input type="text" name="name" onBlur={handleChange} placeholder="Enter name" required />
        <input type="text" name="email" onBlur = {handleChange} placeholder="Enter Mail" required/>
        <input type="password" name="password" onBlur = {handleChange} placeholder="Enter Password" required></input>
        <input type = "submit" value = "Create Account"></input>
      </form>
      {
        user.error && <h2>{ user.error }</h2>
      }
    </div>
  );
}

export default App;
