import { Link } from 'react-router-dom';
import React, { useState, useCallback } from 'react'
// import Cropper from 'react-easy-crop'
// import Slider from '@material-ui/core/Slider'
// import Button from '@material-ui/core/Button'
// import Typography from '@material-ui/core/Typography'
// import { withStyles } from '@material-ui/core/styles'
// import { getOrientation } from 'get-orientation/browser'
// import ImgDialog from '../../ImgDialog'
// import { getCroppedImg, getRotatedImage } from '../../canvasUtils'
// import { styles } from '../../styles'
import axios from 'axios';
// import $ from "jquery";
import swal from 'sweetalert';
const ListItem = ({ value, onClick }) => (
  <li onClick={onClick}>{value}</li>
);

const List = ({ items, onItemClick }) => (
  <ul className="add_tag">
    {
      items.map((item, i) => <ListItem key={i} value={item} onClick={onItemClick} />)
    }
  </ul>
);

const Lists = ({ items, onItemClick }) => (
  <ul className="add_tag">
    {
      items.map((item, i) => <ListItem key={i} value={item} onClick={onItemClick} />)
    }
  </ul>
);


class Createpost extends React.Component { 
    constructor(props)
    {
      super(props);
      this.state = {
        data: [],
        subcat: [],
        category: '',
        input: {},
        errors: {},
        tags: [],
        inputValue: '',
        fruites: [],
        categories:[],
        profession:[],
        friends: [],
        frientList:[],
        files: [],
        imagesPreviewUrls: [],
        inputEmail:[],
        setEmail:'',
        isViprole: false,
        submition:false,
        postId:0,
        userimage : '/images/blank.png',
        formfilled: 'notempty'
       }

       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       this._handleImageChange = this._handleImageChange.bind(this);
       this.checkboxChecked = this.checkboxChecked.bind(this);
       this.currentvalue = this.currentvalue.bind(this);
    }

    onClick = () => {
        const { inputValue, fruites } = this.state;
        if (inputValue) {
          const nextState = [...fruites, inputValue];
          this.setState({ fruites: nextState, inputValue: '' });
          document.getElementById('addtag').style.display = 'none';
        }
        console.log('fruites onCLick',this.state.fruites);
    }

    onChange = (e) => this.setState({ inputValue: e.target.value });

    handleItemClick = (e) => { console.log(e.target.innerHTML) }


    onFriendClick = () => {
        const { inputValues, friends, setEmail,inputEmail } = this.state;
        if (inputValues) {
          const nextState = [...friends, inputValues];
          const nextStateDash = [...inputEmail, setEmail];
          this.setState({ friends: nextState, inputValues: '',setEmail:'',inputEmail:nextStateDash },()=>{
           
          });
          document.getElementById('addfriendtag').style.display = 'none';
        }
    }

    onFriendChange(e){
    this.setState({ inputValues : e.target.value });
    let formData = new FormData();
    formData.append('name',e.target.value);
    axios.post('https://domaintobesocial.com/domaintobe/findUserByName',
                formData
        )
        .then((res) => {
            if(res.data.status == 'success')
            {
            this.setState({frientList:res.data.data});
            }else{
                this.setState({frientList:[]});
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
    }
    handleItemClicks = (e) => { console.log(e.target.innerHTML) }

    handleChangeLogout()
    {
      window.localStorage.clear();
      window.location.reload();
    }

    handleChangeaddtags()
    {
        document.getElementById('addtag').style.display = 'block';
    }

    handleChangeaddfriendtags(){
        document.getElementById('addfriendtag').style.display = 'block';
    }
    
    handleChange(event) {
        // console.log(event.target.checked);
        // console.log(event.target.name);
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({
          input
        });
        if(event.target.name=='category'){
            console.log('under testing cat');
        axios.get('https://domaintobesocial.com/domaintobe/subcategory?catId='+event.target.value).then(response => 
        {
            this.setState({subcat: response.data.message});
        });
        }else{
            console.log('under else part testing');
        }
    }

    checkboxChecked(event){
        let input = this.state.input;
        input[event.target.name] = event.target.checked;
        this.setState({
          input
        });
    }


    _handleImageChange(e) {
        e.preventDefault();

        let files = Array.from(e.target.files);

        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState({    
                     files: [...this.state.files, file],
                     imagesPreviewUrls: [...this.state.imagesPreviewUrls, reader.result]
                });
            }
            reader.readAsDataURL(file);
        });
    }

