import React, { Component } from "react";
import axios from "./axiosService";


export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
      products: [],
      viewcount: 5,
      currentcatid: 0,
      ischeckall: false,
      items: [],
      ncat: [],
      isloading: false,
      vats: [],
      showall:false,
      searchField:'',
      searchResult:[]
    };
    this.API_URL = 'http://localhost:3000/api/';
    this.onSkuChange = this.onSkuChange.bind(this);
    this.Check = this.Check.bind(this);
    this.handleCatChange = this.handleCatChange.bind(this);
    this.changeLimit = this.changeLimit.bind(this);
  }
  componentWillMount(){
    let token = localStorage.getItem('token');
    axios.setHeader('Authorization',`Bearer ${token}`);
  }

  changeLimit(){
    this.setState({showall:!this.state.showall},()=>{
      this.getProductFromCat({target: { id: this.state.currentcatid }},this.state.currentcatid)
    });
    
    
  }

  componentDidMount() {
    this.setState({ isloading: true });
    axios.get(this.API_URL+"getallcat")
      .then(res => {
        
        this.setState({
          cats: res.data[0],
          ncats: res.data[1],
          isloading: false
        });
      });
  }
  difference(a, b) {
    return a.filter(
      item1 => !b.some(item2 => item2.id.toString() === item1.id.toString())
    );
  }

  getProductFromCat = (e, cid) => {
    this.setState({ isloading: true });
    let id = e.target.id || cid;
    let viewcount = this.state.currentcatid !== 0 ? this.state.viewcount : 5;
    let { items } = this.state;
    
    axios
      .post(this.API_URL+"getproduct", {
        catid: id,
        perpage: viewcount,
        showall:this.state.showall
      })
      .then(res => {
        res.data.forEach((product) =>{
          items.find(o=>{
            if(o.id.toString()===product.id.toString()){
              product.variations = o.variations;
              return true;
            }
            return false;
          })
        });
        this.setState({
          products: res.data,
          currentcatid: id,
          isloading: false
        });
        });
        //res.data.map(product=>product.isSelect = false);
       
  }
  async setViewCount(e) {
    await this.setState({ viewcount: e.target.value });
    this.getProductFromCat(
      { target: { id: this.state.currentcatid } },
      this.state.currentcatid
    );
  }
  checkAll(e) {
    let { products, items } = this.state;
    if (e.target.checked) {
      items = products.map(p => p);
    } else {
      items = [];
    }

    this.setState({ ischeckall: e.target.checked, items: items });
  }
  onSkuChange(e) {
    let id = e.target.id;
    let value = e.target.value;
    let product = this.state.products;
    let indexOfProduct = product.findIndex(
      x =>
        typeof x.variations[0] === "object" &&
        x.variations.find(j => j.id.toString() === id.toString())
    );
    let vat = product[indexOfProduct].variations;
    let vaIndex = vat.findIndex(x => x.id.toString() === id.toString());
    vat[vaIndex].sku = value;
    product[indexOfProduct].variations = vat;
    this.setState({
      products: [
        ...product.slice(0, indexOfProduct),
        product[indexOfProduct],
        ...product.slice(indexOfProduct + 1)
      ]
    });
  }
  addItems(item){
    let {products} = this.state;
    if(products.find(p=>p.id===item.id)){
      let itemFiltered = products.filter(product=>product.id!==item.id);
      this.setState({
        products:itemFiltered
      })
    }
    else{
      this.setState({
        products:[
            item,
          ...products
        ]
      });
    }
   
  }
  Check(e) {
    let { id, checked } = e.target;
    let { items, products } = this.state;
    if (checked) {
      // if(typeof currentProduct[0].variations[0]!=='object'){
      axios
        .post(this.API_URL+"getvariation", { id: id })
        .then(res => {
          let vat = products;
          let index = vat.findIndex(x => x.id.toString() === id.toString());
          vat[index].variations = res.data;
          this.setState({
            products: vat,
            items: [...items, vat[index]]
          });
        });
      //this.setState({items:[...items,parseInt(id)]})
      if (products.length - items.length === 1) {
        this.setState({ ischeckall: true });
      }
      //}
    } else {
      items = items.filter(p => p.id !== parseInt(id));
      this.setState({ items: items, ischeckall: false });
      
    }
  }
  closeSearchResult(){
    this.setState({searchResult:[]});
  }
  searchChange(e){
   if(e.keyCode===13 && this.state.searchField!==''){
    this.searchSubmit();
   }
   else{
     this.setState({
      searchField: e.target.value
    });
   }
  }
  async searchSubmit(){
    let {searchField} = this.state;
    this.setState({isloading:true});
    await axios.post(this.API_URL+"search",{search:searchField})
    .then(searchResult=>this.setState({searchResult:searchResult.data,isloading:false}));
  }
  getVariation() {
    let { items } = this.state;
    this.setState({isloading:true});
    axios
      .post(this.API_URL+"insertproduct", { products: items })
      .then(res => {
        console.log(res.data);
        this.setState({isloading:false});
      });
  }
  handleCatChange(e){
    let product_id = e.target.getAttribute('data-id'),cat_id = e.target.value;
    let {products,ncats} = this.state;
    let currentCat = ncats.find(cat=>cat.id.toString()===cat_id.toString());
    let newCat = {id:currentCat.id};
    let currentIndex = products.findIndex(p=> p.id.toString()===product_id.toString());
    let currentProduct =  products.find(p=> p.id.toString()===product_id.toString());
    currentProduct.categories = [newCat];
    products[currentIndex] = currentProduct;
    this.setState({products:products}); 
  }
  render() {
    let {ncats,showall} = this.state;
    return (
      <div>
        <div>
          <ul id="listCat">
            {this.state.cats.length > 0 &&
              this.state.cats.map(cat => (
                <li
                  key={cat.id}
                  className={
                    cat.id.toString() === this.state.currentcatid ? "caton" : ""
                  }
                  id={cat.id}
                  onClick={this.getProductFromCat.bind(this)}
                >
                  {cat.name}
                </li>
              ))}
          </ul>
        </div>
        {this.state.products.length > 0 && (
          <div id="topoption">
            <select id="numbershow" className="dst-select" onChange={this.setViewCount.bind(this)}>
              <option value="5">5</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <button onClick={this.changeLimit} className="btn btn-change">
              {showall ? 'Xem đã lọc' : 'Xem tất cả'}
            </button>
            <button
              className="btn btn-suc"
              onClick={this.getVariation.bind(this)}
            >
              Sync
            </button>
            <input type="text"
            placeholder="Nhập tên sản phẩm"
            value={this.state.searchField} onChange={this.searchChange.bind(this)} onKeyUp={this.searchChange.bind(this)} />
            <button className="btn btn-search" onClick={this.searchSubmit.bind(this)}>Tìm kiếm</button>
          </div>
        )}
        <ul className="ul-table table-header">
          <li>#</li>
          <li>Tên Sản Phẩm</li>
          <li>Danh Mục</li>
          <li>
            {" "}
            <input
              type="checkbox"
              checked={this.state.ischeckall}
              onChange={this.checkAll.bind(this)}
            ></input>{" "}
            Chọn
          </li>
        </ul>
        {this.state.products.length > 0 &&
          this.state.products.map((product, index) => (
            <ul className="ul-table" key={index}>
              <li>{index + 1}</li>
              <li>
                <a href={product.permalink} id={product.id}>
                  {product.name}
                </a>
              </li>
              <li>
                <select className="dst-select" data-id={product.id} onChange={this.handleCatChange}>
                  {
                    ncats.map((cat,index)=>
                    <option key={index} value={cat.id}>{cat.name}</option>
                    )
                  }
                </select>
              </li>
              <li>
                <input
                  type="checkbox"
                  id={product.id}
                  onChange={this.Check}
                ></input>
              </li>
              {product.variations.length > 0 &&
                typeof product.variations[0] === "object" &&
                product.variations.map((v, index) => (
                  <div
                    className={
                      this.state.items.find(p => p.id === product.id)
                        ? "subrow show"
                        : "subrow"
                    }
                    key={"parent-" + v.id}
                  >
                    <div className="expandrow">
                      <span> {v.id}</span>
                      <span>
                        {" "}
                        {product.name + " " + v.attributes[0].option}
                      </span>
                      <span>
                        <input
                          id={v.id}
                          value={v.sku}
                          type="text"
                          onChange={this.onSkuChange}
                          placeholder="SKU"
                        />
                      </span>
                    </div>
                  </div>
                ))}
            </ul>
          ))}

        {this.state.isloading && (
          <div className="hiddenbackground">
            <img src="/loader.svg" alt="loader" />
          </div>
        )}
        {
          this.state.searchResult.length > 0 &&
          <div className="hiddenbackground">
            <div className="wraplist">
            <button onClick={this.closeSearchResult.bind(this)} className="btn btn-suc">Thêm vào danh sách</button>
            <p>Click vào tên sản phẩm để thêm vào danh sách</p>
            <ul className="searchresult">
          
              
            {
              this.state.searchResult.map((product,index)=>
                <li className={this.state.products.find(p=>p.id===product.id) ? 'added' : ''}
                onClick={()=>this.addItems(product)} 
                key={index}>{product.name}</li>
              )
            }
            
            </ul>
            </div>
          </div>
        }
      </div>
    );
  }
}
