import React,{Component} from 'react';
import axios from './axiosService';
import { Link,Redirect,Router,BrowserRouter,withRouter } from 'react-router-dom';

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            user:{}
        }
        this.API_URL = 'http://localhost:3000/api/userinfo';
    }
    componentDidMount(){
        axios.get(this.API_URL)
        .then(user=>this.setState({
            user:user.data
        }));
    }
    componentWillMount(){
        let token = localStorage.getItem('token');
        axios.setHeader('Authorization',`Bearer ${token}`);
    }

    render(){
        return(
            <div className="homepage">
                <div className="sidebar-left">
                    <h3>Xin chào {this.state.user.name}</h3>
                    <Link to="/user">Quản lý User</Link>
                    <Link to="/product">Quản lý sản phẩm</Link>
                </div>
            </div>
        )
    }
}