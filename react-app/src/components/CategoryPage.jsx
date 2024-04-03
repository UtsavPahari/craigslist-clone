import { useEffect,useState } from "react";
import Header from "./Header";
import { Link,useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import {FaHeart,FaRegHeart} from 'react-icons/fa';
import './Home.css';


function CategoryPage(){
    const navigate=useNavigate();
    const param = useParams()
    const [products,setproducts]=useState([]);
    const [cproducts,setcproducts]=useState([]);
    
    
    const [search,setsearch]=useState('');
    const [issearch,setissearch]=useState(false);

    
    useEffect(()=>{
        const url='http://localhost:4000/get-products?catName=' + param.catName;
        axios.get(url)
        .then((res)=>{
            
            if(res.data.products){
                    setproducts(res.data.products);
            }
        })
        .catch((err)=>{
            
            alert("server Error");
        })
    },[param])

    const handlesearch=(value)=>{
        
        setsearch(value);
    }

    const handleClick=()=>{
        const url='http://localhost:4000/search?search=' + search;
        axios.get(url)
        .then((res)=>{
           console.log(res.data) 
           setcproducts(res.data.products);
           setissearch(true);
        })
        .catch((err)=>{
            
            alert("server Error");
        })
        // let filteredProducts=products.filter((item)=>{
        //     if(item.pname.toLowerCase().includes(search.toLowerCase())|| item.pdesc.toLowerCase().includes(search.toLowerCase()) || item.pcategory.toLowerCase().includes(search.toLowerCase())){
        //         return item;
        //     }
        // })

        // setcproducts(filteredProducts)
        
    }

    const handleCategory=(value)=>{
       
        let filteredProducts=products.filter((item,index)=>{
            
            if(item.pcategory==value){
                return item;
            }
            
        })
        setcproducts(filteredProducts)
    }

    const handleLike=(productId)=>{
        let userId=localStorage.getItem('userId');
        console.log('userId',"productid",productId,userId);
        const url='http://localhost:4000/like-product';
        const data={userId,productId}
        axios.post(url,data)
        .then((res)=>{
            
            if(res.data.message){
                alert(res.data.message)
            }
        })
        .catch((err)=>{
            
            alert("server Error");
        })
    }

    const handleProduct=(id)=>{
        navigate('/product/'+id);
    }
    
    return(
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick}/>
            <Categories handleCategory={handleCategory}/>
           
           {/* {!!localStorage.getItem('token') && <Link to="/add-product">Add Product</Link>} */}
          {issearch && cproducts && 
          <h5>SEARCH RESULTS 
            <button className="search-btn" onClick={()=> setissearch(false)}>CLEAR</button>
            </h5>}

          {issearch && cproducts && cproducts.length == 0 && <h5>No results found</h5>}
           {issearch && <div className="d-flex justify-content-center flex-wrap">
           {cproducts&&products.length>0&&
           cproducts.map((item,index)=>{
            return (
                <div key={item._id} className="card m-3 ">
                        <div onClick={()=>handleLike(item._id)} className="icon-con">
                     <FaHeart className="icons"/>
                     </div>
                        <img width="300px" height="200px" src={'http://localhost:4000/'+ item.pimage}/>
                        <h3 className="m-2 price-text">${item.pprice}</h3>
                        <p className="m-2">{item.pname} |{item.pcategory}</p>
                        <p className="m-2 text-success">{item.pdesc}</p>
                        
                        


                </div>

            )
           }) }
           </div> }

          {!issearch && <div className="d-flex justify-content-center flex-wrap">
           {products&&products.length>0&&
           products.map((item,index)=>{
            return (
                <div onClick={()=>handleProduct(item._id)} key={item._id} className="card m-3 ">
                     <div onClick={()=>handleLike(item._id)}  className="icon-con">
                     <FaHeart className="icons"/>
                     </div>
                        <img width="250px" height="150px" src={'http://localhost:4000/'+ item.pimage}/>
                        <h3 className="m-2 price-text">${item.pprice}</h3>
                        <p className="m-2">{item.pname} |{item.pcategory}</p>
                        <p className="m-2 text-success">{item.pdesc}</p>
                        
                        


                </div>

            )
           }) }
           </div> }
          
        </div>
    )
}

export default CategoryPage;