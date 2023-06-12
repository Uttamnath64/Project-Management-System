import LogoutIcon from "../../assets/icons/LogoutIcon";
import AddIcon from "../../assets/icons/AddIcon";
import "./style.css";
import ListItem from "../../components/listItem/ListItem";
import ItemFrom from "../../components/itemForm/ItemForm";
import { useCookies } from 'react-cookie';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Home(){
    
    // cookies and navigate(move other page)
    const [cookies,removeCookie] = useCookies(['name']);
    const navigate = useNavigate();

    // set headers
    const headers = {
        "Authorization": `Bearer ${cookies.token}`,
        "Content-Type": `application/json`
    };

    // user data (user name and user email address)
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    });

    // use for action @newItem or @editItem (when popup open that data hold for create or edit any item)
    const [selectedAction, setSelectedAction] = useState({
        error:{
            Type:'',
            Message:''
        },
        isNew:false,
        title:'',
        isLoading:false,
        btnText:'',
        btnTextProcess:''
    });

    // any product item seleted for editing
    const [selectedProduct, setSelectedProduct] = useState(null);

    // all products list
    const [productList, setProductList] = useState([]);

    // get all products list from server
    const getProductList = async () =>{
        await axios.get('http://localhost:8000/api/products',{
            headers:{
                'Authorization': `Bearer ${cookies.token}`
            }
        })
        .then(response=>{
            if(response.data.success){
                setProductList(response.data.result); // set data in product list
            }
        })
        .catch(error =>{
            console.log(error.message);
        });
    };

    // if user not logged in than goto login page
    useEffect(()=>{
        if(cookies.isLoggedIn !== "true"){
            navigate('/login');
        }
    },[]);

    // fatch user data like name and email
    useEffect(()=>{
        const fetchData = async () => {
            await axios.get('http://localhost:8000/api/user',{
                headers:{
                    'Authorization': `Bearer ${cookies.token}`
                }
            })
            .then(response=>{
                setUserData({
                    name: response.data.name,
                    email: response.data.email
                }); // set data in userData list
            })
            .catch(error =>{
                console.log(error.message);
            });
        }
        fetchData();

        // call for product list();
        getProductList();

    },[]);

    // user like on logout button
    const logout = () =>{
        removeCookie("token");
        removeCookie("isLoggedIn");
        navigate("/login");
    };

    // click on edit button in product list
    const itemClick = (product) => {
        setSelectedProduct({
            id:product.id,
            name:product.name,
            description:product.description,
            price:product.price
        });
        setSelectedAction({
            error:{
                Type:'',
                Message:''
            },
            isNew:false,
            title:'Edit Item',
            isLoading:false,
            btnText:'Save',
            btnTextProcess:'Saving...'
        });
    };

    // click on delete button in product list
    const deleteItem = async (product) => {
        await axios.delete('http://localhost:8000/api/products/'+ product.id,{headers})
        .then(response=>{
            if(response.data.success){
                getProductList();
            }
        })
        .catch(error =>{
        });
    };

    // click on new button (for create new product)
    const newBtnClick = () => {
        setSelectedProduct({
            id:'',
            name:'',
            description:'',
            price:''
        });
        setSelectedAction({
            error:{
                Type:'',
                Message:''
            },
            isNew:true,
            title:'Add Item',
            isLoading:false,
            btnText:'Create',
            btnTextProcess:'Creating...'
        });
    };
    
    // click on close button in popup
    const popupClose = () => {
        setSelectedProduct(null);
    };

    // change in popup textbox (input)
    const setOnChange = (e) =>{
        const { name, value } = e.target;
        setSelectedProduct({
            ...selectedProduct,
            [name]: value,
          })
    }

    // set errer in useState
    const setError = (type,message) =>{
        setSelectedAction(prevState =>({
            ...prevState,
            error:{
                Type:type,
                Message:message
            }
        }));
    }

    // set loading in useState
    const setloading = (value) =>{
        setSelectedAction(prevState =>({
            ...prevState,
            isLoading:value
        }));
    }

    // validate input fields
    function validate() {
        var price_regex = /^[0-9]+(\.[0-9]+)?$/;

        // name
        if(selectedProduct.name === ""){
            setError("error","Enter product name!");
            return;
        }    

        // price
        if(!price_regex.test(selectedProduct.price)){
            setError("error","Enter valid product price!");
            return;
        } 
        
        // description
        if(selectedProduct.description === ""){
            setError("error","Enter product description!");
            return;
        } 
        
        // save data
        onSubmit()
    }

    // create or save product item
    const onSubmit = async (e) => {
        if(!setSelectedAction.isLoading){
            
            // for create new product
            setError("","");
            setloading(true);
            if(selectedAction.isNew){
                await axios.post('http://localhost:8000/api/products',{
                        
                        name: selectedProduct.name,
                        description: selectedProduct.description,
                        price: selectedProduct.price
                    
                    },{headers})
                .then(response=>{
                    if(response.data.success){
                        setError("success",response.data.message);
                        getProductList();
                        popupClose();
                    }else{
                        setError("error",response.data.message);
                    }
                    setloading(false);
                })
                .catch(error =>{
                    setError("error",error.response.data.message);
                    setloading(false);
                });
            }else{

                // for edit any item in product list
                await axios.put('http://localhost:8000/api/products/'+ selectedProduct.id,{
                        
                        name: selectedProduct.name,
                        description: selectedProduct.description,
                        price: selectedProduct.price

                    },{headers})
                .then(response=>{
                    if(response.data.success){
                        setError("success",response.data.message);
                        getProductList();
                        popupClose();
                    }else{
                        setError("error",response.data.message);
                    }
                    setloading(false);
                })
                .catch(error =>{
                    setError("error",error.response.data.message);
                    setloading(false);
                });
            }
        }
    }

    return(
        <div className="home">
            <div className="title-div">
                <h1 className="title"><span>Product</span> Management System</h1>
            </div>
            <div className="account-div">
                <div className="account">
                    <p className="name">{userData.name}</p>
                    <p className="id"><span>ID:</span> {userData.email}</p>
                </div>
                <div className="logout">
                    <button onClick={()=>{logout()}} className="btn click-hover"><LogoutIcon/></button>
                </div>
            </div>
            <div className="container">
                <div className="new-btn-div">
                    <h6 className="text">Products</h6>
                    <button className="btn" onClick={newBtnClick}><AddIcon/> Add</button>
                </div>
                {productList.length === 0 ?(
                    <div className="notFound">Product Not Found!</div>
                ):(
                    productList.map((product) => (
                        <ListItem  key={product.id} title={product.name}
                        description={product.description}
                        price={product.price}
                        editBtn={()=>{itemClick(product)}}
                        deleteBtn={()=>{deleteItem(product)}}/>
                    ))
                )}    
            </div>
            {selectedProduct&&(
                <div className="overlap">
                    <ItemFrom
                        error={selectedAction.error}
                        data={selectedProduct}
                        isNew={selectedAction.isNew}
                        title={selectedAction.title}
                        isLoading={selectedAction.isLoading}
                        setOnChange={setOnChange}
                        onSubmit={validate}
                        onClose={popupClose}
                        btnText={selectedAction.btnText}
                        btnTextProcess={selectedAction.btnTextProcess}
                        />
                </div>
            )}
        </div>
    );
}