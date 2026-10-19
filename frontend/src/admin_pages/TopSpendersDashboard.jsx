import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import ErrorPopUp from "../components/ErrorPopUp";
import { useSelector } from "react-redux";
import "../admin_pages/TopSpendersDashboard.css"
import blackImage from "../assets/black image.webp"

function TopSpendersDashboard() {

    const role = localStorage.getItem("role");
    const userToken = useSelector((state) => state.token);
    const [topSpenders, setTopSpenders] = useState([]);

    useEffect(() => {
        OrderService.getTopSpenders(userToken)
            .then((response) => {
                if (response.status === 200) {
                    const modifiedData = response.data.map(item => {
                        if (item.image != "") {
                            const arrayBufferView = new Uint8Array([...item.image]);
                            const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
                            const imageUrl = URL.createObjectURL(blob);
                            item.image = imageUrl;
                        } else {
                            item.image = blackImage;
                        }
                        return item;
                    });
                    setTopSpenders(modifiedData);
                } else {
                    console.log("error: " + response.status);
                }
            })
            .catch((error) => {
                console.log("error: " + error.message);
            });
    }, []);


    return (
        <>
            {userToken ? (
                <>
                    {role === "ADMIN" ? (
                        <div className="main-content">
                            <div className="catalogue-title-container">
                                <h1 className="display-4 catalogue-banner fw-bold">Top Spenders</h1>
                            </div>
                            <div className="col">
                                {topSpenders.map((spender) => (
                                    <div key={spender.id}>
                                        <div className="row d-flex spender_container justify-content-between text-center border border-5 border-black mb-5 bg-secondary align-items-center ">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 mt-5 mb-5 d-flex justify-content-center">
                                                {spender.image ? (
                                                    <img className="spender_image" src={spender.image} alt={`${spender.name}'s image`} />
                                                ) : (
                                                    <img className="spender_image" src={blackImage} alt={`${spender.name}'s image`} />
                                                )}

                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 mt-5 mb-5 h-100 d-flex justify-content-center align-content-center">
                                                <div className="">
                                                    <h2>Total amount spent: €{spender.totalAmountSpent}</h2>
                                                    <h2>Name: {spender.name}</h2>
                                                    <h2>Email: {spender.email}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                            </div>
                        </div>
                    ) : (
                        <ErrorPopUp />
                    )}
                </>
            ) : (
                <UnauthorizedPopUp />
            )}
        </>
    )
}

export default TopSpendersDashboard;

// {topSpenders && topSpenders.length > 0 ? (
//     topSpenders.map((spender) => (
//         <div key={spender.id}>
//             <p>Name: {spender.name}</p>
//             <p>Email: {spender.email}</p>
//             <p>Total Spent: €{spender.totalAmountSpent}</p>
//         </div>
//     ))
// ) : (
//     <p>No top spenders found.</p>
// )}