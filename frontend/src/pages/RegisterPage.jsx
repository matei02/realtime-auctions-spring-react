import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterPage.css'
import RegisterService from "../services/RegisterService";
import ErrorPopUp from "../components/ErrorPopUp";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../redux/features/userSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {

    const userToken = useSelector((state) => state.token);
    const [emailUsedAlready, setEmailUsedAlready] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorField, setErrorField] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function ResetFields() {
        setRegisterData({
            name: '',
            email: '',
            password: '',
            age: '',
            address: ''
        });
        setEmailUsedAlready(false);
        setErrorMessage("");
        setErrorField("");
    }


    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "email") {
            setRegisterData({ ...registerData, [name]: value.toLowerCase() });
        }
        else {
            setRegisterData({ ...registerData, [name]: value });
        }
    };

    function handleSubmit() {

        if (!emailRegex.test(registerData.email)) {
            alert("Please provide a proper email address.")
        }

        console.log("submit triggered!")
        RegisterService.registerUser(registerData)
            .then((response) => {
                if (response) {
                    dispatch(setUserToken(response.data.accessToken))
                    const id = response.data.id;
                    localStorage.setItem('id', id);
                    console.log("Register successful for customer : ", registerData.email, " with ID: ", id);
                    localStorage.setItem("role", "CUSTOMER")
                    toast.success("Register successful!");
                    navigate("/products");
                    ResetFields();
                }
                else { console.log("Login failed. Connection not established to server."); }
            })
            .catch((error) => {
                if (error.response && error.response.status === 409) {
                    setEmailUsedAlready(true);
                }
                else if (error.response && error.response.status === 400) {
                    const firstError = error.response.data.errors[0];
                    const { field, error: errorMessage } = firstError;
                    setErrorField(field);
                    setErrorMessage(errorMessage);
                }
                else {
                    setConnectionError(true);
                }
            })
    };

    useEffect(() => {
        setEmailUsedAlready(false);
        setConnectionError(false);
        setErrorField("");
        setErrorMessage("");
    }, [registerData])

    // useEffect(() => {
    //     if (authenticated) {
    //         navigate("/products");
    //     }
    // }, [userToken, navigate]);

    function showForm() {
        setEmailUsedAlready(false);
        setErrorField("");
        setErrorMessage("");
    }


    return (
        <>
            {userToken ? (<ErrorPopUp></ErrorPopUp>)
                : (
                    <div className="main-content">
                        {emailUsedAlready ? (<ErrorPopUp showForm={showForm} description={"Email is already being used!"} />) :
                            (
                                <div>
                                    <div className="register-title-container">
                                        <h1 className="display-4 register-banner fw-bold">Register</h1>

                                    </div>
                                    <div className="register-form mt-2">
                                        <div className="form-floating w-100 mb-4 mt-3">
                                            <input type="text" name="name" value={registerData.name} className="form-control w-100 border border-5 border-dark" id="nameInput" onChange={handleChange} placeholder="Full Name" required></input>
                                            <label htmlFor="nameInput">Full Name</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4 col-lg-12">
                                            <input name="email" value={registerData.email} type="text" className="form-control w-100 border border-5 border-dark" id="emailInput" onChange={handleChange} placeholder="Email" required></input>
                                            <label htmlFor="emailInput">Email</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input name="password" value={registerData.password} type="password" className="form-control w-100 border border-5 border-dark" id="passwordInput" onChange={handleChange} placeholder="Password" required></input>
                                            <label htmlFor="passwordInput">Password</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input type="number" name="age" value={registerData.age} className="form-control w-100 border border-5 border-dark" id="ageInput" onChange={handleChange} placeholder="Age" min={16} max={100} required></input>
                                            <label color="white" htmlFor="ageInput">Age</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input type="text" name="address" value={registerData.address} className="form-control w-100 border border-5 border-dark" id="addressInput" onChange={handleChange} placeholder="Address" required></input>
                                            <label htmlFor="addressInput">Address</label>
                                        </div>
                                        <button type="submit" className="btn btn-light align-self-center" onClick={handleSubmit}>Register</button>
                                        <div className="d-flex justify-content-center">
                                            <h3 className="d-block text-center text-danger bg-light rounded mt-2">{errorField} {errorMessage}</h3>
                                        </div>
                                        {connectionError ? (
                                            <div className="d-flex justify-content-center align-items-center mt-2">
                                                <h3 className="text-danger bg-light p-3">
                                                    Error connecting to the server. Please try again.
                                                </h3>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                    </div>
                )}
        </>
    )
}

export default RegisterPage;