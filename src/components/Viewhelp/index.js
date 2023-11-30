import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Viewhelp extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        data: [],
        input: {},
        errors: {},
        helpposts:[],
        helpcomments: [],
        values : '',
        hidecomment: ''
        
       }
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       this.commentSubmit = this.commentSubmit.bind(this);

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
        if(this.validate()){
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            const currentUrl = window.location;
            const formData = new FormData();
            console.log("curentlogin.value", curentlogin.value)
            formData.append('id', this.props.match.params.id);
            formData.append('userid', curentlogin.value);
            formData.append('category', this.state.input.category);
            formData.append('description', this.state.input.description);
            formData.append('post_page', currentUrl);
            axios.post('https://domaintobesocial.com/domaintobe/reporthelpost',
                formData
            )
            .then((res) => {
                if(res.data.message == 'success'){
                    alert('Successfully submit');
                    window.location.reload();
                }else{
                    alert(res.data.message);
                }
            })
            .catch((error) => {
                alert('Invalid Login1');
            })

        }
    }

    validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;

      if (!input["category"]) {
        isValid = false;
        errors["category"] = "Please select category.";
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

    likePost = () => {
        let userid = JSON.parse(window.localStorage.getItem("user"));
        let routeState = JSON.parse(window.localStorage.getItem("routeState"));

        const formData = new FormData();
        formData.append('id', this.props.match.params.id);
        formData.append('userid', userid.value);
        formData.append('postuser', this.state.helpposts[0].userid);
        formData.append('postdes', this.state.helpposts[0].description);
        axios.post('https://domaintobesocial.com/domaintobe/helppostlike',
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

    commentSubmit(event) {
        event.preventDefault();
        if(this.validates()){
            let userid = JSON.parse(window.localStorage.getItem("user"));
            let routeState = JSON.parse(window.localStorage.getItem("routeState"));

            const formData = new FormData();
            formData.append('id', this.props.match.params.id);
            formData.append('user', userid.value);
            formData.append('comment', this.state.input.comment);
            formData.append('hidecomment', this.state.hidecomment);
            formData.append('emailuser', this.state.helpposts[0].userid);
            formData.append('description', this.state.helpposts[0].description);
            formData.append('emailname', this.state.helpposts[0].name);
            formData.append('email', this.state.helpposts[0].email);
            formData.append('discussionuser', document.getElementById("discussionuser").value);
            axios.post('https://domaintobesocial.com/domaintobe/commenthelppost',
                formData
            )
            .then((res) => {
            if(res.data.message == 'success')
            {   
                // document.getElementById("commentext").value = '';

                let input = this.state.input;
                input.comment = '';
                this.setState({
                  input
                });
                event.target.reset();

                this.componentDidMount();
            }else{
                alert(res.data.message);
            }
              
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
    }

     validates(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;

      if (!input["comment"]) {
        isValid = false;
        errors["comment"] = "Please enter comment.";
      }

      this.setState({
        errors: errors
      });
  
      return isValid;
    }


    componentDidMount() {
       
        const formData = new FormData();
        formData.append('id', this.props.match.params.id);
        axios.post('https://domaintobesocial.com/domaintobe/viewsinglehelp',
            formData
        )
        .then((res) => {
            this.setState({helpposts: res.data.message});
        })
        .catch((error) => {
            alert('Invalid Login1');
        })

        const formData1 = new FormData();
        formData1.append('id', this.props.match.params.id);
        axios.post('https://domaintobesocial.com/domaintobe/gethelpcomments',
            formData1
        )
        .then((response) => {
            this.setState({helpcomments: response.data.message});
        })
        .catch((error) => {
            alert('Invalid Login1');
        })

        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        const formData2 = new FormData();
        formData2.append('id', curentlogin.value);
        formData2.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
        formData2
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


    }

    openLikereply = (i,id)  => {
        let userid = JSON.parse(window.localStorage.getItem("user"));

        const formData = new FormData();
        formData.append('userid', userid.value);
        formData.append('id', id);
        formData.append('postid', this.props.match.params.id);
        axios.post('https://domaintobesocial.com/domaintobe/likereplyhelp',
            formData
        )
        .then((res) => {
       
            if(res.data.message == 'Liked')
            {   
                this.componentDidMount();
            }else if(res.data.message == 'Like'){
               this.componentDidMount();
            }else{
                alert(res.data.message);
                this.componentDidMount();
            }
          
        })
        .catch((error) => {
        console.log(error.message);
        })
    };

    handleGetreply(i, e) {
        this.setState({
          values: { ...this.state.values, [i]: e.target.value }
        });
    }

    openReplycomment = (i,id)  => {
        document.getElementById(id).style.display = "block";
    }

    handleReplysubmit(i, e){
        e.preventDefault();

        let userid = JSON.parse(window.localStorage.getItem("user"));
        let routeState = JSON.parse(window.localStorage.getItem("routeState"));
        const formData = new FormData();
        formData.append('postid', this.props.match.params.id);
        formData.append('userid', userid.value);
        formData.append('comment', this.state.values[i]);
        formData.append('replyid', e.target.attributes['data-tag'].value);
        axios.post('https://domaintobesocial.com/domaintobe/relpyhelpcomments',
            formData
        )
        .then((res) => {
        if(res.data.message == 'success')
        {   
            document.getElementById("reply"+e.target.attributes['data-tag'].value).value = '';
            document.getElementById(e.target.attributes['data-tag'].value).style.display = "none";
            this.componentDidMount();
        }else{
            alert(res.data.message);
            this.componentDidMount();
        }
          
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

    handleHidecomment(e){
        if (e.target.checked){
            this.setState({hidecomment:e.target.value});
        } else {
            this.setState({hidecomment:''});
        }
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

        let userid = JSON.parse(window.localStorage.getItem("user"));

        return (
            <section className="maindiv ">
                <i className="fas fa-bars side_b"></i>
                <div className="sidbar_left">
                    <i className="fas fa-times side_b close"></i>
                    <div className="logo">
                        <Link to="/userdashboard">
                            <img src="/images/logo.png" alt="logo"/>
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
                        <li><Link to="/blocklist"><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                        <li><Link to="/viewnotifications" ><span><img src="/images/iconS6.png" align="icon"/></span> Notifications</Link></li>
                        {/* <li><Link to="pagesliked" ><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li> */}
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
                                <Link to="/help" className="active" >
                                Help</Link>
                            </li>
                            {/* <li><Link to="/blog" >Blog</Link></li> */}
                        </ul>
                         <div className="side_right">
                    <div className="asuser">
                        <Link to="/userprofile">
                            <span className="userimg"><img className="w-100" src={this.state.userimage} align="icon"/></span>
                            {vipimage}
                            <h5>{this.state.input.name}</h5>
                        </Link>
                        {/* <div className="dropdown">
                            <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="/images/setting.png" align="icon"/>
                            </span>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <Link className="dropdown-item" to="/userprofile">My Profile</Link>
                                <button className="dropdown-item" onClick={this.handleChangeLogout.bind(this)}>Logout</button>
                            </div>
                        </div> */}
                       
                    </div>
                    <span className="logout" onClick={this.handleChangeLogout.bind(this)} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Logout</span>
                </div>

                    </div>

                <div className="in_center in_center_discussion help ">

                    <div className="head" style={{display:  'none' }}>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn" type="submit"><img src="/images/searchicon.png" alt="icon"/> </button>
                        </form>
                    </div>

                    {this.state.helpposts.length > 0  ? 
                        <div className="listusr discussion help mt-0">
                            {this.state.helpposts.map((result) => {
                            return (
                            <div className="test">
                                <div className="categoryhd">
                                    <h3>Help Post</h3>
                                    {/* <h5 className="mb-4 ctga">Category  <span>{result.category}</span></h5> */}
                                    <input type="hidden" value={result.userid} id="discussionuser"/>
                                </div>
                                <div className="asuser">
                                    <span className="userimg"><img src={result.userimage} align="icon"/></span>
                                    <h5>{result.name}<a className="d_report" data-toggle="modal" data-target="#exampleModalHelp">Report</a>
                                    </h5>
                                    <p>{result.created} Ago</p>
                                    {/* <div className="dropdown">
                                        <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-ellipsis-h"></i>
                                        </span>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div> */}
                                    <p>{result.description}</p>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="testin mt-0 h-auto">
                                                <img className="w-100" src={result.image} alt="ion"/>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="likecomment">
                                        <li onClick={this.likePost}><img src="/images/like.png" alt="ion"/> {result.likes}</li>
                                        <li><img src="/images/comment.png" alt="ion"/>{result.comments}</li>
                                    </ul>
                                </div>
                                </div>
                            )
                            })}

                            <div className="allcomment">
                                {console.log("helpcomments", this.state.helpcomments)}
                            {this.state.helpcomments.length > 0 ? this.state.helpcomments.map((results, i) => 
                            <>{results.hidecomment=="1" && this.state.isViprole!==false ? 
                                <div className="commentin">
                                    <span className="userimg"><img className="w-100" src={results.image} align="icon"/></span>
                                    <div style={{display: "flex"}}><h5>{results.name}</h5>
                                   &nbsp; &nbsp;<h6>{`(${results?.created} Ago)`}</h6></div>
                                    <p>{results.comment}
                                    </p>
                                    <ul className="likecomment">
                                        <li onClick={() => this.openLikereply(i, results.id)}><img src="/images/like1.png" alt="ion"/>{results.commentlike}</li>
                                        <li onClick={() => this.openReplycomment(i, results.id)}><img src="/images/reply.png" alt="ion"/> Reply</li>
                                    </ul>
                                    <form className="replyid" data-tag={results.id} id={results.id}  onSubmit={this.handleReplysubmit.bind(this, i)}>
                                    <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply'+results.id} value={this.state.values[i]} name={this.state.values[i]} onChange={this.handleGetreply.bind(this, i)}/>
                                        <button className="comment" type="submit">Comment</button>
                                    </form>
                                </div>

                             : <>
                             
                             {results.hidecomment=="1" && userid.value==results.discussionuser ? 
                             
                             <div className="commentin">
                                    <span className="userimg"><img className="w-100" src={results.image} align="icon"/></span>
                                    <div style={{display: "flex"}}><h5>{results.name}</h5>
                                    &nbsp;&nbsp;<h6>{`(${results?.created} Ago)`}</h6></div>
                                    <p>{results.comment}
                                    </p>
                                    <ul className="likecomment">
                                        <li onClick={() => this.openLikereply(i, results.id)}><img src="/images/like1.png" alt="ion"/>{results.commentlike}</li>
                                        <li onClick={() => this.openReplycomment(i, results.id)}><img src="/images/reply.png" alt="ion"/> Reply</li>
                                    </ul>
                                    <form className="replyid" data-tag={results.id} id={results.id}  onSubmit={this.handleReplysubmit.bind(this, i)}>
                                    <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply'+results.id} value={this.state.values[i]} name={this.state.values[i]} onChange={this.handleGetreply.bind(this, i)}/>
                                        <button className="comment" type="submit">Comment</button>
                                    </form>
                                </div>
                             
                             : <>
                             
                             {results.hidecomment=="0" ? 
                             
                             <div className="commentin">
                                    <span className="userimg"><img className="w-100" src={results.image} align="icon"/></span>
                                    <div style={{display: "flex"}}><h5>{results.name}</h5>
                                    &nbsp;&nbsp;<h6>{`(${results?.created} Ago)`}</h6></div>
                                    <p>{results.comment}
                                    </p>
                                    <ul className="likecomment">
                                        <li onClick={() => this.openLikereply(i, results.id)}><img src="/images/like1.png" alt="ion"/>{results.commentlike}</li>
                                        <li onClick={() => this.openReplycomment(i, results.id)}><img src="/images/reply.png" alt="ion"/> Reply</li>
                                    </ul>
                                    <form className="replyid" data-tag={results.id} id={results.id}  onSubmit={this.handleReplysubmit.bind(this, i)}>
                                    <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply'+results.id} value={this.state.values[i]} name={this.state.values[i]} onChange={this.handleGetreply.bind(this, i)}/>
                                        <button className="comment" type="submit">Comment</button>
                                    </form>
                                </div>
                             
                             : ""}

                             </>}
                             
                             </> }</>                            
                            
                            ):"" }
                            </div>

                            <div className="likeshare">
                                <form onSubmit={this.commentSubmit}>
                                {(isViprole) ?
                                   <div className="pcheck"><input type="checkbox" value="1" onChange={this.handleHidecomment.bind(this)}/>Hide comment</div>
                                : ""}
                                    <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search" name="comment" value={this.state.input.comment} onChange={this.handleChange} autoComplete="off"  id="commentext"/>
                                    <div className="text-danger">{this.state.errors.comment}</div>
                                    <button className="comment" type="submit">Comment</button>
                                </form>
                            </div>
                        </div>
                    :
                        <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    }

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
                                            <label>Categories</label>
                                            <select value={this.state.input.category} onChange={this.handleChange} name="category" id="category">
                                                <option key="" value="">--Select Category--</option>
                                                <option key="Abuse" value="Abuse">Abuse</option>
                                                <option key="Anti-bullying" value="Anti-bullying">Anti-bullying</option>
                                            </select>
                                            <div className="text-danger">{this.state.errors.category}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea placeholder="Description" value={this.state.input.description} onChange={this.handleChange} id="description" name="description"></textarea>
                                            <div className="text-danger">{this.state.errors.description}</div>
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
        )

    }

}

export default Viewhelp;