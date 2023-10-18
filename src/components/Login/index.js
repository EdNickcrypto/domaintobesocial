import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {email: '',password:"",page:undefined,inputPassword:"password",icon:"fa fa-eye"};
      this.handleSubmit = this.handleSubmit.bind(this);
      
    }

    handleEmailChange(e) {
       document.getElementById('errorlogin').style.display = 'none';
       this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        document.getElementById('errorlogin').style.display = 'none';
        this.setState({password: e.target.value});
    }

  
    componentDidMount() {
        document.getElementById('loadingicon').style.display = 'block';
        axios.get('https://domaintobesocial.com/domaintobe/getmode',
        )
        .then((res) => {
            console.log('res',res);
            if(res.data.message && res.data.message.mode=='false')
            {   
                document.getElementById('loadingicon').style.display = 'none';
                this.setState({page:false});
            }
            else {
                this.setState({page:true})
            }
        })
          
        if(this.props.location.search.substring(1) != ''){
            const formData = new FormData();
            formData.append('id', this.props.location.search.substring(1))
            axios.post('https://domaintobesocial.com/domaintobe/verifyemail',formData,
            )
            .then((res) => {
                if(res.data.message == 'success')
                {   
                    document.getElementById('successlogin').style.display = 'block';
                    setTimeout(function(){  document.getElementById('successlogin').style.display = 'none'; }, 3000);

                }else{
                    document.getElementById('errorlogin').style.display = 'block'; 
                    document.getElementById("errorlogin").innerHTML = res.data.message;
                    setTimeout(function(){ document.getElementById('errorlogin').style.display = 'none'; }, 2000);
                }
            })
            .catch((error) => {
                alert('Error in request')
            })
        }
    }

   
    handleSubmit(event){
        event.preventDefault();
        const body={
            email:this.state.email,
            password:this.state.password,
        };
       
        axios.post('https://domaintobesocial.com/domaintobe/loginapi',
            body
        )
        .then((res) => {
          if(res.data.status == 'login'){

            let expirationDate = new Date(new Date().getTime() + (60000 * 50))
            let newValue = {
                value: res.data.message,
                role:  res.data.role,
                expirationDate: expirationDate.toISOString()
            }

            window.localStorage.setItem('user', JSON.stringify(newValue));

            window.location = "/userdashboard";


          }else{
            document.getElementById('errorlogin').style.display = 'block';
            document.getElementById("errorlogin").innerHTML = res.data.message;
          }
        })
        .catch((error) => {
            console.log('errror',error);
        console.log(error.message);
        })

    }

  
    handleKeypress(e) {
        if (e.charCode === 13) {
            document.getElementsByName("submitform")[0].type = "submit";
        }
    }

    changeText(){
        if(this.state.inputPassword=='password'){
            this.setState({inputPassword:'text',icon:'fa fa-eye-slash'});
        }else{
            this.setState({inputPassword:'password',icon:'fa fa-eye'});
        }
    }

    render() {
        return (
            <>
<div className="loadingicon" id="loadingicon" style={{display: "none"}}><img src="/images/loading.gif" /></div>
{this.state.page==true ? <div class="commingsoon text-center">
<div class="commingin">
                                <img src="images/loginimg.png" alt="images"/>
                                <h3 class="mt-3">Coming Soon</h3>
                            </div></div>:
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
                                <h3>Login</h3>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                <div className="alert alert-danger" id="errorlogin"></div>
                                <div className="alert alert-danger" id="errorlogin"></div>
                                <div className="alert alert-success" id="successlogin">Successfully verified</div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" value={this.state.email} onChange={this.handleEmailChange.bind(this)} onKeyPress={this.handleKeypress.bind(this) }  />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type={this.state.inputPassword} className="form-control" value={this.state.password} onChange={this.handlePasswordChange.bind(this)}  onKeyPress={this.handleKeypress.bind(this) }/>
                                        <i class={this.state.icon} onClick={this.changeText.bind(this)} aria-hidden="true"></i>
                                    </div>
                                    <button name="submitform" className="btn" type="submit">Login</button>
                                </form>
                                <h6>Don’t have an Account?  <Link to="/Signup">Sign up</Link></h6>
                                <h6><Link to="/Forget">Forget Password?</Link></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
}</>
        );
    }
};
    
export default Login;