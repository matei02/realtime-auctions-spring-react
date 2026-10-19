import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ArtService from "../services/ArtService";
import CustomerService from "../services/CustomerService";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import "../pages/OrderPage.css"
import OrderService from "../services/OrderService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderPage() {

    const { id } = useParams();

    const userToken = useSelector((state) => state.token);
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("id");
    const navigator = useNavigate();

    const [painting, setPainting] = useState('');
    const [customer, setCustomer] = useState('');
    const [uploadedImageByteArray, setUploadedImageByteArray] = useState('');

    const [orderID, setOrderID] = useState("");

    useEffect(() => {
        function getPainting() {
            ArtService.getPaintingById(id, userToken)
                .then((response) => {
                    if (response) {
                        let receivedPainting = response.data.painting;
                        if (receivedPainting.image != null) {
                            setUploadedImageByteArray(receivedPainting.image);
                            const arrayBufferView = new Uint8Array([...receivedPainting.image]);
                            const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
                            const imageUrl = URL.createObjectURL(blob);
                            receivedPainting.image = imageUrl;
                            setPainting(receivedPainting);
                        }
                    }
                    else {
                        console.log("no response returned from server.")
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        navigator("/products")
                    }
                    console.error("Error fetching paintings:", error);
                });
        }

        async function getCustomer() {
            try {
                const response = await CustomerService.getCustomerById(userId, userToken);
                if (response) {
                    let customerResponse = response.data.customer;
                    setCustomer(customerResponse)
                } else {
                    console.log("customer response returned false.")
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const firstError = error.response.data.errors[0];
                    const { messageField, error: messageValue } = firstError;
                    setMessageField(messageField);
                    setMessageValue(messageValue);
                } else {
                    // Handle other types of errors
                }
            }
        }

        getPainting();
        getCustomer();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    function orderPainting() {

        const auctioned_price = localStorage.getItem("auction_price");

        let body = {
            paintingID: painting.id,
            price: painting.price,
            name: painting.name,
            description: painting.description,
            length: painting.length,
            width: painting.width,
            image: uploadedImageByteArray,
            buyer_id: customer.id,
            buyer_address: customer.address,
            buyer_email: customer.email,
            status: 0
        }

        if (auctioned_price) {
            console.log("")
            body.price = auctioned_price;
        }

        OrderService.createOrder(body, userToken)
            .then((response) => {
                if (response) {
                    setOrderID(response.data.id);
                    console.log("order #" + response.data.id + " has been placed!");
                    toast.success(`Order #${response.data.id} has been placed!`);
                    navigator("/home");

                    // let updateBody = {
                    //     name: painting.name,
                    //     price: painting.price,
                    //     description: painting.description,
                    //     length: painting.length,
                    //     width: painting.width,
                    //     image: uploadedImageByteArray,
                    //     auction: painting.auction,
                    //     sold: 1
                    // }
                    // ArtService.updatePainting(painting.id, userToken, updateBody)
                    //     .then((response) => {
                    //         if (response)
                    //         {
                    //             console.log("painting #" + painting.id + " has been sold!");
                    //         }
                    //     })

                    // setTimeout(() => {
                    //     navigator("/products");
                    // }, 4000);
                }
                else {
                    console.log("error on response: " + response.data)
                }
            })
    }

    return (
        <div className="main-content-detailpage">
            {userToken ?
                (
                    <>
                        {
                            role == "CUSTOMER" ? (
                                <>
                                    <div className="detail-title-container">
                                        <h1 className="display-4 detail-banner fw-bold">Order painting: {painting.name}</h1>
                                        {/* {orderID ? (<h2 className="text-danger bg-white">Order #{orderID} has been submitted!</h2>) : (null)} */}
                                    </div>
                                    <div>
                                        <div className="row">
                                            <div className="col-12 col-lg-6 mb-2 text-center">
                                                <img className="img-fluid" src={painting.image} alt={painting.name}></img>
                                            </div>
                                            <div className="col-12 col-lg-6 border border-white border-2 p-3 bg-secondary col">
                                                <div className="row-6">
                                                    <h3>
                                                        Name: {painting.name}<br></br>
                                                        {localStorage.getItem("auction_price") ? (
                                                            <>
                                                                Price: €{localStorage.getItem("auction_price")} <br></br>
                                                            </>
                                                        ) : (
                                                            <>
                                                                Price: €{painting.price}<br></br>
                                                            </>
                                                        )}
                                                        Description: {painting.description}<br></br>
                                                    </h3>
                                                    <h5>
                                                        Length: {painting.length}cm<br></br>
                                                        Width: {painting.width}cm<br></br>
                                                    </h5>
                                                    <hr>
                                                    </hr>
                                                </div>
                                                <div className="row-6">
                                                    <p className="h3">Please change address if incorrect:</p>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <input type="text" name="address" value={customer.address} className="form-control w-100 border border-5 border-dark" id="nameInput" onChange={handleChange} placeholder="Address" required></input>
                                                    </div>
                                                    <div className="mt-5 text-center">
                                                        <button className="custom-btn btn-15" onClick={orderPainting}>Order painting</button>
                                                        {/* {orderID ? (<h2 className="text-danger bg-white">Order #{orderID} has been submitted!</h2>) : (null)} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : role == "ADMIN" ? (
                                <>
                                    <div className="detail-title-container">
                                        <h1 className="display-4 detail-banner fw-bold">Order painting: {painting.name}</h1>
                                    </div>
                                    <div className="mt-5 d-flex justify-content-evenly">
                                        <h2 className="text-center bg-secondary text-black p-5">ADMIN accounts are NOT allowed to purchase paintings!</h2>
                                        <button onClick={() => navigator(-1)} className="btn btn-danger border border-5 border-white ">Go back</button>
                                    </div>
                                </>
                            ) : (null)
                        }

                    </>
                ) : (
                    <UnauthorizedPopUp></UnauthorizedPopUp>
                )}

        </div>
    )
}


export default OrderPage;