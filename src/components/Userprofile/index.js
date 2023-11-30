import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import TimeInput from 'react-input-time';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import moment from 'moment';
import $ from 'jquery';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import UpgreadePlan from '../UpgreadePlan';
import swal from 'sweetalert';
const stripe = require('stripe')('sk_test_lsxxa2Ksy3I3qfl9HbnNtKyj00oAOPeZkp');
class Userprofile extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        data: [],
        input: {},
        stripeInput: {},
        stripe:{},
        posts:[],
        helps:[],
        stripeStatus:'Pending',
        errors: {},
        isViprole : false,
        friendsdata: [],
        postsdata: [],
        followingdata: [],
        friendsrequests: [],
        followers: [],referral:[],
        tags: [],
        files: [],
        galleryimages: [],
        from : '00:00',
        to : '00:00',
        StripeId:"",
        plans: [],
        checkedItems: [],
        userimage:'images/blank.png',
        checkall : '',
        copied: false,
        selectedFile: '',
        themecolor: '#016afb',
        themeimage: 'select2.jpg',
        setbannerimage: '',
        profession:[],
        buisnessFile: [],
        childVisible: false,
        businesscardimages:[],
        drivinglicenseimage: '',
        passportimage: '',
        subcategoryprofession:[],
        professionview:'',
        subprofessionview:'',
        studentidimage:'',
        licenseimage:'',
        uid:'',
        astrickSignImageInput: false,
        limit: [],
        getadvertisement:'',
        showadvertisement:false
       }

       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
    // this.imageChange = this.imageChange.bind(this);
       this.deleteGallery = this.deleteGallery.bind(this);
       this.handleBusiness = this.handleBusiness.bind(this);
       this.handleProfession = this.handleProfession.bind(this);
       this.handleadvertisementSubmit = this.handleadvertisementSubmit.bind(this);

    }
    handleButtonClick = () => {
        this.setState(prevState => ({
          showAdvertisement: !prevState.showAdvertisement // Toggling the session visibility
        }));
      };

    onChange = ({target: {value}}) => {
        this.setState({value, copied: false});
    }

    onClick = ({target: {innerHTML}}) => {
        console.log(`Clicked on "${innerHTML}"!`); 
    }

    onCopy = () => {
        this.setState({copied: true});
    }

    handleInputChange= (event) => {
        let newArray = [...this.state.checkedItems, event.target.id];
        if (this.state.checkedItems.includes(event.target.id)) {
          newArray = newArray.filter(day => day !== event.target.id);
        }
        this.setState({
          checkedItems: newArray
        });

        this.setState({checkall: ''});
    }
    getdatec(date)
    {
        
        var test=new Date(date*1000);
        return moment(test).format("YYYY/MM/DD")
    }
    handleInputAllGallery = (event) => {
        if(event.target.checked){
            this.setState({checkall: event.target.id});
        }else{
            this.setState({checkall: ''});
        }
    }

    deleteGallery(event) {
        event.preventDefault();
        console.log("items lenght", this.state.checkedItems.length);
        if(this.state.checkedItems.length == 0)  {
            alert("Please select the image");
        }
        else {
        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        document.getElementById('loadingicon').style.display = 'block';
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('all', this.state.checkall);
        formData.append('items', this.state.checkedItems);
        axios.post('https://domaintobesocial.com/domaintobe/deletegalley',
                formData
            )
        .then((res) => {
            if(res.data.message == 'success'){
                this.componentDidMount();
                // $('input:checkbox').attr('checked','checked');
                this.setState({
                    checkedItems: []
                  });
                $('input:checkbox').prop('checked', false); 
                console.log("testing 1")
                document.getElementById('loadingicon').style.display = 'none';
            }else{     
                console.log("res", res.data.message);                                                                                                                                                                                                                                                     
                alert(res.data.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
        }) 
    }}


    // imageChange(event){
    //     const preview = document.querySelector('#myImg');
    //     const file = document.querySelector('input[type=file]').files[0];
    //     const reader = new FileReader();
    //     var setfile = '';
    //     reader.addEventListener("load", function () {
    //         //convert image file to base64 string
    //        preview.src = reader.result;
    //     }, false);

    //     if (file) {
    //        reader.readAsDataURL(file);
    //     }
    // }

    fileSelectedHandler = (e) => {
        this.setState({
            astrickSignImageInput: false
        });
        this.setState({ files: [...this.state.files, ...e.target.files] });
    }

    uploadGallery = (e) => {
        if(this.state.files[0]){
        e.preventDefault();
        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        document.getElementById('loadingicon').style.display = 'block';
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        this.state.files.forEach((file) => {
            if(file.size/1000 > 2000) {
                this.state.limit.push(true);
            }
            else {
                this.state.limit.push(false);
                formData.append('files[]', file); 
            }
        });

        if(!this.state.limit.includes(true)){ 
             axios.post('https://domaintobesocial.com/domaintobe/galleryimages',
                formData
            )
        .then((res) => {
            //console.log(res);
            if(res.data.message == 'Successfully Upload'){
                swal("Success", res.data.message, "success");
                this.componentDidMount();
                this.setState({
                    files: []
                });
                this.setState({
                    limit: []
                });
                document.getElementById('loadingicon').style.display = 'none';
            }else{
                if(res.data.message == "<p>The file you are attempting to upload is larger than the permitted size.</p>") {
                swal('Oops!', "Upload file size less than 2Mb", "error");
                this.setState({
                    files: []
                });
                this.setState({
                    limit: []
                });
                this.componentDidMount();
                document.getElementById('loadingicon').style.display = 'none';
            }
            else {
                swal("Oops!", res.data.message, "error");
                this.setState({
                    files: []
                });
                this.setState({
                    limit: []
                });
                document.getElementById('loadingicon').style.display = 'none';
            }
            }

        })
        .catch((error) => {
            console.log(error.message);
        })
    }
    else 
    {
        swal("Oops!", "Please upload Image size under 2mb", "error");
        this.setState({
            files: []
        });
        this.setState({
             limit: []
         });
        document.getElementById('loadingicon').style.display = 'none';
    }
    }   
    else {
        this.setState({
            astrickSignImageInput: true
        })
        swal("Please Select The Image")
    }
    }

openPop(){
    // alert('asdfasdf');
    $(".dash_sidebar").toggleClass("main");
}

openClose(){
    $(".dash_sidebar").toggleClass("main");
    }
    componentDidMount() {

// $(document).ready(function(){
//         $(".side_b").click(function(){
  //$(".dash_sidebar").toggleClass("main");
// });
// })        
let curentlogin = JSON.parse(window.localStorage.getItem("user"));
this.setState({uid:curentlogin.value});
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                formData
            )
        .then((res) => {
            console.log('res message 12 12',res.data.message.planstatus);
            console.log("res.data.message.twitter", res.data.message.twitter);
            let input = this.state.input;
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
            input.referralid = res.data.message.referralid;
            input.plan = res.data.message.plan;
            input.planstatus = res.data.message.planstatus;
            input.expireddate = res.data.message.expireddate;
            input.university = res.data.message.university;
            input.certificate = res.data.message.certificate;
            input.licence = res.data.message.licence;
            input.drivinglicense = res.data.message.drivinglicense;
            input.references = res.data.message.references;
            input.facebook = res.data.message.facebook;
            input.twitter = res.data.message.twitter;
            input.tumbler = res.data.message.tumbler;
            input.snapchat = res.data.message.snapchat;
            input.amazon = res.data.message.amazon;
            input.ebay = res.data.message.ebay;
            input.whatsapp = res.data.message.whatsapp;
            input.marital_status= res.data.message.marital_status;
            input.firstname = res.data.message.firstname;
            input.lastname = res.data.message.lastname;
            input.image = res.data.message.image;
            input.passportimage=res.data.message.passportimage;
            input.bannerimage = res.data.message.bannerimage;
            
            
            if(res.data.message.themecolor == null){
                this.setState({ themecolor: '#016afb' });
            }else{
                this.setState({ themecolor: res.data.message.themecolor});
            }

            if(res.data.message.themeimage == null){
                this.setState({ themeimage: 'select2.jpg' });
            }else{
                this.setState({ themeimage: res.data.message.themeimage });
            }

            if(res.data.message.bannerimage == null){
                this.setState({ setbannerimage: 'http://domaintobesocial.com/images/bannerimage.png' });
            }else{
                this.setState({ setbannerimage: res.data.message.bannerimage });
            }

            this.setState({
              input
            },()=>{
                console.log('first name',this.state.input);
            });
         

            this.setState({ tags: res.data.message.tags,StripeId:res.data.message.stripe_id});
            this.setState({ from: res.data.message.from});
            this.setState({ to: res.data.message.to});
            this.setState({ galleryimages: res.data.message.galleryimages});
            this.setState({ businesscardimages: res.data.message.businesscard});

            if(res.data.message.roles == 'vip'){
                this.setState({isViprole: true});
            }else{
                this.setState({isViprole: false});
            }

            
            if((res.data.message.image == null) || (res.data.message.image == '') ){
                var image = '/images/blank.png';
            }else{
                var image = res.data.message.image;
            }   
           
            const preview = document.querySelector('#myImg');
            preview.src = image;
            this.setState({referral:res.data.reff});

        })
        .catch((error) => {
            console.log(error.message);
        })


        const formData3 = new FormData();
        formData3.append('id', curentlogin.value);
        // formData3.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getusersallposts',
                formData3
            )
        .then((response2) => {
            // console.log(response2);
            if(response2.data.status == 'data'){
                console.log('post data',response2.data.message);
                this.setState({postsdata: response2.data.message.newsfeed,helps:response2.data.message.helps,posts:response2.data.message.posts},()=>{
                    console.log('post data',this.state.postsdata);
                });
            }else{
                alert(response2.data.message);
            }

        })
        .catch((error) => {
            console.log(error.message);
        })


        const formData2 = new FormData();
        formData2.append('id', curentlogin.value);
        // formData2.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfollowing',
                formData2
            )
        .then((response1) => {
            //console.log(response1);
            if(response1.data.status = 'data'){
                this.setState({followingdata: response1.data.message});
            }else{
                alert(response1.data.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
        })


        const formData1 = new FormData();
        formData1.append('id', curentlogin.value);
        formData1.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfriendlist',
                formData1
            )
        .then((response) => {
            //console.log(response);
            if(response.data.status = 'data'){
                this.setState({friendsdata: response.data.message});
            }else if(response.data.status = 'no'){

            }else{
                alert(response.data.message);
            }
        })
        .catch((error) => {
            alert('Invalid Login1');
        })


        const formData4 = new FormData();
        formData4.append('id', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfriendrequests',
                formData4
            )
        .then((response3) => {
            //console.log(response3);
            if(response3.data.status = 'data'){
                this.setState({friendsrequests: response3.data.message});
            }else{
                alert(response3.data.message);
            }

        })
        .catch((error) => {
            alert('Invalid Login1');
        })


        const formData5 = new FormData();
        formData5.append('id', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getfollowers',
                formData5
            )
        .then((response4) => {
            if(response4.data.status = 'data'){
                this.setState({followers: response4.data.message});
            }else{
                alert(response4.data.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
        })

        axios.post('https://domaintobesocial.com/domaintobe/membershipplans',
        )
        .then((response5) => {
            //console.log(response5);
            this.setState({ plans: response5.data.result});
        })
        .catch((error) => {
            console.log(error.message);
        })


        axios.get('https://domaintobesocial.com/domaintobe/getprofessions').then(response6 => 
        {
            this.setState({profession: response6.data.message});
        }).catch((error) => {
            console.log(error.message);
        })
        

        axios.get('https://domaintobesocial.com/domaintobe/getprofessionssubcategories').then(response7 => 
        {
            this.setState({subcategoryprofession: response7.data.message});
        }).catch((error) => {
            console.log(error.message);
        })

        const formData55 = new FormData();
        formData55.append('uid', curentlogin.value);
        // formData3.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getAccountDetails',
        formData55
            )
        .then((response2) => {
            // console.log(response2);
            if(response2.data.status = 'success'){
            if(response2.data.details){
            let stripe = this.state.stripe;
            stripe.holdername=response2.data.details.holdername;
            stripe.routingnumber=response2.data.details.routingnumber;
            stripe.accountnumber=response2.data.details.accountnumber;
            stripe.email=response2.data.details.email;
            stripe.city=response2.data.details.city;
            stripe.addressone=response2.data.details.addressone;
            stripe.addresstwo=response2.data.details.addresstwo;
            stripe.state=response2.data.details.state;
            stripe.zipcode=response2.data.details.zipcode;
            stripe.ssn=response2.data.details.ssn;
            stripe.dob=response2.data.details.dob;
            stripe.firstname=response2.data.details.firstname;
            stripe.lastname=response2.data.details.lastname;
            stripe.phone=response2.data.details.phone;
            stripe.gender=response2.data.details.gender;
            stripe.company_name=response2.data.details.company_name;
            stripe.company_tin=response2.data.details.company_tin;
            this.setState({stripe});
            }
            if(response2.data.data && response2.data.data.individual?.verification.status)
            {
                this.setState({stripeStatus:response2.data.data.individual?.verification.status});
            }
            }else{
                alert(response2.data.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
        })
        axios.get('https://domaintobesocial.com/domaintobe/getadvertisement').then(response6 => 
        {
            //console.log(response6)
             this.setState({getadvertisement: response6.data});
        }).catch((error) => {
            console.log(error.message);
        })

    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({
          input
        },()=>{
            console.log('input on change event',this.state.input);
        });
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

    handleadvertisementSubmit(event){
        event.preventDefault();
        if(this.avalidated()){
            document.getElementById('loadingicon').style.display = 'block';
            let curentlogin = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('userid', curentlogin.value);
            formData.append('businessname', this.state.input.abusinessname);
            formData.append('advertisement', this.state.input.advertisement);
            formData.append('duration', this.state.input.duration);
            formData.append('description', this.state.input.adescription);
            axios.post('https://domaintobesocial.com/domaintobe/saveadvertisement',
                formData
            )
            .then((res) => {
                document.getElementById('loadingicon').style.display = 'none';
                swal("Done", res.data.message, "success");
                event.target.reset();
            })
            .catch((error) => {
                console.log(error.message);
            })

        }
    }


    avalidated(){
        let input = this.state.input;
        let errors = {};
        let isValid = true;
  
        if (!input["advertisement"]) {
          isValid = false;
          errors["advertisement"] = "Please enter type of advertisement.";
        }
  
        if (!input["abusinessname"]) {
          isValid = false;
          errors["abusinessname"] = "Please enter your buisnessname.";
        }
  
        if (!input["duration"]) {
          isValid = false;
          errors["duration"] = "Please select duration.";
        }
  
        if (!input["adescription"]) {
          isValid = false;
          errors["adescription"] = "Please enter description.";
        }
  
        this.setState({
          errors: errors
        });
    
        return isValid;
    }
    handleSubmitSocail(event){
        event.preventDefault();
        document.getElementById('loadingicon').style.display = 'block';
        var obj = JSON.parse(window.localStorage.getItem("user"));
        const formData3 = new FormData();
        formData3.append('facebook', this.state.input.facebook);
        formData3.append('twitter', this.state.input.twitter);
        formData3.append('tumbler', this.state.input.tumbler);
        formData3.append('snapchat', this.state.input.snapchat);
        formData3.append('amazon', this.state.input.amazon);
        formData3.append('ebay', this.state.input.ebay);
        formData3.append('whatsapp', this.state.input.whatsapp);
        formData3.append('userid', obj.value);
        formData3.append('type', 'social');
        axios.post('https://domaintobesocial.com/domaintobe/saveinfo',
        formData3
        )
        .then((res) => {
            if(res.data.message == 'success')
            {   document.getElementById('loadingicon').style.display = 'none';
                alert('Successfully Update');
                this.componentDidMount()
            }else{
                alert(res.data.message);
                this.componentDidMount()
            }
        })
        .catch((error) => {
            console.log(error.message);
        })
    }


    handleSubmit(event) {

        
        event.preventDefault();
        if(this.validate()){

            // var imgsrc = document.getElementById("myImg").src;
            // if(imgsrc == 'https://localhost:3000/blank'){
            //     var useimage = '';
            // }else{
            //     var useimage = imgsrc;
            // }
            document.getElementById('loadingicon').style.display = 'block';
            var obj = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('name', this.state.input.name);
            // formData.append('lname', this.state.input.lname);
            formData.append('firstname', this.state.input.firstname);
            formData.append('lastname', this.state.input.lastname);
            formData.append('email', this.state.input.email);
            formData.append('mobile', this.state.input.mobile);
            formData.append('marital_status', this.state.input.marital_status);
            //formData.append('profession', this.state.input.profession);
            //formData.append('buisnessname', this.state.input.buisnessname);
            //formData.append('university', this.state.input.university);
            //formData.append('certificate', this.state.input.certificate);
            //formData.append('licence', this.state.input.licence);
            formData.append('references', this.state.input.references);
            //formData.append('days', this.state.input.days);
            formData.append('address', this.state.input.address);
            formData.append('age', this.state.input.age);
            formData.append('description', this.state.input.description);
            //formData.append('from', this.state.input.from);
            //formData.append('to', this.state.input.to);
            formData.append('tags', this.state.tags);
            formData.append('userid', obj.value);
            // formData.append('image', useimage);
            formData.append('banner', this.state.selectedFile);
            formData.append('drivinglicense', this.state.drivinglicenseimage);
            formData.append('passport', this.state.passportimage);
            formData.append('studentid', this.state.studentidimage);
            formData.append('type', 'profile');
            // formData.append('facebook', this.state.input.facebook);
            // formData.append('twitter', this.state.input.twitter);
            // formData.append('tumbler', this.state.input.tumbler);
            // formData.append('snapchat', this.state.input.snapchat);
            // formData.append('amazon', this.state.input.amazon);
            // formData.append('ebay', this.state.input.ebay);
            // formData.append('whatsapp', this.state.input.whatsapp);
            //formData.append('businesscard', this.state.buisnessFile);
            formData.append('bannerimage', this.state.setbannerimage);
            axios.post('https://domaintobesocial.com/domaintobe/saveinfo',
                formData
            )
            .then((res) => {
                if(res.data.message == 'success')
                {   document.getElementById('loadingicon').style.display = 'none';
                    alert('Successfully Update');
                    this.componentDidMount()
                }else{
                    alert(res.data.message);
                    this.componentDidMount()
                }
            })
            .catch((error) => {
                console.log(error.message);
            })

        }
    }

    bannerChange = (e) => {
        this.setState({ selectedFile: e.target.files[0] });
    }

    drivinglicense = (e) => {
        this.setState({ drivinglicenseimage: e.target.files[0] });
    }

    studentid = (e) => {
        this.setState({ studentidimage: e.target.files[0] });
    }

    licenceImage = (e) => {
        this.setState({ licenseimage: e.target.files[0] });
    }

    passport = (e) => {
        this.setState({ passportimage: e.target.files[0] });
    }

    validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;

      if (!input["name"]) {
        isValid = false;
        errors["name"] = "Please enter your username.";
      }
  
      if (typeof input["name"] !== "undefined") {
        const re = /^\S*$/;
        if(input["name"].length < 6 ){
            isValid = false;
            errors["name"] = "Please enter valid username.";
        }
      }

    //   if (!input["lname"]) {
    //     isValid = false;
    //     errors["lname"] = "Please enter your last name.";
    //   }

     if (!input["email"]) {
        isValid = false;
        errors["email"] = "Please enter your email Address.";
      }
  
      if (typeof input["email"] !== "undefined") {
          
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(input["email"])) {
          isValid = false;
          errors["email"] = "Please enter valid email address.";
        }
      }

      if (!input["mobile"]) {
        isValid = false;
        errors["mobile"] = "Please enter your mobile.";
      }

      if (typeof input["mobile"] !== "undefined") {
        const rep = /^\d*$/;
        if(input["mobile"].length < 10 || !rep.test(input["mobile"])){
            isValid = false;
            errors["mobile"] = "Please enter your valid 10 digit mobile.";
        }
      }

    //   if (!input["profession"]) {
    //     isValid = false;
    //     errors["profession"] = "Please enter your profession.";
    //   }

    //   if (!input["buisnessname"]) {
    //     isValid = false;
    //     errors["buisnessname"] = "Please enter your buisnessname.";
    //   }

    //   if (!input["days"]) {
    //     isValid = false;
    //     errors["days"] = "Please add your day.";
    //   }

      if (!input["address"]) {
        isValid = false;
        errors["address"] = "Please enter your address.";
      }

      if (!input["description"]) {
        isValid = false;
        errors["description"] = "Please enter your description.";
      }

      if (!input["age"]) {
        isValid = false;
        errors["age"] = "Please enter your age.";
      }

    //    if (!input["university"]) {
    //     isValid = false;
    //     errors["university"] = "Please enter your university.";
    //    }

    //     if (!input["certificate"]) {
    //     isValid = false;
    //     errors["certificate"] = "Please enter your degree certificate.";
    //     }

    //     if (!input["licence"]) {
    //         isValid = false;
    //         errors["licence"] = "Please enter your business licence.";
    //     }


       if (typeof input["age"] !== "undefined") {
            const rep = /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;
            if (rep.test(input["age"])) {
                var parts =input["age"].split("/");
                var dtDOB = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
                var dtCurrent = new Date();
                
                if (dtCurrent.getFullYear() - dtDOB.getFullYear() < 16) {
                    isValid = false;
                    errors["age"] = "Eligibility minimum 16 years.";
                }

                if (dtCurrent.getFullYear() - dtDOB.getFullYear() == 16) {
 
                    //CD: 11/06/2018 and DB: 15/07/2000. Will turned 18 on 15/07/2018.
                    if (dtCurrent.getMonth() < dtDOB.getMonth()) {
                        isValid = false;
                        errors["age"] = "Eligibility minimum 16 years.";
                    }
                    if (dtCurrent.getMonth() == dtDOB.getMonth()) {
                        //CD: 11/06/2018 and DB: 15/06/2000. Will turned 18 on 15/06/2018.
                        if (dtCurrent.getDate() < dtDOB.getDate()) {
                            isValid = false;
                            errors["age"] = "Eligibility minimum 16 years.";
                        }
                    }
                }

            }else{
                isValid = false;
                errors["age"] = "Enter date in dd/MM/yyyy format ONLY.";
            }

            
        }
        

      // if (!input["from"]) {
      //   isValid = false;
      //   errors["from"] = "Please enter from time.";
      // }

      // if (!input["to"]) {
      //   isValid = false;
      //   errors["to"] = "Please enter to time.";
      // }

      this.setState({
        errors: errors
      });
  
      return isValid;
    }

    acceptFriendrequest = (i,id)  => {
        const formData = new FormData();
        formData.append('id', id);
        axios.post('https://domaintobesocial.com/domaintobe/acceptfriendrequests',
            formData
        )
        .then((res) => {
            swal(res.data.message);
            window.location.reload(false);
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    unFriendrequest = (i,id) => {
        const formData = new FormData();
        formData.append('id', id);
        axios.post('https://domaintobesocial.com/domaintobe/removefriend',
            formData
        )
        .then((res) => {
            alert(res.data.message);
            window.location.reload(false);
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    changebutton = ()  => {
        document.getElementsByName("submitform")[0].type = "submit";
    }

    removeTag = (i) => {
        const newTags = [ ...this.state.tags ];
        newTags.splice(i, 1);
        this.setState({ tags: newTags });
    }

    inputKeyDown = (e) => {
    document.getElementsByName("submitform")[0].type = "button";
        const val = e.target.value;
        if (e.key === 'Enter' && val) {
          if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
            return;
          }
          this.setState({ tags: [...this.state.tags, val]});
          this.tagInput.value = null;
        } else if (e.key === 'Backspace' && !val) {
          this.removeTag(this.state.tags.length - 1);
        }
    }

    cardChange = (e) => {
        this.setState({ buisnessFile: [...this.state.buisnessFile, ...e.target.files] });
    }

    onShowfields() {
        this.setState({childVisible: !this.state.childVisible});
    }

    stripeValidate() {
        let input = this.state.stripe;
    
        let isValid = true;

        if(!input.holdername) {
            isValid = false;
            alert('holdername');
        }

        if (!input.firstname) {
            isValid = false;
            alert('firstname');
          }

          if (!input.lastname) {
            isValid = false;
            alert('lastn');
          }

        //   if (!input.gender) {
        //     isValid = false;
        //     alert('gender');
        //   }

          if (!input.email) {
            isValid = false;
            alert('email');
          }

          if (!input.phone) {
            isValid = false;
            alert('phone');
          }

          if (!input.routingnumber) {
            isValid = false;
            alert('routing');
          }

          if (!input.accountnumber) {
            isValid = false;
            alert('acc');
          }

          if (!input.addressone) {
            isValid = false;
            alert('addressone');
          }

          if (!input.addresstwo) {
            isValid = false;
            alert('addresstwo');
          }

          if (!input.city) {
            isValid = false;
            alert('city');
          }

          if (!input.state) {
            isValid = false;
            alert('state');
          }

          if (!input.zipcode) {
            isValid = false;
            alert('zipcode');
          }
          
          if (!input.ssn) {
            isValid = false;
            alert('ssn');
          }
          if (!input.dob) {
            isValid = false;
            alert('dob');
          }

     
      alert(isValid);
          return isValid;
    }

    validated(){
        let input = this.state.input;
        let errors = {};
        let isValid = true;
  
        if (!input["profession"]) {
          isValid = false;
          errors["profession"] = "Please enter your profession.";
        }
  
        if (!input["buisnessname"]) {
          isValid = false;
          errors["buisnessname"] = "Please enter your buisnessname.";
        }
  
        if (!input["days"]) {
          isValid = false;
          errors["days"] = "Please add your day.";
        }
  
        if (!input["university"]) {
          isValid = false;
          errors["university"] = "Please enter your university.";
        }
  
        if (!input["certificate"]) {
          isValid = false;
          errors["certificate"] = "Please enter your degree certificate.";
        }
  
        // if (!input["licence"]) {
        //     isValid = false;
        //     errors["licence"] = "Please enter your business licence.";
        // }
  
        // if (!input["from"]) {
        //   isValid = false;
        //   errors["from"] = "Please enter from time.";
        // }
  
        // if (!input["to"]) {
        //   isValid = false;
        //   errors["to"] = "Please enter to time.";
        // }
  
        this.setState({
          errors: errors
        });
    
        return isValid;
    }

    handleBusiness(event) {
        event.preventDefault();
        if(this.validated()){
            document.getElementById('loadingicon').style.display = 'block';
            var obj = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('profession', this.state.input.profession);
            formData.append('buisnessname', this.state.input.buisnessname);
            formData.append('university', this.state.input.university);
            formData.append('certificate', this.state.input.certificate);
            formData.append('days', this.state.input.days);
            formData.append('subcategory', this.state.input.subprofession);
            formData.append('from', document.getElementById("from").value);
            formData.append('to', document.getElementById("to").value);
            formData.append('licenseimage', this.state.licenseimage);
            formData.append('userid', obj.value);
            this.state.buisnessFile.forEach((file) => formData.append('files[]', file));
            // formData.append('businesscard', this.state.buisnessFile);
            axios.post('https://domaintobesocial.com/domaintobe/businessdetails',
                formData
            )
            .then((res) => {
                if(res.data.message == 'success')
                {   document.getElementById('loadingicon').style.display = 'none';
                    alert('Successfully Update');
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

    handelchangemaritalStatus(e){

    }

    updatestrip=async(e)=>
    {

        e.preventDefault();
        if(this.stripeValidate()){
        if(this.state.stripeStatus!=='verified'){
      
            // if(this.validated() && this.state.stripe.cart_number.length==16 && this.state.stripe.card_expiry_month.length==2 && this.state.stripe.card_expiry_year.length==2
            // && this.state.stripe.card_cvc.length==3){
                var obj = JSON.parse(window.localStorage.getItem("user"));
                const formData = new FormData();
                formData.append('holdername', this.state.stripe.holdername);
                formData.append('routingnumber', this.state.stripe.routingnumber);
                formData.append('accountnumber', this.state.stripe.accountnumber);
                formData.append('email', this.state.stripe.email);
                formData.append('city', this.state.stripe.city);
                formData.append('addressone', this.state.stripe.addressone);
                formData.append('addresstwo', this.state.stripe.addresstwo);
                formData.append('state', this.state.stripe.state);
                formData.append('zipcode', this.state.stripe.zipcode);
                formData.append('ssn', this.state.stripe.ssn);
                formData.append('dob', this.state.stripe.dob);
                formData.append('firstname', this.state.stripe.firstname);
                formData.append('lastname', this.state.stripe.lastname);
                formData.append('phone', this.state.stripe.phone);
                formData.append('gender', 'male');
                formData.append('uid', obj.value);
                formData.append('company_name', this.state.stripe.company_name);
                formData.append('company_tin',this.state.stripe.company_tin);
                axios.post('https://domaintobesocial.com/domaintobe/makestripe',
                formData
            )
            .then((res) => {
                if(res.data.status == 'success')
                {   document.getElementById('loadingicon').style.display = 'none';
                    alert(res.data.message);
                    //this.componentDidMount();
                }else{
                    alert(res.data.message);
                }
            })
            .catch((error) => {
                console.log(error.message);
            })
        // }else{
        //     alert('Please enter valid details');
        // }
        }
    }
    else {
        //alert("All fields are manatory")
    }
    }

    selecthemecolor = (i,id) => {
        document.getElementById('loadingicon').style.display = 'block';
        var currentuser = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('user', currentuser.value);
        formData.append('color', i);
        formData.append('image', id);
        axios.post('https://domaintobesocial.com/domaintobe/changetheme',
            formData
        )
        .then((res) => {
            if(res.data.message == 'success')
            {   
                alert('Successfully Update');
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

    usercover=(e)=>{
        const preview = document.querySelector('.inbanner');
        const file = e.target.files[0];
        const reader = new FileReader();
        var setfile = '';
        reader.addEventListener("load", function () {
            //convert image file to base64 string
        preview.src = reader.result;
        }, false);

        if (file) {
        reader.readAsDataURL(file);
        }

        var currentuser = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('user', currentuser.value);
        formData.append('image', e.target.files[0]);
        formData.append('type', '1');
        axios.post('https://domaintobesocial.com/domaintobe/uploadimage',
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

    userimage = (e) => {
        const preview = document.querySelector('#myImg');
        const file = e.target.files[0];
        const reader = new FileReader();
        var setfile = '';
        reader.addEventListener("load", function () {
            //convert image file to base64 string
        preview.src = reader.result;
        }, false);

        if (file) {
        reader.readAsDataURL(file);
        }

        var currentuser = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('user', currentuser.value);
        formData.append('image', e.target.files[0]);
    
        axios.post('https://domaintobesocial.com/domaintobe/uploadimage',
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


    handelchangestripe(event) {
        let stripe = this.state.stripe;
        stripe[event.target.name] = event.target.value;
        this.setState({
            stripe
        });
    }
    // editpage(){
    //     $('#mp1').addClass('diplay1');
    //     $('#mp2').removeClass('diplay1');
    // }
    // openProfile(){
    //     $('#mp1').removeClass('diplay1');
    // }

    editpage(){
        $('#mp1').toggleClass('diplay1');
        $('#mp2').toggleClass('diplay1');
    }
    openProfile(){
        $('#mp1').toggleClass('diplay1');
        $('#mp2').toggleClass('diplay1');
    }
 
    
    render() {

        const { showAdvertisement } = this.state;
        //console.log(this.state.checkall);
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
      
        const { tags } = this.state;
        const { plans } = this.state;
        const { galleryimages } = this.state;
        const { businesscardimages } = this.state;

        const isViprole = this.state.isViprole;
        const from = this.state.from;
        const to = this.state.to;
        let vipimage,gallerybutton,theme,bannerimage,businessbutton,galleroption;
       
        if(isViprole){
            vipimage = <div className="report_btni"><img src="/images/vip.png" alt="images"/></div>;
            gallerybutton = <div className="uplodim"><input type="file" multiple onChange={this.fileSelectedHandler} accept=".jpg,.jpeg,.png, .mp4"/>Choose images<button type="button" onClick={this.uploadGallery}>Upload</button></div>;

            theme = <div class="user2">
            <h3>Select theme</h3>
            <ul class="llctthems">
                <li><span onClick={() => this.selecthemecolor('#016afb', 'select2.jpg')}    style={{ backgroundImage: `url(/images/select2.jpg)`}} ></span></li>
                <li><span onClick={() => this.selecthemecolor('#66a21c', 'select1.jpg')}  style={{ backgroundImage: `url(/images/select1.jpg)`}} ></span></li>
                <li><span onClick={() => this.selecthemecolor('#e3611c', 'select3.jpg')} style={{ backgroundImage: `url(/images/select3.jpg)`}} ></span></li>
                <li><span onClick={() => this.selecthemecolor('#000116', 'select4.jpg')} style={{ backgroundImage: `url(/images/select4.jpg)`}} ></span></li>
            </ul>
        </div>;
            
            businessbutton = <li><a data-toggle="tab" href="#business">Business Details</a></li>
            galleroption = <li><a data-toggle="tab" href="#Gallery">Gallery</a></li>
            
        }else{
            vipimage = '';
            gallerybutton = '';
            theme = '';
            businessbutton = '';
            galleroption = '';
        }

        

        return (
            <span>
                <div className="inbanner"  style={{ backgroundImage: `url(${this.state.setbannerimage})`}} >
                <span className="uploadImg">
                        <img className="camerai" src="/images/camerai.png" alt="your image" />Upload
                        <input className="form-control" type="file" id="userimage" name="userimage" onChange={this.usercover.bind(this)} accept=".jpg,.jpeg,.png"/>
                    </span>
                </div>
                <section className="dashboard p-0" style={{ backgroundImage: `url(${'/images/'+this.state.themeimage})`}}>
                <div className="container userprofile">
           
               

              
                    <div className="loadingicon" id="loadingicon"><img src="/images/loading.gif" /></div>
                    <div className="dash_top">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="user pro_user" style={{backgroundColor: this.state.themecolor}} >
                                <div className="uphead">
                                    {vipimage}
                                    <div className="userimg">
                                        <img id="myImg" src="/images/blank.png" alt="your image" />
                                        <span className="uploadImg">
                                            <img className="camerai" src="/images/camerai.png" alt="your image" />
                                            <input className="form-control" type="file" id="userimage" name="userimage" onChange={this.userimage} accept=".jpg,.jpeg,.png"/>
                                        </span>
                                    </div>
                                    <h3>{this.state.input.name}</h3>
                                    <p>{this.state.input.description}</p>
                                    <h5>{this.state.input.email}</h5>
                                    <h6>Your code {this.state.input.referralid} 
                                    <CopyToClipboard text={'https://domaintobesocial.com/Signup/?'+this.state.input.referralid}
                                      onCopy={() => this.setState({copied: true})}>
                                      <span style={{cursor: "pointer"}}> <i className="fa fa-copy"></i></span>
                                    </CopyToClipboard>
                                    {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
                                    </h6>
                                    <h6>Tags</h6>
                                    <ul>
                                        { tags?.map((tag, i) => (
                                            (tag) ? <li>{tag}</li> : ""
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <h5 className="socialicon">

{this.state.input.facebook && this.state.input.facebook!=="" ? <span><a href={this.state.input.facebook} target="_blank" ><i className="fab fa-facebook-f"></i></a></span>:""}

{this.state.input.twitter && this.state.input.twitter!=="" ? <span><a href={this.state.input.twitter} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a></span>:""}

{this.state.input.snapchat && this.state.input.snapchat!=="" ? <span><a href={this.state.input.snapchat} target="_blank"><i className="fab fa-snapchat-ghost"></i></a></span>:""}

{this.state.input.amazon && this.state.input.amazon!=="" ? <span><a href={this.state.input.amazon} target="_blank"><i className="fab fa-amazon"></i></a></span>:""}

{this.state.input.whatsapp && this.state.input.whatsapp!=="" ? <span><a href={'https://wa.me/'+this.state.input.whatsapp} target="_blank"><i className="fab fa-whatsapp"></i></a></span>:""}

{this.state.input.tumbler && this.state.input.tumbler!=="" ? <span><a href={this.state.input.tumbler} target="_blank"><i className="fab fa-tumblr"></i></a></span>:""}

{this.state.input.ebay && this.state.input.ebay!=="" ? <span><a href={this.state.input.ebay} target="_blank"><i className="fab fa-ebay"></i></a></span>:""}
{this.state.input.tiktok && this.state.input.tiktok!=="" ? <span><a href={this.state.input.tiktok} target="_blank"><i class="fab fa-tiktok"></i></a></span>:""}
{this.state.input.Instagram && this.state.input.Instagram!=="" ? <span><a href={this.state.input.Instagram} target="_blank"><i class="fab fa-instagram"></i></a></span>:""}
{this.state.input.Reddit && this.state.input.Reddit!=="" ? <span><a href={this.state.input.Reddit} target="_blank"><i class="fab fa-reddit"></i></a></span>:""}
{this.state.input.WeChat && this.state.input.WeChat!=="" ? <span><a href={this.state.input.WeChat} target="_blank"><i className="fab fa-weixin"></i></a></span>:""}

</h5>
                        </div>
                        <div className="col-md-6">
                            {theme}
                        </div>
            </div>
            </div>
            <div className="dash_topmain">
                <i className="fas fa-bars side_b" onClick={this.openPop.bind(this)}></i>
                <div className="dash_sidebar">
                    <i className="fas fa-times side_b close" onClick={this.openClose.bind(this)}></i>
                    <ul className="nav nav-tabs">
                        <li><Link to="/userdashboard">Home</Link></li>
                        <li><a className="active" data-toggle="tab" onClick={this.openProfile.bind(this)} href="#bioinfo">My Profile</a></li>
                        <li><a data-toggle="tab" href="#posts">Posts</a></li>
                        <li><a data-toggle="tab" href="#social">Social Links</a></li>
                        {businessbutton}
                        <li><a data-toggle="tab" href="#Friends">Friends</a></li>
                        <li><a data-toggle="tab" href="#friendrequests">Friend Requests</a></li>
                        {galleroption}
                        <li><a data-toggle="tab" href="#Followers">Followers</a></li>
                        <li><a data-toggle="tab" href="#Following">Following</a></li>
                        <li><a data-toggle="tab" href="#Membership">Vip Membership</a></li>
                        <li><a data-toggle="tab" href="#Referral">Referral Details</a></li>
                        <li><a data-toggle="tab" href="#StripeId">Stripe Id</a></li>
                        <li><a data-toggle="tab" href="#Advertisement">Advertisement</a></li>
                    </ul>
                </div>
                <div className="tab-content">
                    <div id="posts" className="tab-pane fade">
                        <h3>Posts</h3>
                        <div className="listusr help Postall">
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">News Feeds</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Discussion</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">help</a>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
    <div className="row">

{this.state.postsdata?.map((resultp) => {
    console.log(resultp)
return (
    <div className="col-sm-6 col-lg-4  mb-3">
        <div className="singleposttest">
            <div className="asuser mb-0">
                <span className="userimg"><img src={resultp.userimage?resultp.userimage:this.state.userimage} align="icon"/></span>
                <h5>{resultp.username}
                </h5>
                <p>{resultp.created} Ago</p>
            </div>
            <div className="contants">
                
            {resultp.images && resultp.images!=='' ? <div class="img"><img class="w-100" src={resultp.images}/></div> :""}
              <p>{resultp.posts}</p>
              <i class="fa fa-thumbs-up g-pos-rel g-top-1 g-mr-3"></i>{resultp.likes}
                    
                 
             <Link to={'editPost/'+resultp.id}>Edit post <i className="fas fa-long-arrow-alt-right"></i></Link>
            </div>
        </div>
    </div>
    )
})}

</div></div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
  <div className="row">
  {this.state.posts?.map((resultp) => {
   //console.log(this.state.posts) 
    
return (
    <div className="col-sm-6 col-lg-4  mb-3">
        
        <div className="singleposttest">
            <div className="asuser mb-0">
                <span className="userimg"><img src={resultp.image?resultp.image:this.state.userimage} align="icon"/></span>
                <h5>{resultp.name}
                </h5>
                <p>{resultp.created} Ago</p>
            </div>
            <div className="contants">
            {resultp.images && resultp.image!=='' ? <div class="img"><img class="w-100" src={"https://domaintobesocial.com/domaintobe/assets/allimages/"+resultp.images}/></div> :""}
              <p>{resultp.description}</p>
             <Link to={'editPost/'+resultp.id}>Edit post <i className="fas fa-long-arrow-alt-right"></i></Link>
            </div>
        </div>
    </div>
    )
})}
  </div></div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
  <div className="row">
  {this.state.helps?.map((resultp) => {
return (
    <div className="col-sm-6 col-lg-4  mb-3">
        <div className="singleposttest">
            <div className="asuser mb-0">
                <span className="userimg"><img src={resultp.userimage?resultp.userimage:this.state.userimage} align="icon"/></span>
                <h5>{resultp.username}
                </h5>
                <p>{resultp.created} Ago</p>
            </div>
            <div className="contants">
            {resultp.image && resultp.image!=='' ? <div class="img"><img class="w-100" src={resultp.image}/></div> :""}
              <p>{resultp.description}</p>
             <Link to={'editPost/'+resultp.id}>Edit post <i className="fas fa-long-arrow-alt-right"></i></Link>
            </div>
        </div>
    </div>
    )
})}
  </div>
</div>
</div>
                        
                            
                        </div>
                    </div>

                    <div id="bioinfo" className="tab-pane fade show active">
                    <div className="bus_det editInformation view1" id="mp1">
                            <h3>My Profile <a onClick={this.editpage.bind(this)} ><i class="fa fa-solid fa-edit"></i></a></h3>
                            <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                {/* <div className="col-sm-6">
                                <div className="tes">
                                <h4>First Name</h4>
                                <input type="text" id="name" className="form-control" name="name" placeholder="First name" value={this.state.input.name} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.name}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Last Name</h4>
                                <input type="text" className="form-control" name="lname" placeholder="Last name" id="lname" value={this.state.input.lname} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.lname}</div>
                                </div>
                                </div> */}

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>First Name</h4>
                                <p >{this.state.input.firstname}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Last Name</h4>
                                <p >{this.state.input.lastname}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Username</h4>
                                <p>{this.state.input.name}</p>
                                </div>
                                </div>

                                
                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Email address</h4>
                                <p>{this.state.input.email}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Phone Number</h4>
                                <p>{this.state.input.mobile}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>References</h4>
                                <p>{this.state.input.references}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Marital Status</h4>
                                <p>{this.state.input.marital_status}</p>
                                </div>
                                </div>
                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Address</h4>
                                <p>{this.state.input.address}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Dob<sup>(dd/MM/yyyy)</sup></h4>
                                <p>{this.state.input.age}</p>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Tags</h4>
                                {/* <input type="text" className="form-control" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /> */}
                              
                                    <ul className="input-tag__tags">
                                    { tags?.map((tag, i) => (
                                        (tag) ? 
                                            <li key={tag}>
                                            {tag}
                                            {/* <button type="button" onClick={() => { this.removeTag(i); }}>+</button> */}
                                            <button type="button">+</button>
                                            </li>
                                        : 
                                        ""
                                    ))}
                                    <li className="input-tag__tags__input"></li>
                                    </ul>
                                      
                                
                                
                                </div>
                                </div>
                                <div className="col-sm-6"><div className="tes"><h4>Banner Image</h4>
                                <img className="w-100" src={this.state.input.bannerimage}/>
                                </div></div>

                                <div className="col-sm-6"><div className="tes"><h4>Driving License</h4>
                                <img className="w-100" src={this.state.input.drivinglicense}/>
                                </div></div>

                                <div className="col-sm-6"><div className="tes"><h4>Passport</h4>
                                <img className="w-100" src={this.state.input.passportimage}/>
                                </div></div>

                                


                                <div className="col-sm-12">
                                <div className="tes">
                                <h4>Bio </h4>
                                <p>{this.state.input.description}</p>
                               
                                </div>
                                </div>
                            </div>
                           
                            </form>
                        </div>
                        <div className="bus_det editInformation diplay1" id="mp2">
                            <h3>Edit Profile</h3>
                            {/* {(() => {
                                console.log('hshhs',this.state.errors);  
                                   
                            })()} */}
                            <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                {/* <div className="col-sm-6">
                                <div className="tes">
                                <h4>First Name</h4>
                                <input type="text" id="name" className="form-control" name="name" placeholder="First name" value={this.state.input.name} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.name}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Last Name</h4>
                                <input type="text" className="form-control" name="lname" placeholder="Last name" id="lname" value={this.state.input.lname} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.lname}</div>
                                </div>
                                </div> */}

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>First Name {this.state.errors.firstname ? <span style={{color: "red"}}>*</span> : ''}</h4>
                                <input type="text" id="name" className="form-control" name="firstname" placeholder="First name" value={this.state.input.firstname} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.firstname}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Last Name</h4>
                                <input type="text" className="form-control" name="lastname" placeholder="Last name" id="lname" value={this.state.input.lastname} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.lastname}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Username</h4>
                                <input type="text" id="name" className="form-control" name="username" placeholder="Username" value={this.state.input.name} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.name}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Email address{this.state.errors.email?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</h4>
                                <input type="text" className="form-control" name="email" placeholder="Enter email" id="email" value={this.state.input.email} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.email}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Phone Number{this.state.errors.mobile?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</h4>
                                <input type="text" className="form-control" name="mobile" placeholder="Enter number" id="mobile" value={this.state.input.mobile} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.mobile}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>References{this.state.errors.references?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</h4>
                                <input type="text"  name="references" value={this.state.input.references} onChange={this.handleChange} className="form-control" id="references" autoComplete="off"/>
                                <div className="text-danger">{this.state.errors.references}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                        <h4>Marital Status</h4>
                                        <select name="marital_status"
                                        defaultValue={this.state.input.marital_status} 
                                        value={this.state.input.marital_status}
                                         className="form-control" id="marital_status" onChange={this.handleChange}>
                                            <option value="" disabled>Select Marital Status</option>
                                            <option value="Single" >Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Certain cases">Certain cases</option>
                                            <option value="Registered partnership">Registered partnership</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Address{this.state.errors.address?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</h4>
                                <input type="text" className="form-control" name="address" id="address" placeholder="Address" value={this.state.input.address} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.address}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Dob<sup>(dd/MM/yyyy)</sup>{this.state.errors.age?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</h4>
                                <input type="text" className="form-control" name="age" id="age" placeholder="Age" value={this.state.input.age} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.age}</div>
                                </div>
                                </div>


                                {/* <div className="col-sm-6">
                                <div className="tes">
                                <h4>Profile Image</h4>
                                <input type="file" className="form-control"  accept=".jpg,.jpeg,.png"/>
                                </div>
                                </div> */}

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Tags</h4>
                                <input type="text" className="form-control" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} />
                              
                                    <ul className="input-tag__tags">
                                    { tags?.map((tag, i) => (
                                        (tag) ? 
                                            <li key={tag}>
                                            {tag}
                                            <button type="button" onClick={() => { this.removeTag(i); }}>+</button>
                                            </li>
                                        : 
                                        ""
                                    ))}
                                    <li className="input-tag__tags__input"></li>
                                    </ul>
                                      
                                
                                
                                </div>
                                </div>
                                <div className="col-sm-6"><div className="tes"><h4>Banner Image</h4><input className="form-control" type="file" id="banner" name="banner" onChange={this.bannerChange} accept=".jpg,.jpeg,.png"/></div></div>

                                <div className="col-sm-6"><div className="tes"><h4>Driving License</h4>
                                <input className="form-control" type="file" id="drivinglicense" name="drivinglicense" onChange={this.drivinglicense} accept=".jpg,.jpeg,.png"/></div></div>

                                <div className="col-sm-6"><div className="tes"><h4>Passport</h4>
                                <input className="form-control" type="file" id="passport" name="passport" onChange={this.passport} accept=".jpg,.jpeg,.png"/></div></div>

                                <div className="col-sm-6"><div className="tes"><h4>Student Id</h4>
                                <input className="form-control" type="file" id="studentid" name="studentid" onChange={this.studentid} accept=".jpg,.jpeg,.png"/></div></div>
{/* 
                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Facebook</h4>
                                    <input type="text" className="form-control" name="facebook" id="facebook" placeholder="Facebook" value={this.state.input.facebook} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Twitter</h4>
                                    <input type="text" className="form-control" name="twitter" id="twitter" placeholder="Twitter" value={this.state.input.twitter} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Tumbler</h4>
                                    <input type="text" className="form-control" name="tumbler" id="tumbler" placeholder="Tumbler" value={this.state.input.tumbler} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Snapchat</h4>
                                    <input type="text" className="form-control" name="snapchat" id="snapchat" placeholder="Snapchat" value={this.state.input.snapchat} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Whatsapp</h4>
                                    <input type="text" className="form-control" name="whatsapp" id="whatsapp" placeholder="Whatsapp" value={this.state.input.whatsapp} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Amazon</h4>
                                    <input type="text" className="form-control" name="amazon" id="amazon" placeholder="Amazon" value={this.state.input.amazon} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Ebay</h4>
                                    <input type="text" className="form-control" name="ebay" id="ebay" placeholder="Ebay" value={this.state.input.ebay} onChange={this.handleChange}/>
                                    </div>
                                </div> */}

                                <div className="col-sm-12">
                                <div className="tes">
                                <h4>Bio{this.state.errors.description?<span style={{color: "red", marginLeft: "4px"}}>*</span>: ''}</h4>
                                <textarea className="form-control" placeholder="Description" id="description" name="description" value={this.state.input.description} onChange={this.handleChange}></textarea>
                                <div className="text-danger">{this.state.errors.description}</div>
                                </div>
                                </div>
                            </div>
                            <button type="button" name="submitform" onClick={() => this.changebutton() }>Submit</button>
                            </form>


                        </div>
                    </div>


                    <div id="social" className="tab-pane fade">
                        <div className="bus_det editInformation">
                            <h3>Social</h3>
                            {/* {(() => {
                                console.log('hshhs',this.state.errors);  
                                   
                            })()} */}
                            <form onSubmit={this.handleSubmitSocail.bind(this)}>
                            <div className="row">
                                {/* <div className="col-sm-6">
                                <div className="tes">
                                <h4>First Name</h4>
                                <input type="text" id="name" className="form-control" name="name" placeholder="First name" value={this.state.input.name} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.name}</div>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="tes">
                                <h4>Last Name</h4>
                                <input type="text" className="form-control" name="lname" placeholder="Last name" id="lname" value={this.state.input.lname} onChange={this.handleChange}/>
                                <div className="text-danger">{this.state.errors.lname}</div>
                                </div>
                                </div> */}

                                

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Facebook</h4>
                                    <input type="text" className="form-control" name="facebook" id="facebook" placeholder="Facebook https://facebook.com/" value={this.state.input.facebook} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Twitter</h4>
                                    <input type="text" className="form-control" name="twitter" id="twitter" placeholder="Twitter https://Twitter.com/" value={this.state.input.twitter} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Tumbler</h4>
                                    <input type="text" className="form-control" name="tumbler" id="tumbler" placeholder="Tumbler https://Tumbler.com/" value={this.state.input.tumbler} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Snapchat</h4>
                                    <input type="text" className="form-control" name="snapchat" id="snapchat" placeholder="Snapchat https://Snapchat.com/" value={this.state.input.snapchat} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Whatsapp</h4>
                                    <input type="text" className="form-control" name="whatsapp" id="whatsapp" placeholder="Enter your Whatsapp number" value={this.state.input.whatsapp} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Amazon</h4>
                                    <input type="text" className="form-control" name="amazon" id="amazon" placeholder="Amazon  https://Amazon.com/" value={this.state.input.amazon} onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Ebay</h4>
                                    <input type="text" className="form-control" name="ebay" id="ebay" placeholder="Ebay  https://Ebay.com/" value={this.state.input.ebay} onChange={this.handleChange}/>
                                    </div>
                                </div>
                               {isViprole?<> <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>TikTok</h4>
                                    <input type="text" className="form-control" name="tiktok" id="ebay" placeholder="tiktok  https://TikTok.com/" value={this.state.input.tiktok} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Instagram</h4>
                                    <input type="text" className="form-control" name="Instagram" id="ebay" placeholder="Instagram  https://Instagram.com/" value={this.state.input.Instagram} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>Reddit</h4>
                                    <input type="text" className="form-control" name="Reddit" id="ebay" placeholder="Reddit  https://Reddit.com/" value={this.state.input.Reddit} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="tes">
                                    <h4>WeChat</h4>
                                    <input type="text" className="form-control" name="WeChat" id="ebay" placeholder="WeChat  https://WeChat.com/" value={this.state.input.WeChat} onChange={this.handleChange}/>
                                    </div>
                                </div></>:""}
                            </div>
                            <button type="submit" name="submitform">Submit</button>
                            </form>


                        </div>
                    </div>

                    <div id="business" className="tab-pane fade show">
                        <div className="bus_det businessddl">
                            <h3>Business Details <i className="fa fa-edit" onClick={() => this.onShowfields()}></i></h3>
                            <form onSubmit={this.handleBusiness}>
                            <div className="tes">
                                <h4><b>Business Name</b> 
                                    { this.state.childVisible
                                        ? 
                                        <span>
                                        <input type="text" className="form-control" name="buisnessname" id="buisnessname" placeholder="Buisness Name" value={this.state.input.buisnessname} onChange={this.handleChange}/>
                                        <div className="text-danger">{this.state.errors.buisnessname}</div>
                                        </span> 
                                        : <span>{this.state.input.buisnessname}</span>
                                    } 
                                </h4>
                            </div>
                            <div className="tes">
                            <h4><b>Profession</b> 
                                    { this.state.childVisible
                                        ?  
                                        <span>
                                        <select className="form-control" name="profession" value={this.state.input.profession} onChange={this.handleProfession} id="profession">
                                        <option key="" value="">--Select Profession--</option>
                                        {this.state.profession?.map((results) => {
                                            return (
                                                <option  value={results.id}>{results.name}
                                                </option>
                                            )
                                        })}
                                        </select>
                                        <div className="text-danger">{this.state.errors.profession}</div>
                                        </span>
                                        : <span>{this.state.input.professionview}</span>
                                    }   
                            </h4>
                            </div>

                            <div className="tes">
                            <h4><b>Subcategory Profession</b> 
                                    { this.state.childVisible
                                        ?  
                                        <span>
                                        <select className="form-control" name="subprofession" value={this.state.input.subprofession} onChange={this.handleChange} id="subprofession">
                                        <option key="" value="">--Select Subcategory--</option>
                                        {this.state.subcategoryprofession?.map((results) => {
                                                return (
                                                    <option key={results.name} value={results.id} >{results.name}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                        <div className="text-danger">{this.state.errors.subprofession}</div>
                                        </span>
                                        : <span>{this.state.input.subprofessionview}</span>
                                    }   
                            </h4>
                            </div>

                            <div className="tes">
                            <h4><b>University</b> 
                                { this.state.childVisible
                                    ? 
                                    <span> 
                                    <input type="text"  name="university" value={this.state.input.university} onChange={this.handleChange} className="form-control" id="university" autoComplete="off"/>
                                    <div className="text-danger">{this.state.errors.university}</div>
                                    </span>
                                    : <span>{this.state.input.university}</span>
                                }   
                                </h4>
                            </div>
                            <div className="tes">
                                <h4><b>Degree Certificate</b> 
                                    { this.state.childVisible
                                        ? 
                                        <span> 
                                        <input type="text"  name="certificate" value={this.state.input.certificate} onChange={this.handleChange} className="form-control" id="certificate" autoComplete="off"/>
                                        <div className="text-danger">{this.state.errors.certificate}</div>
                                        </span>
                                        : <span>{this.state.input.certificate}</span>
                                    } 
                                </h4>
                            </div>

                            { this.state.childVisible
                                ?
                                <div className="tes">
                                    <h4><b>Business Licence</b> 
                                        <span> 
                                        <input type="file"  name="licence"  onChange={this.licenceImage} className="form-control" id="licence" autoComplete="off" accept=".jpg,.jpeg,.png"/>
                                        </span> 
                                    </h4>
                                </div>
                             : ""
                            }   

                            <div className="tes">
                                <h4><b>Working Days</b>
                                { this.state.childVisible
                                    ? 
                                    <span> 
                                    <select className="form-control" id="days" name="days" value={this.state.input.days} onChange={this.handleChange}>
                                    <option value="">--Select Days--</option>
                                    <option>1 Day</option>
                                    <option>2 Days</option>
                                    <option>3 Days</option>
                                    <option>4 Days</option>
                                    <option>5 Days</option>
                                    <option>6 Days</option>
                                    <option>7 Days</option>
                                    </select>
                                    <div className="text-danger">{this.state.errors.days}</div>
                                    </span>
                                     : <span>{ this.state.input.days}</span> }
                                    
                                </h4>
                               
                            </div>
                            <div className="tes">
                                <h4><b>From Time</b>
                                { this.state.childVisible
                                    ? 
                                    <span> 
                                    <TimeInput className="input-time form-control" initialTime={(this.state.from == false) ? '00:00' : this.state.from} onChange={this.handleChange} name="from" id="from"/>
                                    </span> 
                                    : <span>{ this.state.from}</span> 
                                }
                                </h4>
                            </div>
                            <div className="tes">
                                <h4><b>To Time</b>
                                { this.state.childVisible
                                    ? 
                                    <span>
                                    <TimeInput className="input-time form-control" initialTime={(this.state.to == false) ? '00:00' : this.state.to}  onChange={this.handleChange} name="to" id="to"/>
                                    </span>
                                    : <span>{ this.state.to}</span> 
                                }
                                </h4>
                            </div>
                            <div className="tes">
                                <h4><b>Business Card</b>
                                { this.state.childVisible
                                    ? 
                                    <span> 
                                        <input type="file" multiple  name="card" className="form-control" onChange={this.cardChange} id="card" autoComplete="off" accept=".jpg,.jpeg,.png"/>
                                    </span>
                                    :
                                    <div className="row"> 
                                    { businesscardimages.map((businesscardimage, i) => (
                                        <div className="col-sm-6 mb-2">
                                            <img className="cart w-100" src={businesscardimage} />
                                        </div>
                                    ))}
                                    </div>
                                }
                                </h4>
                            </div>
                            <div><button type="submit" name="" value="Submit">Submit</button></div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="Friends" className="addfrbfil tab-pane fade">
                        <h3>All Friends</h3>
                        <div className="row">
                        {this.state.friendsdata?.map((result, i) => {
                            return (
                            <div className="col-lg-6 mb-3">
                                <div className="testfrnd friend ">
                                    <span className="userimg">
                                        {/* <span><i className="fas fa-video"></i></span> */}
                                        <img src={result.image} align="icon"/></span>
                                    <h5>{result.name}</h5>
                                    <p>Lorem Ipsum is simply dummy text. simply dummy text.</p>
                                    <ul className="followmessage">
                                        <li><a onClick={() => this.unFriendrequest(i, result.id)}>Remove</a></li>
                                        <li><a className="mg" onClick={() => {window.location.href="/viewprofile/"+result.friendid+'/'+result.name}}>View Profile</a></li>
                                    </ul>
                                </div>
                            </div>
                            )
                        })}
                        </div>
                    </div>
                    <div id="friendrequests" className="addfrbfil tab-pane fade">
                        <h3>All Friends Requests</h3>
                        <div className="row">

                            {this.state.friendsrequests?.map((resultf, i) => {
                            return (
                            <div className="col-lg-6 mb-3">
                                <div className="testfrnd">
                                    <span className="userimg">
                                        {/* <span><i className="fas fa-video"></i></span> */}
                                        <img src={resultf.image ? resultf.image : "images/useri_1.png"} align="icon"/></span>
                                    <h5>{resultf.name}</h5>
                                    <ul className="followmessage">
                                        <li><a onClick={() => this.acceptFriendrequest(i, resultf.id)}>Accept Request</a></li>
                                        <li><a className="mg" onClick={() => {window.location.href="/viewprofile/"+resultf.userid+'/'+resultf.name}}>View Profile</a></li>
                                    </ul>
                                </div>
                            </div>
                            )
                            })}

                        </div>
                    </div>
                    <div id="Gallery" className="tab-pane fade">
                        <h3>Gallery</h3>
                        <div style={{display: "flex"}}>{this.state.astrickSignImageInput ? <span style={{color: "red", fontSize: "18px", padding: "14px"}}>*</span> : ""}{gallerybutton}</div>
                        <div className="row allvideoimages">
                            { galleryimages?.map((galleryimage, i) => (
                                <div className="col-sm-6 col-lg-4 mb-3">
                                    {i == 0 ?  (
                                    <div className="imagetest first-imagetest">

                                    <div className="removemultipleimages">
                                        <input type="checkbox" value="all" onChange={this.handleInputAllGallery}  id="all"/>Select All
                                        <button type="button" className="btn btn-success" onClick={this.deleteGallery}>Delete</button>
                                    </div>

                                    <input type="checkbox" value={i} onChange={this.handleInputChange} id={i}/>
                                        {galleryimage.image ?  (
                                            <a href={galleryimage.image} data-fancybox><img className="w-100" src={galleryimage.image} alt="ion"/></a>
                                        ) : (
                                            <video width="320" height="240" controls src={galleryimage.video}/>
                                        )}
                                    </div>
                                    ) : (

                                    <div className="imagetest">
                                    <input type="checkbox" value={i} onChange={this.handleInputChange} id={i}/>
                                        {galleryimage.image ?  (
                                            <a href={galleryimage.image} data-fancybox><img className="w-100" src={galleryimage.image} alt="ion"/></a>
                                        ) : (
                                            <video width="320" height="240" controls src={galleryimage.video}/>
                                        )}
                                    </div>

                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id="Followers" className="addfrbfil tab-pane fade ">
                        <h3>Followers</h3>
                        <div className="row">

                            {this.state.followers?.map((resultfo) => {
                            return (
                                <div className="col-lg-6 mb-3">
                                    <div className="testfrnd">
                                        <span className="userimg">
                                            {/* <span><i className="fas fa-video"></i></span> */}
                                            <img src={resultfo.image} align="icon"/></span>
                                        <h5>{resultfo.name}</h5>
                                        <ul className="followmessage">
                                            <li>
                                                <a className="mg" onClick={() => {window.location.href="/viewprofile/"+resultfo.userid+'/'+resultfo.name}}>View Profile</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )
                            })}

                        </div>
                    </div>
                    <div id="Following" className="addfrbfil tab-pane fade">
                        <h3>Following</h3>
                        <div className="row">

                            {this.state.followingdata?.map((results) => {
                            return (
                                <div className="col-lg-6 mb-3">
                                    <div className="testfrnd">
                                        <span className="userimg">
                                            {/* <span><i className="fas fa-video"></i></span> */}
                                            <img src={results.image} align="icon"/></span>
                                        <h5>{results.name}</h5>
                                        <ul className="followmessage">
                                            <li>
                                                <a className="mg" onClick={() => {window.location.href="/viewprofile/"+results.friendid+'/'+results.name}}>View Profile</a>
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
                            { plans?.map((plan, i) => (
                                            
                            <div className="col-lg-4 mb-3">
                                <div className="testup">
                                    <div className="test">
                                        <div className="head_me">
                                            <h5>{plan.duration} Plan
                                                {this.state.input.plan == plan.id ?  (
                                                    <span style={{float:'right',color:'red'}}>{this.state.input.planstatus}</span>
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

                                            {plan.membershiprenewal  ? (
                                               <li>To get discounts on membership renewal by allowing ads on profile page</li>
                                              ) : (
                                               <li></li>
                                            )}

                                            {plan.chatvideo  ? (
                                               <li>To receive requests for chat , video call and Help information</li>
                                              ) : (
                                               <li></li>
                                            )}

                                            {plan.galleryfiles  ? (
                                               <li>Multiple delete of gallery files</li>
                                              ) : (
                                               <li></li>
                                            )}

                                            {plan.posts  ? (
                                               <li>Search posts by date</li>
                                              ) : (
                                               <li></li>
                                            )}

                                            {plan.livevideo  ? (
                                               <li>Live video streaming</li>
                                              ) : (
                                               <li></li>
                                            )}
                                            
                                            
                                        </ul>
                                        {/* {this.state.input.plan == null ||  this.state.input.planstatus=='Expired' ? <CheckoutForm price={plan.price} form={this.state.formData}  />  } */}
                                        
                                        <UpgreadePlan price={plan.price} plan={plan.id} form={this.state.uid}  />
                                        
                                        {this.state.input.plan == plan.id ?  (
                                            <button style={{float:'right'}} className="btn btn-success">Current Plan</button>
                                        ) : (
                                            <span></span>
                                        )}

                                        
                                        {this.state.input.plan == plan.id ?  (
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
                    <div id="Advertisement" className="tab-pane fade">

                    <div>
        <button onClick={this.handleButtonClick} className='btn btn-primary mb-4'>View Advertisement</button>
        {showAdvertisement && (
          <div className='row mb-2'>
{this.state.getadvertisement&&
  
this.state.getadvertisement.filter(item=>item.userid==JSON.parse(window.localStorage.getItem("user")).value).map(item=>(<div className='col-sm-4 mt-1'>
            <div className="card" style={{ width: "18rem" }}>

  <div className="card-body">
    <h5 className="card-title">{item.businessname}</h5>
    <p className="card-text text-dark">
    <span className="badge bg-light text-dark">advertisement</span> : {item.advertisement}<br/>
    <span className="badge bg-light text-dark"> description </span> : {item.description}
    </p>
    {/* <a href="#" className="btn btn-primary">
      Go somewhere
    </a> */}
  </div>
</div>
 </div>))}
            
       
          </div>
        )}
      </div>
                        <h3>Advertisement</h3>
                        <div className="bus_det editInformation">
                        <form onSubmit={this.handleadvertisementSubmit}>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="tes">
                                        <h4>Business name {this.state.errors.abusinessname ? <span style={{color: "red", marginLeft: "5px"}}>*</span> : ''}</h4>
                                        <input type="text" id="abusinessname" className="form-control" name="abusinessname" placeholder="Business name" onChange={this.handleChange} autoComplete="off"/>
                                        <div className="text-danger">{this.state.errors.abusinessname}</div>
                                    </div>
                                </div>
                            
                                <div className="col-sm-6">
                                    <div className="tes">
                                        <h4>Type of advertisement {this.state.errors.advertisement ? <span style={{color: "red", marginLeft: "5px"}}>*</span> : ''}</h4>
                                        <input type="text" id="advertisement" className="form-control" name="advertisement" placeholder="Type of advertisement"  onChange={this.handleChange} autoComplete="off"/>
                                        <div className="text-danger">{this.state.errors.advertisement}</div>
                                    </div>
                                </div>
                            

                        
                                <div className="col-sm-6">
                                    <div className="tes">
                                        <h4>Duration {this.state.errors.duration ? <span style={{color: "red", marginLeft: "5px"}}>*</span> : ''}</h4>
                                        <select className="form-control" name="duration" onChange={this.handleChange} id="duration" autoComplete="off">
                                            <option value="" style={{color: "black"}}>--Select Duration--</option>
                                            <option style={{color: "black"}}>One Week</option>
                                            <option style={{color: "black"}}>One Month</option>
                                        </select>
                                        <div className="text-danger">{this.state.errors.duration}</div>
                                    </div>
                                </div>
                           
                                <div className="col-sm-12">
                                    <div className="tes">
                                    <h4>Description {this.state.errors.adescription ? <span style={{color: "red", marginLeft: "5px"}}>*</span> : ''}</h4>
                                    <textarea className="form-control" placeholder="Description" id="description" name="adescription"  onChange={this.handleChange}></textarea>
                                    <div className="text-danger">{this.state.errors.adescription}</div>
                                    </div>

                                    <button >Submit</button>
                                </div>
                            </div>

                        </form>
                       
                        </div>
                      
                        
                    </div>

                    <div id="Referral" className="tab-pane fade">
                    <h3>Referral Earning</h3>

                    <div className="row">

                    <div class="table-responsive">
<table class="table resdiv">
<thead>
<tr>
<th scope="col">Count</th>
<th scope="col">User Name</th>
<th scope="col">Earning Amount</th>
<th scope="col">Date</th>
</tr>
</thead>
<tbody>

{

this.state.referral?.map((n,num) => {
return (
<tr>
<th scope="row">{num+1}</th>
<td>{n.name}</td>
<td>{Number(n.price)*Number(n.comm)/100}</td>
<td>{this.getdatec(n.date)}</td>
</tr>
                            )})}
</tbody>
</table>
</div>
</div>



                    </div>


                    <div id="StripeId" className="tab-pane fade">
                    <h3>Stripe {this.state.stripeStatus}</h3>
                        <div className="bus_det editInformation">
                        <form onSubmit={this.updatestrip.bind(this)}>
                            <div className="row">

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Account holder name</h4>
                                    <input type="text" id="holdername" className="form-control" name="holdername" placeholder="Account Holder Name" value={this.state.stripe.holdername} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>First Name</h4>
                                    <input type="text" id="firstname" className="form-control" name="firstname" placeholder="First Name" value={this.state.stripe.firstname} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Last Name</h4>
                                    <input type="text" id="lastname" className="form-control" name="lastname" placeholder="Last Name" value={this.state.stripe.lastname} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Gender</h4>
                                    <select name="gender" className="form-control" id="gender" onChange={this.handelchangestripe.bind(this)}>
                                        <option value="Male" selected>Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Email</h4>
                                    <input type="text" id="email" className="form-control" name="email" placeholder="Email" value={this.state.stripe.email} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Phone Number</h4>
                                    <input type="text" id="phone" className="form-control" name="phone" placeholder="Phone Number" value={this.state.stripe.phone} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Routing Number</h4>
                                    <input type="text" id="routingnumber" className="form-control" name="routingnumber" placeholder="Routing Number" value={this.state.stripe.routingnumber} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Account Number</h4>
                                    <input type="text" id="accountnumber" className="form-control" name="accountnumber" placeholder="Account Number" value={this.state.stripe.accountnumber} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>


                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Address 1</h4>
                                    <input type="text" id="addressone" className="form-control" name="addressone" placeholder="Address One" value={this.state.stripe.addressone} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Address 2</h4>
                                    <input type="text" id="addresstwo" className="form-control" name="addresstwo" placeholder="Address Two" value={this.state.stripe.addresstwo} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>


                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>City</h4>
                                    <input type="text" id="city" className="form-control" name="city" placeholder="City" value={this.state.stripe.city} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>


                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>State</h4>
                                    <input type="text" id="state" className="form-control" name="state" placeholder="State" value={this.state.stripe.state} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Zip Code</h4>
                                    <input type="text" id="zipcode" className="form-control" name="zipcode" placeholder="zipcode" value={this.state.stripe.zipcode} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Social Security Number last 4 Digit</h4>
                                    <input type="text" id="ssn" className="form-control" min="4" max="4" name="ssn" placeholder="ssn" value={this.state.stripe.ssn} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Company Name</h4>
                                    <input type="text" id="ssn" className="form-control" min="4" max="4" name="company_name" placeholder="Company Name" value={this.state.stripe.company_name} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>Tin Number</h4>
                                    <input type="text" id="ssn" className="form-control" min="4" max="4" name="company_tin" placeholder="Tin Number" value={this.state.stripe.company_tin} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="tes">
                                    <h4>DOB</h4>
                                    <input type="date" id="dob" className="form-control"  name="dob" placeholder="dob" value={this.state.stripe.dob} onChange={this.handelchangestripe.bind(this)}/>
                                    <div className="text-danger"></div>
                                </div>
                            </div>

                        </div>
                        {this.state.stripeStatus=='verified' ? <p>Your Stripe Account is verified</p> : <button type="submit" name="submitform">submit</button>}
                            </form>
                            </div>
                    </div>
                </div>
            </div>
            </div>
            </section>
            </span>
        )
    }
}

export default Userprofile;         

