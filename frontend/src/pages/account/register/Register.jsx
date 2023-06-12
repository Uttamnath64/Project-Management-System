import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import '../style.css';
import axios from "axios";
export default function Register(){

    // cookies and navigate(move other page)
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['name']);
    
    // when waiting for result (API)
    const [isLoading,setIsLoading] = useState(false);

    // if user is logged in
    useEffect(()=>{
        if(cookies.isLoggedIn === "true"){
            navigate('/');
        }
    },[])
    
    // user input data
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        c_password: ''
    });

    // input validation or server error
    const [error, setError] = useState({
        Type:"",
        Message:""
    });

    // change in input boxs
    const onChange = e =>{
        setData({...data,[e.target.name]:e.target.value});
    }

    // validate input fields
    function validater() {

        var name_regex = /^[A-Za-z\s]+$/;
        var email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var password_regex = /^.{6,}$/;

        // name
        if(!name_regex.test(data.name)){
            setError({
                Type:"error",
                Message:"Enter valid name!"
            });
            return;
        }

        // email
        if(!email_regex.test(data.email)){
            setError({
                Type:"error",
                Message:"Enter valid email address!"
            });
            return;
        }    

        // password
        if(!password_regex.test(data.password)){
            setError({
                Type:"error",
                Message:"Enter valid password (minmum 6)!"
            });
            return;
        }

        // confirm password
        if(data.password !== data.c_password){
            setError({
                Type:"error",
                Message:"Confirm password not same!"
            });
            return;
        }

        // call api for register
        register();
    }

    // call api for register
    const register = async (e) => {
        if(!isLoading){
            setError({
                Type:"",
                Message:""
            });
            setIsLoading(true);
            await axios.post('http://localhost:8000/api/register',data)
            .then(response=>{
                if(response.data.success){
                    setError({
                        Type:"success",
                        Message:response.data.message
                    });
                    setCookie('token', response.data.result.token, { path: '/' });
                    setCookie('isLoggedIn', 'true', { path: '/' });
                    navigate('/');
                }else{
                    setError({
                        Type: "error",
                        Message: response.data.message
                    });
                }
                setIsLoading(false);
            })
            .catch(error =>{
                setError({
                    Type:"error",
                    Message:error.response.data.message
                });
                setIsLoading(false);
            });
        }
    }


    return(
        <div className="main">
            <div className="form">
                <h1 className="title">Register</h1>
                <div className="inputBox">
                    <p className={"message "+error.Type}>{error.Message}</p>
                </div>
                
                <div className="inputBox">
                    <input 
                        type="text"
                        onChange={(e)=>{onChange(e)}}
                        value={data.name}
                        name="name"
                        placeholder="Name"
                        readOnly={isLoading}/>
                </div>
                <div className="inputBox">
                    <input 
                        type="text"
                        onChange={(e)=>{onChange(e)}}
                        value={data.email}
                        name="email"
                        placeholder="Email"
                        readOnly={isLoading}/>
                </div>
                <div className="inputBox">
                    <input 
                        type="text"
                        onChange={(e)=>{onChange(e)}}
                        value={data.password}
                        name="password"
                        placeholder="Password"
                        readOnly={isLoading}/>
                </div>
                <div className="inputBox">
                    <input 
                        type="text"
                        onChange={(e)=>{onChange(e)}}
                        value={data.c_password}
                        name="c_password"
                        placeholder="Confirm Password"
                        readOnly={isLoading}/>
                </div>  
                <div className="inputBox">
                    <button type="button" className="btn"  disabled={isLoading} onClick={()=>{validater()}}>{!isLoading ? ("Register"):("Registering...")}</button>
                </div>
                <div className="other-option">
                    <p className="text">Already have an account?</p>
                    <Link to="/login" className="link">Login</Link>
                </div>
            </div>
        </div>
    );
}