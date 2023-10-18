import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Viewblog extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        // data: [],
        // input: {},
        // errors: {},
        blogposts:[]
        // helpcomments: [],
        // values : ''
        
       }
    //    this.handleChange = this.handleChange.bind(this);
    //    this.handleSubmit = this.handleSubmit.bind(this);
    //    this.commentSubmit = this.commentSubmit.bind(this);

    }

    componentDidMount() {
        const formData = new FormData();
        formData.append('id', this.props.match.params.id);
        axios.post('https://domaintobesocial.com/domaintobe/viewsingleblog',
            formData
        )
        .then((res) => {
            this.setState({blogposts: res.data.message});
        })
        .catch((error) => {
            alert('Invalid Login1');
        })

    }

    likePost = () => {
        let userid = JSON.parse(window.localStorage.getItem("user"));
        let routeState = JSON.parse(window.localStorage.getItem("routeState"));
        const formData = new FormData();
        formData.append('id', this.props.match.params.id);
        formData.append('userid', userid.value);
        axios.post('https://domaintobesocial.com/domaintobe/bloglike',
            formData
        )
        .then((res) => {
        if(res.data.message == 'success')
        {   
            this.componentDidMount();
        }else{
            alert(res.data.message);
        }
          
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
                            <Link to="/userdashboard">
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
                        <li><Link to="/viewnotifications" ><span><img src="/images/iconS6.png" align="icon"/></span> Notifications</Link></li>
                        <li><Link to="pagesliked" ><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li>
                        <li><Link to="/favorites"><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
                    </ul>
                </div>
                <div className="in_center in_center_discussion">
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
                                <Link to="/help">
                                Help</Link>
                            </li>
                            {/* <li><Link to="/blog" className="active" >Blog</Link></li> */}
                        </ul>
                    </div>
                    <div className="head" style={{display:  'none' }}>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn" type="submit"><img src="/images/searchicon.png" alt="icon"/> </button>
                        </form>
                    </div>

                    {this.state.blogposts.length > 0  ? 
                        <div className="listusr discussion help">
                            {this.state.blogposts.map((result) => {
                            return (
                            <div className="test">
                                <div className="categoryhd">
                                    <h3>Blog</h3>
                                </div>
                                <div className="asuser">
                                    <h5>{result.title}</h5>
                                    <p>{result.created} Ago</p>
                                </div>
                                <p>{result.description}</p>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="testin mt-0 h-auto">
                                            <img className="w-100" src={result.image} alt="ion"/>
                                        </div>
                                    </div>
                                </div>
                                <ul className="likecomment">
                                    <li onClick={this.likePost}><img src="/images/like.png" alt="ion"/>{result.likes}</li>
                                </ul>
                                </div>
                            )
                            })}
                        </div>    
                    :
                        <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    }

                    
                </div>


            </section>
        )

    }

}

export default Viewblog;