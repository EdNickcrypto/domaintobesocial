import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import $ from 'jquery';

class Blog extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        // data: [],
        // input: {},
        // errors: {},
        blogs: [],
        // formfilled: 'notempty'
       }

    //    this.handleChange = this.handleChange.bind(this);
    //    this.handleSubmit = this.handleSubmit.bind(this);
    //    this.imageChange = this.imageChange.bind(this);
    }

openPop(){
    // alert('asdfasdf');
    $(".maindiv").toggleClass("main");
}

openClose(){
    $(".maindiv").toggleClass("main");
    }

    componentDidMount() {
        axios.post('https://domaintobesocial.com/domaintobe/getblogs'
        )
        .then((res) => {
          this.setState({blogs: res.data.message});
        })
        .catch((error) => {
            console.log(error.message);
        })

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

        return (
            <section className="maindiv pr-0">
                <i className="fas fa-bars side_b"onClick={this.openPop.bind(this)}></i>
    <div className="sidbar_left">
        <i className="fas fa-times side_b close"  onClick={this.openClose.bind(this)}></i>
                    <div className="logo">
                        <Link to="/userdashboard" >
                            <img src="images/logo.png" alt="logo"/>
                        </Link>
                    </div>
                    <ul>
                    <li>
                            <Link to="/userdashboard">
                            <span><img src="/images/iconS1.png" align="icon"/></span> News Feed</Link>
                        </li>
                        <li><Link to="/userprofile"><span><img src="images/useri_1.png" align="icon"/></span> My Profile</Link></li>
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
                        <li><Link to="/blocklist"><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                        <li><Link to="/viewnotifications" ><span><img src="images/iconS6.png" align="icon"/></span> Notifications</Link></li>
                        <li><Link to="pagesliked"><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li>
                        <li><Link to="/favorites" ><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
                    </ul>
                </div>
                   <div className="main_menu ">
                        <ul>
                            <li>
                                <Link  to="/userdashboard" >
                                News Feed</Link>
                            </li>
                            <li>
                                <Link to="/discussion" >
                                Discussion</Link>
                            </li>
                            <li>
                                <Link to="/help"  >
                                Help</Link>
                            </li>
                            {/* <li><Link to="/blog" className="active">Blog</Link></li> */}
                        </ul>
                    </div>
                <div className="in_center in_center_discussion help pt-0">
                 
                    <div className="head" style={{display:  'none' }}>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn" type="submit"><img src="images/searchicon.png" alt="icon"/> </button>
                        </form>
                    </div>

                    {this.state.blogs.length > 0  ? 

                    <div className="listusr discussion mt-0">
                        <div className="test">
                            <div className="categoryhd">
                                <h3>Blogs</h3>
                            </div>
                            <div className="row">
                            {this.state.blogs.map((result,i) => {
                                return (
                                <div className="col-sm-6 col-lg-4 col-xl-3  mb-3">
                                    <div className="singleposttest">
                                        <div className="asuser mb-0">
                                            <h5>{result.title}
                                            </h5>
                                            <p>{result.created} Ago</p>
                                        </div>
                                        <div className="contants">
                                            <img className="w-100" src={result.image} alt="ion"/>
                                            <p>{result.description}</p>
                                            <Link to={{ pathname: '/viewblog/'+ result.id }}>View more <i className="fas fa-long-arrow-alt-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                                )
                            })}  
        
                            </div>
                        </div>
                    </div>

                    :
                    <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    }



                </div>

            </section>
        )
    }

}

export default Blog;