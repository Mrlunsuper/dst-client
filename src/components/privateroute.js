import React,{Component} from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import Product from '../components/product';
import Login from '../components/login';
import User from '../components/user';
import HomePage from '../components/home';

class PrivateRoute extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLogin:false
        }
    }
    componentWillMount(){
        let token = localStorage.getItem('token');
        if(token && token!==''){
            this.setState({
                isLogin:true
            })
        }
    }
    render(){
        let {isLogin} = this.state;
        return(
            isLogin ? 
            <Router>
            <Switch>
                <Route path="/user">
                    <User />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/">
                    <HomePage />
                </Route>
                <Route exact path="/product">
                    <Product />
                </Route>
            </Switch>
            </Router>
            :
            <Router>
                <Switch>
                 <Route path="/login">
                    <Login />
                    </Route>
                </Switch>
           
            <Redirect to="/login" />
            </Router>
        )
    }


}
export default PrivateRoute;