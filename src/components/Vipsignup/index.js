import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import CheckoutForm from '../CheckoutForm';
import DatePicker from 'react-datepicker';  
import "react-datepicker/dist/react-datepicker.css"; 
class Vipsignup extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
          data: [],
          input: {},
          errors: {},
          formData:false,
          planprice:false,
          selectedDate:new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
          plans: '',coupon_id:0,amt:0,
          coupon:""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        let input = this.state.input;
        input.referral = this.props.location.search.substring(1);
        this.setState({
            input
        });
    }

    componentDidMount() {
        axios.get('https://domaintobesocial.com/domaintobe/getplan').then(res => 
        {
            this.setState({data: res.data.message});
            //var result = arr.map(person => ({ value: person.id, text: person.name }));
            
        });
        axios.get('https://domaintobesocial.com/domaintobe/fetch_docs').then(res=>
        {
            this.setState({amt: res.data.data.amount});
    })
    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({
          input
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.validate() && this.state.data.length>0 && this.state.amt>0){

            const planprice=this.state.data.find(x => x.id === this.state.input.plan).price;
            this.setState({planprice:planprice});
            const formData = new FormData();
            formData.append('firstname', this.state.input.firstname);
            formData.append('lastname', this.state.input.lastname);
            formData.append('username', this.state.input.username);
            formData.append('email', this.state.input.email);
            formData.append('mobile', this.state.input.mobile);
            formData.append('age', this.state.input.age);
            formData.append('password', this.state.input.password);
            formData.append('company_name', this.state.input.company);
            formData.append('coupon', this.state.coupon_id);
            formData.append('plan', this.state.input.plan);
            formData.append('ordl', this.state.amt);
            formData.append('planprice', planprice);
            formData.append('referral', this.state.input.referral);
            axios.post('https://domaintobesocial.com/domaintobe/vipsignup',
                formData
            )
            .then((res) => {
                if(res.data.message == 'success')
                {   this.setState({formData:formData});
                    document.getElementById('errorlogin').style.display = 'none';
                    document.getElementById('successlogin').style.display = 'block';
                    if(res.data.repo){
                        this.setState({formData:res.data.repo});
                    }
                     //setTimeout(function(){ window.location = "/"; }, 3000);
                }else{
                    document.getElementById('successlogin').style.display = 'none';
                    document.getElementById('errorlogin').style.display = 'block'; 
                    document.getElementById("errorlogin").innerHTML = res.data.message;
                    setTimeout(function(){ document.getElementById('errorlogin').style.display = 'none'; }, 2000);

                }
                
            })
            .catch((error) => {
                console.log(error.message);
            })
        }
    }

    validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;
   
      if (!input["username"]) {
        isValid = false;
        errors["username"] = "Please enter your username.";
      }

      if (!input["firstname"]) {
        isValid = false;
        errors["firstname"] = "Please enter your firstname.";
      }

      if (!input["lastname"]) {
        isValid = false;
        errors["lastname"] = "Please enter your lastname.";
      }
  
      if (!input["username"]) {
        //const re = /^\S*$/;
        if(input["username"].length < 6 ){
            isValid = false;
            errors["username"] = "Please enter valid username.";
        }
      }

      if (!input["plan"]) {
        isValid = false;
        errors["plan"] = "Please select your plan.";
      }

      if (!input["mobile"]) {
        isValid = false;
        errors["mobile"] = "Please enter your mobile.";
      }

      if (typeof input["mobile"] !== "undefined") {
        const rep = /^\d*$/;
        if(input["mobile"].length < 10 || !rep.test(input["mobile"])){
            isValid = false;
            errors["mobile"] = "Please enter your valid 10 digit mobile.";
        }
      }

      if (!input["age"]) {
        isValid = false;
        errors["age"] = "Please enter your age.";
      }

      if (!input["company"]) {
        isValid = false;
        errors["company"] = "Please enter company name.";
      }


      if(!input['age'])
    {
        isValid = false;
        errors['age'] = "Please fill the input"
    }
    else {
        var parts =input["age"].split("-"); 
        console.log("parts", parts)
        var dtDOB = new Date(parts[2] + "/" + parts[1] + "/" + parts[0]);
        var dtCurrent = new Date();
        console.log("DTBOB", dtCurrent.getFullYear())
        if(dtCurrent.getFullYear() - parts[0] < 16 ) {
           isValid = false;
           errors["age"] = "Eligibility minimum 16 years.";
        }

        if (dtCurrent.getFullYear() - dtDOB.getFullYear() == 16) {
 
                            //CD: 11/06/2018 and DB: 15/07/2000. Will turned 18 on 15/07/2018.
                            if (dtCurrent.getMonth() < parts[1]) {
                                isValid = false;
                                errors["age"] = "Eligibility minimum 16 years.";
                            }
                            if (dtCurrent.getMonth() == parts[1]) {
                                //CD: 11/06/2018 and DB: 15/06/2000. Will turned 18 on 15/06/2018.
                                if (dtCurrent.getDate() < parts[0]) {
                                    isValid = false;
                                    errors["age"] = "Eligibility minimum 16 years.";
                                }
                            }
                        }
    }

      
      if (!input["email"]) {
        isValid = false;
        errors["email"] = "Please enter your email Address.";
      }
  
      if (typeof input["email"] !== "undefined") {
          
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(input["email"])) {
          isValid = false;
          errors["email"] = "Please enter valid email address.";
        }
      }
  
      if (!input["password"]) {
        isValid = false;
        errors["password"] = "Please enter your password.";
      }
  
      if (!input["confirm_password"]) {
        isValid = false;
        errors["confirm_password"] = "Please enter your confirm password.";
      }
  
      if (typeof input["password"] !== "undefined") {
        if(input["password"].length < 6){
            isValid = false;
            errors["password"] = "Please add at least 6 charachter.";
        }
      }
  
      if (typeof input["password"] !== "undefined" && typeof input["confirm_password"] !== "undefined") {
          
        if (input["password"] != input["confirm_password"]) {
          isValid = false;
          errors["password"] = "Passwords don't match.";
        }
      }

      this.setState({
        errors: errors
      });
  
      return isValid;
    }
    handlecoupon(e)
    {   
        if(e.target.value)
        {
        this.setState({coupon:e.target.value},()=>
        {
            this.getcode()
        });
        }
    }
    getcode()
    {
        const formData = new FormData();
        formData.append('data', this.state.coupon);
        axios.post('https://domaintobesocial.com/domaintobe/fetch_coupon',
        formData
    )
    .then((res) => {
        if(res.data.message == 'success')
        {   
            document.getElementById('errorcoupon').style.display = 'none'; 
            document.getElementById('successcoupon').style.display = 'block';
            this.setState({coupon_id:res.data.data.id});
            // setTimeout(function(){ window.location = "/"; }, 3000);
        }else{
            document.getElementById('successcoupon').style.display = 'none'; 
            document.getElementById('errorcoupon').style.display = 'block'; 
    
        }
    })
}

