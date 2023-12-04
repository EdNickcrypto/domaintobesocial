import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import firebase from 'firebase';
import swal from 'sweetalert';
import $ from "jquery";
class Messages extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        input: {},
        errors: {},
        friendsdata: [],
        chatid: '',
        chatusername: '',
        chatuserimage: '',
        chatingdata: [],
        files: [],
        imagesPreviewUrls: [],
        currentusername: '',
        currentuserimage: '',
        notificationcount: '',
        filterValue: null,
       }
       this.handleChange = this.handleChange.bind(this);
       this._handleImageChange = this._handleImageChange.bind(this);
    }
    _handleImageChange(e) {
        e.preventDefault();
        let files = Array.from(e.target.files);

        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                const filesize = Math.round((file.size / 1024));
                if(filesize > 2048){
                    swal("!Oops", "File too large, please select a file less than 2mb", "error");
                }else{
                    this.setState({    
                        files: [...this.state.files, file],
                        imagesPreviewUrls: [...this.state.imagesPreviewUrls, reader.result]
                    });
                }
            }
            reader.readAsDataURL(file);
        });
    }
    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({
          input
        });
    }
    handleFilterChange = (event) => {
        const value = event.target.value;
        this.setState({ filterValue: value === '' ? null : value });
      };

    validate(){
        let input = this.state.input;
        let errors = {};
        let isValid = true;
     
        if (!input["message"]) {
          isValid = false;
          errors["message"] = "Please add message.";
        }

        this.setState({
            errors: errors
        });
      
        return isValid;
    }

    openPop(){
    // alert('asdfasdf');
    $(".maindiv").toggleClass("main");
}

