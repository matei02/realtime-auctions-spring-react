import React, { useState } from "react";
import { useSelector } from "react-redux";
import AdminService from "../services/AdminService";
import ErrorPopUp from "../components/ErrorPopUp";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";

function AddAdminPage() {

    const userToken = useSelector((state) => state.token);
    const role = localStorage.getItem("role")

    const [admin, setAdmin] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
    };

    const [messageValue, setMessageValue] = useState("");
    const [messageField, setMessageField] = useState(false);

    function handleSubmit() {

        let body = {
            name: admin.name,
            email: admin.email,
            password: admin.password
        }

        // console.log(body.name)
        // console.log(body.email)
        // console.log(body.password)

        AdminService.addAdmin(userToken, body)
            .then((response) => {
                if (response)
                {
                    setMessageField("Success!")
                    setMessageValue("Admin account created!")
                }
                else{
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
                else if (error.response && error.response.status === 409)
                {
                    setMessageField("Email")
                    setMessageValue("already used!")
                    console.log("409 error.")
                }
                else { console.log("error is " + error) }
            })
    }

    return (
        <>
            {userToken ? (
                <>
                    {role === "ADMIN" ? (
                        <>
                            <div className="detail-title-container">
                                <h1 className="display-4 detail-banner fw-bold">Create ADMIN account</h1>
                            </div>
                            <div className="row d-flex text-center justify-content-center">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 d-flex flex-column justify-content-center
                    align-items-center">
                                    {/* <h2>Description: {painting.description}</h2> */}
                                    <div className="register-form mt-2">
                                        <div className="form-floating w-100 mb-4 mt-3">
                                            <input type="text" name="name" value={admin.name} className="form-control w-100 border border-5 border-dark" id="name" onChange={handleChange} placeholder="Full Name" required></input>
                                            <label htmlFor="nameInput">Full Name</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4 col-lg-12">
                                            <input name="email" value={admin.email} type="text" className="form-control w-100 border border-5 border-dark" id="email" onChange={handleChange} placeholder="Email" required></input>
                                            <label htmlFor="emailInput">Email</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input name="password" type="password" className="form-control w-100 border border-5 border-dark" id="password" onChange={handleChange} placeholder="Password" required></input>
                                            <label htmlFor="passwordInput">Password</label>
                                        </div>
                                    </div>
                                    {messageField || messageValue ?
                                        (<div className="d-flex justify-content-center">
                                            <h3 className="d-block text-center text-danger bg-light rounded mt-2 fw-bold">{messageField} {messageValue}</h3>
                                        </div>)
                                        : (null)}

                                    <div className="col-sm d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="profile-btn-hover color-7 border border-4" onClick={handleSubmit} role="button">Create account</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <ErrorPopUp />
                    )}
                </>
            ) : (
                <UnauthorizedPopUp></UnauthorizedPopUp>
        )}

        </>
    )
}

export default AddAdminPage;