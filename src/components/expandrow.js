import React,{Component} from 'react';
import axios from 'axios';
export default class ExpandRow extends Component{
    constructor(props){
        super(props);
        this.state = {
           parent : this.props.parent,
           currentSku:'',
           vat:[]
        }
        this.onChange = this.onChange.bind(this)
    }
    componentDidMount(){
        let {parent} = this.state;
        axios.post('http://localhost:3000/api/getvariation',{id:parent})
            .then(res=>{
                this.setState({vat:res.data});
            });
    }
    onChange(e){
        let id = e.target.id;
        let value = e.target.value;
        let {vat} = this.state;
        let index = vat.findIndex(x=>x.id.toString()===id.toString());
        vat[index].sku = value;
        
        this.setState({
            vat:[
                ...vat.slice(0,index),
                vat[index],
                ...vat.slice(index+1)
            ]
        })
    }

    render(){
        let vat = this.state.vat;
        let tgClass = this.props.checked ? 'subrow show' : 'subrow';
        return(
            <div className={tgClass} key={this.props.parent}>
            {vat.length > 0 && vat.map((v,index)=>
            
                <div className="expandrow" key={v.id}><span> {this.props.title +' '+ v.attributes[0].option}</span>
                <span><input id={v.id} value={v.sku} type="text" onChange={this.onChange} placeholder="SKU" /></span></div>
            
            )}
            </div>
        )
    }
}