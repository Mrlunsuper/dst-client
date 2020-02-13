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
            viewcount:25,
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
        let viewcount =   this.state.currentcatid !==0 ? this.state.viewcount : 25;
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
        let {products,ischeckall} = this.state;
        if(e.target.checked){
            products.map(product=>product.isSelect = true);
        }
        else{
            products.map(product=>product.isSelect = false);
        }
       
        this.setState({ischeckall:e.target.checked,products:products})
    }
    Check(e){
        let id = e.target.id;
        
        let {products,items} = this.state;
        
        let i = products.findIndex(p=> p.id==id);
        let itemtopush = []
        products[i].isSelect = !products[i].isSelect;
        if(e.target.checked){
            itemtopush = [products[i].id,...itemtopush]
        }
        else{

            let ir = itemtopush.findIndex(products[i].id);
            itemtopush.slice(ir,1);
        }
        this.setState({products:products,ischeckall:false,items:itemtopush});
    }
    render(){
        
        return(
            <div>
            <div>
                {
                    this.state.cats.length>0 && this.state.cats.map((cat)=>
                        <p key={cat.id} id={cat.id} onClick={this.getProductFromCat.bind(this)}>{cat.name}</p>
                    )
                }
            </div>
            <div>
                <label >Hiển thị sản phẩm: 
                <select id="numbershow" onChange={this.setViewCount.bind(this)}>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                </label>
                
            </div>
            <table className="table table-scripped">
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <td>Giá</td>
                        <th><input type="checkbox" checked={this.state.ischeckall} onChange={this.checkAll.bind(this)}></input></th>
                    </tr>
                {
                    this.state.products.length>0 && this.state.products.map((product,index)=>

                    <tr key={index}>
                        <td>{index+1}</td>
                        <td><a href={product.permalink}  id={product.id}>{product.name}</a></td>
                        <td>{product.price}</td>
                        <td><input type="checkbox" id={product.id} checked={product.isSelect} onChange={(e)=>this.Check(e)}></input></td>
                    </tr>
                    
                )
                }
                </tbody>
            </table>
            </div>
        )
    }


}