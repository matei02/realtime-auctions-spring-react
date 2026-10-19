import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoginService from "../services/LoginService";
import { useDispatch } from "react-redux";
import { setUserToken } from "../redux/features/userSlice";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ArtService from "../services/ArtService";
import "../pages/DetailPage.css"
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuctionService from "../services/AuctionService";
import { end } from "@popperjs/core";

function DetailPage() {

    const userToken = useSelector((state) => state.token);
    const [painting, setPainting] = useState([]);
    const { id } = useParams();
    const role = localStorage.getItem("role");
    const navigator = useNavigate();
    const [uploadedImageByteArray, setUploadedImageByteArray] = useState('');
    let isAuctionAlready = false;

    const [currentDatetime, setCurrentDatetime] = useState('');

    useEffect(() => {
        ArtService.getPaintingById(id, userToken)
            .then((response) => {
                if (response) {
                    let receivedPainting = response.data.painting;
                    if (receivedPainting.image != null) {
                        const arrayBufferView = new Uint8Array([...receivedPainting.image]);
                        const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
                        const imageUrl = URL.createObjectURL(blob);
                        receivedPainting.image = imageUrl;
                        setPainting(prevState => ({
                            ...prevState,
                            ...receivedPainting
                        }))
                        setUploadedImageByteArray(arrayBufferView)
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
    }, []);

    function deletePainting(id) {
        ArtService.deletePainting(id, userToken)
            .then((response) => {
                if (response) {
                    console.log("Product deleted!")
                    navigator("/products")
                }
                else {
                    console.log("error")
                }
            })
            .catch((error) => {
                console.log("error: " + error)
            })
    }

    // async function checkExistingAuction() {
    //     ArtService.fetchPaintings()
    //     .then((response) => {
    //         console.log("Response.data.paintings:", response.data.paintings);
    //         if (response && response.data.paintings) {
    //             console.log("response - " + response)
    //             response.data.paintings.forEach((painting) => {
    //                 if (painting.auction == 1) {
    //                     isAuctionAlready = true;
    //                     console.log("Auction already live : isAuctionAlready = " + isAuctionAlready)
    //                 }
    //             })
    //         }
    //     })
    // }

    const getCurrentDatetime = () => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24-hour format
        };

        const currentDate = new Date();

        // Subtract one hour (in milliseconds) from the current date
        currentDate.setTime(currentDate.getTime() + 60 * 60 * 1000);

        const datetimeString = currentDate.toLocaleString('en-US', options);
        setCurrentDatetime(datetimeString);
        return datetimeString;
    };

    async function startAuction() {
        await ArtService.fetchPaintings()
            .then((response) => {
                console.log("Response.data.paintings:", response.data.paintings);
                if (response && response.data.paintings) {
                    console.log("response - " + response)
                    response.data.paintings.forEach((painting) => {
                        if (painting.auction == 1) {
                            isAuctionAlready = true;
                            console.log("Auction already live : isAuctionAlready = " + isAuctionAlready)
                        }
                    })
                }
            })

        if (isAuctionAlready) {
            toast.error("There is an auction already live.")
        }
        else {
            console.log("start auction called")
            if (role === "ADMIN") {
                let body =
                {
                    name: painting.name,
                    price: painting.price,
                    description: painting.description,
                    length: painting.length,
                    width: painting.width,
                    image: [...uploadedImageByteArray],
                    auction: 1,
                    sold: 0
                }

                // console.log("body = " + body.name)
                // console.log("body = " + body.price)
                // console.log("body = " + body.description)
                // console.log("body = " + body.length)
                // console.log("body = " + body.width)
                // console.log("body = " + body.image)

                ArtService.updatePainting(id, userToken, body)
                    .then((response) => {
                        if (response) {
                            console.log("Success!")
                            console.log("Painting auction has started!")

                            const currentDateTime = getCurrentDatetime();

                            const startTime = new Date(currentDateTime);
                            // const endTime = new Date(startTime.getTime() + 20 * 60000);

                            const body = {
                                painting_id: painting.id,
                                start_time: startTime.toISOString(),
                                // end_time: endTime.toISOString()
                            }

                            AuctionService.createAuction(body, userToken)
                                .then((response) => {
                                    if (response) {
                                        toast.success("Auction has been created: " + response.data.id);
                                    }
                                    else {
                                        toast.error(response.error);
                                    }
                                }, [])


                            setTimeout(() => {
                                window.location.reload();
                            }, 6000);
                        }
                        else {
                            console.log("error on response: " + response.data)
                        }
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            console.log("404 error");
                            console.log(error.response)

                            if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                                const firstError = error.response.data.errors[0];
                                const { field: messageField, error: messageValue } = firstError;
                                console.log(messageField);
                                console.log(messageValue);
                                console.log("error field: " + messageField);
                            } else {
                                console.log("No errors array or it is empty.");
                                // Handle the case where there are no errors or the errors array is empty
                            }
                        }
                        else { console.log("error is " + error) }
                    })
            }
        }
    }

    function stopAuction() {
        console.log("STOP auction called")
        if (role === "ADMIN") {
            let body =
            {
                name: painting.name,
                price: painting.price,
                description: painting.description,
                length: painting.length,
                width: painting.width,
                image: [...uploadedImageByteArray],
                auction: 0,
                sold: 0
            }

            // console.log("body = " + body.name)
            // console.log("body = " + body.price)
            // console.log("body = " + body.description)
            // console.log("body = " + body.length)
            // console.log("body = " + body.width)
            // console.log("body = " + body.image)

            ArtService.updatePainting(id, userToken, body)
                .then((response) => {
                    if (response) {
                        console.log("Success!")
                        console.log("Painting auction has been stopped!")
                        AuctionService.deleteAuction(id, userToken)
                            .then((response) => {
                                if (response)
                                {
                                    toast.success("Painting auction has been stopped!")
                                }
                            })
                        setTimeout(() => {
                            window.location.reload();
                        }, 6000);
                    }
                    else {
                        console.log("error on response: " + response.data)
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        console.log("404 error");
                        console.log(error.response)

                        if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                            const firstError = error.response.data.errors[0];
                            const { field: messageField, error: messageValue } = firstError;
                            console.log(messageField);
                            console.log(messageValue);
                            console.log("error field: " + messageField);
                        } else {
                            console.log("No errors array or it is empty.");
                            // Handle the case where there are no errors or the errors array is empty
                        }
                    }
                    else { console.log("error is " + error) }
                })
        }
    }

    return (
        <div className="main-content-detailpage">
            {userToken ?
                (
                    <>
                        <div className="detail-title-container">
                            <h1 className="display-4 detail-banner fw-bold">{painting.name}</h1>
                        </div>
                        <div className="row d-flex text-center">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 h-auto">
                                <img className="detail_card_img img-fluid w-auto border border-5 rounded-3" src={painting.image}></img>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 mt-3 d-flex flex-column justify-content-center
                align-items-center">
                                <h2>Description: {painting.description}</h2>
                                <div className="mt-4 h4">
                                    <p>Price: {painting.price}</p>
                                    <p>Length: {painting.length}cm</p>
                                    <p>Width: {painting.width}cm</p>
                                </div>
                                <button className="btn-hover color-7 border border-4" role="button" onClick={() => navigator(`/order/${painting.id}`)}>Buy now!</button>
                                {role === "ADMIN" ? (
                                    <>
                                        <button className="btn btn-danger rounded border-4 mb-3" role="button" onClick={() => deletePainting(painting.id)}>Delete product</button>
                                        <button className="btn btn-warning rounded border-4 mb-3" role="button" onClick={() => navigator(`/admin/edit-painting/${painting.id}`)}>Edit Painting</button>
                                        {painting.auction == 1 ? (
                                            <>
                                                <button className="btn btn-danger rounded border-4" role="button" onClick={stopAuction}>STOP Auction!</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary rounded border-4" role="button" onClick={startAuction}>Start Auction!</button>
                                            </>
                                        )}

                                    </>
                                ) : (null)}
                            </div>
                        </div>
                    </>
                ) : (
                    <UnauthorizedPopUp></UnauthorizedPopUp>
                )
            }

        </div >



    )
}

export default DetailPage;

//carousel for images:
{/* <div id="myCarousel" class="carousel slide">
    <ol class="carousel-indicators">
        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
        <li data-target="#myCarousel" data-slide-to="1"></li>
        <li data-target="#myCarousel" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner">
        <div class="item active">
            //IMAGES HERE I THINK
        </div>
    </div>
    <a class="left carousel-control" href="#myCarousel" data-slide="prev">
        <span class="icon-prev"></span>
    </a>
    <a class="right carousel-control" href="#myCarousel" data-slide="next">
        <span class="icon-next"></span>
    </a>
</div> */}