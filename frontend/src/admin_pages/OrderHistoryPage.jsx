import React, { useEffect, useState } from "react";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import ErrorPopUp from "../components/ErrorPopUp";
import { useSelector } from "react-redux";
import "../admin_pages/OrderHistoryPage.css"
import mockImage from "../assets/black image.webp"
import OrderService from "../services/OrderService"

function OrderHistoryPage() {

    const userToken = useSelector((state) => state.token);
    const role = localStorage.getItem("role");

    const [orders, setAllOrders] = useState([]);

    function getAllOrders() {
        OrderService.getAllOrders(userToken)
            .then((response) => {
                if (response) {
                    const ordersWithBlobs = response.data.orders.map((painting) => {
                        if (painting.image != null) {
                            const arrayBufferView = new Uint8Array([...painting.image]);
                            const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
                            const imageUrl = URL.createObjectURL(blob);
                            painting.image = imageUrl;
                        }
                        return painting;
                    });
                    setAllOrders(ordersWithBlobs)
                }
            })
    }

    useEffect(() => {
        getAllOrders();
    }, [])

    function updateToDelivered(id) {
        let body = {
            status: 1
        }

        OrderService.changeOrderStatus(id, body, userToken)
            .then((response) => {
                if (response) {
                    console.log("Order has been delivered!")
                }
                else {
                    console.log("error: " + response)
                }
            })

        window.location.reload();
    }

    function deleteOrder(id) {
        OrderService.deleteOrder(id, userToken)
            .then((response) => {
                if (response) {
                    console.log("Order has been deleted succesfully!")
                }
                else {
                    console.log("error: " + response)
                }
            })
    }

    return (
        <>
            {userToken ? (
                <div>
                    {role === "ADMIN" ? (
                        <div className="main-content">
                            <div className="home-title-container">
                                <h1 className="display-4 home-banner fw-bold">Order History</h1>
                            </div>
                            {orders.length > 0 ? (
                                <div className="col">
                                    {orders.map((order, index) => (
                                        <>
                                            <h1 className="text-decoration-underline">Order #{order.id}</h1>
                                            {
                                                order.status === 0 ? (
                                                    <div key={index} className="row d-flex justify-content-between text-center order_container order_container_pending border border-5 border-danger mb-5">
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-5 mb-5 d-flex h-100 justify-content-center">
                                                            <img className="order_image" src={order.image} alt={`Order number ${index} image`} />
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-5 mb-5 h-100 d-flex justify-content-center">
                                                            <div className="order_product_info m-auto">
                                                                <h2>Painting: {order.name}</h2>
                                                                <p className="custom-border-bottom">Price: €{order.price}</p>
                                                                <p className="description">Description: {order.description}</p>
                                                                <p className="custom-border-top">Length: {order.length}cm</p>
                                                                <p>Width: {order.width}cm</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-5 mb-5 h-100 d-flex justify-content-center">
                                                            <div className="order_buyer_info m-auto">
                                                                <h2>Buyer ID: {order.buyer_id}</h2>
                                                                <p className="">Email: {order.buyer_email}</p>
                                                                <p className="description">Address: {order.buyer_address}</p>
                                                                {order.status === 0 ? (
                                                                    <p className="bg-warning text-black rounded opacity-75">Status: Pending...</p>
                                                                ) : (
                                                                    <p className="bg-success text-black rounded opacity-75">Status: Delivered!</p>
                                                                )}
                                                                {order.status === 1 ? (null) : (
                                                                    <button className="btn btn-primary mt-2 mb-2" onClick={() => updateToDelivered(order.id)}>Mark as delivered</button>
                                                                )}
                                                                <br></br>
                                                                <button className="btn btn-danger" onClick={() => deleteOrder(order.id)}>Delete order</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key={index} className="row d-flex justify-content-between text-center order_container order_container_delivered border border-5 border-danger mb-5">
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-5 mb-5 d-flex h-100 justify-content-center">
                                                            <img className="order_image" src={order.image} alt={`Order number ${index} image`} />
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-5 mb-5 h-100 d-flex justify-content-center">
                                                            <div className="order_product_info m-auto">
                                                                <h2>Painting: {order.name}</h2>
                                                                <p className="custom-border-bottom">Price: €{order.price}</p>
                                                                <p className="description">Description: {order.description}</p>
                                                                <p className="custom-border-top">Length: {order.length}cm</p>
                                                                <p>Width: {order.width}cm</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-5 mb-5 h-100 d-flex justify-content-center">
                                                            <div className="order_buyer_info m-auto">
                                                                <h2>Buyer ID: {order.buyer_id}</h2>
                                                                <p className="">Email: {order.buyer_email}</p>
                                                                <p className="description">Address: {order.buyer_address}</p>
                                                                {order.status === 0 ? (
                                                                    <p className="bg-warning text-black rounded opacity-75">Status: Pending...</p>
                                                                ) : (
                                                                    <p className="bg-success text-black rounded opacity-75">Status: Delivered!</p>
                                                                )}
                                                                {order.status === 1 ? (null) : (
                                                                    <button className="btn btn-primary mt-2 mb-2" onClick={() => updateToDelivered(order.id)}>Mark as delivered</button>
                                                                )}
                                                                <br></br>
                                                                <button className="btn btn-danger" onClick={() => deleteOrder(order.id)}>Delete order</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                        </>
                                    ))}
                                </div>
                            ) : (
                                <h2 className="text-center bg-secondary text-black p-5">There are no orders at the moment.</h2>
                            )}

                        </div>
                    ) : (
                        <ErrorPopUp />
                    )}
                </div>
            ) : (
                <UnauthorizedPopUp />
            )}
        </>
    );

}

export default OrderHistoryPage;