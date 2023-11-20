import { Link } from 'react-router-dom';
import React, { useState, useRef } from "react";
import axios from 'axios';
import Picker from 'emoji-picker-react';
import ReadMoreReact from 'read-more-react';
import firebase from 'firebase';
import $ from "jquery";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
//import { EditorState } from 'draft-js';
//import { Editor } from 'react-draft-wysiwyg';
//import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//import { useQuill } from "react-quilljs";
//import "quill/dist/quill.snow.css";


class Userdashboard extends React.Component {
    constructor(props)
    {
      super(props);
      this.myRef = React.createRef();
      this.state = {
        data: [],
        input: {},
        errors: {},
        isViprole: false,
        userimage : '/images/blank.png',
        comments: '',
        hidecomment : '',
        values: '',
        chatimages: '',
        formfilled: 'notempty',
        files: [],
        files2: [],
        imagesPreviewUrls: [],
        imagesPreviewUrls2: [],
        videosPreviewUrls:[],
        videos:[],
        enteredText: [],
        friendsdata: [],
        checkedItems: [],
        childVisible: false,
        chatingdata: [],
        showdata : [],
        categories:[],
        popupchat:[],
        inputFields:[],
        searcheddata:[],
        profession:[],
        query: {},
        notificationcount: ''
      };
        
      this._handleImageChange2 = this._handleImageChange2.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.commentSubmit = this.commentSubmit.bind(this);
      this.handleReportSubmit = this.handleReportSubmit.bind(this);
      this._handleImageChange = this._handleImageChange.bind(this);
      this._handleVideoChange = this._handleVideoChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.popupchat=this.popupchat.bind(this);
      this.handleInputChange=this.handleInputChange.bind(this);
    }
    handleInputChange(event) {
        let query = this.state.query;
        query[event.target.name] = event.target.value;
        this.setState({
            query
        });
        
        // if(this.state.query.tagsearch.length > 1 ){
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            const formData2 = new FormData();
            formData2.append('id', curentlogin.value);
            formData2.append('key', this.state.query.tagsearch);
            axios.post('https://domaintobesocial.com/domaintobe/searchtagusers',formData2
            )
            .then((resp) => {
                this.setState({friendsdata: resp.data.message});
            })
            .catch((error) => {
                //alert('Invalid Login1');
            })
        // }
    }
   

    onClick() {
        this.setState({childVisible: !this.state.childVisible});
    }

    onEmojiClick (event, emojiObject) {
     
        //this.setState({enteredText: emojiObject.emoji})
        this.setState({enteredText: [...this.state.enteredText, emojiObject.emoji]})
    }


