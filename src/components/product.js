import React, {
    Component
} from 'react';
import axios from 'axios';
export default class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cats: [],
            products:[],
            viewcount:5,
            currentcatid:0,
            ischeckall:false,
            items:[]
            
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/api/getallcat')
            .then(result => result.json())
            .then(res => {
                this.setState({
                    cats: res
                })
            });
    }

    getProductFromCat = (e)=>{
        let id = e.target.id;
        let viewcount =   this.state.currentcatid !==0 ? this.state.viewcount : 5;
        axios.post('http://localhost:3000/api/getproduct',{catid:id,perpage:viewcount})
        .then(res=>{
            res.data.map(product=>product.isSelect = false);
            this.setState({products:res.data,currentcatid:id});
        })
        
    }
    setViewCount(e){
        this.setState({viewcount:e.target.value})
        
    }
    checkAll(e){
        let {products,items} = this.state;
        if(e.target.checked){
            
            items = products.map(p=>p.id);
        }
        else{
            items = [];
        }
       
        this.setState({ischeckall:e.target.checked,items:items})
    }
    Check(e){
        let {id,checked} = e.target;      
        let {items,products} = this.state;

        if(checked){
           
            
                this.setState({items:[...items,parseInt(id)]})
                if(products.length-items.length===1) {
                    this.setState({ischeckall:true})
                }

        }else{
            items = items.filter(iid=>iid!==parseInt(id));
            this.setState({items:items,ischeckall:false});
            
        }

    }
    getVariation(){
        let {items} = this.state;
        
        axios.post('http://localhost:3000/api/insertproduct',{products:items})
        .then(res=>{
            
            console.log(res.data);
        })

    }
    render(){
        
        return(
            <div>
            <div>
                <ul id="listCat">
                {
                    this.state.cats.length>0 && this.state.cats.map((cat)=>
                        <li key={cat.id} className={cat.id.toString()===this.state.currentcatid?'caton':''} id={cat.id} onClick={this.getProductFromCat.bind(this)}>{cat.name}</li>
                    )
                }
                </ul>               
            </div>
            <div id="topoption">
                <label >Hiển thị sản phẩm: 
                <select id="numbershow" onChange={this.setViewCount.bind(this)}>
                <option value="5">5</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                </label>
                
                <button className="btn btn-success" onClick={this.getVariation.bind(this)}>Múc</button>
            </div>
            <table className="table table-striped table-hover table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Danh mục</th>
                        <th>SKU</th>
                        <th> <input type="checkbox" checked={this.state.ischeckall} onChange={this.checkAll.bind(this)}></input> Chọn hết</th>
                    </tr>
                </thead>
                <tbody>
                
                {
                    this.state.products.length>0 && this.state.products.map((product,index)=>

                    <tr key={index}>
                        <td>{index+1}</td>
                        <td><a href={product.permalink}  id={product.id}>{product.name}</a></td>
                        <td>{product.categories.map(c=>c.name).join(' / ')}</td>
                        <td><input type="text" className="form-control" defaultValue={product.sku}></input></td>
                        <td><input type="checkbox" id={product.id} checked={this.state.items.includes(product.id)} onChange={(e)=>this.Check(e)}></input></td>
                    </tr>
                    
                )
                }
                </tbody>
            </table>
            </div>
        )
    }


}