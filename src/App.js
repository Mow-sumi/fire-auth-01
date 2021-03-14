import logo from './logo.svg';
import './App.css';
import  firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);

  const [ user , setUser] = useState({
    isSignedIn : false,
   
    name: '',
    email:'',
   password:'',
   
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
    .signInWithPopup(provider)
    .then(res => {
      const {displayName,email} = res.user;
      const signedInUser ={
       isSignedIn :true,
       name :displayName,
       email : email, 

      }
  setUser(signedInUser)


      console.log(displayName,email);
    }) 
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

 const handleSignOut=()=>{
firebase.auth().signOut()
.then(res =>{

const signedOutUser = {
  isSignedIn:false,
  name:'',
  email:'',
  error:'',
  success: false
}
setUser(signedOutUser)
})
.catch( err=>{

})
  //  console.log('signOut');
 }
 const handleBlur = (e)=>{
 debugger;
let isFieldValid = true;
   if ( e.target.name === 'email'){
     isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
  
   
   }
  if(e.target.name === 'password'){
 const isPasswordValid = e.target.value.length > 6;
 const passwordHasNumber = /\d{1}/.test(e.target.value);
 isFieldValid = (isPasswordValid && passwordHasNumber);

 }
 if( isFieldValid){
   
const newUserInfo ={...user};
newUserInfo[e.target.name] = e.target.value;
setUser(newUserInfo);
 
}
}
 
const handleSubmit = (e)=>{
  // console.log(user.email,user.password)
  if( newUser && user.email && user.password){

    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
       newUserInfo.success = true;
      setUser(newUserInfo);
      updateUserName(user.name);
      // Signed in 
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {

      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo);
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });


  //  console.log('submitting')
  }
 if(!newUser  && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword( user.email, user.password)
  .then((userCredential) => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
     newUserInfo.success = true;
    setUser(newUserInfo);
    // console.log('sign in user info',serCredential.user);

    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo);
    var errorCode = error.code;
    var errorMessage = error.message;
  });


 }


  e.preventDefault();
}
 
const updateUserName = name =>{
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
 
}).then(function() {
  console.log('user name updated successfully')
  // Update successful.
}).catch(function(error) {
  console.log(error)
  // An error happened.
});
} 

  return (
    <div className = "app">
      {

        user.isSignedIn ?  <button onClick = {handleSignOut}>Sign out</button> :
 <button onClick = {handleSignIn}>Sign in</button>

      }
      <br/>
      <button>Facebook login</button>
      {
     
     user.isSignedIn && <div>
      
       <p> Welcome,{user.name}</p>
       <p>your email:{user.email}</p>
       </div>
   }
    <h1>Our own Authentication</h1>

  <input type="checkbox" onChange ={()=> setNewUser(!newUser)} name="newUser" id=""/>

   <label htmlFor="newUser">New User Sign Up</label>




    {/* <p>Name:{user.name}</p>
    <p>Email:{user.email}</p>
    <p>Password:{user.password}</p> */}
     <form onSubmit={handleSubmit}>
     {newUser &&  <input name ="name" type="text" placeholder ="Your name"/>}
   <br/>
   <input type="text" name = "email" onBlur ={handleBlur}    placeholder="Your email address" required=""/>
     <br/>
    <input type="password" name="password" onBlur ={handleBlur} placeholder="Your password" required/>
    <br/>
    <input type="submit" value="Submit"/>
     </form>
     <p style= {{color :'red'}}>{user.error}</p>
  {user.success && <p style= {{color :'green'}}>User{ newUser?'created':'logged In'}</p>}

     
    </div>
  );
}



export default App;