    updateState(e)
    {
        let myArr = e.target.value.split(",");
        myArr = myArr.filter(item => item);
        
        this.setState({enteredText: ''})

        this.setState({enteredText: myArr})
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
        _handleImageChange2(e) {
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
                            files2: [...this.state.files2, file],
                            imagesPreviewUrls2: [...this.state.imagesPreviewUrls2, reader.result]
                        });
                    }
                }
                reader.readAsDataURL(file);
            });

            
        }

     _handleVideoChange(e) {
        e.preventDefault();
        let files = Array.from(e.target.files);
        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                const filesize = Math.round((file.size / 1024));
                if(filesize > 2048){
                    alert("File too large, please select a file less than 2mb");
                }else{
                    this.setState({    
                        videos: [...this.state.videos, file],
                        videosPreviewUrls: [...this.state.videosPreviewUrls, reader.result]
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


    forchanedosage= (index, event) => {
        this.state.inputFields[index].name=event.target.value;
        this.setState({inputFields:this.state.inputFields});
      }

    validate(){
        let input = this.state.enteredText.length;
        let errors = {};
        let isValid = true;
        

        if (input == 0) {
            isValid = false;
            errors["post"] = "Please enter post data.";
        }

        this.setState({
            errors: errors
        });
  
        return isValid;
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.validate()){
            if(this.state.formfilled == 'empty'){
                alert('Complete your personal details');
                window.location = "/userprofile";
                return false;
            }else{
                document.getElementById('loadingicon').style.display = 'block';
                let input = {};

                const urlify = (postcontent) => {
                    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                    return postcontent.toString().replace(urlRegex, (url) => {
                      return `<a href="${url}" >${url}</a>`;
                    })
                }
                const postcontent = this.state.enteredText;
                const html = urlify(postcontent);

                var obj = JSON.parse(window.localStorage.getItem("user"));
                const formData = new FormData();
                formData.append('userid', obj.value);
                formData.append('post', html);
                formData.append('tagged', this.state.checkedItems);
                this.state.files.forEach((file) => formData.append('files[]', file));
                this.state.videos.forEach((file) => formData.append('videos[]', file));
                formData.append('tagged', JSON.stringify(this.state.checkedItems));
                axios.post('https://domaintobesocial.com/domaintobe/savenewsfeed',
                    formData
                )
                .then((res) => {
                    document.getElementById('loadingicon').style.display = 'none';
                    this.setState({enteredText: ''})
                    this.setState({imagesPreviewUrls: []})
                    this.setState({videosPreviewUrls: []})
                    this.setState({checkedItems: []})
                    if(res.data.message == 'success')
                    {
                       this.componentDidMount();
                    }else{
                        alert(res.data.message)
                    }
                })
                .catch((error) => {
                console.log(error.message);
                })

            }
        }

    }


    handleGetreply(i, e) {
        this.setState({
          comments: { ...this.state.values, [i]: e.target.value }
        });
    }

    handleHidecomment(i ,e){
        if (e.target.checked){
            this.setState({
                hidecomment: { ...this.state.values, [i]: e.target.value }
            });
              
        } else {
            this.setState({
                hidecomment: { ...this.state.values, [i]: '' }
            });
        }
    }

    commentSubmit(i, e){
        e.preventDefault();

        if(this.state.formfilled == 'empty'){
            alert('Complete your personal details');
            window.location = "/userprofile";
            return false;
        }

        else if(!this.state.comments[i]) {
            swal("Oops!", "Please fill the comment field", "error");
        }

        else{

            document.getElementById('loadingicon').style.display = 'block';
            let userid = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('userid', userid.value);
            formData.append('comment', this.state.comments[i]);
            formData.append('hidecomment', this.state.hidecomment[i]);
            formData.append('feedname', this.state.data[i].username);
            formData.append('feedemail', this.state.data[i].useremail);
            formData.append('postuser', this.state.data[i].postuser);
            formData.append('posts', this.state.data[i].posts);
            formData.append('sendername', this.state.input.name);
            formData.append('senderemail', this.state.input.email);
            formData.append('feedid', e.target.attributes['data-tag'].value);
            axios.post('https://domaintobesocial.com/domaintobe/commentsonfeeds',
                formData
            )
            .then((res) => {
                if(res.data.message = 'success'){
                    this.setState({comments : ''});
                    e.target.reset();
                    this.componentDidMount()
                }else{
                    swal("!Oops", this.data.message, "error");
                }
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
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
        const parseURLParams = (url) => {
            var queryStart = url.indexOf("?") + 1,
                queryEnd   = url.indexOf("#") + 1 || url.length + 1,
                query = url.slice(queryStart, queryEnd - 1),
                pairs = query.replace(/\+/g, " ").split("&"),
                parms = {}, i, n, v, nv;
        
            if (query === url || query === "") return;
        
            for (i = 0; i < pairs.length; i++) {
                nv = pairs[i].split("=", 2);
                n = decodeURIComponent(nv[0]);
                v = decodeURIComponent(nv[1]);
        
                if (!parms.hasOwnProperty(n)) parms[n] = [];
                parms[n].push(nv.length === 2 ? v : null);
            }
            return parms;
        }
       const urlString = window.location.href;
       const urlParams = parseURLParams(urlString);
       console.log("urlParams", urlParams);
        if(urlParams?.comment) {
            this.state.input.search = urlParams.comment[0];
            const formData = new FormData();
            formData.append('search', this.state.input.search);
            axios.post('https://domaintobesocial.com/domaintobe/searchnewsfeed',
                formData
            )
            .then((res) => {
               console.log("searchNewFeed", res.data.message);
               this.setState({searcheddata: res.data.message})
               const formData = new FormData();
               formData.append('id', res.data.message[0]?.id);
               axios.post('https://domaintobesocial.com/domaintobe/getuserspostsbyid',
                   formData
               )
               .then((res) => {
                   console.log("res", res);
                   this.setState({data: res.data.message});
                   this.setState({searcheddata: []});
                   document.getElementById('loadingicon').style.display = 'none';
               })
               .catch((error) => {
               console.log(error.message);
               })
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
        // $(".testin").click(function(){
        //     alert('hii');
        //   });

      else{
        const formData1 = new FormData();
        formData1.append('id', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getnewfeeds',formData1).then(res => 
        {
            if(res.data.message == 'false'){
            
            }else{
                this.setState({data: res.data.message});
                document.getElementById('loadingicon').style.display = 'none';
            }
        });
        }
        
        const db = firebase.database();
        db.ref("chatwith/" + curentlogin.value).on("value", snapshot => {
            let chatingdatas = [];
            snapshot.forEach(snap => {
                chatingdatas.push(snap.val());
            });
            this.setState({ chatingdata: chatingdatas });
        });

        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                formData
            )
        .then((response) => {
            let input = this.state.input;
            input.name = response.data.message.name;
            input.email = response.data.message.email;
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


        const formData2 = new FormData();
        formData2.append('id', curentlogin.value);
        formData2.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfriendlist',
            formData2
        )
        .then((resp) => {
            if(resp.data.status = 'data'){
                this.setState({friendsdata: resp.data.message});
            }else{
                // console.log(resp.data.message);
            }
        })
        .catch((error) => {
            alert('Invalid Login1');
        })

        axios.get('https://domaintobesocial.com/domaintobe/category').then(response => 
        {
            const sortedCategories = [...response.data.message];

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

                //notification count

                const formData13 = new FormData();
                formData13.append('id', curentlogin.value);
                axios.post('https://domaintobesocial.com/domaintobe/countnotifications',formData2 )
                .then((resp) => {
                    this.setState({ notificationcount: resp.data.message });
                })
                .catch((error) => {
                    // console.log(error.message);
                })
        
        
        const formData12 = new FormData();
        formData12.append('id', '16');
        axios.post('https://domaintobesocial.com/domaintobe/getprofessions',
        formData12).then(response1 => 
        {
            this.setState({profession: response1.data.message});
        }).catch((error) => {
            console.log(error.message);
        })
    }

    handleChangeLogout()
    {
      window.localStorage.clear();
      window.location.reload()
    }
    
    postLike = (i,id)  => {
        if(this.state.formfilled == 'empty'){
            alert('Complete your personal details');
            window.location = "/userprofile";
            return false;
        }else{
            document.getElementById('loadingicon').style.display = 'block';
            let userid = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('userid', userid.value);
            formData.append('postid', id);
            formData.append('feedname', this.state.data[i].username);
            formData.append('feedemail', this.state.data[i].useremail);
            formData.append('postuser', this.state.data[i].postuser);
            formData.append('posts', this.state.data[i].posts);
            formData.append('sendername', this.state.input.name);
            formData.append('senderemail', this.state.input.email);
            axios.post('https://domaintobesocial.com/domaintobe/postlike',
                formData
            )
            .then((res) => {
                if(res.data.message = 'success'){
                    this.componentDidMount();
                }else{
                    alert(this.data.message);
                }
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
    }

    handleReportSubmit(event){
        event.preventDefault();
        if(this.validates()){

            if(this.state.formfilled == 'empty'){
                alert('Complete your personal details');
                window.location = "/userprofile";
                return false;
            }else{

                let userid = JSON.parse(window.localStorage.getItem("user"));
                let routeState = JSON.parse(window.localStorage.getItem("routeState"));

                const formData = new FormData();
                formData.append('userid', userid.value);
                formData.append('feedid', event.target.attributes['data-id'].value);
                formData.append('commentid', event.target.attributes['commentid'].value);
                formData.append('category', this.state.input.category);
                formData.append('description', this.state.input.description);
              
                axios.post('https://domaintobesocial.com/domaintobe/postcommentreports',
                    formData
                )
                .then((res) => {
                    
                    if(res.data.message == 'success'){
                       this.componentDidMount();
                       swal("Successfully", "Report Submit", "success");
                       window.location.reload();                     
                    }else{
                        alert(res.data.message);
                    }
                    
                })
                .catch((error) => {
                console.log(error.message);
                })

            }

        }
    }

    validates(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;
   
      if (!input["category"]) {
        isValid = false;
        errors["category"] = "Category field is required.";
      }

      if (!input["description"]) {
        isValid = false;
        errors["description"] = "Description is required.";
      }
      
      this.setState({
        errors: errors
      });
  
      return isValid;
    }

    commentLike = (i,id, post)  => {
        if(this.state.formfilled == 'empty'){
            alert('Complete your personal details');
            window.location = "/userprofile";
            return false;
        }else{

            let userid = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('userid', userid.value);
            formData.append('commentid', id);
            formData.append('feedid', post);
            axios.post('https://domaintobesocial.com/domaintobe/postcommentlike',
                formData
            )
            .then((res) => {
                if(res.data.message = 'success'){
                    this.componentDidMount()
                }else{
                    alert(this.data.message);
                }
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
    }

    openReplycomment = (i,id,post)  => {
        document.getElementById('rid'+id).style.display = "block";
    }

    handlereply(i, e) {
        this.setState({
          values: { ...this.state.values, [i]: e.target.value }
        });
    } 

    handleReplysubmit(i, e){
        e.preventDefault();
        if(this.state.formfilled == 'empty'){
            alert('Complete your personal details');
            window.location = "/userprofile";
            return false;
        }else{

            let userid = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('userid', userid.value);
            formData.append('commentid', e.target.attributes['commentid'].value);
            formData.append('postid', e.target.attributes['data-id'].value);
            formData.append('comment', this.state.values[i]);
            axios.post('https://domaintobesocial.com/domaintobe/postreplycomment',
                formData
            )
            .then((res) => {
                // console.log(res);
                if(res.data.message = 'success'){
                    this.componentDidMount()
                }else{
                    alert(this.data.message);
                }

                document.getElementById('rid'+e.target.attributes['commentid'].value).style.display = "none";
                
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
    }

    updateStateList(e, value,id,image){
        // $("#owl-home-slider").owlCarousel();
        // console.log(id)
        if (e.target.checked){
          //append to array

            this.setState(({checkedItems}) => ({
                checkedItems: [...checkedItems, {
                name: value,
                id: id,
                image:image
            }]
            }))
        } else {
          //remove from array
          this.setState(({checkedItems}) => ({
            checkedItems: checkedItems.filter((element) =>  (value !== element.name))
            }));
       }
    //    console.log(this.state.checkedItems);
    }

    removeImage(i){
        var array = [...this.state.imagesPreviewUrls];
        array.splice(i, 1);
        this.setState({imagesPreviewUrls: array});
    }

    removeVideo(i){
        // console.log(i);
        var array = [...this.state.videosPreviewUrls];
        array.splice(i, 1);
        this.setState({videosPreviewUrls: array});
    }

    handleSearch(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('search', this.state.input.search);
        axios.post('https://domaintobesocial.com/domaintobe/searchnewsfeed',
            formData
        )
        .then((res) => {
            this.setState({searcheddata: res.data.message});
        })
        .catch((error) => {
        console.log(error.message);
        })
    }

    postClick(i){
        document.getElementById('loadingicon').style.display = 'block';
        const formData = new FormData();
        formData.append('id', i);
        axios.post('https://domaintobesocial.com/domaintobe/getuserspostsbyid',
            formData
        )
        .then((res) => {
            this.setState({data: res.data.message});
            this.setState({searcheddata: []});
            document.getElementById('loadingicon').style.display = 'none';
        })
        .catch((error) => {
        console.log(error.message);
        })
    }

    closeChatbox = (id)  => {
        $('.chat-popup').removeClass('main');
      
        let filteredArray = this.state.showdata.filter((item,i) => item.id !==id)

        this.setState({showdata: filteredArray});
    }

    openChatbox(id,name,image){
        // let yt =  this.state.showdata.filter((element) =>  (id === element.props.id))
       
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
     
   
        // if(this.chatvalidate(j)){
            
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            const sender = curentlogin.value+'_'+id;
            const reciever = id+'_'+curentlogin.value;
            
            const db = firebase.database();
            var time = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
            
            if(this.state.imagesPreviewUrls2.length!==0) { const formData = new FormData();
                this.state.files2.forEach((file) => formData.append('files[]', file));
                formData.append('tagged', JSON.stringify(this.state.checkedItems));
                axios.post('https://domaintobesocial.com/domaintobe/chatimage',
                    formData
                )
                .then((res) => {
                   
                    db.ref("chat/" + sender).push({
                        read: 'y',
                        side: 'right',
                        msg: this.state.inputFields[j].name+ ' ' + res.data.message?res.data.message:'',
                        image:this.state.userimage,
                        time: time
                        
                    });

                    db.ref("chat/" + reciever).push({
                        read: 'n',
                        side: 'left',
                        msg: this.state.inputFields[j].name+ ' ' + res.data.message?res.data.message:'',
                        image:this.state.userimage,
                        time: time
                    });
                    this.setState({imagesPreviewUrls2: []})
                    
                   
                })

                .catch((error) => {
                console.log(error.message);
                })}
                if(this.state.inputFields[j].name.length!=0) {
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
        }

    

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
        // }else{
        //     alert('Enter message');
        // }
    }

    // handleKeypress(e) {
    //     if (e.charCode === 13) {
    //         document.getElementsByName("chatsubmit")[0].type = "submit";
    //     }
    // }

    // chatvalidate(j){
    //     let input = this.state.inputFields[j].name;
    //     let errors = {};
    //     let isValid = true;
     
    //     if (!input["message"]) {
    //       isValid = false;
    //       errors["message"] = "Please add message.";
    //     }

    //     this.setState({
    //         errors: errors
    //     });
      
    //     return isValid;
    // }



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

    minimize(id){
        console.log('idddd',id);
        $('#'+id).toggleClass('minimize');


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
       
        // console.log('dsadsa',isViprole);
        if(isViprole){
            vipimage = <img className="vip" src="/images/vip.png" align="icon"/>;
        }else{
            vipimage = '';
        }

        return (
        
            <section className="maindiv">
                <i className="fas fa-bars side_b" onClick={this.openPop.bind(this)}></i>
        
                <div className="sidbar_left">
                    <i className="fas fa-times side_b close" onClick={this.openClose.bind(this)}></i>
                    <div className="logo">
                        <Link to="/userdashboard">
                            <img src="images/logo.png" alt="logo"/>
                        </Link>
                    </div>
                    <ul>
                    <li><Link to="/userdashboard" className="active"><span><img src="images/iconS1.png" align="icon"/></span> News Feed</Link></li>
                    <li><Link to="/userprofile"><span><img src="images/useri_1.png" align="icon"/></span> My Profile</Link></li>
                    <li><Link to="/messages"><span><img src="images/iconS2.png" align="icon"/></span> Messages</Link></li>
                    <li><Link to="/requests"><span><img src="images/iconS3.png" align="icon"/></span> Requests</Link></li>
                   <li><Link to="/followers"><span><img src="images/iconS4.png" align="icon"/></span> My Followers</Link></li>
                   <li><Link to="/blocklist"><span><img src="images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                   <li><Link to="/viewnotifications"><span><i className="fas fa-bell" style={{color:'#ffdc5d'}}><sup style={{color:'#ff0000d6'}}>{this.state.notificationcount}</sup></i></span> Notifications</Link></li>
                   {/* <li><Link to="pagesliked"><span><img src="images/iconS7.png" align="icon"/></span> Pages Liked</Link></li> */}
                   <li><Link to="/favorites"><span><img src="images/iconS8.png" align="icon"/></span> Favorites</Link></li>
                    </ul>
                </div>
               
                
                    <div className="main_menu ">
                        <ul>
                            <li><Link to="/userdashboard" className="active">News Feed</Link></li>
                            <li className="dropdown">
                            <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Discussion
                            </span>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            
                            <ul>
                            {
                            this.state.categories.map((result) => {
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
                        <div className="side_right">
                         <div className="asuser">
                        <Link to="/userprofile">
                            <span className="userimg"><img className="w-100" src={this.state.userimage} align="icon"/></span>
                            {vipimage}
                            <h5>{this.state.input.name}</h5>
                        </Link>
                    
                    </div>
                    <span className="logout" onClick={this.handleChangeLogout.bind(this)} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Logout</span>
                    </div>
                    </div>
         <div className="in_center">
                    <div className="head">
                        <form className="d-flex" onSubmit={this.handleSearch}>
                            <input className="form-control me-2" type="search" placeholder="Search Post Name" name="search" aria-label="Search" autoComplete="off" onChange={this.handleChange} value={this.state.input.search}  />
                            <button className="btn" type="submit"><img src="images/searchicon.png" alt="icon"/> </button>
                            <div className="setsearchdata">
                            <ul>
                                {this.state.searcheddata.map((results) => {
                                    return (
                                        <li className="postsearch" onClick={(e)=>this.postClick(results.id)}>{results.posts}<i className="fas fa-arrow-right"></i></li>
                                    )
                                })}
                            </ul>
                    </div>
                        </form>
                        <Link to="/createpost" className="hpl"><img src="images/iconS2.png" align="icon"/> <span>Start Discussion</span></Link>
                    </div>
        
                    <div className="addpost">
                        <h3>Add post</h3>
                        <div className="addhead">
                        <div className="loadingicon" id="loadingicon"><img src="/images/loading.gif" /></div>
                            <form className="d-flex" onSubmit={this.handleSubmit}>
                                <Link to="/userprofile" ><span className="userimg"><img src={this.state.userimage} align="icon"/></span></Link>
                                <textarea name="post" className="form-control " placeholder="Type What are you Thinking..."  id="post"  value={enteredText} onChange={this.updateState.bind(this)}></textarea>
                                <div className="text-danger">{this.state.errors.post}</div>
        
                                <div className="maindivkap">
                                <div className="row">
                                {this.state.imagesPreviewUrls.map((imagePreviewUrl, i) => {
                                    return <div className="col-4 col-sm-3 col-lg-2"  onClick={(e)=>this.removeImage(i)}><div className="imgg"><i className="fa fa-times" ></i><img className="upim w-100" key={imagePreviewUrl} alt='previewImg' src={imagePreviewUrl} /></div></div>
                                })}
                                
                                {this.state.videosPreviewUrls.map((videoPreviewUrl,i) => {
                                    return <div className="col-sm-3 col-lg-2"><div className="imgg"><i className="fa fa-times" onClick={(e)=>this.removeVideo(i)}></i><video width="320" height="240" controls><source src={videoPreviewUrl} type="video/mp4"/></video></div></div>
                                })}
        
        
                                </div>
                                </div>
                                <ul>
                                    <li><input type="file" name="" onChange={this._handleImageChange} multiple accept="image/*"/><img src="images/addicon1.png" align="icon"/></li>
                                    <li><input type="file" name="" onChange={this._handleVideoChange} multiple accept="video/*"/><img src="images/addicon2.png" align="icon"/></li>
                                   
                                    <li className="dropdown" data-toggle="modal" data-target="#exampleModalHelp"><span ><img src="images/addicon3.png" align="icon"/></span>
                                    </li>
        
                                   
                                    {/* <li className="dropdown"><span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <img src="images/addicon4.png" align="icon"/>
                                        </span>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                                            <input type="text" className="form-control linkurl" name="url" placeholder="Add Url" onChange={this.handleChange} id="url" value={this.state.input.url}/>
                                           
                                        </div>
                                    </li> */}
                                    <li onClick={() => this.onClick()}><img src="images/addicon5.png" align="icon"/></li>
                                </ul>
                                <button className="btn" type="submit">Post</button>
                            </form>
                        </div>
        
                        <div className="appendusers">
                        {this.state.checkedItems.map((checkedItem,index) => {
                            console.log(this.state.checkedItems)
                            return (
                                <div className="item">
                                    <i className="fa fa-times"></i>
        
                                    {checkedItem.image ? (
                                        <span className="usersimage"><img className="w-100" src={checkedItem.image} align="icon"/></span>
                                        ) : (
                                        <span className="usersimage"><img className="w-100" src="images/userimg2.jpg" align="icon"/></span>
                                    )}
                                    
                                    <h5>{checkedItem.name}</h5>
        
                                </div>
                            );
                        })}
                        </div>
                    </div>
        
                    {
                    this.state.childVisible
                        ?  <Picker onEmojiClick={this.onEmojiClick.bind(this)}/>
                        : null
                    }

                    {this.state.data.length > 0  ? 
                    
                    <div className="listusr">
                        {this.state.data.map((result,i) => {
                        return (
                            <div className="test">
                                <a onClick={() => this.postLike(i, result.id)}>
                                {(result.userlike == '1') ? <img className="hearticon" src="images/iconS8.png" align="icon" style={{filter:'none'}} /> : <img className="hearticon" src="images/iconS8.png" align="icon"  /> }    
                                </a>
                                <div className="asuser">
                                    
                                       
                                        <Link to={{ pathname: '/viewprofile/'+result.username }}><span className="userimg"><img src={result.userimage?result.userimage:this.state.user} align="icon"/></span>
                                        </Link>
                                        
                                    <h5><Link to={{ pathname: '/viewprofile/'+result.username }}>{result.username}</Link> {result.counttaguser == 2 ? (
                                        <span>is with { result.taggedusers.map((taggeduser, i) => ( <Link to={{ pathname: '/viewprofile/'+taggeduser.name }}>{taggeduser.name}</Link> ))}
                                        </span>
                                        ) : (
                                        ""
                                    )}</h5>

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
                                    <ReadMoreReact 
                                       text={result.posts}
                                       numberOfLines={10}
                                       showLessButton={true}
                                      />
                                    {/* <p dangerouslySetInnerHTML={{__html: result.posts}} /> */}
                                    <div className="row">
                                    { result.images.map((galleryimage, i) => ( 
                                       
                                        <div className="col-6 col-sm-4 col-lg-3">
                                            <div  className="testin">
                                            <img className="w-100"src={galleryimage.image} />
                                            </div>
                                        </div>
                                    ))}
                                    </div>
        
                                    <div className="row">
                                    { result.videos.map((galleryvideos, i) => ( 
                                        <div className="col-6 col-sm-4 col-lg-3">
                                            <div className="testin">
                                            <video width="320" height="240" controls>
                                                <source src={galleryvideos.videos} type="video/mp4"/>
                                            </video>
        
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                   
                                   
                                    <ul className="likecomment">
                                        <li><img src="images/like.png" alt="ion" onClick={() => this.postLike(i, result.id)}/> {result.likes}</li>
                                        <li><img src="images/comment.png" alt="ion"/> {result.comments}</li>
                                    </ul>
                                   
                                    <div className="allcomment">
                                        {result.sendcomments.length>0 ? result.sendcomments.map((object, i) => 
                                        <>{object.hidecomment=="1" && this.state.isViprole!==false ? <div className="commentin">
                                        <Link to={{ pathname: '/viewprofile/'+object.name }}><span className="userimg"><img className="w-100" src={object.image} align="icon"/></span></Link>
                                        <h5><Link to={{ pathname: '/viewprofile/'+object.name }}>{object.name}</Link><a className="reportbtn" data-toggle="modal" data-target={'#exampleModalHelp'+object.id}>Report</a></h5>
                                        <p>{object.comment} (<span>{object.created} Ago</span>)
                                        </p>
                                        <ul className="likecomment">
                                            <li style={{cursor:'pointer'}} onClick={() => this.commentLike(i, object.id , result.id)}><img src="images/like1.png" alt="ion"/>{object.clike}</li>
                                            <li style={{cursor:'pointer'}} onClick={() => this.openReplycomment(i, object.id , result.id)}><img src="images/reply.png" alt="ion"/> Reply</li>
                                        </ul>
    
                                        <form className="replyid"  id={'rid'+object.id}  onSubmit={this.handleReplysubmit.bind(this, i)} data-id={result.id} commentid={object.id}>
                                        <input className="form-control me-2" type="text" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply' + object.id} name={this.state.values[i]} value={this.state.values[i]} onChange={this.handlereply.bind(this, i)}
                                            />
                                            <button className="comment" type="submit"><span className="send"><img src="images/send.png" alt="ion"/></span><span>Comment</span></button>
<></>                                        </form>
    
    
    
                                    <div className="modal fade" id={'exampleModalHelp'+object.id}  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content HelpForm">
                                                <div className="modal-header ghg">
                                                    <h5 className="modal-title" id="exampleModalLongTitle">Report</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <form onSubmit={this.handleReportSubmit} data-id={result.id} commentid={object.id}>
                                                    <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Categories{this.state.errors.category?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</label>
                                                                <select value={this.state.input.category} onChange={this.handleChange} name="category" id="category">
                                                                    <option key="" value="">--Select Category--</option>
                                                                    <option key="Abusive" value="Abusive">Abusive</option>
                                                                    <option key="Adult" value="Adult">Adult</option>
                                                                    <option key="Others" value="Others">Others</option>
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
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="submit"  className="btn btn-primary submit">Submit</button>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    </div>:
                                    
                                   <>{object.hidecomment == 0 ? 
                                    
                                    <div className="commentin">
                                        <Link to={{ pathname: '/viewprofile/'+object.name }}><span className="userimg"><img className="w-100" src={object.image} align="icon"/></span></Link>
                                        <h5><Link to={{ pathname: '/viewprofile/'+object.name }}>{object.name}</Link><a className="reportbtn" data-toggle="modal" data-target={'#exampleModalHelp'+object.id}>Report</a></h5>
                                        <p>{object.comment} (<span>{object.created} Ago</span>)
                                        </p>
                                        <ul className="likecomment">
                                            <li style={{cursor:'pointer'}} onClick={() => this.commentLike(i, object.id , result.id)}><img src="images/like1.png" alt="ion"/>{object.clike}</li>
                                            <li style={{cursor:'pointer'}} onClick={() => this.openReplycomment(i, object.id , result.id)}><img src="images/reply.png" alt="ion"/> Reply</li>
                                            {object.reply.map((item) => {
                                               
                                               return (
                                                   <>
                                                   {item.commentid==object.id? <div className='replyin'>
                                                 
                                                 <Link to={{ pathname: '/viewprofile/'+item.username }}><span className="userimg"><img className="w-100" src={item.image} align="icon"/></span></Link>
                                                 <h5><Link to={{ pathname: '/viewprofile/'+item.username }}>{item.username}</Link></h5>
                                                <div><div class="para"><p>{item.comment} </p></div>
                                                <div class="bottomreport"><span class="days">{item.created} Ago</span><a className="reportbtn btn-report" data-toggle="modal" data-target={'#exampleModalHelp'+item.id}>Report</a></div></div> 
                                                 </div>:""}
                                                  
                                                   </>
                                               )
                                                
                                             
                                            })
                                            }
                                            
                                        </ul>
    
                                        <form className="replyid"  id={'rid'+object.id}  onSubmit={this.handleReplysubmit.bind(this, i)} data-id={result.id} commentid={object.id}>
                                        <input className="form-control me-2" type="text" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply' + object.id} name={this.state.values[i]} value={this.state.values[i]} onChange={this.handlereply.bind(this, i)}
                                            />
                                            <button className="comment" type="submit"><span className="send"><img src="images/send.png" alt="ion"/></span><span>Comment</span></button>
                                        </form>
    
    
    
                                    <div className="modal fade" id={'exampleModalHelp'+object.id}  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content HelpForm">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLongTitle">Report</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <form onSubmit={this.handleReportSubmit} data-id={result.id} commentid={object.id}>
                                                    <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <h6>Categories {this.state.errors.category ? <span style={{color: "red"}}>*</span> : ''}</h6>
                                                                <select value={this.state.input.category} onChange={this.handleChange} name="category" id="category">
                                                                    <option key="" value="">--Select Category--</option>
                                                                    <option key="Abusive" value="Abusive">Abusive</option>
                                                                    <option key="Adult" value="Adult">Adult</option>
                                                                    <option key="Others" value="Others">Others</option>
                                                                </select>
                                                                <div className="text-danger">{this.state.errors.category}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <h6>Description {this.state.errors.description ? <span style={{color: "red"}}>*</span> : ''}</h6>
                                                                <textarea placeholder="Description" value={this.state.input.description} onChange={this.handleChange} id="description" name="description"></textarea>
                                                                <div className="text-danger">{this.state.errors.description}</div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button"  className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="submit"  className="btn btn-primary submit">Submit</button>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    
                                    : ""}</>
                                    
                                    }</>
                                        
                                    

                                    ):""}
                                    </div>
                                   
        
                                    <div className="likeshare">
                                        <form onSubmit={this.commentSubmit.bind(this, i)} data-tag={result.id} id={result.id}>
                                            {(isViprole) ? <div className="pcheck"><input type="checkbox" value="1" onChange={this.handleHidecomment.bind(this, i)}/>Hide comment</div> : ""}
                                           
                                            <input id={'comments' + result.id} className="form-control me-2" type="text" placeholder="Your Comment..." aria-label="Search" value={this.state.comments[i]} 
                                            name={this.state.comments[i]}  onChange={this.handleGetreply.bind(this, i)} autoComplete="off"/>
                                            
                                            <button className="comment" type="submit"><span className="send"><img src="images/send.png" alt="ion"/></span><span>Comment</span></button>
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                        })}
                    </div>
                    
                    : <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
                    
                    }
                    
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
                </div>
                </div>
        
            
        
                <div id="display-data-Container" className="chat-popup">
                    {this.state.showdata.map((x,j)=>
                    {
                        return(
                    <div className="appendchatuser"  id={x.id}><h1><Link to={{ pathname: '/viewprofile/'+x.name }}>{x.name}</Link><span id={'chat'+x.id} onClick={() => this.minimize(x.id)}><i class="fa fa-window-minimize" aria-hidden="true"></i><i class="fa fa-window-maximize" aria-hidden="true"></i></span><button type="button" className="btn cancel" onClick={() => this.closeChatbox(x.id)}><i className="fas fa-times"></i></button></h1><form onSubmit={this.startChat.bind(this, x.id,x.image,x.name,j)} className="form-container"><div className="chatstart">
                    {this.popupchat(x.id) && this.popupchat(x.id).length>0 ? this.popupchat(x.id).map((chat,i) => {  
                      
                        return (
                            <span>
                            { chat.side == 'left' ?
                                <div className="container_left">
                                    <img src={chat.image} alt="Avatar"/>
                                    {chat.msg.endsWith('.mp4') ? (
                        <video className='chatvideo' controls>
                            <source src={chat.msg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) :chat.msg.endsWith('.png') || chat.msg.endsWith('.jpg') ? (
                       <img src={chat.msg} alt="Image" className='chatimage' style={{ height: '100px', position: 'relative' }} />

                    ) : (
                        <p>{chat.msg}</p>
                    )}
                                    {/* <p>{chat.msg}</p> */}
                                    <span className="time-right">{chat.time}</span>
                                </div>
                            : 
                                <div className="container_left darker">
                                    <img src={chat.image} alt="Avatar" className="right"/>
                                    {chat.msg.endsWith('.mp4') ? (
                        <video className='chatvideo' controls>
                            <source src={chat.msg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : chat.msg.endsWith('.png') || chat.msg.endsWith('.jpg') ? (
                        <img src={chat.msg} alt="Image" className='chatimage' style={{ height: '100px', position: 'relative' }} />

                    ) : (
                        <p>{chat.msg}</p>
                    )}  
                                    <span className="time-left">{chat.time}</span>  
                                </div>
                            }
                            </span>
                        )
                    }):"No record found"}
                    </div>
                   
                    <textarea placeholder="Type message.." name="message" autoComplete="off"  onChange={this.forchanedosage.bind(this,j)} value={this.state.inputFields[j].name}></textarea>

                    {/* <input type="file" name="" onChange={this._handleImageChange2} multiple accept="image/*"/> */}
                    {/* <input type="file" name="" onChange={this._handleImageChange} multiple accept="image/*"/> */}
                    <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={this._handleImageChange2}
        multiple accept="image/ video/*"
      />
      
      <img src="images/addicon1.png" align="icon" className='chatuploadfile'   onClick={() => document.getElementById('file-upload').click()}/>
                    <button type="submit" name="chatsubmit" className="btn">Send</button></form></div>
                        )
                    })}
                </div>
                

            <div className="modal fade" id="exampleModalHelp"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content HelpForm">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Users List</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="tagfriends">
                        <input type="text" className="form-control" placeholder="Search user..." autoComplete="off" value={this.state.query.tagsearch} name="tagsearch" onChange={this.handleInputChange}/> 
                        <ul>
                            {this.state.friendsdata.map((result, i) => {
                                return(
                                    <li>
                                        <label className="checkcontainer"><input 
                                        key={result.name}
                                        type="checkbox" name="checkbox" onClick={(e)=>this.updateStateList(e,result.name,result.friendid,result.image)} /><span className="radiobtn"></span></label>
                                        <b>
                                        <img src={result.image} /></b>{result.name}
                                    </li>
                                )
                            })}   
                        </ul>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        
            </section>
        );
        
        
    }
};

export default Userdashboard;                                                                   