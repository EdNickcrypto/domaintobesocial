import React, { Component } from 'react';  
import { withRouter, BrowserRouter, Route } from "react-router-dom"; 
import { Link } from 'react-router-dom';
import'./App.css'; 
import Login from"./components/Login"; 
import Signup from"./components/Signup"; 
import Userdashboard from"./components/Userdashboard";
import Normalsignup from"./components/Normalsignup";
import Vipuser from"./components/Vipuser";
import Vipsignup from"./components/Vipsignup";
import Createpost from"./components/Createpost";
import Discussion from"./components/Discussion";
import Help from"./components/Help";
import Messages from"./components/Messages";
import Singlediscussion from"./components/Singlediscussion";
import Requests from"./components/Requests";
import Followers from"./components/Followers";
import Blocklist from"./components/Blocklist";
import Userprofile from"./components/Userprofile";
import Viewprofile from"./components/Viewprofile";
import Viewhelp from"./components/Viewhelp";
import firebase from './firebase.js';
import Pagesliked from './components/Pagesliked';
import Viewnotifications from './components/Viewnotifications';
import Favorites from './components/Favorites';
import Blog from './components/Blog';
import Viewblog from './components/Viewblog';
import Professions from './components/Professions';
import Forget from './components/Forget';
import Forgetpassword from './components/Forgetpassword';
import Checkout from './components/CheckoutForm';
import Notification from './components/Notification';
import EditPost from './components/EditPost';
import Footer from './components/Footer';

function App () { 
  return (
    <BrowserRouter>
      <div className="App"> 
        <Route  component = {Login} exact path="/" /> 
        <Route  component = {Signup} exact path ="/Signup" />
        <Route  component = {Userdashboard} exact path ="/userdashboard" />
        <Route  component = {Normalsignup} exact path ="/normalsignup" /> 
        <Route  component = {Vipuser} exact path ="/vipuser" />
        <Route  component = {Vipsignup} exact path ="/vipsignup" />    
        <Route  component = {Createpost} exact path ="/createpost" /> 
        <Route  component = {Discussion} exact path ="/discussion" />
        <Route  component = {Help} exact path ="/help" />
        <Route  component = {Messages} exact path ="/messages" /> 
        <Route  component = {Singlediscussion} exact path ="/singlediscussion" />
        <Route  component = {Requests} exact path ="/requests" />
        <Route  component = {Followers} exact path ="/followers" />
        <Route  component = {Checkout} exact path ="/CheckoutForm" />
        <Route  component = {Blocklist} exact path ="/blocklist" />
        <Route  component = {Notification} exact path ="/Notification" />
        <Route  component = {Userprofile} exact path ="/userprofile" />
        <Route  component = {Forget} exact path ="/Forget" />
        <Route  component = {Forgetpassword} exact path ="/Forgetpassword" />
        <Route  component = {Viewprofile} exact path ="/viewprofile/:id/:name" />
        <Route  component = {Viewprofile} exact path ="/viewprofile/:name" />
        <Route  component = {Viewhelp} exact path ="/viewhelp/:id" />
        <Route  component = {Pagesliked} exact path ="/pagesliked" />
        <Route  component = {Viewnotifications} exact path ="/viewnotifications" />
        <Route  component = {Favorites} exact path ="/favorites" />
        <Route  component = {Blog} exact path ="/blog" />
        <Route  component = {EditPost} exact path ="/editPost/:id" />
        <Route  component = {Viewblog} exact path = "/viewblog/:id" />
        <Route  component = {Professions} exact path ="/professions/:id" />
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App; 
