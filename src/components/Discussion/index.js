import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import firebase from 'firebase';
import Player from "./player";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReactPlayer from "react-player";
import queryString from 'query-string';
import $ from "jquery";
class Discussion extends React.Component { 
    constructor(props)
    {
      super(props);
      this.state = {
        data: [],
        input: {},
        category:[],
        isViprole: false,
        userimage : '/images/blank.png',
        freePosts: true,
        vipPosts:false,
        chatingdata: [],
        categories:[],
        profession:[],
        popupchat:[],
        inputFields:[],
        showdata:[],
        open: false,
        queries:''
       }
       this.handleChange = this.handleChange.bind(this);
       this.popupchat=this.popupchat.bind(this);
     
    }
    handleFilterChange = (event) => {
        const value = event.target.value;
        this.setState({ filterValue: value === '' ? null : value });
      };
    handleChangeLogout()
    {
      window.localStorage.clear();
      window.location.reload();
    }

    onOpenModal = () => {
        this.setState(prevState => ({
          open: !prevState.open
        }));
      };

    freeclick(){
        this.setState({freePosts: !this.state.freePosts});
        this.setState({vipPosts: false});
        if(!this.state.vipPosts){ this.setState({freePosts: true}); }
    }
    vipclick(){
        this.setState({vipPosts: !this.state.vipPosts});
        this.setState({freePosts: false});
        if(!this.state.freePosts){ this.setState({vipPosts: true}); }
    }