    handleSubmit(event) {
        if(this.state.submition==false){
        this.setState({submition:true});
        event.preventDefault();

        if(this.state.formfilled == 'empty'){
            alert('Complete your personal details');
            window.location = "/userprofile";
            return false;
        }else{

            if(this.validate()){
                var obj = JSON.parse(window.localStorage.getItem("user"));
                // let frd=this.state.friends;
                // if(friends.length>0){
                //     for (let index = 0; index < frd.length; index++) {
                //         const element = frd[index];
                        
                //     }

                // }

                const formData = new FormData();
                formData.append('category', this.state.input.category);
                formData.append('subcategory', this.state.input.subcategory);
                formData.append('title', this.state.input.title);
                formData.append('description', this.state.input.description);
                formData.append('tags', this.state.fruites);
                formData.append('tagfriends', this.state.inputEmail);
                formData.append('url', this.state.input.url);
                formData.append('userid', obj.value);
                formData.append('postId',this.state.postId);
                formData.append('oldImage',this.state.input.oldImage);
                formData.append('privatepost', this.state.input.private);
                this.state.files.forEach((file) => formData.append('files[]', file));

                axios.post('https://domaintobesocial.com/domaintobe/savediscussion',
                    formData
                )
                .then((res) => {
                    console.log('res',res);
                    if(res.data.message == 'success')
                    {
                        swal({
                            title: "Success!",
                            text: "Your post created successfully done",
                            icon: "success",
                            button: "Ok",
                          });
                          this.props.history.push('/discussion');
                        //window.location.reload();
                        // this.state.input.post = "";
                    }else{
                        alert(res.data.message);
                        this.setState({submition:false});
                        //window.location.reload();
                    }
                })
                .catch((error) => {
                    this.setState({submition:false});
                    alert(error.message);
                })
            }
        }

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

    //   if (!input["subcategory"]) {
    //     isValid = false;
    //     errors["subcategory"] = "Please select subcategory.";
    //   }

      if (!input["title"]) {
        isValid = false;
        errors["title"] = "Please add title.";
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
   

    componentDidMount() {

        axios.get('https://domaintobesocial.com/domaintobe/category').then(response => 
        {
            this.setState({categories: response.data.message});
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

        axios.get('https://domaintobesocial.com/domaintobe/category').then(res => 
        {
            this.setState({data: res.data.message});
        }); 




        let curentlogin = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('id', curentlogin.value);
        formData.append('user', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getuserprofile',
                formData
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

        const formData2 = new FormData();
        formData2.append('id', curentlogin.value);
        axios.post('https://domaintobesocial.com/domaintobe/getDraftPost',
                formData2
            )
        .then((response) => {
            let input = this.state.input;
            input.description = response.data.message.description;
            input.category = response.data.message.catid;
            input.subcategory = response.data.message.subcatid;
            input.title = response.data.message.title !== undefined ? response.data.message.title :'' ;
            input.private=response.data.message.privatepost;
            input.oldImage=response.data.message.images;
            input.url = response.data.message.url && response.data.message!==undefined ? response.data.message:'';
            // this.setState({
            //   input,fruites:response.data.message.tags,inputEmail:response.data.message.tagfriends
            // });
            if(response.data.message.catid && response.data.message.catid!==0 && response.data.message.catid!==undefined)
            {
                axios.get('https://domaintobesocial.com/domaintobe/subcategory?catId='+response.data.message.catid).then(response => 
                {
                    this.setState({subcat: response.data.message});
                });
            }
            this.setState({
                input,fruites:response.data.message.tags.split(','),postId:response.data.message.id,friends:response.data.message.tagfriends.split(','),inputEmail:response.data.message.tagfriends.split(',')
              },()=>{
                console.log('category',this.state.input.category);
                console.log('subcategory',this.state.input.subcategory);
            });
            let img=response.data.message.images;
            if(img && img !==undefined && img !=='')
            {
                let imgr = img.split(',');
                let ice=[];
                for (let index = 0; index < imgr.length; index++) {
                    ice.push('https://domaintobesocial.com/domaintobe/assets/allimages/'+imgr[index]);
                }
            // this.setState({imagesPreviewUrls:ice});
            }
        }).catch((error) => {
            console.log(error.message);
        })
    }

    // currentvalue(e){
    //     console.log("e.target",e.currentTarget.value);
    //     this.setState({ inputValues : e.target.value });
    // }

    currentvalue(name,dash){
        this.setState({ inputValues : name,setEmail:dash,frientList:[]});
    }

    clearDraft(){
        if(this.state.postId!==0)
        {
            var obj = JSON.parse(window.localStorage.getItem("user"));
            const formData = new FormData();
            formData.append('userId', obj.value);
            formData.append('postId',this.state.postId);
            axios.post('https://domaintobesocial.com/domaintobe/clearDraft',
                formData
            )
            .then((res) => {
            this.componentDidMount();
            })
            .catch((error) => {
            })
        }
    }

    saveDraft(){
        var obj = JSON.parse(window.localStorage.getItem("user"));
        const formData = new FormData();
        formData.append('category', this.state.input.category);
        formData.append('subcategory', this.state.input.subcategory);
        formData.append('title', this.state.input.title);
        formData.append('description', this.state.input.description);
        formData.append('tags', this.state.fruites);
        formData.append('tagfriends', this.state.inputEmail);
        formData.append('url', this.state.input.url);
        formData.append('userid', obj.value);
        formData.append('oldImage',this.state.input.oldImage);
        formData.append('postId',this.state.postId);
        formData.append('privatepost', this.state.input.private);
        this.state.files.forEach((file) => formData.append('files[]', file));
        axios.post('https://domaintobesocial.com/domaintobe/savediscussionwithdraft',
            formData
        )
        .then((res) => {
            console.log('responce',res.data.message);
        this.componentDidMount();
        })
        .catch((error) => {
            // this.setState({submition:false});
            // alert(error.message);
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

        const isViprole = this.state.isViprole;
        const userimage = this.state.userimage;
        let vipimage,privatepost;

        if(isViprole){
            vipimage = <img className="vip" src="/images/vip.png" align="icon"/>;
            privatepost = <p className="vipp"><label className="checkcontainer"><input type="checkbox" name="private" onChange={this.checkboxChecked}/><span className="radiobtn"></span></label>Make post private</p>;
        }else{
            vipimage = '';
            privatepost = '';
        }

        const { fruites, inputValue } = this.state;
        const { friends, inputValues } = this.state;
        return (
            <section className="maindiv">
        
            <i className="fas fa-bars side_b"></i>
            <div className="sidbar_left">
                <i className="fas fa-times side_b close"></i>
                <div className="logo">
                    <Link to="/userdashboard" >
                        <img src="images/logo.png" alt="logo"/>
                    </Link>
                </div>
                <ul>
                    <li><Link className="active"  to="/userdashboard"><span><img src="images/iconS1.png" align="icon"/></span> News Feed</Link></li>
                    <li><Link to="/userprofile"><span><img src="images/useri_1.png" align="icon"/></span> My Profile</Link></li>
                    <li><Link  to="/messages"><span><img src="images/iconS2.png" align="icon"/></span> Messages</Link></li>
                    <li><Link  to="/requests"><span><img src="images/iconS3.png" align="icon"/></span> Requests</Link></li>
                    <li><Link  to="/followers"><span><img src="images/iconS4.png" align="icon"/></span> My Followers</Link></li>
                    <li><Link to="/blocklist" ><span><img src="/images/iconS5.png" align="icon"/></span> Blocklist</Link></li>
                    <li><Link to="/viewnotifications" ><span><img src="images/iconS6.png" align="icon"/></span> Notifications</Link></li>
                    {/* <li><Link to="pagesliked" ><span><img src="/images/iconS7.png" align="icon"/></span> Pages Liked</Link></li> */}
                    <li><Link to="/favorites"><span><img src="/images/iconS8.png" align="icon"/></span> Favorites</Link></li>
                </ul>
            </div>
            <div className="in_center in_center_discussion pr-4">
                <div className="main_menu ">
                    <ul>
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
                <div className="create_post">
                    <h3>Create a Post</h3>
                    <div className="create_in">
                        <form className="add_create" onSubmit={this.handleSubmit}>
                        <ul className="select_in">
                            <li>
                                <label>Select Category</label>
                                <select value={this.state.input.category} onChange={this.handleChange} name="category" id="category">
                                    <option key="" value="">--Select Category--</option>
                                    {this.state.data.map((result) => {
                                    return (
                                        <option key={result.id} value={result.id} data-set="check">{result.catname}</option>
                                    )
                                  })}
                                </select>
                                <div className="text-danger">{this.state.errors.category}</div>
                            </li>
                            <li>
                                <label>Sub Category</label>
                                <select value={this.state.input.subcategory} onChange={this.handleChange} name="subcategory" id="subcategory">
                                    <option key="" value="">--Select Sub Category--</option>
                                    {this.state.subcat.map((result) => {
                                    return (
                                        <option key={result.id} value={result.id} data-catid={result.catid}>{result.subcat}</option>
                                    )
                                  })}
                                </select>
                                {/* <div className="text-danger">{this.state.errors.subcategory}</div> */}
                            </li>
                        </ul>
                            <input className="input" type="text" placeholder="Add Title..." name="title"  onChange={this.handleChange} id="title" />
                            <div className="text-danger">{this.state.errors.title}</div>
                            <h4>Description</h4>
                            <textarea  placeholder="Write Here..." name="description" onChange={this.handleChange} id="description"></textarea>
                            <div className="text-danger">{this.state.errors.description}</div>
                            <h4>Add Photos</h4>
                            <div className="row">
                                {this.state.imagesPreviewUrls.map((imagePreviewUrl) => {
                                return <div className="col-sm-3 col-lg-2 mb-4"><img className="upim w-100" key={imagePreviewUrl} alt='previewImg' src={imagePreviewUrl} /></div>
                                 })}

                                <div className="col-sm-3 col-lg-2 mb-3">
                                    <div className="addbtn">
                                        <input type="file" name="" onChange={this._handleImageChange} multiple accept=".jpg,.jpeg,.png"/>
                                        <i className="fas fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                            <h4>Add Tags</h4>
                            <List items={fruites} onItemClick={this.handleItemClick} />
                            <ul className="add_tag">
                                <span onClick={this.handleChangeaddtags.bind(this)} className="btn"><i className="fas fa-plus"></i></span>
                            </ul>
                            <div id="addtag"><input type="text" placeholder="Tags" value={inputValue} onChange={this.onChange}  id="inputtag" autoComplete="off" /><button type="button" className="btn btn-sm btn-primary" onClick={this.onClick}  >Submit</button></div>
                            <h4>
                            <Lists items={friends} onItemClick={this.handleItemClick} />
                            <img src="images/dubleicon.png" alt="images"/> Tag Friends <span onClick={this.handleChangeaddfriendtags.bind(this)} className="btn"><i className="fas fa-plus"></i></span></h4>
                                
                                <div id="addfriendtag"><input type="text" placeholder="Friend Tags" autoComplete="off" value={inputValues} onChange={this.onFriendChange.bind(this)} />
                                <button type="button" className="btn btn-sm btn-primary" onClick={this.onFriendClick} >Submit</button></div>
                                <ul>
                                    {this.state.frientList.map((result,i) => {
                                return (<li key={i} value={result.email} onClick={(e) => this.currentvalue(result.name,result.email)}>{result.name}</li>)},this)}
                                </ul>
                            <div className="url">
                                <img src="images/addicon4.png" alt="images"/>
                                <input className="input" type="text" placeholder="Add url" name="url" value={this.state.input.url} onChange={this.handleChange}/>
                            </div>

                            {privatepost}
                            

                            <ul className="save_draft">
                                <li><a onClick={this.saveDraft.bind(this)} className="btn">Save as Draft</a></li>
                                <li><a onClick={this.clearDraft.bind(this)} className="btn">Discard</a></li>
                                <li><button type="submit" className="postbtn btn">Post</button></li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        );
    }
}

export default Createpost;