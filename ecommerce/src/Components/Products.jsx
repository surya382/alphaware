import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import "./Products.css"

const Products = () => {
    const [ProductList, setProductList] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [showModal, setModal] = useState(false);
    const [cartData, setCartData] = useState([]);


    useEffect(() => {
        ApiCallToGetProducts();
    }, [])

    const ApiCallToGetProducts = async () => {
        setLoading(true);

        try {
            const response = await fetch("http://3.7.252.58:4001/product/getAllProduct", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'connect.sid=s%253AC9UlQ9M1W1aslddIqBNrrk68Yx4GleaF.OyLqPkC%252FpbJKf070EG6KIJoS70bHaP5GOYXBXBV6hG8'
                },
                body: JSON.stringify({
                    "limit": 100,
                    "page": 0,
                    "search": ""
                })
            });



            const data = await response.json();
            setProductList(data);
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }

    }

    const addToCart = (item) => {
        setCartData([...cartData, item]);

    }

    const removeFromCart=(id)=>{
       let FilteredCart=cartData.filter((item,index)=>{
        return item._id!==id
       });

       setCartData(FilteredCart);
    }

    const ProductInCart=(id,state)=>{
    
        if(state.find((item)=>item._id==id)){
          return true;
        }
        return false;
      }

    return (
        <div id='Container'>
            <h1>Product List</h1>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <button id='cartBtn' onClick={() => setModal(true)}>Cart</button>
            </div>

            <div className='ListContainer'>
                {
                    Loading ?
                        <h2>Loading...</h2>
                        :
                        ProductList.length > 0 ?
                            ProductList.map((item, index) =>
                                <div className='itemDiv' key={item._id}>

                                    <img className='Image' src={item.imageUrl} alt={item.name} />
                                    <p className='name'>{item.name}</p>
                                    <p>{item.description}</p>
                                    <div className='priceSection'>
                                        <p>Price: <span style={{ textDecoration: "line-through" }}>{item.price}</span>₹</p>
                                        <p>Discounted Price: {item.discountAmount}₹</p>
                                    </div>

                                    <button className='addToCart' disabled={ProductInCart(item._id,cartData)} onClick={() => addToCart(item)}>
                                        {ProductInCart(item._id,cartData) ?"Added to cart":"+ Add to cart"}
                                    </button>
                                </div>
                            )
                            :
                            <div>No results found</div>
                }
            </div>

            <div id="myModal" class="modal" style={{ display: showModal ? "block" : "none" }}>
                <div class="modal-content">
                    <span id="closeModalBtn" class="close" onClick={() => setModal(false)}>&times;</span>
                    <h2>Your Cart</h2>
                    <div className='ListContainer'>
                        {
                            cartData.length > 0 ?
                                cartData.map((item, index) =>
                                    <div className='itemDiv' key={item._id}>
                                        <img className='Image' src={item.imageUrl} alt={item.name} />
                                        <p className='name'>{item.name}</p>
                                        <p>{item.description}</p>
                                        <div className='priceSection'>
                                            <p>Price: <span style={{ textDecoration: "line-through" }}>{item.price}</span>₹</p>
                                            <p>Discounted Price: {item.discountAmount}₹</p>
                                        </div>

                                        <button className='addToCart' onClick={()=>removeFromCart(item._id)}>
                                           Remove
                                        </button>
                                    </div>
                                )
                                :
                                <div style={{textAlign:"center"}}>Your cart is empty</div>
                        }
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Products