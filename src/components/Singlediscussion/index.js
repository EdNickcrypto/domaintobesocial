import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import firebase from 'firebase';
import $ from "jquery";
import swal from 'sweetalert';

class Singlediscussion extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        data: [],
        discussions: [],
        input: {},
        errors: {},
        postlike: '',
        postcomments: '',
        postmemberjoins: '',
        postjoin: 'Join',
        values : '',
        formfilled: 'notempty',
        showModal: false,
        userimage : '/images/blank.png',
        isViprole: false,
        chatingdata: [],
        popupchat:[],
        inputFields:[],
        showdata:[],
        hidecomment : ''
       }

       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       this.handleReportSubmit = this.handleReportSubmit.bind(this);
       this.imageChange = this.imageChange.bind(this);
       this.handleReportreplySubmit = this.handleReportreplySubmit.bind(this);
       this.handlePassword = this.handlePassword.bind(this);
       this.popupchat=this.popupchat.bind(this);
    }

   openPop(){
    // alert('asdfasdf');
    $(".maindiv").toggleClass("main");
}

openClose(){
    $(".maindiv").toggleClass("main");
    }

    
    likePost = (id,cat,description) => {

        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{

            let userid = JSON.parse(window.localStorage.getItem("user"));
            let routeState = JSON.parse(window.localStorage.getItem("routeState"));

            const formData = new FormData();
            formData.append('did', routeState.id);
            formData.append('userid', userid.value);
            formData.append('postuser', id);
            formData.append('cat', cat);
            formData.append('description', description);
            axios.post('https://domaintobesocial.com/domaintobe/discussionlike',
                formData
            )
            .then((res) => {
            console.log(res);
            if(res.data.message == 'success')
            {   
                this.setState({postlike: res.data.likes});
            }else{
                alert(res.data.message);
            }
              
            })
            .catch((error) => {
            console.log(error.message);
            })

        }

    };

    joinPost = (id,cat,description) => {
        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{

            let userid = JSON.parse(window.localStorage.getItem("user"));
            let routeState = JSON.parse(window.localStorage.getItem("routeState"));
            const formData = new FormData();
            formData.append('did', routeState.id);
            formData.append('userid', userid.value);
            formData.append('postuser', id);
            formData.append('cat', cat);
            formData.append('description', description);
            axios.post('https://domaintobesocial.com/domaintobe/joindiscussion',
                formData
            )
            .then((res) => {
            if(res.data.message == 'Joined')
            {   
                this.setState({postjoin: res.data.message});
                this.setState({postmemberjoins: res.data.members});
            }else if(res.data.message == 'Join'){
                this.setState({postjoin: res.data.message});
                this.setState({postmemberjoins: res.data.members});
            }else{
                alert(res.data.message);
            }
              
            })
            .catch((error) => {
            console.log(error.message);
            })
        }
    };

    openModel = (event) => {
        //document.getElementById("exampleModalHelp1")
        let tag = event.currentTarget.dataset.tag;
        //console.log(tag);
    };

    openLikereply = (i,id)  => {
        
        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{

            let userid = JSON.parse(window.localStorage.getItem("user"));
            let routeState = JSON.parse(window.localStorage.getItem("routeState"));
            const formData = new FormData();
            formData.append('did', routeState.id);
            formData.append('userid', userid.value);
            formData.append('id', id);
            axios.post('https://domaintobesocial.com/domaintobe/likereplydiscussions',
                formData
            )
            .then((res) => {
            console.log(res);
            if(res.data.message == 'Liked')
            {   window.location.reload();
                //this.setState({replylikes: res.data.message});
            }else if(res.data.message == 'Like'){
                window.location.reload();
                //this.setState({replylikes: res.data.message});
            }else{
                alert(res.data.message);
            }
              
            })
            .catch((error) => {
            console.log(error.message);
            })

        }

    };

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
        
        //alert(url);
        //this.setState({
        // file: URL.createObjectURL(event.target.files[0])
        //})
    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({
          input
        });
    }

    handleGetreply(i, e) {
        //console.log(e.target.value);
        //console.log(i);
        this.setState({
          values: { ...this.state.values, [i]: e.target.value }
        });
    }

    handleReplysubmit(i, e){
        e.preventDefault();

        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{

            let userid = JSON.parse(window.localStorage.getItem("user"));
            let routeState = JSON.parse(window.localStorage.getItem("routeState"));
            const formData = new FormData();
            formData.append('did', routeState.id);
            formData.append('userid', userid.value);
            formData.append('comment', this.state.values[i]);
            formData.append('replyid', e.target.attributes['data-tag'].value);
            axios.post('https://domaintobesocial.com/domaintobe/discussionrepliescomments',
                formData
            )
            .then((res) => {
            console.log(res);
            if(res.data.message == 'success')
            {   

                document.getElementById("reply"+e.target.attributes['data-tag'].value).value = '';
                document.getElementById(e.target.attributes['data-tag'].value).style.display = "none";
                alert('Successfully submit');
            }else{
                alert(res.data.message);
            }
              
            })
            .catch((error) => {
            console.log(error.message);
            })

        }
    }


    openReplycomment = (i,id)  => {
        document.getElementById(id).style.display = "block";
    }

    handleReportSubmit(event){
        event.preventDefault();

        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{
            if(this.validates()){
                var imgsrc = document.getElementById("myImg").src;
                if(imgsrc == 'https://localhost:3000/blank'){
                    var useimage = '';
                }else{
                    var useimage = imgsrc;
                }

                let userid = JSON.parse(window.localStorage.getItem("user"));
                let routeState = JSON.parse(window.localStorage.getItem("routeState"));

                const formData = new FormData();
                formData.append('did', routeState.id);
                formData.append('userid', userid.value);
                formData.append('category', this.state.input.category);
                formData.append('description', this.state.input.description);
                formData.append('image', useimage);
                axios.post('https://domaintobesocial.com/domaintobe/reportdiscussion',
                    formData
                )
                .then((res) => {
                // console.log(res);
                if(res.data.message == 'success')
                {   alert('Successfully submit');
                    //document.getElementById("description").value = '';
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

    handleReportreplySubmit(event){
        event.preventDefault();

        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{

            if(this.validates()){
                let userid = JSON.parse(window.localStorage.getItem("user"));
                let routeState = JSON.parse(window.localStorage.getItem("routeState"));

                const formData = new FormData();
                formData.append('did', routeState.id);
                formData.append('userid', userid.value);
                formData.append('category', this.state.input.category);
                formData.append('description', this.state.input.description);
                axios.post('https://domaintobesocial.com/domaintobe/reportreplydiscussion',
                    formData
                )
                .then((res) => {
                //console.log(res);
                if(res.data.message == 'success')
                {   alert('Successfully submit');
                    //document.getElementById("description").value = '';
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

    validating(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;
   
      if (!input["password"]) {
        isValid = false;
        errors["password"] = "Password field is required.";
      }
      
      this.setState({
        errors: errors
      });
  
      return isValid;
    }

    handlePassword(event) {
        event.preventDefault();
        if(this.validating()){

            const formData = new FormData();
            formData.append('password', this.state.input.password);
            formData.append('post', this.props.location.search.substring(1));
            axios.post('https://domaintobesocial.com/domaintobe/handlepassword',
                formData
            ).then((res) => {
            
            if(res.data.message == 'match')
            {  
                localStorage.setItem('match', 'true')
                this.componentDidMount();
            }else{
                localStorage.setItem('match', 'false')
                alert(res.data.message);
            }

              
            }).catch((error) => {
            console.log(error.message);
            })
 
        }
    }

    closepopup(){
        this.setState({showModal: false})
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.state.formfilled == 'empty'){
            swal("Oops", 'Complete your personal details', "error");
            window.location = "/userprofile";
            return false;
        }else{

            if(this.validate()){
                let input = {};
                const formData = new FormData();
                formData.append('did', document.getElementById("did").value);
                formData.append('userid', document.getElementById("userid").value);
                formData.append('hidecomment', this.state.hidecomment);
                formData.append('comment', this.state.input.comment);
                formData.append('discussionuser', document.getElementById("discussionuser").value);
                formData.append('postuser', this.state.data[0].userid);
                formData.append('cat', this.state.data[0].catname);
                formData.append('description', this.state.data[0].description);

                axios.post('https://domaintobesocial.com/domaintobe/replydiscussion',
                    formData
                )
                .then((res) => {
                if(res.data.message == 'success')
                {   
                    document.getElementById("commentext").value = '';
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

    validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;
   
      if (!input["comment"]) {
        isValid = false;
        errors["comment"] = "Field is required.";
      }
      
      this.setState({
        errors: errors
      });
  
      return isValid;
    }


    handleChangeLogout()
    {
      window.localStorage.clear();
      window.location.reload();
    }

    componentDidMount() {
        let routeState
        // const {id} =this.props.location.state
        if(this.props.location.state){
            localStorage.setItem('routeState', JSON.stringify(this.props.location.state))
            routeState = this.props.location.state
        }else{
            routeState = localStorage.getItem('routeState')
            if(routeState) routeState = JSON.parse(routeState)
        }

        let id
        if(routeState == null){
            id = this.props.location.search.substring(1)
            if(localStorage.getItem('match') == 'true'){
                this.setState({showModal: false})
                id = this.props.location.search.substring(1)


                let userid = JSON.parse(window.localStorage.getItem("user"));
                const formData = new FormData();
                formData.append('id', id);
                formData.append('userid', userid.value);
                axios.post('https://domaintobesocial.com/domaintobe/singlediscussion',
                        formData
                    )
                .then((res) => {
                    if(res.data.status == 'data')
                    {   
                        this.setState({data: res.data.message});
                        {this.state.data.map((result) => {
                            this.setState({postlike: result.likes});
                            this.setState({postcomments: result.comments});
                            this.setState({postjoin: result.joins});
                            this.setState({postmemberjoins: result.members});
                        })}   
                    }else{
                        alert(res.data.message);
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                })

                const db = firebase.database();
                db.ref("chatwith/" + userid.value).on("value", snapshot => {
                  let chatingdatas = [];
                  snapshot.forEach(snap => {
                    chatingdatas.push(snap.val());
                  });
                  this.setState({ chatingdata: chatingdatas });
                });
                

                axios.post('https://domaintobesocial.com/domaintobe/getreplydiscussion',
                    formData
                )
                .then((response) => {
                    if(response.data.status == 'data')
                    {  
                        this.setState({discussions: response.data.message});
                    }else if(response.data.status == 'no'){
                        this.setState({discussions: []});
                    }else{
                        alert(response.data.message);
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                })


                const formData1 = new FormData();
                formData1.append('id', userid.value);
                formData1.append('user', userid.value);

                axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                    formData1
                )
                .then((response) => {
                    let input = this.state.input;
                    input.name = response.data.message.name;
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



            }else{
                this.setState({showModal: true})
            }

        }else{
            if(this.props.location.search.substring(1)){
                
                if(localStorage.getItem('match') == 'true'){
                    this.setState({showModal: false})
                    id = this.props.location.search.substring(1)

                    let userid = JSON.parse(window.localStorage.getItem("user"));
                    const formData = new FormData();
                    formData.append('id', id);
                    formData.append('userid', userid.value);
                    axios.post('https://domaintobesocial.com/domaintobe/singlediscussion',
                            formData
                        )
                    .then((res) => {
                        if(res.data.status == 'data')
                        {   
                            this.setState({data: res.data.message});
                            {this.state.data.map((result) => {
                                this.setState({postlike: result.likes});
                                this.setState({postcomments: result.comments});
                                this.setState({postjoin: result.joins});
                                this.setState({postmemberjoins: result.members});
                            })}   
                        }else{
                            alert(res.data.message);
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.log(error.message);
                    })


                const db = firebase.database();
                db.ref("chatwith/" + userid.value).on("value", snapshot => {
                  let chatingdatas = [];
                  snapshot.forEach(snap => {
                    chatingdatas.push(snap.val());
                  });
                  this.setState({ chatingdata: chatingdatas });
                });
                    

                    axios.post('https://domaintobesocial.com/domaintobe/getreplydiscussion',
                        formData
                    )
                    .then((response) => {
                        if(response.data.status == 'data')
                        {  
                            this.setState({discussions: response.data.message});
                        }else if(response.data.status == 'no'){
                            this.setState({discussions: []});
                        }else{
                            alert(response.data.message);
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.log(error.message);
                    })


                    const formData1 = new FormData();
                    formData1.append('id', userid.value);
                    formData1.append('user', userid.value);

                    axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                        formData1
                    )
                    .then((response) => {
                        let input = this.state.input;
                        input.name = response.data.message.name;
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

                }else{
                    this.setState({showModal: true})
                }
                
            }else{
                id = routeState.id


                let userid = JSON.parse(window.localStorage.getItem("user"));
                const formData = new FormData();
                formData.append('id', id);
                formData.append('userid', userid.value);
                axios.post('https://domaintobesocial.com/domaintobe/singlediscussion',
                        formData
                    )
                .then((res) => {
                    if(res.data.status == 'data')
                    {   
                        this.setState({data: res.data.message});
                        {this.state.data.map((result) => {
                            this.setState({postlike: result.likes});
                            this.setState({postcomments: result.comments});
                            this.setState({postjoin: result.joins});
                            this.setState({postmemberjoins: result.members});
                        })}   
                    }else{
                        alert(res.data.message);
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                })

                const db = firebase.database();
                db.ref("chatwith/" + userid.value).on("value", snapshot => {
                  let chatingdatas = [];
                  snapshot.forEach(snap => {
                    chatingdatas.push(snap.val());
                  });
                  this.setState({ chatingdata: chatingdatas });
                });
                

                axios.post('https://domaintobesocial.com/domaintobe/getreplydiscussion',
                    formData
                )
                .then((response) => {
                    if(response.data.status == 'data')
                    {  
                        this.setState({discussions: response.data.message});
                    }else if(response.data.status == 'no'){
                        this.setState({discussions: []});
                    }else{
                        alert(response.data.message);
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                })


                const formData1 = new FormData();
                formData1.append('id', userid.value);
                formData1.append('user', userid.value);

                axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                    formData1
                )
                .then((response) => {
                    let input = this.state.input;
                    input.name = response.data.message.name;
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
        }

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
                window.localStorage.removeItem('id');
                window.localStorage.removeItem('user');
                window.location = "/";
            }
        }else{
            window.localStorage.removeItem('user');
            window.location = "/";
        }

        let userid = JSON.parse(window.localStorage.getItem("user"));
        let button,joinbutton,discussionuser,did,image,vipimage;
        const userimage = this.state.userimage;
        const isViprole = this.state.isViprole;
        if(isViprole){
            vipimage = <img className="vip" src="/images/vip.png" align="icon"/>;
        }else{
            vipimage = '';
        }


        return (

            <div className="maindiv">
              <i className="fas fa-bars side_b"onClick={this.openPop.bind(this)}></i>
    <div className="sidbar_left">
        <i className="fas fa-times side_b close"  onClick={this.openClose.bind(this)}></i>
                    <div className="logo">
                        <Link to="/userdashboard">
                            <img src="images/logo.png" alt="logo"/>
                        </Link>
                    </div>
                    <ul>
                        <li>
                            <Link to="/userdashboard" >
                            <span><img src="/images/iconS1.png" align="icon"/></span> News Feed</Link>
                        </li>
                        <li><Link to="/userprofile"><span><img src="images/useri_1.png" align="icon"/></span> My Profile</Link></li>
                        <li>
                            <Link to="/messages">
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
                        {/* <li><Link to="pagesliked" ><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li> */}
                        <li><Link to="/favorites" ><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
                    </ul>
                </div>
                  <div className="main_menu ">
                        <ul>
                            <li>
                                <Link to="/userdashboard" className="active" >
                                News Feed</Link>
                            </li>
                            <li>
                                <Link to="/discussion" >
                                Discussion</Link>
                            </li>
                            <li>
                                <Link to="/help" >
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
                                <a className="dropdown-item" href="#">Action</a>
                                <Link className="dropdown-item" to="/userprofile">My Profile</Link>
                                <button className="dropdown-item" onClick={this.handleChangeLogout.bind(this)}>Logout</button>
                            </div>
                        </div> */}
                            <div className="dropdown">
                            <span className="dropdown-toggle" onClick={this.handleChangeLogout.bind(this)} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Logout                                                  
                            </span>
                            {/* <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <Link className="dropdown-item" to="/userprofile">My Profile</Link>
                                <button className="dropdown-item" onClick={this.handleChangeLogout.bind(this)}>Logout</button>
                            </div> */}
                        </div>
                    </div>
                    </div>
                    </div>
                <div className="in_center in_center_discussion">

                    <div className="head">
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn" type="submit"><img src="/images/searchicon.png" alt="icon"/> </button>
                        </form>
                        <Link to="/createpost" className="hpl">
                        <img src="/images/iconS2.png" align="icon"/> <span>Start Discussion</span></Link>
                    </div>

                    {this.state.data.length > 0  ?
                    <div className="listusr discussion">
                        <div className="test ">
                            <img className="hearticon" src="/images/iconS8.png" align="icon"/>
                            <div className="asuser">
                                {this.state.data.map((result) => {
                                    discussionuser = result.userid;
                                    did = result.id;
                                    if(result.userid == userid.value){
                                        button = '';
                                        joinbutton = '';
                                    }else{
                                        button = <a className="d_report" data-toggle="modal" data-target="#exampleModalHelp">Report</a>;
                                        joinbutton = <div className="dropdown">
                                        {/* <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-ellipsis-h"></i>
                                        </span>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div> */}
                                        <div className="join" onClick={() => this.joinPost(result.userid,result.catname,result.description)}>
                                        {this.state.postjoin}<br/><img src="/images/tk.png" alt="icon"/></div>
                                    </div>;
                                    }
                                return (
                                <span>
                                    <Link to="userprofile">
                                    <span className="userimg">
                                    <img src={result.image} align="icon"/>
                                    </span>
                                    </Link>
                                    <h5><a >{result.catname}</a> <span>Posted By {result.name}</span>{button}
                                    </h5>
                                    <p>{result.created} Ago</p>

                                    {joinbutton}

                                    <p>{result.description}</p>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="testin h-auto">
                                                <img className="w-100" src={result.singleimage} alt="ion"/>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="likecomment">
                                        <li  onClick={() => this.likePost(result.userid,result.catname,result.description)} ><img src="/images/like.png" alt="ion"/> {this.state.postlike}</li>
                                        <li><img src="/images/comment.png" alt="ion"/> {this.state.postcomments}</li>
                                        <li><img src="/images/shareI.png" alt="ion"/> 0</li>
                                        <li className="group_user"><img src="/images/group_user.png" alt="ion"/> {this.state.postmemberjoins} Members Joined</li>
                                    </ul>
                                </span>
                                )
                                })}
                                
                                <div className="allcomment singlediscussionsing">
                                    {this.state.discussions.length > 0 ? this.state.discussions.map((results, i) => 
                                    <>{results.hidecomment=="1" && this.state.isViprole!==false ?     
                                        <div className="commentin">
                                            <span className="userimg"><img className="w-100" src={results.image} align="icon"/></span>
                                            <h5>{results.name}<a className="reportbtn" data-tag={results.id} onClick={this.openModel}  >Report {results.hidecomment}</a></h5>
                                            <p>{results.comment}( <span>{results.created}</span> )</p>
                                            <ul className="likecomment">
                                                <li data-tag={results.id} onClick={() => this.openLikereply(i, results.id)}><img src="/images/like1.png" alt="ion"/>{results.likes}</li>
                                                <li onClick={() => this.openReplycomment(i, results.id)}><img src="/images/reply.png" alt="ion"/> Reply</li>
                                            </ul>

                                            <form className="replyid" data-tag={results.id} id={results.id} onSubmit={this.handleReplysubmit.bind(this, i)}>
                                            <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply' + results.id}
                                                value={this.state.values[i]} 
                                                name={this.state.values[i]} 
                                                onChange={this.handleGetreply.bind(this, i)}
                                                />
                                                <button className="comment" type="submit">Comment</button>
                                            </form>
                                        </div>
                                    : <>
                                    {results.hidecomment=="1" && userid.value==results.discussionuser ? 
                                    
                                    <div className="commentin">
                                            <span className="userimg"><img className="w-100" src={results.image} align="icon"/></span>
                                            <h5>{results.name}<a className="reportbtn" data-tag={results.id} onClick={this.openModel}  >Report {results.hidecomment}</a></h5>
                                            <p>{results.comment}( <span>{results.created}</span> )</p>
                                            <ul className="likecomment">
                                                <li data-tag={results.id} onClick={() => this.openLikereply(i, results.id)}><img src="/images/like1.png" alt="ion"/>{results.likes}</li>
                                                <li onClick={() => this.openReplycomment(i, results.id)}><img src="/images/reply.png" alt="ion"/> Reply</li>
                                            </ul>

                                            <form className="replyid" data-tag={results.id} id={results.id} onSubmit={this.handleReplysubmit.bind(this, i)}>
                                            <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply' + results.id}
                                                value={this.state.values[i]} 
                                                name={this.state.values[i]} 
                                                onChange={this.handleGetreply.bind(this, i)}
                                                />
                                                <button className="comment" type="submit">Comment</button>
                                            </form>
                                        </div>
                                    
                                    
                                    : <>
                                    
                                    {results.hidecomment=="0" ? 

                                    <div className="commentin">
                                        <span className="userimg"><img className="w-100" src={results.image} align="icon"/></span>
                                        <h5>{results.name}<a className="reportbtn" data-tag={results.id} onClick={this.openModel}  >Report {results.hidecomment}</a></h5>
                                        <p>{results.comment}( <span>{results.created}</span> )</p>
                                        <ul className="likecomment">
                                            <li data-tag={results.id} onClick={() => this.openLikereply(i, results.id)}><img src="/images/like1.png" alt="ion"/>{results.likes}</li>
                                           <li onClick={() => this.openReplycomment(i, results.id)}><img src="/images/reply.png" alt="ion"/> Reply</li>
                                        </ul>

                                        <form className="replyid" data-tag={results.id} id={results.id} onSubmit={this.handleReplysubmit.bind(this, i)}>
                                        <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search"  autoComplete="off" id={'reply' + results.id} value={this.state.values[i]} name={this.state.values[i]} onChange={this.handleGetreply.bind(this, i)} />
                                        <button className="comment" type="submit">Comment</button>
                                       </form>
                                    </div>
                                    
                                    
                                    : ""}
                                    
                                    </>}
                                    </> }</>

                                                             
                                    ) :"" }
                                    
                                  
                                </div>
                                <div className="likeshare">
                                    <form id="comment" onSubmit={this.handleSubmit}>
                                    {(isViprole) ?
                                        <div className="pcheck"><input type="checkbox" value="1" onChange={this.handleHidecomment.bind(this)}/>Hide comment</div>
                                    : ""}

                                        <input className="form-control me-2" type="search" placeholder="Your Comment..." aria-label="Search" name="comment" value={this.state.input.comment} onChange={this.handleChange} autoComplete="off"  id="commentext"/>
                                        <input type="hidden" value={did} id="did"/>
                                        <input type="hidden" value={discussionuser} id="discussionuser"/>
                                        <input type="hidden" value={userid.value} id="userid"/>
                                        <div className="text-danger">{this.state.errors.comment}</div>
                                        <button className="comment" type="submit">Comment</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                       "" // <div className="loadingicon" id="loadingicon" style={{display:'block'}}><img src="/images/loading.gif" /></div>
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

            <div className="modal fade" id="exampleModalHelp"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content HelpForm">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Report</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={this.handleReportSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Categories</label>
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
                                <div className="col-sm-12 text-center">
                                    <div className="form-group mb-0">
                                        <div className="userimgmain">
                                            <input type="file" onChange={this.imageChange}/>
                                            <div className="userimg">
                                                <img id="myImg" className="h-100" src="blank" />
                                            </div>
                                            <img className="camerai" src="/images/camerai.png" alt="your image"/>
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

            <div className="modal fade" id="exampleModalHelp1"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content HelpForm">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Report</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={this.handleReportreplySubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Categories</label>
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


            <div 
            className={`modal fade WelcomeModal ${this.state.showModal ? 'show' : ''}`} 
            style={{
                  display: `${this.state.showModal ? 'block' : 'none'}`,
                }}
            id="WelcomeModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={this.handlePassword}>
                <div className="modal-header">
                  <h4 className="modal-title">Private Post</h4>
                </div>
                <div className="modal-body">
                  <input type="password" id="password" className="form-control" name="password" placeholder="Enter password" value={this.state.input.password} onChange={this.handleChange}  autoComplete="off"/>
                  <div className="text-danger">{this.state.errors.password}</div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Submit</button>
                  <button type="button" className="btn btn-danger" onClick={this.closepopup.bind(this)}>Close</button>
                </div>
                </form>
              </div>
            </div>
          </div>


                </div>
            </div>
        );
    }
}

export default Singlediscussion;