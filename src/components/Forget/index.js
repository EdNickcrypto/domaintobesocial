import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Forget extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {email: ''};
    }

    handleEmailChange(e) {
       document.getElementById('errorlogin').style.display = 'none';
       this.setState({email: e.target.value});
    }

    // handlePasswordChange(e) {
    //     document.getElementById('errorlogin').style.display = 'none';
    //     this.setState({password: e.target.value});
    // }

  
    componentDidMount() {
          
        // if(this.props.location.search.substring(1) != ''){
        //     const formData = new FormData();
        //     formData.append('id', this.props.location.search.substring(1))
        //     axios.post('https://domaintobesocial.com/domaintobe/verifyemail',formData,
        //     )
        //     .then((res) => {
        //         if(res.data.message == 'success')
        //         {   
        //             document.getElementById('successlogin').style.display = 'block';
        //             setTimeout(function(){  document.getElementById('successlogin').style.display = 'none'; }, 3000);

        //         }else{
                    
        //             document.getElementById('errorlogin').style.display = 'block'; 
        //             document.getElementById("errorlogin").innerHTML = res.data.message;
        //             setTimeout(function(){ document.getElementById('errorlogin').style.display = 'none'; }, 2000);

        //         }
            
        //     })
        //     .catch((error) => {
        //         alert('Error in request')
        //     })
        // }
    }

   
    handleSubmit(event){
        event.preventDefault();
        const formData = new FormData();
        formData.append('email', this.state.email);
        axios.post('https://domaintobesocial.com/domaintobe/sendemailforget',
        formData,
        )
        .then((res) => {
          if(res.data.status == 'success'){
            document.getElementById('successlogin').style.display = 'block';
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
                                <h3>Forgot Password</h3>
                                <p>Please enter your email address.</p>
                                <div className="alert alert-danger" id="errorlogin"></div>
                                <div className="alert alert-danger" id="errorlogin"></div>
                                <div className="alert alert-success" id="successlogin">Forget Password Email Send Successfully</div>
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" value={this.state.email} onChange={this.handleEmailChange.bind(this)} onKeyPress={this.handleKeypress.bind(this) }  />
                                    </div>
                                    <button name="submitform" className="btn" type="submit">Send</button>
                                </form>
                                <h6>Don’t have an Account?  <Link to="/Signup" >Sign up</Link></h6>
                                <h6><Link to="/">Login</Link></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
};
    
export default Forget;