openClose(){
    $(".maindiv").toggleClass("main");
    }
    componentDidMount() {
        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        // document.getElementById('loadingicon').style.display = 'block';
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfriendlist',formData )
        .then((response) => {
            console.log(response);
            if(response.data.status = 'data'){
                this.setState({friendsdata: response.data.message});
            }else{
                alert(response.data.message);
            }

        })
        .catch((error) => {
            console.log(error.message);
        })

        const formData100 = new FormData();
        formData100.append('id', curentlogin.value);
        formData100.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/countnotifications',formData100 )
        .then((resp) => {
            this.setState({ notificationcount: resp.data.message });
        })
        .catch((error) => {
            // console.log(error.message);
        })


        const formData1 = new FormData();
        formData1.append('id', curentlogin.value);
        formData1.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
        formData1
            )
        .then((res) => {
            this.setState({
                currentusername: res.data.message.name
            });

            let input = this.state.input;
            input.name = res.data.message.name;
            input.uid = res.data.message.id;
            this.setState({
              input
            });

            if(res.data.message.roles == 'vip'){
               
                this.setState({formfilled: res.data.message.formfilled});
                
                this.setState({isViprole: true});
            }else{
                this.setState({isViprole: false});
            }

            
            if((res.data.message.image == null) || (res.data.message.image == '') ){
                this.setState({userimage: '/images/blank.png'});
            }else{
                this.setState({userimage: res.data.message.image});
            }

        
            if((res.data.message.image == null) || (res.data.message.image == '') ){
                this.setState({currentuserimage: '/images/blank.png'});
            }else{
                this.setState({currentuserimage: res.data.message.image});
            }
          
        })
        .catch((error) => {
            console.log(error.message);
        })


        const db = firebase.database();
        
        db.ref("lastchat/" + curentlogin.value).on("value", snapshot => {
            let check = snapshot.val();
            if(check == null){
                this.setState({
                    chatuserimage: './images/blank.png'
                });
            }else{

                this.setState({
                    chatid: check.uid,
                    chatusername: check.name,
                    chatuserimage: check.image
                });

                const sender = curentlogin.value+'_'+check.uid;
                db.ref("chat/" + sender).on("value", snapshot => {
                    let chatingdatas = [];
                    snapshot.forEach(snap => {
                                               chatingdatas.push(snap.val());
                    });
                                        this.setState({ chatingdata: chatingdatas },()=>
                    {
                        $(".dddd").stop().animate({ scrollTop: $(".dddd")[0].scrollHeight}, 1000);
                    });
                });

            }
        });
        // document.getElementById('loadingicon').style.display = 'none';
        
    }

    selectUser = (i,friendid,name,image)  => {
        this.setState({
            chatid: friendid,
            chatusername: name,
            chatuserimage: image
        });

        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        const db = firebase.database();
        const sender = curentlogin.value+'_'+friendid;

        db.ref("chat/" + sender).on("value", snapshot => {
            let chatingdatas = [];
            snapshot.forEach(snap => {
                chatingdatas.push(snap.val());
            });
            this.setState({ chatingdata: chatingdatas });
        });
    }
    selectUserfordelete = (i,friendid,name,image)  => {
        this.setState({
            chatid: friendid,
            chatusername: name,
            chatuserimage: image
        });

        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        const db = firebase.database();
        const sender = curentlogin.value+'_'+this.state.chatid;
        const reciever = this.state.chatid+'_'+curentlogin.value;

        db.ref(`chat/${sender}`).remove()
        .then(() => {
          console.log('Data for sender deleted successfully');
        })
        .catch((error) => {
          console.error('Error removing data for sender:', error);
        });
      
      // Remove data for receiver
      db.ref(`chat/${reciever}`).remove()
        .then(() => {
          console.log('Data for receiver deleted successfully');
        })
        .catch((error) => {
          console.error('Error removing data for receiver:', error);
        });
    }
    
    submitChat(e){
        e.preventDefault();
        let curentlogin = JSON.parse(window.localStorage.getItem("user"));

        const sender = curentlogin.value+'_'+this.state.chatid;
        const reciever = this.state.chatid+'_'+curentlogin.value;
        //const timestamp = Date.now();
        const db = firebase.database();
        //console.log('time',timestamp);
        console.log(this.state.imagesPreviewUrls )
        var time = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        if(this.state.imagesPreviewUrls.length!==0) { const formData = new FormData();
            this.state.files.forEach((file) => formData.append('files[]', file));
            formData.append('tagged', JSON.stringify(this.state.checkedItems));
            axios.post('https://domaintobesocial.com/domaintobe/chatimage',
                formData
            )
            .then((res) => {
               
                db.ref("chat/" + sender).push({
                    read: 'y',
                    side: 'right',
                    msg: this.state.input.message+ ' ' + res.data.message?res.data.message:'',
                    image:this.state.userimage,
                    time: time
                    
                });

                db.ref("chat/" + reciever).push({
                    read: 'n',
                    side: 'left',
                    msg: this.state.input.message+ ' ' + res.data.message?res.data.message:'',
                    image:this.state.userimage,
                    time: time
                });
                this.setState({imagesPreviewUrls: []})
                this.setState({files: []})
                
               
            })

            .catch((error) => {
            console.log(error.message);
            })}
        if(this.validate()){

        

            // console.log('chatuser',this.state.chatuserimage);
            // console.log('myimage',this.state.currentuserimage);

            
            db.ref("chat/" + sender).push({
                read: 'y',
                side: 'right',
                msg: this.state.input.message,
                image:this.state.currentuserimage,
                time: time
                
            });

            db.ref("chat/" + reciever).push({
                read: 'n',
                side: 'left',
                msg: this.state.input.message,
                image:this.state.currentuserimage,
                time: time
            });

            db.ref("chatwith/" + curentlogin.value+"/"+this.state.chatid).set({
                uid: this.state.chatid,
                name: this.state.chatusername,
                image:this.state.chatuserimage,
                msg: this.state.input.message,
                time: time
            });

            db.ref("chatwith/" + this.state.chatid+"/"+curentlogin.value).set({
                uid: curentlogin.value,
                name: this.state.currentusername,
                image:this.state.currentuserimage,
                msg: this.state.input.message,
                time: time
            });

            db.ref("lastchat/" + curentlogin.value).set({
                uid: this.state.chatid,
                name: this.state.chatusername,
                image:this.state.chatuserimage,
                msg: this.state.input.message,
                time: time
            });

            db.ref("chat/" + sender).on("value", snapshot => {
                let chatingdatas = [];
                snapshot.forEach(snap => {
                    chatingdatas.push(snap.val());
                });
                this.setState({ chatingdata: chatingdatas },()=>
                {
                    $(".dddd").stop().animate({ scrollTop: $(".dddd")[0].scrollHeight}, 1000);
                });
            });

            let input = this.state.input;
            input.message = "";
           
            this.setState({
              input
            });
            
        }
    }

    handleChangeLogout()
    {
    window.localStorage.clear();
    window.location.reload();
    }
   showuser=()=>{
    let modal = document.getElementById("plist");
    modal.style.display ="block"; 
    modal.style.left ="0";
        }
        hideuser = () => {
            let modal = document.getElementById("plist");
            modal.style.display = "none"; // Hide the element
            modal.style.left = "400px"; // Set the left position to 400 pixels (or any other value with a unit)
        }
        

    render() {
        const { initialData, filterValue } = this.state;

        // Apply filter and map data
        const filteredData = filterValue
          ? this.state.friendsdata.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
          : this.state.friendsdata;

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
            <section className="maindiv pr-0">
    <i className="fas fa-bars side_b"onClick={this.openPop.bind(this)}></i>
    <div className="sidbar_left">
        <i className="fas fa-times side_b close"  onClick={this.openClose.bind(this)}></i>

        <div className="logo">
            <Link to="/userdashboard">
                <img src="images/logo.png" alt="logo"/>
            </Link>
        </div>
        <ul>
            <li><Link to="/userdashboard"><span><img src="/images/iconS1.png" align="icon"/></span> News Feed</Link></li>
            <li><Link to="/userprofile"><span><img src="images/useri_1.png" align="icon"/></span> My Profile</Link></li>
            <li><Link to="/messages" className="active"><span><img src="/images/iconS2.png" align="icon"/></span> Messages</Link></li>
            <li><Link to="/requests"><span><img src="/images/iconS3.png" align="icon"/></span> Requests</Link></li>
            <li><Link to="/followers" ><span><img src="/images/iconS4.png" align="icon"/></span> My Followers</Link></li>
            <li><Link to="/blocklist"><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
            <li><Link to="/viewnotifications"><span><i className="fas fa-bell" style={{color:'#ffdc5d'}}><sup style={{color:'#ff0000d6'}}>{this.state.notificationcount}</sup></i></span> Notifications</Link></li>
            {/* <li><Link to="pagesliked" ><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li> */}
            <li><Link to="/favorites"><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
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
                            <img src="images/setting.png" align="icon"/>
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

    {/* <div className="in_center in_center_discussion messagesmain pr-0">
    
        <div className="messages chats">
            <div className="list">
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={filterValue || ''}
          onChange={this.handleFilterChange}/>
                    <button className="btn btn-outline-success" type="submit"><i className="fas fa-search"></i></button>
                </form>
                {this.state.friendsdata.length > 0  ?
                    <div className="nwekaptest">
                        {filteredData.map((result,i) => {
                            return (<>
                            <div className="test" onClick={() => this.selectUser(i,result.friendid,result.name,result.image)}>
                                <div className="images">
                                    <img src={result.image} alt="user"/>
                                </div>
                                <h4>{result.name}</h4> <i onClick={() => this.selectUserfordelete(i,result.friendid,result.name,result.image)} class="fas fa-trash-alt"></i>
                                

                            </div>
                            </>)
                        })}
                    </div>
                :
                "No user found"
                }

            </div>
            
            <div className="row message-box">
                <div className="col-12">
                    <div className="innchat">
                        <div className="scroll_chat">
                            <h4><img src={this.state.chatuserimage} alt="user"/> Chat With {this.state.chatusername}</h4>
                            <div className="dddd">
                                <div className="row">
                                {this.state.chatingdata.map((chat,i) => {  
                                    return (
                                        <span className="w-100">
                                        { chat.side == 'left' ? 
                                            <div className="col-12 inleft message">
                                                <div className="chatin">
                                                {chat.msg.endsWith('.mp4') ? (
                        <video className='chatvideo' controls>
                            <source src={chat.msg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) :chat.msg.endsWith('.png') || chat.msg.endsWith('.jpg') ? (
                       <img src={chat.msg} alt="Image" className='chatimage' style={{ height: '100px', position: 'relative' }} />

                    ) : (
                        <p>{chat.msg} <span>{chat.time}</span></p>
                    )}
                                                   
                                                </div>
                                            </div>
                                        
                                        : 
                                            <div className="col-12 inright text-right message">
                                            <div className="chatin">
                                            {chat.msg.endsWith('.mp4') ? (
                        <video className='chatvideo' controls>
                            <source src={chat.msg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : chat.msg.endsWith('.png') || chat.msg.endsWith('.jpg') ? (
                        <img src={chat.msg} alt="Image" className='chatimage' style={{ height: '100px', position: 'relative' }} />

                    ) : (
                        <p>{chat.msg} <span>{chat.time}</span></p>
                    )}
                                               
                                            </div>
                                            </div>
                                        
                                        }
                                        
                                        </span>
                                    )
                                })}
                                </div>
                            </div>
                            <form className="intype" id={this.state.chatusername} onSubmit={this.submitChat.bind(this)}>
                                <input type="text" className="form-control" id="message" autoComplete="off" placeholder="Compose Message" onChange={this.handleChange} value={this.state.input.message} name="message"/>
                                {/* <div className="text-danger">{this.state.errors.message}</div> 
                                <br/>
                                <input id="file-upload" type="file" onChange={this._handleImageChange} style={{ display: 'none' }}  multiple accept="image/ video/*"/>
      
      <img src="images/addicon1.png" align="icon" className='chatuploadfile'   onClick={() => document.getElementById('file-upload').click()}/>
                                <button type="submit"><i className="fas fa-paper-plane"></i> <span>Send</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> */}

    <div className="container">
  <div className="row clearfix">
    <div className="col-lg-12">
      <div className="card chat-app">
        <button className='chatuser btn btn-primary' onClick={this.showuser}>User List</button>
        <div id="plist" className="people-list">
        <button className='chatuser btn btn-primary' onClick={this.hideuser}><i className="fas fa-times side_b close"></i></button>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-search" />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={filterValue || ''}
          onChange={this.handleFilterChange}
            />
          </div>
          <ul className="list-unstyled chat-list mt-2 mb-0">
          {filteredData.length > 0  ?<>
          {filteredData.map((result,i) => {
         
                            return (<>
                          <li className="clearfix"  onClick={() => this.selectUser(i,result.friendid,result.name,result.image)}>
              <img
                src={result.image}
                alt="avatar"
              />
              <div className="about">
                <div className="name">{result.name}</div>
                <div className="status">
                  {" "}
                  Lets chat {result.name}{" "}
                  <i onClick={() => this.selectUserfordelete(i,result.friendid,result.name,result.image)} class="fas fa-trash-alt"></i>
                </div>
              </div>
            </li>
                            </>)
                        })}</>:""}
          
        
          </ul>
        </div>
        <div className="chat">
          <div className="chat-header clearfix">
            <div className="row">
              <div className="col-lg-6">
                <a
                  href="javascript:void(0);"
                  data-toggle="modal"
                  data-target="#view_info"
                >
                <img src={this.state.chatuserimage} alt="user"/>
                </a>
                <div className="chat-about">
                  <h6 className="m-b-0">{this.state.chatusername}</h6>
                  <small>Last seen: 2 hours ago</small>
                </div>
              </div>
              <div className="col-lg-6 hidden-sm text-right">
                <a
                  href="javascript:void(0);"
                  className="btn btn-outline-secondary"
                >
                  <i className="fa fa-camera" onClick={() => document.getElementById('file-upload').click()} />
                </a>
                {/* <a
                  href="javascript:void(0);"
                  className="btn btn-outline-primary"
                >
                  <i className="fa fa-image" />
                </a>
                <a href="javascript:void(0);" className="btn btn-outline-info">
                  <i className="fa fa-cogs" />
                </a>
                <a
                  href="javascript:void(0);"
                  className="btn btn-outline-warning"
                >
                  <i className="fa fa-question" />
                </a> */}
              </div>
            </div>
          </div>
          <div className="chat-history  dddd">
            <ul className="m-b-0">
            {this.state.chatingdata.map((chat,i) => {  
        
    return (<>
             { chat.side == 'left' ? 
             <li className="clearfix">
             <div className="message-data">
               <span className="message-data-time">{chat.time}</span>
             </div>
             <div className="message my-message"> {chat.msg.endsWith('.mp4') ? (
<video className='chatvideo' controls>
<source src={chat.msg} type="video/mp4" />
Your browser does not support the video tag.
</video>
) :chat.msg.endsWith('.png') || chat.msg.endsWith('.jpg') ? (
<img src={chat.msg} alt="Image" className='chatimage' style={{ height: '100px', position: 'relative' }} />

) : (
<p>{chat.msg} </p>
)}</div>
           </li>
           
            : 
                
           
               <li className="clearfix">
               <div className="message-data text-right">
                 <span className="message-data-time">{chat.time}</span>
                 <img
                   src="https://bootdey.com/img/Content/avatar/avatar7.png"
                   alt="avatar"
                 />
               </div>
               <div className="message other-message float-right">
                 {" "}
                 {chat.msg.endsWith('.mp4') ? (
<video className='chatvideo' controls>
<source src={chat.msg} type="video/mp4" />
Your browser does not support the video tag.
</video>
) : chat.msg.endsWith('.png') || chat.msg.endsWith('.jpg') ? (
<img src={chat.msg} alt="Image" className='chatimage' style={{ height: '100px', position: 'relative' }} />

) : (
<p>{chat.msg} </p>
)}{" "}
               </div>
             </li>
            }
              </>)})}
             
              
            </ul>
          </div>
          <div className="chat-message clearfix">
            <div className="input-group mb-0">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-send" />
                </span>
              </div>
              <form  className="form-control p-0" id={this.state.chatusername} onSubmit={this.submitChat.bind(this)}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter text here..."
                onChange={this.handleChange} value={this.state.input.message} name="message"
              />
               <input id="file-upload" type="file" onChange={this._handleImageChange} style={{ display: 'none' }}  multiple accept="image/ video/*"/>
               {this.state.imagesPreviewUrls.length !=0? <button type="submit"><i className="fas fa-paper-plane"></i> <span>upload</span></button> :""}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



</section>
        );
    }
}

export default Messages;