    componentDidMount() {


        axios.get('https://domaintobesocial.com/domaintobe/category').then(response => 
        {const sortedCategories = [...response.data.message];

            // Sort the categories array alphabetically based on the 'catname' property
            sortedCategories.sort((a, b) => {
              const nameA = a.catname.toUpperCase(); // Ignore case for comparison
              const nameB = b.catname.toUpperCase(); // Ignore case for comparison
            
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0; // Names are equal
            });
            this.setState({categories: sortedCategories});
        });
        
        const formData12 = new FormData();
        formData12.append('id', '16');
        axios.post('https://domaintobesocial.com/domaintobe/getprofessions',
        formData12).then(response1 => 
        {
            this.setState({profession: response1.data.message});
        }).catch((error) => {
            console.log(error.message);
        })
        let queries = queryString.parse(this.props.location.search);
        
        if(queries && queries.type && queries.type!==undefined){
            this.setState({queries:queries.type})
            const formData2 = new FormData();
            formData2.append('category', queries.type);
            formData2.append('sort', this.state.input.sort);  
            axios.post('https://domaintobesocial.com/domaintobe/sortdiscussion',formData2
            )
            .then((response) => {  
                console.log(response.data.data)
                this.setState({data: response.data.data});
            })
            .catch((error) => {
                console.log(error.message);
            })
        }else{
            axios.get('https://domaintobesocial.com/domaintobe/getdiscussions').then(res => 
            {console.log(res.data.message)
                this.setState({data: res.data.message}); 
            }); 
        }
        // console.log("queries",queries.type);
        // console.log('categories print',this.state.input.category);
        // console.log('sort print',this.state.input.sort);
        axios.get('https://domaintobesocial.com/domaintobe/category').then(response => 
        {
            console.log(response.data.data)
            this.setState({category: response.data.message});
        }); 

        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                formData
            )
        .then((response) => {
            console.log(response);
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

        // const db = firebase.database();
        // db.ref("chatwith/" + curentlogin.value).on("value", snapshot => {
        //     let chatingdatas = [];
        //     snapshot.forEach(snap => {
        //         chatingdatas.push(snap.val());
        //     });
        //     this.setState({ chatingdata: chatingdatas });
        // });



    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextProps.location.search.split('=')[1] && nextProps.location.search.split('=')[1]!==this.state.queries)
        {
            console.log('under right condition');
            this.componentDidMount();
        }
    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({ input });
        const formData = new FormData();
        formData.append('category', this.state.input.category);
        formData.append('sort', this.state.input.sort);  
        axios.post('https://domaintobesocial.com/domaintobe/sortdiscussion',formData
        )
        .then((response) => {  
            console.log(response.data.data)
            this.setState({data: response.data.data});
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
                    });
                });
            });
    
        }
        else
        {
            let filteredArray = this.state.showdata.filter(item => item.props.id !== id)
            this.setState({showdata: filteredArray});
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
                window.localStorage.removeItem('id');
                window.localStorage.removeItem('user');
                window.location = "/";
            }
        }else{
            window.localStorage.removeItem('user');
            window.location = "/";
        }

        const isViprole = this.state.isViprole;
        const userimage = this.state.userimage;
        let vipimage,navoptions1,navoptions2;

        if(isViprole){
            vipimage = <img className="vip" src="/images/vip.png" align="icon"/>;
            navoptions1 = <li className={ this.state.freePosts ?  "active" : "" } onClick={() => this.freeclick()}>Free</li>
            navoptions2 = <li className={ this.state.vipPosts ?  "active" : "" } onClick={() => this.vipclick()}>Vip</li>
          
        }else{
            vipimage = '';
            navoptions1 = <li className={ this.state.freePosts ?  "active" : "" } onClick={() => this.freeclick()}>Free</li>
            navoptions2 = <li className={ this.state.vipPosts ?  "active" : "" } >Vip</li>
        }
        const { initialData, filterValue } = this.state;

        // Apply filter and map data while converting to lowercase
        const filteredData = filterValue
          ?this.state.data.filter((item) => item.description.toLowerCase().includes(filterValue.toLowerCase())).map((item) => ({ ...item, name: item.description.toLowerCase() }))
          : this.state.data.map((item) => ({ ...item, name: item.description.toLowerCase() }));

        return (
            <div className="maindiv ">
            
            
            <i className="fas fa-bars side_b"></i>
            <div className="sidbar_left">
                <i className="fas fa-times side_b close"></i>
                <div className="logo">
                    <Link to="/userdashboard" >
                        <img src="images/logo.png" alt="logo"/>
                    </Link>
                </div>
                <ul>
                    <li><Link className="active" to="/userdashboard"><span><img src="images/iconS1.png" align="icon"/></span> News Feed</Link></li>
                    <li><Link to="/messages"><span><img src="images/iconS2.png" align="icon"/></span> Messages</Link></li>
                    <li><Link to="/requests"><span><img src="images/iconS3.png" align="icon"/></span> Requests</Link></li>
                    <li><Link to="/followers" ><span><img src="/images/iconS4.png" align="icon"/></span> My Followers</Link></li>
                    <li><Link to="/blocklist"><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                    <li><Link to="/viewnotifications"><span><img src="/images/iconS6.png" align="icon"/></span> Notifications</Link></li>
                   
                    <li><Link to="/favorites"><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
                </ul>

            </div>
                   <div className="main_menu ">
                    <ul class="ml-0">
                        <li><Link  to="/userdashboard">News Feed</Link></li>
                                <li className="dropdown">
                            <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Discussion
                            </span>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            
                            <ul>
                            {this.state.categories.map((result) => {
                                return (
                                     <li key={result.id} value={result.id} data-set="check"><Link to={"/discussion?type="+result.id}>{result.catname}</Link></li>
                                    )
                                })}
                            </ul>

                            </div>
                        </li>
                        
                            <li className="dropdown">
                                
                            <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Help
                            </span>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            
                            <ul>
                            {this.state.profession.map((result) => {
                                return (
                                     <li data-set="check"><Link to={"/professions/"+result.id}>{result.name}</Link></li>
                                    )
                                })}
                                 <li data-set="check"><Link to={"/help"}>All helps</Link></li>
                            </ul>

                            </div>
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

                <div className="head">
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={filterValue || ''}
          onChange={this.handleFilterChange}/>
                        <button className="btn" type="submit"><img src="images/searchicon.png" alt="icon"/> </button>
                    </form>
                    <Link to="/createpost" className="hpl"><img src="images/iconS2.png" align="icon"/> <span>Start Discussion</span></Link>
                </div>
                <div className="listusr discussion ">
                    <ul className="ul_discussion">
                        <li>
                            <select value={this.state.input.category}  name="category" id="category" onChange={this.handleChange}>
                                <option key="" value="">--Select Category--</option>
                                {this.state.category.map((result) => {
                                return (
                                     <option key={result.id} value={result.id} data-set="check">{result.catname}</option>
                                    )
                                })}
                            </select>
                        </li>
                        {/* <li>
                            <select value={this.state.input.sort} name="sort" id="sort" onChange={this.handleChange}>
                                <option>ASC</option>
                                <option>DESC</option>
                            </select>
                        </li> */}
                        {/* <li>
                            <img src="images/box2.png" alt="icon"/>
                        </li>
                        <li>
                            <img src="images/box1.png" alt="icon"/>
                        </li> */}
                    </ul>
                    
                    {this.state.data.length > 0  ?  
                    <div className="listpro">
                        <ul className="showposts">
                            {navoptions1}
                            {navoptions2}
                        </ul>
                    { this.state.data && this.state.data.length > 0 ? filteredData.map((result) => {
                     console.log( result.postaccess)
                            return (
                                <div>
                                    {this.state.vipPosts && result.postaccess == 1  ? 
                                    <div>
                                    <div className="vipposts">
                                        <div className="list1">
                                            <Link to={{ pathname: '/singlediscussion', state: { id: result.id} }}>
                                                <span className="userimg"><img src={result.singleimage} align="icon"/></span>
                                                <h6>{result.description}</h6></Link>
                                                {this.state.data.length>0 && this.state.data[0].video && this.state.data[0].video!== "Null" ? <Popup trigger={<button><i class="fas fa-video"></i></button>} position="right center">
                                                    <ReactPlayer
                                            url={this.state.data[0].video}
                                            width="100%"
                                            controls={true}
                                        />
                                        </Popup>:""}
                                            
                                            <p>{result.created} Ago</p>
                                            
                                            <ul>
                                                <li><img src="/images/like.png" alt="icon"/> {result.likes}</li>
                                                <li><img src="/images/comment.png" alt="icon"/> {result.comments} Comments</li>
                                            </ul>
                                        </div>
                                    </div>
                                    </div>
                                    :  
                                    <div>
                                    { result.postaccess !== "1" && this.state.freePosts  ? 
                                    
                                        <div className="freeposts">
                                            <div className="list1">
                                                <Link to={{ pathname: '/singlediscussion', state: { id: result.id} }}>
                                                    <span className="userimg"><img src={result.singleimage} align="icon"/></span>
                                                    <h6>{result.description}</h6>
                                                </Link>
                                                {this.state.data.length>0 && this.state.data[0].video && this.state.data[0].video!== "Null" ? <Popup trigger={<button> <i class="fas fa-video"></i></button>} position="right center">
                                                    <ReactPlayer
                                            url={this.state.data[0].video}
                                            width="100%"
                                            controls={true}
                                        />
                                        </Popup>:""}
                                             
                                                
                                                <p>{result.created} Ago</p>
                                                <ul>
                                                    <li><img src="/images/like.png" alt="icon"/> {result.likes}</li>
                                                    <li><img src="/images/comment.png" alt="icon"/> {result.comments} Comments</li>
                                                </ul>
                                            </div>
                                        </div>
                                    
                                    : "" }
                                    
                                    </div>
                                    }
                               </div>
                            )
                        }): 
                        <div className="norecord">
                            <img src="/images/nodata.png" />
                        </div>
                        
                    }
  
                    </div>
                    : 
                    <h1>data not found</h1>
                    // <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    }


                </div>
            </div>

                {/* <div className="test showchatt">
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
                </div> */}
        

        {/* <div id="display-data-Container" className="chat-popup">
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
                </div> */}


         </div>
        );
    }

}

export default Discussion;