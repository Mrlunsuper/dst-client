import React,{Component} from 'react';
import usericon from '../images/user.png';
import passicon from '../images/password.png';
import logo from '../images/logo.png';
import axios from 'axios';
import {withRouter } from 'react-router-dom'
class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            time:'',
            intervalId:null,
            err:'',
           
        }
        this.timer = this.timer.bind(this);
        this.API_URL = 'http://localhost:3000/user/';
    }
    timer(){
        let time = new Date().getHours()+ ':' + new Date().getMinutes() + ':' + new Date().getUTCSeconds();
        this.setState({
            time:time
        })
    }
    componentDidMount(){
        let intervalId = setInterval(this.timer,1000);
        this.setState({
            intervalId:intervalId
        })
        
    }
    componentWillUnmount(){
        clearInterval(this.state.intervalId);
        
    }
    passwordChange(e){
        this.setState({
            password:e.target.value
        })
    }
    emailChange(e){
        this.setState({
            email:e.target.value
        })
    }
    onConfirm(){
        let {password,email} = this.state;
        if(password==='' || email===''){
            this.setState({err:'Vui lòng điền đầy đủ thông tin'});
            return;
        }
        axios.post(this.API_URL+'login',{password:password,email:email})
        .then(result=>{
            if(result.data.success){ 
                localStorage.setItem('token',result.data.token);
                this.setState({isLogin:true});
                this.props.history.push('/');
               
            }
            else{
                this.setState({err:result.data.err})
            }
        })
        .catch(err=>console.log(err));
         
    }
    render(){
        return(
                
            <div className="login-container">
               
                <div className="timer">
                    {this.state.time}
                </div>
               
                <div className="loginform">
                    <img src={logo} className="img-responsive logo" alt="logo" />
                    <div className="custom-input">
                        <img src={usericon} alt="usericon" />
                        <input type='email' value={this.state.email} onChange={this.emailChange.bind(this)} name="email" placeholder="Nhập email"></input>
                    </div>
                    <div className="custom-input">
                        <img src={passicon} alt="usericon" />
                        <input type='password' value={this.state.password} onChange={this.passwordChange.bind(this)} name="password" placeholder="Nhập password"></input>
                    </div>
                    <button onClick={this.onConfirm.bind(this)} className="btn btn-suc">Đăng Nhập</button>
                    {
                        this.state.err!=='' &&
                        <p className="err">
                            {this.state.err}
                        </p>
                    }
                    
                    
                </div>  
            </div>
        )
    }
}

export default withRouter(Login);