import React, { useEffect, useState } from "react";
import AdminService from "../services/AdminService";
import { useNavigate, useParams } from "react-router-dom";
import image from "../assets/black image.webp"
import { useSelector } from "react-redux";
import CustomerService from "../services/CustomerService";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import ErrorPopUp from "../components/ErrorPopUp";

function EditCustomerPage() {

    const { id } = useParams();

    const navigator = useNavigate();

    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        image: ""
    })

    const role = localStorage.getItem("role");

    const [currentName, setCurrentName] = useState();

    const [messageValue, setMessageValue] = useState("");
    const [messageField, setMessageField] = useState(false);

    const userToken = useSelector((state) => state.token);

    const [uploadedImageByteArray, setUploadedImageByteArray] = useState([]);

    useEffect(() => {
        function getCurrentAdmin() {
            CustomerService.getCustomerById(id, userToken)
                .then((response) => {
                    if (response) {
                        let customerResponse = response.data.customer;
                        if (customerResponse.image) {
                            const arrayBufferView = new Uint8Array([...customerResponse.image]);
                            const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
                            const imageUrl = URL.createObjectURL(blob);
                            customerResponse.image = imageUrl;
                            setUploadedImageByteArray(arrayBufferView);
                        }
                        setCurrentName(customerResponse.name);
                        setCustomer(customerResponse);
                    }
                    else {
                        setMessageField("Error!");
                        setMessageValue("response returned false.")
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        const firstError = error.response.data.errors[0];
                        const { messageField, error: messageValue } = firstError;
                        setMessageField(messageField);
                        setMessageValue(messageValue);
                    } else if (error.response && error.response.status === 404) {
                        const firstError = error.response.data.errors[0];
                        const { messageField, error: messageValue } = firstError;
                        setMessageField(messageField);
                        setMessageValue(messageValue);
                    };
                })
        }

        getCurrentAdmin();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    function removeProfilePicture() {
        if (customer.image === "") {
            alert("There is no image selected.");
        } else {
            setCustomer((prevState) => ({
                ...prevState,
                image: ""
            }))
            setUploadedImageByteArray(null);
        }
    }

    const openFileExplorer = () => {

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".jpg,.jpeg,.png";
        input.onchange = handleFileSelect;
        input.click();
    };

    const handleFileSelect = async (event) => {
        event.preventDefault();

        const file = event.target.files[0];
        if (file) {
            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result;
                    const byteArray = new Uint8Array(arrayBuffer);
                    //const base64String = byteArrayToBase64String(byteArray);
                    setUploadedImageByteArray(byteArray);
                    setCustomer(prevState => ({
                        ...prevState,
                        image: URL.createObjectURL(file)
                    }));
                    //THIS IS HOW YOU SAVE ON PAGE THE IMAGE, SO IT REFRESHES
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert("Please select a file of type JPG or JPEG.");
            }
        }
    };

    const handleCustomerSubmit = () => {

        let name = '';
        let pass = '';
        let age = '';
        let address = '';
        let img = '';

        if (uploadedImageByteArray) {
            name = customer.name,
                pass = customer.password,
                age = customer.age,
                address = customer.address,
                img = [...uploadedImageByteArray]
        }
        else {
            name = customer.name,
                pass = customer.password,
                age = customer.age,
                address = customer.address,
                img = null
        }

        const body = {
            name: name,
            password: pass,
            age: age,
            address: address,
            image: img
        }

        // console.log(body.name)
        // console.log(body.password)
        // console.log(body.age)
        // console.log(body.address)
        // console.log(body.image)

        CustomerService.updateCustomer(id, userToken, body)
            .then((response) => {
                if (response) {
                    console.log("We got a response back from server!")
                    setMessageField(true);
                    setMessageValue("Account updated successfully!");
                }
                else {
                    console.log("error = " + response.data)
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    console.log("400 error");
                    console.log(error.response)

                    if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                        const firstError = error.response.data.errors[0];
                        const { field: messageField, error: messageValue } = firstError;
                        setMessageField(messageField);
                        setMessageValue(messageValue);
                        console.log("error field: " + messageField);
                    } else {
                        console.log("No errors array or it is empty.");
                        // Handle the case where there are no errors or the errors array is empty
                    }
                }
                else { console.log("error is " + error) }
            })
    }

    function showConfirmation() {

        const handleCustomerDelete = () => {
            console.log("method called")
            CustomerService.deleteCustomer(id, userToken)
                .then((response) => {
                    if (response.status === 204) {
                        navigator("/admin");
                    }
                    else {
                        console.log("something went wrong. try again.")
                    }
                })
        }


        const isConfirmed = window.confirm("Do you want to proceed?");

        if (isConfirmed) {
            alert("Customer is being deleted...");
            handleCustomerDelete();

        } else {
            alert("You clicked Cancel. Action canceled.");
        }
    }


    return (
        <>
            {userToken ? (
                <>
                    {role === "ADMIN" ? (
                        <>
                            <div className="detail-title-container">
                                <h1 className="display-4 detail-banner fw-bold">Edit {currentName}'s account</h1>
                            </div>
                            <div className="row d-flex text-center">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 h-auto mb-3">
                                    {customer.image ? (
                                        <img className="detail_card_img img-fluid w-auto border border-5 rounded-3" src={customer.image} alt="Profile_Picture"></img>
                                    ) : (
                                        <img className="detail_card_img img-fluid w-auto border border-5 rounded-3" src={image} alt="Profile_Picture"></img>
                                    )}

                                    <div className="col-sm mt-3 d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="btn btn-secondary btn-outline-light" onClick={openFileExplorer}>
                                            Change Profile Picture
                                        </button>
                                    </div>
                                    <div className="col-sm mt-3 d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="btn btn-outline-light btn-warning text-black" onClick={removeProfilePicture}>
                                            Remove Picture
                                        </button>
                                    </div>

                                </div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 d-flex flex-column justify-content-center
                    align-items-center">
                                    {/* <h2>Description: {painting.description}</h2> */}
                                    <div className="register-form mt-2">
                                        <div className="form-floating w-100 mb-4 mt-3">
                                            <input type="text" name="name" value={customer.name} className="form-control w-100 border border-5 border-dark" id="nameInput" onChange={handleChange} placeholder="Full Name" required></input>
                                            <label htmlFor="nameInput">Full Name</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4 col-lg-12">
                                            <input name="email" value={customer.email} type="text" className="form-control w-100 border border-5 border-dark bg-secondary text-light" id="emailInput" onChange={handleChange} placeholder="Email" required disabled></input>
                                            <label htmlFor="emailInput">Email</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input name="password" type="password" className="form-control w-100 border border-5 border-dark" id="passwordInput" onChange={handleChange} placeholder="Password" required></input>
                                            <label htmlFor="passwordInput">Password*</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input type="number" name="age" value={customer.age} className="form-control w-100 border border-5 border-dark" id="ageInput" onChange={handleChange} placeholder="Age" min={16} max={100} required></input>
                                            <label color="white" htmlFor="ageInput">Age</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input type="text" name="address" value={customer.address} className="form-control w-100 border border-5 border-dark" id="addressInput" onChange={handleChange} placeholder="Address" required></input>
                                            <label htmlFor="addressInput">Address</label>
                                        </div>
                                        <p className="fw-bold p-1 bg-light align-self-start">* - Optional Fields</p>
                                    </div>
                                    {messageField || messageValue ?
                                        (<div className="d-flex justify-content-center">
                                            <h3 className="d-block text-center text-danger bg-light rounded mt-2 fw-bold">{messageField} {messageValue}</h3>
                                        </div>)
                                        : (null)}
                                    <div className="col-sm d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="profile-btn-hover color-7 border border-4" onClick={handleCustomerSubmit} role="button">Click to save</button>
                                    </div>
                                    <div className="col-sm d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="btn btn-danger btn-lg border border-5" onClick={showConfirmation} role="button">DELETE ACCOUNT</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <ErrorPopUp/>
                    )}
                </>
            ) : (
                <>
<UnauthorizedPopUp></UnauthorizedPopUp>
                </>
            )}
        </>
    )
}

export default EditCustomerPage;