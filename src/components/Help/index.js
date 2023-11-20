import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Help extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        data: [],
        input: {},
        errors: {},
        helpposts: [],
        formfilled: 'notempty',
        profession:[],
        popprofession:[],
        subcategoryprofession:[],
        helpimage: '',
        searcheddata:[]
       }

       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       this.imageChange = this.imageChange.bind(this);
       this.handleProfession = this.handleProfession.bind(this);
       this.handleSearch = this.handleSearch.bind(this);
    }

    handleProfession(event){

        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({
          input
        });

        const formData = new FormData();
        formData.append('id', event.target.value);
        axios.post('https://domaintobesocial.com/domaintobe/getprofessionsubcategory',
            formData
        )
        .then((res) => {
            this.setState({subcategoryprofession: res.data.result});

        })
        .catch((error) => {
            console.log(error.message);
        })
        
    }


    imageChange(event){
        const preview = document.querySelector('#myImg');
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();
        var setfile = '';
        reader.addEventListener("load", function () {
            //convert image file to base64 string
           preview.src = reader.result;
        }, false);

        if (file) {
           reader.readAsDataURL(file);
        }
        
        this.setState({ helpimage: event.target.files[0] });
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
        if(this.state.formfilled == 'empty'){
            alert('Complete your personal details');
            window.location = "/userprofile";
            return false;
        }else{

            if(this.validate()){
                document.getElementById('loadingicon').style.display = 'block';
                var obj = JSON.parse(window.localStorage.getItem("user"));
                const formData = new FormData();
                formData.append('profession', this.state.input.profession);
                formData.append('subprofession', this.state.input.subprofession);
                formData.append('description', this.state.input.description);
                formData.append('imgsrc', this.state.helpimage);
                formData.append('userid', obj.value);

                axios.post('https://domaintobesocial.com/domaintobe/helprequest',
                formData
                )
                .then((res) => {
                    document.getElementById('exampleModalHelp').style.display = 'none';
                   
                    const modalBackdrops = document.getElementsByClassName('modal-backdrop');
                    document.body.removeChild(modalBackdrops[0]);

                    if(res.data.message == 'success')
                    {
                        this.componentDidMount();
                    }else{
                        alert(res.data.message);
                    }
                    document.getElementById('loadingicon').style.display = 'none';
                })
                .catch((error) => {
                    console.log(error.message);
                })

            }

        }
    }

    validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;

    //   if (!input["category"]) {
    //     isValid = false;
    //     errors["category"] = "Please select category.";
    //   }

      if (!input["profession"]) {
        isValid = false;
        errors["profession"] = "Please select profession.";
      }

      if (!input["subprofession"]) {
        isValid = false;
        errors["subprofession"] = "Please select Subcategory profession.";
      }

      if (!input["description"]) {
        isValid = false;
        errors["description"] = "Please add description.";
      }


      this.setState({
        errors: errors
      });
  
      return isValid;
    }

    componentDidMount() { 
        document.getElementById('loadingicon').style.display = 'block';
        axios.post('https://domaintobesocial.com/domaintobe/gethelpposts'
        )
        .then((res) => {
            document.getElementById('loadingicon').style.display = 'none';
          this.setState({helpposts: res.data.message});
        })
        .catch((error) => {
            console.log(error.message);
        })



        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                formData
            )
        .then((response) => {

            let input = this.state.input;
            input.name = response.data.message.name;
            input.uid = response.data.message.id;
            this.setState({
              input
            });

            if(response.data.message.roles == 'vip'){
               
                this.setState({formfilled: response.data.message.formfilled});
                
                this.setState({isViprole: true});
            }else{
                this.setState({isViprole: false});
            }

            
            if((response.data.message.image == null) || (response.data.message.image == '') ){
                this.setState({userimage: '/images/blank.png'});
            }else{
                this.setState({userimage: response.data.message.image});
            }   

        })
        .catch((error) => {
            console.log(error.message);
        })

        const formData1 = new FormData();
        formData1.append('id', '16');
        axios.post('https://domaintobesocial.com/domaintobe/getprofessions',
        formData1).then(response1 => 
        {
            this.setState({profession: response1.data.message});
        }).catch((error) => {
            console.log(error.message);
        })


        axios.get('https://domaintobesocial.com/domaintobe/getprofessions').then(response2 => 
        {
            this.setState({popprofession: response2.data.message});
        }).catch((error) => {
            console.log(error.message);
        })

        axios.get('https://domaintobesocial.com/domaintobe/getprofessionssubcategories').then(response3 => 
        {
            this.setState({subcategoryprofession: response3.data.message});
        }).catch((error) => {
            console.log(error.message);
        })

    }

    handleSearch(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('search', this.state.input.search);
        axios.post('https://domaintobesocial.com/domaintobe/searchprofessions',
            formData
        )
        .then((res) => {
            this.setState({searcheddata: res.data.message});
        })
        .catch((error) => {
        console.log(error.message);
        })
    }

    handleChangeLogout()
    {
      window.localStorage.clear();
      window.location.reload();
    }

    render() {
        let stringValue = window.localStorage.getItem('user');
        if (stringValue !== null) {
            let value = JSON.parse(stringValue)
            let expirationDate = new Date(value.expirationDate)
            if (expirationDate > new Date()) {
                
            }else{
    
                window.localStorage.removeItem('user');
                window.location = "/";
            }
        }else{
            window.localStorage.removeItem('user');
            window.location = "/";
        }

        const isViprole = this.state.isViprole;
        const userimage = this.state.userimage;
        let vipimage;
        const {enteredText} = this.state
       
        // console.log(this.state.formfilled);
        if(isViprole){
            vipimage = <img className="vip" src="/images/vip.png" align="icon"/>;
        }else{
            vipimage = '';
        }

        return (
        <section className="maindiv">
         <i className="fas fa-bars side_b"></i>
         <div className="sidbar_left">
            <i className="fas fa-times side_b close"></i>
            <div className="logo">
                <Link to="/userdashboard">
                    <img src="images/logo.png" alt="logo"/>
                </Link>
            </div>
            <ul>
                <li>
                    <Link  to="/userdashboard">
                    <span><img src="/images/iconS1.png" align="icon"/></span> News Feed</Link>
                </li>
                <li>
                    <Link to="/messages" >
                    <span><img src="/images/iconS2.png" align="icon"/></span> Messages</Link>
                </li>
                <li>
                    <Link to="/requests" >
                    <span><img src="/images/iconS3.png" align="icon"/></span> Requests</Link>
                </li>
                <li>
                    <Link to="/followers" >
                    <span><img src="/images/iconS4.png" align="icon"/></span> My Followers</Link>
                </li>
                <li><Link to="/blocklist" ><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                <li><Link to="/viewnotifications" ><span><img src="images/iconS6.png" align="icon"/></span> Notifications</Link></li>
                
                <li><Link to="/favorites"><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
            </ul>
        </div> 
        <div className="main_menu ">
                <ul class="ml-0">
                    <li>
                        <Link  to="/userdashboard" >
                        News Feed</Link>
                    </li>
                    <li>
                        <Link to="/discussion" >
                        Discussion</Link>
                    </li>
                    <li>
                        <Link to="/help" className="active" >
                        Help</Link>
                    </li>
                    {/* <li><Link to="/blog" >Blog</Link></li> */}
                </ul>
                <div class="side_right">
                        <div class="asuser">
                    <Link to="/userprofile">
                        <span className="userimg"><img className="w-100" src={this.state.userimage} align="icon"/></span>
                        {vipimage}
                        <h5>{this.state.input.name}</h5>
                    </Link>
                        </div>
                        <span className="logout" onClick={this.handleChangeLogout.bind(this)} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Logout</span>
                        </div>
        
            </div>
        <div className="in_center in_center_discussion help">
            
            <div className="head" >
                <form className="d-flex" onSubmit={this.handleSearch}>
                    <input className="form-control me-2" type="search" placeholder="Search" name="search" aria-label="Search" autoComplete="off" onChange={this.handleChange} value={this.state.input.search}/>
                    <button className="btn" type="submit">
                    <img src="images/searchicon.png" alt="icon"/> </button>
                    <div className="setsearchdata">
                        <ul>
                            {this.state.searcheddata.map((results) => {
                                return (
                                    <li><Link to={'professions/'+results.id}>{results.name}<i className="fas fa-arrow-right"></i></Link></li>
                                )
                            })}
                        </ul>
                    </div>
                </form>
                <a className="hpl" data-toggle="modal" data-target="#exampleModalHelp"><img src="images/iconS2.png" align="icon"/> <span>Help</span></a>
            </div>
            <div className="listusr discussion help">
                <div className="test">
                    <div className="categoryhd">
                        <h3>Help Post</h3>
                    </div>
                    <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    <div className="allctg">
                        <div className="row">
                            {this.state.profession.map((results) => {
                                return (
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
                                        <Link to={'professions/'+results.id}><div className="text">
                                                <img src="/images/iconS2.png" align="icon"/>
                                                <h3>{results.name}</h3> 
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {this.state.helpposts.length > 0  ? 
                    <div className="row">
                        {this.state.helpposts.map((result,i) => {
                            return (
                            <div className="col-sm-6 col-lg-4 col-xl-3  mb-3">
                                <div className="singleposttest">
                                    <div className="asuser mb-0">
                                        <span className="userimg"><img src={result.userimage} align="icon"/></span>
                                        <h5>{result.name}
                                        </h5>
                                        <p>{result.category}</p>
                                        <p>{result.created} Ago</p>
                                    </div>
                                    <div className="contants">
                                        <img className="w-100" src={result.image} />
                                        <p>{result.description}</p>
                                        <Link to={{ pathname: '/viewhelp/'+ result.id }}>View more <i className="fas fa-long-arrow-alt-right"></i></Link>
                                    </div>
                                </div>
                            </div>
                            )
                        })}  
                    </div>
                    :
                    <div className="norecord">
                        <img src="/images/nodata.png" />
                    </div>
                    }



                </div>
            </div>
        </div>

   
        
        <div className="modal fade" id="exampleModalHelp"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content HelpForm">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Help</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label>Professions</label>

                                    <select className="form-control" name="profession" value={this.state.input.profession} onChange={this.handleProfession}  id="profession">
                                        <option key="" value="">--Select Profession--</option>
                                        {this.state.popprofession.map((results) => {
                                            return (
                                                <option  value={results.id}>{results.name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <div className="text-danger">{this.state.errors.profession}</div>
                                </div>
                            </div>
                            
                            <div className="col-sm-12">
                                <div className="form-group">
                                <label>Subcategory Profession</label>
                                    <select className="form-control"  value={this.state.input.subprofession} onChange={this.handleChange} name="subprofession" id="subprofession">
                                        <option key="" value="">--Select Subcategory--</option>
                                        {this.state.subcategoryprofession.map((results) => {
                                                return (
                                                    <option key={results.name} value={results.id} >{results.name}
                                                    </option>
                                                )
                                            })}
                                    </select>
                                    <div className="text-danger">{this.state.errors.subprofession}</div>
                                </div>
                            </div>

                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea placeholder="Description" value={this.state.input.description} onChange={this.handleChange} id="description" name="description"></textarea>
                                    <div className="text-danger">{this.state.errors.description}</div>
                                </div>
                            </div>
                            <div className="col-sm-12 text-center">
                                <div className="form-group mb-0">
                                    <div className="userimgmain">
                                        <input type="file" onChange={this.imageChange} accept=".jpg,.jpeg,.png"/>
                                        <div className="userimg">
                                            <img id="myImg" className="h-100" src="images/usrrr.png" alt="your image"/>
                                        </div>
                                        <img className="camerai" src="images/camerai.png" alt="your image"/>
                                        <h6 className="mt-3">Upload Image</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit"  className="btn btn-primary submit">Submit</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

        );
    }
    
}

export default Help;