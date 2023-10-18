import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import firebase from 'firebase';
import $ from "jquery";
class Followers extends React.Component { 
    constructor(props)
    {
      super(props);
      this.state = {
        input: {},
        isViprole: false,
        userimage : '/images/blank.png',
        followers: [],
        chatingdata: [],
        popupchat:[],
        inputFields:[],
        showdata:[],
        notificationcount: ''
      };

      this.popupchat=this.popupchat.bind(this);

    }

    handleChangeLogout()
    {
      window.localStorage.clear();
      window.location.reload();
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
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                formData
            )
        .then((response) => {
            document.getElementById('loadingicon').style.display = 'none';
            let input = this.state.input;
            input.name = response.data.message.name;
            input.uid = response.data.message.id;
            this.setState({
              input
            });
            
            if(response.data.message.roles == 'vip'){
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
        axios.post('https://domaintobesocial.com/domaintobe/getfollowers',
                formData1
            )
        .then((response1) => {
            if(response1.data.status = 'data'){
                this.setState({followers: response1.data.message});
            }else{
                alert(response1.data.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
        })

        const db = firebase.database();
        db.ref("chatwith/" + curentlogin.value).on("value", snapshot => {
        let chatingdatas = [];
            snapshot.forEach(snap => {
                chatingdatas.push(snap.val());
            });
        this.setState({ chatingdata: chatingdatas });
        });
    }

    unfollow = (i,id)  => {
        const formData = new FormData();
        formData.append('id', id);
        axios.post('https://domaintobesocial.com/domaintobe/unfollow',
            formData
        )
        .then((res) => {
            console.log(res);
            if(res.data.message == 'Success'){
                this.componentDidMount();
                alert(res.data.message);
            }else{
                alert(res.data.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    openChatbox(id,name,image){
        $('.chat-popup').addClass('main');
        var inds=this.state.showdata.findIndex(function (value) {
            return value.id == id;})
        if(inds==-1){
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            const db =  firebase.database();
    
            db.ref("chat/" + curentlogin.value+'_'+id).on("value", snapshot => {
                let chatingdatas = [];
                snapshot.forEach(snap => {
                    chatingdatas.push(snap.val());
                });
                this.setState({ popupchat: chatingdatas},()=>
                {
                    const key = 'id';
                    let arr = this.state.showdata;
                    arr.push({id:id,name:name,image:image});
                    var newarray=[...new Map(arr.map(item =>
                        [item[key], item])).values()];
                        this.state.inputFields.push({name:""});
                    this.setState({
                        showdata : newarray,inputFields:this.state.inputFields
                    },()=>
                    {
                        $(".chatstart").stop().animate({ scrollTop: $(".chatstart")[0].scrollHeight}, 1000);
                    });
                });
            });
    
        }
        else
        {
            let filteredArray = this.state.showdata.filter(item => item.props.id !== id)
            this.setState({showdata: filteredArray},()=>
            {
                $(".chatstart").stop().animate({ scrollTop: $(".chatstart")[0].scrollHeight}, 1000);
            });
        }
        
    }

    startChat(id,image,name,j,e){
        e.preventDefault();
    
            
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            const sender = curentlogin.value+'_'+id;
            const reciever = id+'_'+curentlogin.value;
            
            const db = firebase.database();
            var time = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
            
            db.ref("chat/" + sender).push({
                read: 'y',
                side: 'right',
                msg: this.state.inputFields[j].name,
                image:this.state.userimage,
                time: time
                
            });
    
            db.ref("chat/" + reciever).push({
                read: 'n',
                side: 'left',
                msg: this.state.inputFields[j].name,
                image:this.state.userimage,
                time: time
            });
    
            db.ref("chatwith/" + curentlogin.value+"/"+id).set({
                uid: id,
                name: name,
                image:image,
                msg: this.state.inputFields[j].name,
                time: time
            });
    
            db.ref("chatwith/" + id+"/"+curentlogin.value).set({
                uid: curentlogin.value,
                name: this.state.input.name,
                image:this.state.userimage,
                msg: this.state.inputFields[j].name,
                time: time
            });
    
            db.ref("lastchat/" + curentlogin.value).set({
                uid: id,
                name: name,
                image:image,
                msg: this.state.inputFields[j].name,
                time: time
            });
            this.state.inputFields[j].name="";
            this.setState({inputFields:this.state.inputFields});
            $(".chatstart").stop().animate({ scrollTop: $(".chatstart")[0].scrollHeight}, 1000);
    }

    popupchat(id)
    {
        let chatingdatas = [];
      
        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        firebase.database().ref("chat/" + curentlogin.value+'_'+id).on("value", snapshot => {
           
            snapshot.forEach(snap => {
                chatingdatas.push(snap.val());
            });
           
            
        });
        return chatingdatas;
    }

    forchanedosage= (index, event) => {
        this.state.inputFields[index].name=event.target.value;
        this.setState({inputFields:this.state.inputFields});
    }

    closeChatbox = (id)  => {
        $('.chat-popup').removeClass('main');
        let filteredArray = this.state.showdata.filter((item,i) => item.id !==id)
    
        this.setState({showdata: filteredArray});
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

        if(isViprole){
            vipimage = <img className="vip" src="/images/vip.png" align="icon"/>;
        }else{
            vipimage = '';
        }

        return ( 
            <section class="maindiv">
                <i className="fas fa-bars side_b"onClick={this.openPop.bind(this)}></i>
    <div className="sidbar_left">
        <i className="fas fa-times side_b close"  onClick={this.openClose.bind(this)}></i>
                    <div class="logo">
                        <Link to="/userdashboard">
                            <img src="images/logo.png" alt="logo"/>
                        </Link>
                    </div>
                    <ul>
                        <li><Link to="/userdashboard"><span><img src="/images/iconS1.png" align="icon"/></span> News Feed</Link></li>
                        <li><Link to="/userprofile"><span><img src="images/useri_1.png" align="icon"/></span> My Profile</Link></li>
                        <li><Link to="/messages" ><span><img src="/images/iconS2.png" align="icon"/></span> Messages</Link></li>
                        <li><Link to="/requests" ><span><img src="/images/iconS3.png" align="icon"/></span> Requests</Link></li>
                        <li><Link to="/followers" className="active"><span><img src="/images/iconS4.png" align="icon"/></span> My Followers</Link></li>
                        <li><Link to="/blocklist" ><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                        <li><Link to="/viewnotifications"><span><i className="fas fa-bell" style={{color:'#ffdc5d'}}><sup style={{color:'#ff0000d6'}}>{this.state.notificationcount}</sup></i></span> Notifications</Link></li>
                        {/* <li><Link to="pagesliked" ><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li> */}
                        <li><Link to="/favorites" ><span><img src="//iconS8.png" align="icon"/></span> Favorites</Link></li>
                    </ul>
                </div>
<div className="main_menu ">
                        <ul>
                            <li><Link to="/userdashboard"  className="active">News Feed</Link></li>
                            <li><Link to="/discussion"  >Discussion</Link></li>
                            <li><Link to="/help" >Help</Link></li> 
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
                <div class="in_center in_center_discussion">
    

                    <div className="head pr-0">
                       <form className="d-flex w-100">
                          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                          <button className="btn" type="submit"><img src="images/searchicon.png" alt="icon"/> </button>
                       </form>
                    </div>

                    <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    
                    <div className="my_followers">
                        <div className="row">
                        { this.state.followers && this.state.followers.length > 0 ? this.state.followers.map((resultfo, i) => {
                            return (
                            <div className="col-lg-6 col-xl-4">
                                <div className="test">
                                    <span className="userimg">
                                        {/* <span><i className="fas fa-video"></i></span> */}
                                        <img src={resultfo.image} align="icon"/></span>
                                    <h5>{resultfo.name}</h5>
                                    <ul className="followmessage">
                                       <li><a onClick={() => this.unfollow(i, resultfo.id)}>Unfollow</a></li>
                                       <li><Link to="/messages" className="mg" href="">Message</Link></li>
                                    </ul>
                                </div>
                            </div>

                            )
                        }): 
                            <div className="norecord">
                                <img src="/images/nodata.png" />
                            </div>
                        }
                        </div>
                    </div>
                    
                   
     <div className="side_right">
        
                    <div className="test showchatt">
                    <h3>Messages list</h3>
                    <div className="all mmss">
                    {this.state.chatingdata.map((chat,i) => {  
                        return (
                        <div className="testin" onClick={() => this.openChatbox(chat.uid,chat.name,chat.image)}>
                            <div className="images">
                                <img src={chat.image} alt="user"/>
                            </div>
                            <h4>{chat.name}</h4>
                            <p>{chat.msg}</p>
                            <h6>{chat.time}</h6>
                        </div>
                        
                        )
                    })}
                    </div>
                </div>
                <div id="display-data-Container" className="chat-popup">
                    {this.state.showdata.map((x,j)=>
                    {
                        return(
                    <div className="appendchatuser" id={x.id}><h1>Chat with {x.name}<button type="button" className="btn cancel" onClick={() => this.closeChatbox(x.id)}><i className="fas fa-times"></i></button></h1><form onSubmit={this.startChat.bind(this, x.id,x.image,x.name,j)} className="form-container"><div className="chatstart">
                    {this.popupchat(x.id) && this.popupchat(x.id).length>0 ? this.popupchat(x.id).map((chat,i) => {  
                        return (
                            <span>
                            { chat.side == 'left' ?
                                <div className="container_left">
                                    <img src={chat.image} alt="Avatar"/>
                                    <p>{chat.msg}</p>
                                    <span className="time-right">{chat.time}</span>
                                </div>
                            : 
                                <div className="container_left darker">
                                    <img src={chat.image} alt="Avatar" className="right"/>
                                    <p>{chat.msg}</p>
                                    <span className="time-left">{chat.time}</span>
                                </div>
                            }
                            </span>
                        )
                    }):"No record found"}
                    </div>
                   
                    <textarea placeholder="Type message.." name="message" autoComplete="off"  onChange={this.forchanedosage.bind(this,j)} value={this.state.inputFields[j].name}></textarea>
                    <button type="submit" name="chatsubmit" className="btn">Send</button></form></div>
                        )
                    })}
                </div>


            </div>

                </div>

           

            </section>
        );
    }
}

export default Followers;