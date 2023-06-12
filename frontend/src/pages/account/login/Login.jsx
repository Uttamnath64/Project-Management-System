import { useEffect, useState } from "react";
import '../style.css';
import axios from "axios";
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(){


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
        email: '',
        password: ''
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
        var email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var password_regex = /^.{6,}$/;

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
        // call api for login
        login()
    }

    // call api for login
    const login = async (e) => {
        if(!isLoading){
            setError({
                Type:"",
                Message:""
            });
                setIsLoading(true);
                await axios.post('http://localhost:8000/api/login',data)
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
                        Message: error.response.data.message
                    });
                    setIsLoading(false);
                });
        }
    }


    return(
        <div className="main">
            <div className="form">
                <h1 className="title">Login</h1>
                <div className="inputBox">
                    <p className={"message "+error.Type}>{error.Message}</p>
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
                    <button type="button" className="btn"  disabled={isLoading} onClick={()=>{validater()}}>{!isLoading ? ("Login"):("Login...")}</button>
                </div>
                <div className="other-option">
                    <p className="text">Don't have an account?</p>
                    <Link to="/register" className="link">Register</Link>
                </div>
            </div>
        </div>
    );
}