handleDateChange(date) { 
    let day = date.getDate();
    let month = date.getMonth() + 1; // take care of the month's number here ⚠️
    let year = date.getFullYear();
    this.state.input.age=day+"/"+month+"/"+year; 
    this.setState({input:this.state.input,selectedDate:date});  
  } 

    render() {
        return (
        <section className="loginpage vipsignup">
            <div className="container">
            <Link to="/Signup" className="gologin"><img src="/images/loginarrow.png" alt="icon"/></Link>
                <div className="row">
                    <div className="col-md-6">
                        <div className="imglogin">
                            <img src="/images/loginimg.png" alt="/images"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right_login right_signup" style={{ backgroundImage: `url(/images/signupbg1.jpg)`}}>
                            {/* <div className="plan">
                                <h5>1 Week Plan</h5>
                                <h2>$65.00 <span>/ Week</span></h2>
                            </div> */}
              <div className="lgn">
                            <h3>Sign up vip account</h3>
                            <div className="alert alert-danger" id="errorlogin"></div>
                            <div className="alert alert-success" id="successlogin">Successfully Registered</div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>First Name*</label>
                                            <input type="text" name="firstname" value={this.state.input.firstname} onChange={this.handleChange} id="firstname"  className="form-control" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.firstname}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Last Name*</label>
                                            <input type="text" name="lastname" value={this.state.input.lastname} onChange={this.handleChange} id="lastname"  className="form-control" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.lastname}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Username*</label>
                                            <input type="text" name="username" value={this.state.input.username} onChange={this.handleChange} id="username"  className="form-control" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.username}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email Address*</label>
                                            <input type="text"  name="email" value={this.state.input.email} onChange={this.handleChange}  className="form-control" id="email" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Mobile Number*</label>
                                            <input type="text" name="mobile" value={this.state.input.mobile} onChange={this.handleChange}  className="form-control" id="mobile" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.mobile}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Dob<sup>(dd/MM/yyyy)*</sup></label>
                                            <input type="date" className="form-control" name="age" value={ this.state.input.age }  onChange={this.handleChange}   />
                                            {/* <DatePicker  
                                            selected={ this.state.selectedDate }  
                                            onChange={ this.handleDateChange.bind(this) }  
                                            name="startDate"  
                                            dateFormat="MM/dd/yyyy"
                                            className="form-control" id="age" 
                                            /> */}
                                            <div className="text-danger">{this.state.errors.age}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Create Password*</label>
                                            <input type="password" name="password"  value={this.state.input.password} onChange={this.handleChange} className="form-control" id="password"  autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.password}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Confirm Password*</label>
                                            <input type="password"  name="confirm_password" value={this.state.input.confirm_password} onChange={this.handleChange} className="form-control" id="confirm_password" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.confirm_password}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Company Name*</label>
                                            <input type="text"  name="company" value={this.state.input.company} onChange={this.handleChange} className="form-control" id="company" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.company}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Referral Code</label>
                                            <input type="text"  name="referral" value={this.state.input.referral} onChange={this.handleChange} className="form-control" id="referral" autoComplete="off"/>
                                            <div className="text-danger">{this.state.errors.referral}</div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Apply for vouchers</label>
                                            <input type="text"  name="coupon" value={this.state.coupon} onChange={this.handlecoupon.bind(this)} className="form-control" id="coupon" autoComplete="off"/>
                                            <div id="errorcoupon" className="text-danger">Invalid Coupon</div>
                                            <div id="successcoupon">Your coupon added</div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                    <div className="form-group">
                                       <label>Plan*</label>
                                        <div className="row">

                                        {this.state.data.map((result) => {
                                        return (
                                            // <input type="radio"  name="referral" key={result.id} value={result.id} onChange={this.handleChange} className="form-control"  autoComplete="off"/>
                                            <div className="col-md-12 mb-2">
                                                <div class="checkcontainer">
                                                    <input type="radio" name="plan" key={result.id} value={result.id} onChange={this.handleChange}/>
                                                    <span class="radiobtn"></span>
                                                    {result.duration} / ${result.price}
                                                </div>
                                            </div>
                                            )
                                        })}
                                        <div className="text-danger">   {this.state.errors.plan}</div>
                                        </div>
                                    </div>  
                                    </div>
                                </div>
                                <div className="text-center">
                                {this.state.formData!==false ? <CheckoutForm price={this.state.planprice} form={this.state.formData}  /> : <button className="btn" type="submit">Create Account</button>}

                                    {/* <button className="btn" type="submit">Create Account</button> */}
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        );
    }
}
export default Vipsignup;