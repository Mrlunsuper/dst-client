import React,{Component} from 'react';
import {Tabs,Tab,TabList,TabPanel} from 'react-tabs';
import axios from './axiosService';
import 'react-tabs/style/react-tabs.css';
export default class User extends Component{
    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:'',
            role:'',
            branch:'',
            name:'',
            active:true,
            users:[],
            branchs:[],
            roles:[],
            branchName:'',
            branchCode:'',
            roleCode:'',
            roleName:''
        }
        this.onBranchCodeChange = this.onBranchCodeChange.bind(this);
        this.onBranchNameChange = this.onBranchNameChange.bind(this);
        this.onRoleNameChange = this.onRoleNameChange.bind(this);
        this.onRoleCodeChange = this.onRoleCodeChange.bind(this);
        this.addBranch = this.addBranch.bind(this);
        this.addRole = this.addRole.bind(this);
        this.API_URL = 'http://localhost:3000/user/';
    }
componentWillMount(){
    let token = localStorage.getItem('token');
    axios.setHeader('Authorization',`Bearer ${token}`);
    }
    componentDidMount(){
        axios.get(this.API_URL+'getallbranch').then(branchs=>this.setState({branchs:branchs.data,branch:branchs.data[0]._id}));
        axios.get(this.API_URL+'getalluser').then(users=>this.setState({
            users:users.data
           
        }));
        axios.get(this.API_URL+'getallrole').then(roles=>this.setState({
            roles:roles.data,
            role:roles.data[0]._id
        }));
    }
    onBranchCodeChange(e){
        this.setState({branchCode:e.target.value});
    }
    onBranchNameChange(e){
        this.setState({branchName:e.target.value});
    }
    onRoleCodeChange(e){
        this.setState({roleCode:e.target.value});
    }
    onRoleNameChange(e){
        this.setState({roleName:e.target.value});
    }
    onUserEmailChange(e){
        this.setState({
            email:e.target.value
        });
    }
    onUserPasswordChange(e){
        this.setState({
            password:e.target.value
        });
    }
    onUserNameChange(e){
        this.setState({
            name:e.target.value
        });
    }
    onUserRoleChange(e){
        this.setState({
            role:e.target.value
        });
    }
    onUserBranchChange(e){
        this.setState({
            branch:e.target.value
        });
    }
    async addBranch(){
        let {branchCode,branchName,branchs} = this.state;
        await axios.post(this.API_URL+'createbranch',{branch:{name:branchName,code:branchCode}})
        .then(result=>{
            this.setState({branchCode:'',
            branchName:'',
            branchs:[
                ...branchs,
                result.data
            ]
        });

        })
        .catch(err=>console.err(err));
    }
    async addRole(){
        let {roleCode,roleName,roles} = this.state;
        await axios.post(this.API_URL+'createrole',{role:{name:roleName,code:roleCode}})
        .then(result=>{
            this.setState({roleCode:'',
            roleName:'',
            roles:[
                ...roles,
                result.data
            ]
        });

        })
        .catch(err=>console.err(err));
    }
    async addUser(){
        let {password,name,email,active,role,branch,users} = this.state;
        let user = {
            name:name,
            email:email,
            password:password,
            active:active,
            role:role,
            branch:branch
        }
        for(var key in user){
            if(user.hasOwnProperty(key) && user[key]===''){
                alert('Vui lòng điền đủ thông tin');
                return false;
            }
        }
        await axios.post(this.API_URL+'createuser',{user:user})
        .then(result=>{
            this.setState({
            users:[
                ...users,
                result.data
            ]
        });

        })
        .catch(err=>console.err(err));
    }
    render(){
        let {email,name,password,role,branch,roles,branchs} = this.state
        return(
            <div className="container-fluid">
                <div className="left-sidebar user-screen">
                    <Tabs>
                        <TabList>
                            <Tab>Quản lí người dùng</Tab>
                            <Tab>Quản lí chi nhánh</Tab>
                            <Tab>Quản lí quyền</Tab>
                        </TabList>
                        <TabPanel>
                            <div className="row">
                                <div className="col-xs-4 col-md-4">
                                    <h3>Thêm người dùng</h3>
                                    <div className="user-form">
                                        <div className="custom-input">
                                            <span>Email</span>
                                            <input type="text" onChange={this.onUserEmailChange.bind(this)} value={email} name="email" id="email"/>
                                        </div>
                                        <div className="custom-input">
                                            <span>Mật khẩu</span>
                                            <input type="text" onChange={this.onUserPasswordChange.bind(this)} value={password} name="password" id="password"/>
                                        </div>
                                        <div className="custom-input">
                                            <span>Họ và tên</span>
                                            <input type="text" onChange={this.onUserNameChange.bind(this)} value={name} name="name" id="name"/>
                                        </div>
                                        <div className="custom-input">
                                            <span>Chi nhánh</span>
                                            <select  name="branch" onChange={this.onUserBranchChange.bind(this)} value={branch} id="branch">
                                                {
                                                    this.state.branchs.length>0 && this.state.branchs.map((branch,index)=>
                                                        <option key={branch._id} value={branch._id}>{branch.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="custom-input">
                                            <span>Quyền</span>
                                            <select  name="role" onChange={this.onUserRoleChange.bind(this)}
                                             value={role} id="role">
                                                {
                                                    this.state.roles.length>0 && this.state.roles.map((role,index)=>
                                                        <option key={role._id} value={role._id}>{role.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <button onClick={this.addUser.bind(this)} className="btn btn-suc">Chấp nhận</button>
                                    </div>
                                </div>
                                <div className="col-xs-8 col-md-8">
                                    <h3>Danh sách người dùng</h3>
                                    <table className="table  table-dark">
                                        <thead>
                                            <tr>
                                            <th>Tên người dùng</th>
                                            <th>Email</th>
                                            <th>Chi nhánh</th>
                                            <th>Quyền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.users.length > 0 && this.state.users.map((user,index)=>
                                                <tr key={index}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{branchs.length > 0 && (branchs.find(b=>b._id===user.branch)).name}</td>
                                                    <td>{roles.length > 0 && (roles.find(b=>b._id===user.role)).name}</td>
                                                </tr>
                                                ) 
                                            }
                                        </tbody>
                                    </table>
                                </div>   
                            </div>
                            
                        </TabPanel>
                        <TabPanel>
                            <div className="row">
                                <div className="col-xs-4 col-md-4">
                                    <h3>Quản lý chi nhánh</h3>
                                    <div className="branch-form">
                                        <div className="custom-input">
                                            <span>Mã chi nhánh</span>
                                            <input value={this.state.branchCode}
                                            onChange={this.onBranchCodeChange} type="text" name="branchcode" id="branchcode"/>
                                        </div>
                                        <div className="custom-input">
                                            <span>Tên chi nhánh</span>
                                            <input  value={this.state.branchName}
                                            onChange={this.onBranchNameChange} type="text" name="branchname" id="branchname"/>
                                        </div>
                                        <button className="btn btn-suc" onClick={this.addBranch}>Chấp nhận</button>
                                    </div>
                                </div>
                                <div className="col-xs-8 col-md-8">
                                <h3>Danh sách chi nhánh</h3>
                                    <table className="table  table-dark">
                                        <thead>
                                            <tr>
                                            <th>Tên chi nhánh</th>
                                            <th>Mã chi nhánh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.branchs.length > 0 && this.state.branchs.map((branch,index)=>
                                                <tr key={index}>
                                                    <td>{branch.name}</td>
                                                    <td>{branch.code}</td>
                                                </tr>
                                                ) 
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                        <div className="row">
                                <div className="col-xs-4 col-md-4">
                                    <h3>Quản lý quyền</h3>
                                    <div className="branch-form">
                                        <div className="custom-input">
                                            <span>Mã quyền</span>
                                            <input value={this.state.roleCode}
                                            onChange={this.onRoleCodeChange} type="text" name="rolecode" id="rolecode"/>
                                        </div>
                                        <div className="custom-input">
                                            <span>Tên quyền</span>
                                            <input  value={this.state.roleName}
                                            onChange={this.onRoleNameChange} type="text" name="rolename" id="rolename"/>
                                        </div>
                                        <button className="btn btn-suc" onClick={this.addRole}>Chấp nhận</button>
                                    </div>
                                </div>
                                <div className="col-xs-8 col-md-8">
                                <h3>Danh sách chi nhánh</h3>
                                    <table className="table  table-dark">
                                        <thead>
                                            <tr>
                                            <th>Tên quyền</th>
                                            <th>Mã quyền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.roles.length > 0 && this.state.roles.map((role,index)=>
                                                <tr key={index}>
                                                    <td>{role.name}</td>
                                                    <td>{role.code}</td>
                                                </tr>
                                                ) 
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
                <div className="content">

                </div>
            </div>
        )
    }
}