import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Forgetpassword extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {password: '',vtoken:"",vemail:""};
    }

    handleEmailChange(e) {
       document.getElementById('errorlogin').style.display = 'none';
       this.setState({password: e.target.value});
    }

    componentDidMount() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        this.setState({vemail:params.email,vtoken:params.token});
    }

   
    handleSubmit(event){
        event.preventDefault();
        const formData = new FormData();
        formData.append('email', this.state.vemail);
        formData.append('token', this.state.vtoken);
        formData.append('password', this.state.password);
        axios.post('https://domaintobesocial.com/domaintobe/changepasswordforget',
        formData,
        )
        .then((res) => {
          if(res.data.status == 'success'){
            document.getElementById('successlogin').style.display = 'block';
            setTimeout(() => {
                window.location = "/";
            }, 2000);
          }else{
            document.getElementById('errorlogin').style.display = 'block';
            document.getElementById("errorlogin").innerHTML = res.data.message;
          }
        })
        .catch((error) => {
            console.log('errror',error);
        alert('Something Went Wrong');
        })

    }

  
    handleKeypress(e) {
        if (e.charCode === 13) {
            document.getElementsByName("submitform")[0].type = "submit";
        }
    }

    render() {
        return (
            <section className="loginpage">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="imglogin">
                                <img src="images/loginimg.png" alt="images"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="right_login" style={{ backgroundImage: `url(images/loginbg.jpg)`}}>
                            <div className="lgn">
                                <h3>Create your new Password</h3>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                <div className="alert alert-danger" id="errorlogin"></div>
                                <div className="alert alert-danger" id="errorlogin"></div>
                                <div className="alert alert-success" id="successlogin">Your Password Change Successfully</div>
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="text" className="form-control" value={this.state.password} onChange={this.handleEmailChange.bind(this)} onKeyPress={this.handleKeypress.bind(this) }  />
                                    </div>
                                    <button name="submitform" className="btn" type="submit">Create</button>
                                </form>
                                <h6>Don’t have an Account?  <Link to="/Signup" >Sign up</Link></h6>
                                <h6><Link to="/Login">Login</Link></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
};
    
export default Forgetpassword;