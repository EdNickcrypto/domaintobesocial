import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import $ from "jquery";
import swal from 'sweetalert';
// import firebase from 'firebase';


class Viewprofile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            input: {},
            errors: {},
            isFriendRequest: false,
            isViprole: false,
            friendsdata: [],
            followingdata: [],
            postsdata: [],
            galleryimages: [],
            followers: [],
            firendstatus: false,
            // themecolor: '#016afb',
            themeimage: 'select2.jpg',
            setbannerimage: 'https://localhost:3000/images/bannerimage.png',
            plans: [],
            businesscardimages: [],
            from: '00:00',
            to: '00:00',
            showModal: false,
            category: [],
            advertisementModal: false,
            advertisementData: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleHelp = this.handleHelp.bind(this);
        this.handleReportSubmit = this.handleReportSubmit.bind(this);
    }


    handleChange(event) {
        let input = this.state.input;
        let errors = {};
        input[event.target.name] = event.target.value;
        this.setState({
            input
        });

        this.setState({
            errors: errors
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let curentlogin = JSON.parse(window.localStorage.getItem("user"));

        const formData0 = new FormData();
        formData0.append('id', 9);
        axios.post('https://domaintobesocial.com/domaintobe/getadvertisementpost', formData0).then((res) => {
            console.log("respose", res);
            this.setState({ advertisementData: res.data });
        }).catch(error => console.log("error", error));
        const formData = new FormData();
        formData.append('id', this.props.match.params.name)
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofilename',
            formData
        )
            .then((res) => {
                let input = this.state.input;
                input.id = res.data.message.id;
                input.name = res.data.message.name;
                input.email = res.data.message.email;
                input.lname = res.data.message.lname;
                input.mobile = res.data.message.mobile;
                input.profession = res.data.message.profession;
                input.subprofession = res.data.message.professionsubcategory;
                input.professionview = res.data.message.professionname;
                input.subprofessionview = res.data.message.subprofessionname;
                input.buisnessname = res.data.message.buisnessname;
                input.days = res.data.message.days;
                input.address = res.data.message.address;
                input.description = res.data.message.description;
                input.age = res.data.message.age;
                input.uid = res.data.message.id;
                input.friendstatus = res.data.message.firendrequeststatus;
                input.plan = res.data.message.plan;
                input.planstatus = res.data.message.planstatus;
                input.expireddate = res.data.message.expireddate;
                input.facebook = res.data.message.facebook;
                input.twitter = res.data.message.twitter;
                input.tumbler = res.data.message.tumbler;
                input.snapchat = res.data.message.snapchat;
                input.amazon = res.data.message.amazon;
                input.ebay = res.data.message.ebay;
                input.whatsapp = res.data.message.whatsapp;
                input.marital_status = res.data.message.marital_status;
                // if(res.data.message.themecolor == null){
                //     input.favcolor = '#016afb';
                //     this.setState({ themecolor: '#016afb' });
                // }else{
                //     input.favcolor = res.data.message.themecolor;
                //     this.setState({ themecolor: res.data.message.themecolor });
                // }

                if (res.data.message.themeimage == null) {
                    this.setState({ themeimage: 'select2.jpg' });
                } else {
                    this.setState({ themeimage: res.data.message.themeimage });
                }


                if (res.data.message.bannerimage == null) {
                    this.setState({ setbannerimage: 'https://localhost:3000/images/bannerimage.png' });
                } else {
                    this.setState({ setbannerimage: res.data.message.bannerimage });
                }

                this.setState({
                    input
                });

                if (res.data.message.firendrequeststatus == 'Send Request') {
                    this.setState({ firendstatus: true });
                } else {
                    this.setState({ firendstatus: false });
                }

                this.setState({ galleryimages: res.data.message.galleryimages });
                this.setState({ businesscardimages: res.data.message.businesscard });


                if (res.data.message.roles == 'vip') {
                    this.setState({ isViprole: true });
                } else {
                    this.setState({ isViprole: false });
                }

                if (input.uid == curentlogin.value) {
                    this.setState({ isFriendRequest: true });
                } else {
                    this.setState({ isFriendRequest: false });
                }

                if ((res.data.message.image == null) || (res.data.message.image == '')) {
                    var image = '/images/blank.png';
                } else {
                    var image = res.data.message.image;
                }

                this.setState({ from: res.data.message.from });
                this.setState({ to: res.data.message.to });

                const preview = document.querySelector('#myImg');
                preview.src = image;

            })
            .catch((error) => {
                console.log(error.message);
            })


        const formData1 = new FormData();
        formData1.append('id', this.props.match.params.name);
        formData1.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfriendlistname',
            formData1
        )
            .then((response) => {
                if (response.data.status = 'data') {
                    this.setState({ friendsdata: response.data.message });
                } else {
                    alert(response.data.message);
                }

            })
            .catch((error) => {
                alert('Invalid Login1');
            })


        const formData2 = new FormData();
        formData2.append('id', this.props.match.params.name);
        axios.post('https://domaintobesocial.com/domaintobe/getfollowingname',
            formData2
        )
            .then((response1) => {
                if (response1.data.status = 'data') {
                    this.setState({ followingdata: response1.data.message });
                } else {
                    alert(response1.data.message);
                }

            })
            .catch((error) => {
                console.log(error.message);
            })



        const formData3 = new FormData();
        formData3.append('id', this.props.match.params.name);
        axios.post('https://domaintobesocial.com/domaintobe/getuserspostsname',
            formData3
        )
            .then((response2) => {
                console.log(response2);
                if (response2.data.status = 'data') {
                    this.setState({ postsdata: response2.data.message });
                } else {
                    alert(response2.data.message);
                }

            })
            .catch((error) => {
                console.log(error.message);
            })

        const formData5 = new FormData();
        formData5.append('id', this.props.match.params.name);
        axios.post('https://domaintobesocial.com/domaintobe/getfollowersname',
            formData5
        )
            .then((response4) => {
                if (response4.data.status = 'data') {
                    console.log("followers", response4);
                    this.setState({ followers: response4.data.message });
                } else {
                    alert(response4.data.message);
                }

            })
            .catch((error) => {
                console.log(error.message);
            })


        axios.post('https://domaintobesocial.com/domaintobe/membershipplans',
        )
            .then((response6) => {
                this.setState({ plans: response6.data.result });
            })
            .catch((error) => {
                console.log(error.message);
            })


        axios.get('https://domaintobesocial.com/domaintobe/category').then(response => {
            this.setState({ category: response.data.message });
        });

    }

    handleReportSubmit(event) {
        event.preventDefault();
        if(this.validates()) {
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            console.log("postid", event.target.attributes['data-id'].value);
            console.log("userid", curentlogin.value);
            console.log("description", this.state.input.postDescription);
            const formData = new FormData();
            console.log("curentlogin.value", curentlogin.value)
            formData.append('id', event.target.attributes['data-id'].value);
            formData.append('userid', curentlogin.value);
            formData.append('category', "");
            formData.append('description', this.state.input.postDescription);
            axios.post('https://domaintobesocial.com/domaintobe/reporthelpost',
                formData
            )
            .then((res) => {
                if(res.data.message == 'success'){
                    swal('Successfully', 'Report submit', "success");
                    window.location.reload();
                }else{
                    swal('Oops', res.data.message, "success");
                }
            })
            .catch((error) => {
                console.log("error", error)
                alert('Invalid Login1');
            })
        }
    }

    validates(){
        let input = this.state.input;
        let errors = {};
        let isValid = true;
     
        if (!input["postDescription"]) {
          isValid = false;
          errors["postDescriptions"] = "Description field is required.";
        }
        
        this.setState({
          errors: errors
        });
    
        return isValid;
      }
  

    openPop() {
        $(".dash_topmain").toggleClass("main");
    }

    openClose() {
        $(".dash_topmain").toggleClass("main");
    }


    sendFriendRequest = (uid) => {
        let userid = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('id', uid);
        formData.append('userid', userid.value);
        axios.post('https://domaintobesocial.com/domaintobe/sendfriendrequest',
            formData
        )
            .then((res) => {
                if (res.data.message == 'success') {
                    alert('Successfully sent');
                } else if (res.data.message == 'already') {
                    alert('Already sent friend request');
                } else {
                    alert(res.data.message);
                }

            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    sendFollowRequest = (uid) => {

        let userid = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('id', uid);
        formData.append('userid', userid.value);
        axios.post('https://domaintobesocial.com/domaintobe/sendfollowrequest',
            formData
        )
            .then((res) => {
                if (res.data.message == 'success') {
                    alert('Successfully sent');
                } else if (res.data.message == 'already') {
                    alert('Already sent follow request');
                } else {
                    alert(res.data.message);
                }

            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    redirectmessages = (uid) => {
        window.location = '/messages';
    }

    helpPop() {
        this.setState({ showModal: true })
    }

    closepopup() {
        this.setState({ showModal: false })
    }

    handleHelp(event) {
        event.preventDefault();
        if (this.validate()) {
            document.getElementById('loadingicon').style.display = 'block';
            let userid = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('id', userid.value);
            formData.append('category', this.state.input.category);
            formData.append('message', this.state.input.message);
            formData.append('email', this.state.input.email);
            formData.append('name', this.state.input.name);
            axios.post('https://domaintobesocial.com/domaintobe/helpmail',
                formData
            )
                .then((res) => {
                    document.getElementById('loadingicon').style.display = 'none';
                    if (res.data.message == 'success') {
                        this.setState({ showModal: false })
                        alert('Successfully sent');
                    } else {
                        alert(res.data.message);
                    }

                })
                .catch((error) => {
                    console.log(error.message);
                })

        }
    }

    validate() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (!input["category"]) {
            isValid = false;
            errors["category"] = "Please select category.";
        }

        if (!input["message"]) {
            isValid = false;
            errors["message"] = "Please enter text.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    render() {
        let stringValue = window.localStorage.getItem('user');
        if (stringValue !== null) {
            let value = JSON.parse(stringValue)
            let expirationDate = new Date(value.expirationDate)
            if (expirationDate > new Date()) {

            } else {
                window.localStorage.removeItem('id');
                window.localStorage.removeItem('user');
                window.location = "/";
            }
        } else {
            window.localStorage.removeItem('user');
            window.location = "/";
        }

        const isFriendRequest = this.state.isFriendRequest;
        const firendstatus = this.state.firendstatus;
        const isViprole = this.state.isViprole;
        const { plans } = this.state;
        let button, reportbutton, follow, message, vipimage, advertisement, membership;

        if (isFriendRequest) {
            button = '';
            follow = '';
            message = '';
            advertisement = <li><a data-toggle="tab" href="#Membership">Vip Membership</a></li>;
            // membership = <li><a data-toggle="tab" href="#Advertisement">Advertisement</a></li>;
        } else {
            if (firendstatus) {
                button = <li onClick={() => this.sendFriendRequest(this.state.input.uid)} style={{ cursor: "pointer" }}>{this.state.input.friendstatus}</li>;
            } else {
                button = <li>{this.state.input.friendstatus}</li>;
            }


            follow = <li onClick={() => this.sendFollowRequest(this.state.input.uid)} style={{ cursor: "pointer" }}>Follow</li>;
            message = <li onClick={() => this.redirectmessages()} style={{ cursor: "pointer" }}>Message</li>;
            advertisement = '';
            // membership = '';

        }

        if (isViprole) {
            vipimage = <div className="report_btni"><img src="/images/vip.png" alt="images" /></div>;
        } else {
            vipimage = '';
        }

        const { galleryimages } = this.state;
        const { businesscardimages } = this.state;
        const from = this.state.from;
        const to = this.state.to;

        let currentlogin = JSON.parse(window.localStorage.getItem("user"));
        return (
            <span>
                <div className="inbanner" style={{ backgroundImage: `url(${this.state.setbannerimage})` }} ></div>
                <section className="dashboard dashboard_pro" style={{ backgroundImage: `url(${'/images/' + this.state.themeimage})` }}>
                    <div className="container">
                        <div className="dash_top">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="user usernew">
                                        <div className="uphead">
                                            {vipimage}
                                            <div className="userimg">
                                                <img id="myImg" src="/images/blank.png" alt="your image" />
                                            </div>
                                            {currentlogin.role == 'vip' ?
                                                <a className="help" onClick={() => this.helpPop()}>Help <span><img src="/images/mark.png" alt="your image" /></span> </a>
                                                : ""}

                                            <ul>
                                                {button}
                                                {follow}
                                                {message}
                                            </ul>
                                            <h5 className="socialicon">
                                                {/* {this.state.input.facebook ? <span><a href={this.state.input.facebook} ><i className="fab fa-facebook-f"></i></a></span> : ""}
                                        
                                        {this.state.input.twitter ?  <span><a href={this.state.input.twitter}><i className="fab fa-twitter"></i></a></span> : ""}
                                       
                                        {this.state.input.snapchat ? <span><a href={this.state.input.snapchat}><i className="fab fa-snapchat-ghost"></i></a></span> : "" }

                                        {this.state.input.amazon ? <span><a href={this.state.input.amazon}><i className="fab fa-amazon"></i></a></span> : ""}
                                        
                                        {this.state.input.whatsapp ? <span><a href={'https://wa.me/'+this.state.input.whatsapp}><i className="fab fa-whatsapp"></i></a></span> : "" }

                                        {this.state.input.tumbler ? <span><a href={this.state.input.tumbler}><i className="fab fa-tumblr"></i></a></span> : ""}

                                        {this.state.input.ebay ? <span><a href={this.state.input.ebay}><i className="fab fa-ebay"></i></a></span> : ""} */}

                                                {this.state.input.facebook && this.state.input.facebook !== "" ? <span><a href={this.state.input.facebook} target="_blank" ><i className="fab fa-facebook-f"></i></a></span> : ""}

                                                {this.state.input.twitter && this.state.input.twitter !== "" ? <span><a href={this.state.input.twitter} target="_blank"><i className="fab fa-twitter"></i></a></span> : ""}

                                                {this.state.input.snapchat && this.state.input.snapchat !== "" ? <span><a href={this.state.input.snapchat} target="_blank"><i className="fab fa-snapchat-ghost"></i></a></span> : ""}

                                                {this.state.input.amazon && this.state.input.amazon !== "" ? <span><a href={this.state.input.amazon} target="_blank"><i className="fab fa-amazon"></i></a></span> : ""}

                                                {this.state.input.whatsapp && this.state.input.whatsapp !== "" ? <span><a href={'https://wa.me/' + this.state.input.whatsapp} target="_blank"><i className="fab fa-whatsapp"></i></a></span> : ""}

                                                {this.state.input.tumbler && this.state.input.tumbler !== "" ? <span><a href={this.state.input.tumbler} target="_blank"><i className="fab fa-tumblr"></i></a></span> : ""}

                                                {this.state.input.ebay && this.state.input.ebay !== "" ? <span><a href={this.state.input.ebay} target="_blank"><i className="fab fa-ebay"></i></a></span> : ""}

                                            </h5>
                                        </div>
                                        <h3>{this.state.input.name}</h3>
                                        <p>{this.state.input.description}</p>
                                        <p>{'Status: ' + this.state.input.marital_status}</p>
                                        {/* <h5>{this.state.input.email}</h5> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dash_topmain dash2">
                            <i className="fas fa-bars side_b" onClick={this.openPop.bind(this)}></i>
                            <div className="dash_sidebar">
                                <i className="fas fa-times side_b close" onClick={this.openPop.bind(this)}></i>
                                <ul className="nav nav-tabs">
                                    <li><Link to="/userdashboard">Home</Link></li>
                                    <li><a className="active" data-toggle="tab" href="#posts">Posts</a></li>
                                    {(isViprole) ? (this.state.input.buisnessname) ? <li><a data-toggle="tab" href="#home">Business Details</a></li> : "" : ""}
                                    <li><a data-toggle="tab" href="#Friends">Friends</a></li>
                                    <li><a data-toggle="tab" href="#Gallery">Gallery</a></li>
                                    <li><a data-toggle="tab" href="#followers">Followers</a></li>
                                    <li><a data-toggle="tab" href="#following">Following</a></li>
                                    {/* {membership} */}
                                    {advertisement}
                                </ul>
                            </div>
                            <div className="loadingicon" id="loadingicon"><img src="/images/loading.gif" /></div>
                            <div className="tab-content">
                                <div id="home" className="tab-pane fade">
                                    <div className="bus_det businessddl">
                                        <div className="tes">
                                            <h4><b>Business Name</b>
                                                <span>{this.state.input.buisnessname}</span>
                                                {/* <ul>
                                        <li>Recovered 2000 + Patients</li>
                                        <li><span><img src="/images/brand1.png" alt="icon"/></span></li>
                                        <li><span><img src="/images/brand2.png" alt="icon"/></span></li>
                                        <li><span><img src="/images/brand3.png" alt="icon"/></span></li>
                                        <button className="btn2ul">+</button>
                                    </ul> */}
                                            </h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>Profession</b> <span>{this.state.input.professionview}</span></h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>Subcategory Profession</b> <span>{this.state.input.subprofessionview}</span></h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>Working Days</b>
                                                <span>{this.state.input.days}</span>
                                            </h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>From Time</b>
                                                <span>{(this.state.from == false) ? '00:00' : this.state.from} </span>
                                            </h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>To Time</b>
                                                <span>{(this.state.to == false) ? '00:00' : this.state.to} </span>
                                            </h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>Summary</b>
                                                <span>{this.state.input.description}</span>
                                            </h4>
                                        </div>z
                                        <div className="tes">
                                            <h4><b>Mobile Number</b> <span>{this.state.input.mobile}</span></h4>
                                        </div>
                                        <div className="tes">
                                            <h4><b>Address</b>
                                                <span>{this.state.input.address}</span>
                                            </h4>
                                        </div>


                                        <div className="tes">
                                            <h4><b>Business Card</b>
                                                <div className="row">
                                                    {businesscardimages.map((businesscardimage, i) => (
                                                        <div className="col-sm-6 mb-2">
                                                            <img className="cart w-100" src={businesscardimage} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                <div id="posts" className="tab-pane fade show active">
                                    <h3>Posts</h3>
                                    <div className="listusr help Postall">
                                        <div className="row">

                                            {this.state.postsdata.map((resultp) => {
                                                return (
                                                    <>
                                                        <div className="col-sm-6 col-lg-6  mb-3">
                                                            <div className="singleposttest">
                                                                <div className="asuser mb-0">
                                                                    <span className="userimg"><img src={resultp.userimage} align="icon" /></span>
                                                                    <h5>{resultp.username}<a className="d_report" data-toggle="modal"  data-target={'#exampleModalHelp'+resultp.id}>Report</a>
                                                                    </h5>
                                                                    <p>{resultp.created} Ago</p>
                                                                </div>
                                                                <div className="contants">
                                                                    <p>{resultp.posts}</p>
                                                                    <Link to={`/userdashboard?comment=${resultp.posts}`}>View more <i className="fas fa-long-arrow-alt-right"></i></Link>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="modal fade" id={'exampleModalHelp'+resultp.id} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                                <div className="modal-content HelpForm">
                                                                    <div className="modal-header ghg">
                                                                        <h5 className="modal-title" id="exampleModalLongTitle">Report</h5>
                                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <form onSubmit={this.handleReportSubmit} data-id={resultp.id} postuser={resultp.postuser}>
                                                                        <div className="modal-body">
                                                                            <div className="row">
                                                                                <div className="col-sm-12">
                                                                                    <div className="form-group">
                                                                                    <h6>Description {this.state.errors.postDescription ? <span style={{color: "red"}}>*</span> : ''}</h6>
                                                                                   <textarea placeholder="Description" value={this.state.input.postDescription} onChange={this.handleChange} id="postDescription" name="postDescription"></textarea>
                                                                                    <div className="text-danger">{this.state.errors.postDescription}</div>                                                 
                                                                                    </div>
                                                                                </div>

                                                                                <div className="modal-footer">
                                                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                                    <button type="submit" className="btn btn-primary submit">Submit</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })}

                                        </div>
                                    </div>
                                </div>




                                <div id="Gallery" className="tab-pane fade">
                                    <h3>Gallery</h3>
                                    <div className="row allvideoimages mt-0">

                                        {galleryimages.map((galleryimage, i) => (
                                            <div className="col-sm-6 col-lg-6 mb-3">
                                                <div className="imagetest">
                                                    {galleryimage.image ? (
                                                        <a href={galleryimage.image} data-fancybox><img className="w-100" src={galleryimage.image} alt="ion" /></a>
                                                    ) : (
                                                        <video width="320" height="240" controls src={galleryimage.video} />

                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div id="Friends" className="addfrbfil tab-pane fade">
                                    <h3>All Friends</h3>
                                    <div className="row">
                                        {this.state.friendsdata.map((result) => {
                                            return (
                                                <div className="col-lg-6 mb-3">
                                                    <div className="testfrnd">
                                                        <span className="userimg">
                                                            {/* <span>
                                            <i className="fas fa-video"></i>
                                            </span> */}
                                                            <img src={result.image} align="icon" /></span>
                                                        <h5>{result.name}</h5>
                                                        <ul className="followmessage">
                                                            <li className="w-100">
                                                                <a className="mg" onClick={() => { window.location.href = "/viewprofile/" + result.name }} style={{ cursor: "pointer" }}>View Profile</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div id="followers" className="addfrbfil tab-pane fade">
                                    <h3>All Followers</h3>
                                    <div className="row">
                                        {this.state.followers.map((resultfo) => {
                                            return (
                                                <div className="col-lg-6 mb-3">
                                                    <div className="testfrnd">
                                                        <span className="userimg">
                                                            {/* <span><i className="fas fa-video"></i></span
                                                > */}
                                                            <img src={resultfo.image ? resultfo.image : "/images/useri_1.png"} align="icon" /></span>
                                                        <h5>{resultfo.name}</h5>
                                                        <ul className="followmessage">
                                                            <li>
                                                                <a className="mg" style={{ cursor: "pointer" }} onClick={() => { window.location.href = "/viewprofile/" + resultfo.name }}>View Profile</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>

                                <div id="following" className="addfrbfil tab-pane fade">
                                    <h3>All Following</h3>
                                    <div className="row">
                                        {this.state.followingdata.map((results) => {
                                            return (
                                                <div className="col-lg-6 mb-3">
                                                    <div className="testfrnd">
                                                        <span className="userimg">
                                                            {/* <span><i className="fas fa-video"></i></span> */}
                                                            <img src={results.image} align="icon" /></span>
                                                        <h5>{results.name}</h5>
                                                        <ul className="followmessage">
                                                            <li>
                                                                <a className="mg" onClick={() => { window.location.href = "/viewprofile/" + results.friendid + '/' + results.name }}>View Profile</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>



                                <div id="Membership" className="tab-pane fade">
                                    <h3>Membership</h3>
                                    <div className="row">
                                        {plans.map((plan, i) => (

                                            <div className="col-lg-4 mb-3">
                                                <div className="testup">
                                                    <div className="test">
                                                        <div className="head_me">
                                                            <h5>{plan.duration} Plan
                                                                {this.state.input.plan == plan.id ? (
                                                                    <span style={{ float: 'right', color: 'red' }}>{this.state.input.planstatus}</span>
                                                                ) : (
                                                                    <span></span>
                                                                )}
                                                            </h5>
                                                            <h4>${plan.price}</h4>
                                                        </div>
                                                        <h5>Features</h5>
                                                        <ul>
                                                            {plan.quickposting ? (
                                                                <li>Quick Posting using feed along with features like attaching photo, video, tagging user and themselves too and using emojis</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.messageboard ? (
                                                                <li>Posting on Message board to start a discussion</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.markingprofile ? (
                                                                <li>Marking profile hidden while adding comments</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.customprofile ? (
                                                                <li>Creating custom profile page with different colour theme, Banner, photos, video, bio, URL and Location</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.feed ? (
                                                                <li>Posting feed or Discussion thread as private with custom duration and password access with share function</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.membershiprenewal ? (
                                                                <li>To get discounts on membership renewal by allowing ads on profile page</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.chatvideo ? (
                                                                <li>To receive requests for chat , video call and Help information</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.galleryfiles ? (
                                                                <li>Multiple delete of gallery files</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.posts ? (
                                                                <li>Search posts by date</li>
                                                            ) : (
                                                                <li></li>
                                                            )}

                                                            {plan.livevideo ? (
                                                                <li>Live video streaming</li>
                                                            ) : (
                                                                <li></li>
                                                            )}


                                                        </ul>

                                                        <button className="btn btn-primary">Choose Plan</button>


                                                        {this.state.input.plan == plan.id ? (
                                                            <button style={{ float: 'right' }} className="btn btn-success">Current Plan</button>
                                                        ) : (
                                                            <span></span>
                                                        )}

                                                        {this.state.input.plan == plan.id ? (
                                                            <h5 >Renew on: <span> {this.state.input.expireddate}</span>
                                                            </h5>
                                                        ) : (
                                                            <span></span>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>

                                        ))}


                                    </div>
                                </div>

                                <div id="Advertisement" class="tab-pane fade">
                                    <h3>Advertisement</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>

                            </div>
                       {this.state.advertisementData.type == 2 && this.state.advertisementModal == false ? 
                        <div className="psotiv_right2">
                                <a><i className="fas fa-times" onClick={() => {
                                    // this.state.advertisementModal = true;
                                    // this.state.showModal = false
                                    this.setState({advertisementModal:true,showModal:false});
                                    console.log("this.state.advertisementModal", this.state.advertisementModal);
                                    console.log("this.state.showModal", this.state.showModal);
                                }
                                }></i></a>
                                <div className="inpost">
                                     <><h5>Advertisement</h5>
                                            <img className="w-100" src={this.state.advertisementData.post} align="icon" style={{ height: "300px" }} />
                                            <div className="intap">
                                                <h6>{this.state.advertisementData.description}</h6>
                                            </div>
                                            <a href={this.state.advertisementData.link}>Click Here</a>
                                        </>
                                      
                                </div>
                            </div> : ""}
                        </div>
                    </div>

                    <div className={`modal fade WelcomeModal ${this.state.showModal ? 'show' : ''}`}
                        style={{
                            display: `${this.state.showModal ? 'block' : 'none'}`,
                        }}
                        id="WelcomeModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog " role="document">
                            <div className="modal-content">
                                <form onSubmit={this.handleHelp}>
                                    <div className="modal-header">
                                        <h4 className="modal-title">Help</h4>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <select value={this.state.input.category} name="category" id="category" className="form-control" onChange={this.handleChange}>
                                                <option key="" value="">--Select Category--</option>
                                                {this.state.category.map((result) => {
                                                    return (
                                                        <option key={result.id} value={result.catname} data-set="check">{result.catname}</option>
                                                    )
                                                })}
                                            </select>
                                            <div className="text-danger">{this.state.errors.category}</div>
                                        </div>

                                        <div className="form-group">
                                            <textarea className="form-control" id="message" name="message" rows="4" cols="50" onChange={this.handleChange}></textarea>
                                            <div className="text-danger">{this.state.errors.message}</div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-success">Submit</button>
                                        <button type="button" className="btn btn-danger" onClick={this.closepopup.bind(this)}>Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>



                </section>
            </span>
        )
    }
}

export default Viewprofile;