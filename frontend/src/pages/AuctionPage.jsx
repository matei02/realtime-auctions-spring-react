import UnauthorizedPopUp from '../components/UnauthorizedPopUp';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import CustomerService from "../services/CustomerService";
import { useLocation } from 'react-router-dom';
import ArtService from '../services/ArtService';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../pages/AuctionPage.css";
import AuctionService from '../services/AuctionService';
import { useNavigate } from 'react-router-dom';

function AuctionPage() {
    const userToken = useSelector((state) => state.token);
    const role = localStorage.getItem("role");
    const [stompClient, setStompClient] = useState();
    const [auctionPainting, setAuctionPainting] = useState({});
    const [currentBidValue, setCurrentBidValue] = useState('');
    const [userName, setUserName] = useState();
    const [auction, setAuction] = useState({});
    const [imageByteArray, setImageByteArray] = useState('')

    const [started, setStarted] = useState(false);
    // const [endTime, setEndTime] = useState();
    const [stopped, setStopped] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    const navigator = useNavigate();
    const [isStompConnected, setIsStompConnected] = useState(false);

    const [bidsReceived, setBidsReceived] = useState([]);
    const [highestBid, setHighestBid] = useState(0);
    const [highestBidder, setHighestBidder] = useState({
        name: "",
        id: ""
    });
    let ok = 0;
    let auctionFound = 0;

    function getUsersName() {
        if (role === "CUSTOMER") {
            CustomerService.getCustomerById(localStorage.getItem("id"), userToken)
                .then((response) => {
                    if (response) {
                        setUserName(response.data.customer.name);
                        // console.log("username = " + userName)
                    }
                    else {
                        console.log("error: " + response)
                    }
                })
        }
    }

    async function getAuctionPainting() {
        await ArtService.fetchPaintings()
            .then((response) => {
                if (response && response.data.paintings) {
                    response.data.paintings.forEach((painting) => {
                        if (painting.auction === 1) {
                            const arrayBufferView = new Uint8Array([...painting.image]);
                            setImageByteArray(arrayBufferView);
                            const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
                            const imageUrl = URL.createObjectURL(blob);
                            painting.image = imageUrl;
                            setAuctionPainting(painting);
                            auctionFound = 1;
                            getAuctionDetails(painting.id);
                        }
                    })
                }
            })
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         const currentDatetime = new Date();
    //         // console.log("currentDateTime = " + currentDatetime)
    //         // console.log("endTime = " + endTime)
    //         // console.log("stopped = " + stopped)
    //         if (currentDatetime > endTime && stopped == false) {
    //             setStopped(true);
    //             toast.info("Auction has ended.");
    //         }
    //     }, 2000);
    // })

    async function getAuctionDetails(id) {
        await AuctionService.getAuctionByPaintingId(id, userToken)
            .then((response) => {
                if (response) {
                    setAuction(response.data.auction);
                    if (response.data.auction.highestBid && response.data.auction.highestBidderId) {
                        setHighestBid(response.data.auction.highestBid);
                        setHighestBidder(response.data.auction.highestBidderId);
                    }
                    const givenDatetime = new Date(response.data.auction.startTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'));
                    let endTime = "";
                    const currentDatetime = new Date();
                    if (response.data.auction.endTime != null) {
                        endTime = new Date(response.data.auction.endTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'));

                        if (currentDatetime > endTime) {
                            setStopped(true);
                            if (response.data.auction.highestBidderId == localStorage.getItem("id"))
                            {
                                console.log("winner is good")
                                setIsWinner(true);
                            }
                        }
                    }
                    // console.log("received end time BEFORE : " + response.data.auction.endTime)
                    // console.log("givenDatetime = " + givenDatetime)
                    // console.log("currentDatetime = " + currentDatetime)
                    if (givenDatetime > currentDatetime) {
                        setStarted(false);
                    }
                    else {
                        setStarted(true);
                        // setEndTime(response.data.auction.endTime);
                    }
                }
            })
    }

    const setupStompClient = () => {
        // stomp client over websockets
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        stompClient.onConnect = () => {
            // subscribe to the backend public topic
            stompClient.subscribe('/topic/place_bid', (data) => {
                OnBidReceived(data);
            });
            stompClient.subscribe('/topic/end_auction', (data) => {
                OnEndAuctionReceived(data);
            });

        };

        stompClient.activate();

        setStompClient(stompClient);
    };

    function OnEndAuctionReceived(data) {
        // stompClient.unsubscribe('/topic/place_bid');
        // stompClient.unsubscribe('/topic/end_auction');

        // console.log("unsubscribed!!")
        const message = JSON.parse(data.body);
        if (message.id == auction.id) {
            toast.info("This auction has ended. Winner is " + highestBidder.name + "! Final price: €" + highestBid)
            setStopped(true);
            if (userName === highestBidder.name) {
                setIsWinner(true);
            }
        }
    }

    const fetchDataAndSetupStomp = async () => {
        try {
            await getUsersName();
            await getAuctionPainting();
            if (auctionPainting && auctionPainting.id) {
                await getAuctionDetails(auctionPainting.id);
            }
            setupStompClient();
            setIsStompConnected(true);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsStompConnected(false);
        }
    };

    useEffect(() => {
        fetchDataAndSetupStomp();
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, [isStompConnected]);


    function OnBidReceived(data) {
        const message = JSON.parse(data.body);
        if (highestBid) {
            if (message.money > highestBid) {
                setBidsReceived(bidsReceived => [...bidsReceived, message])
                setHighestBid(message.money);
                setHighestBidder({ name: message.name, id: message.id });
            }
        }
        else {
            if (message.money > auctionPainting.price) {
                setBidsReceived(bidsReceived => [...bidsReceived, message])
                setHighestBid(message.money);
                setHighestBidder({ name: message.name, id: message.id });
                ok++;
            }
        }
    }

    function UploadHigherBid() {
        const body = {
            id: auction.id,
            bidderId: localStorage.getItem("id"),
            name: userName,
            money: currentBidValue
        }
        if (stompClient && stompClient.connected && currentBidValue) {

            if (highestBid) {
                if (currentBidValue > highestBid) {
                    stompClient.publish({
                        destination: '/topic/place_bid',
                        body: JSON.stringify({ id: auction.id, bidderId: localStorage.getItem("id"), name: userName, money: currentBidValue }),
                    });

                    AuctionService.uploadBid(auction.id, body, userToken)
                        .then((response) => {
                            if (response && response.status === 204) {
                                toast.success("You have placed a bid!");
                            }
                            else {
                                console.log("error: " + response.error)
                            }
                        })
                }
                else toast.error("You cannot bid lower than the highest bid!")
            }
            else if (currentBidValue > auctionPainting.price) {
                stompClient.publish({
                    destination: '/topic/place_bid',
                    body: JSON.stringify({ id: auction.id, bidderId: localStorage.getItem("id"), name: userName, money: currentBidValue }),
                });

                AuctionService.uploadBid(auction.id, body, userToken)
                    .then((response) => {
                        if (response && response.status === 204) {
                            toast.success("You have placed a bid!");
                        }
                        else {
                            console.log("error: " + response.error)
                        }
                    })
            }
            else {
                toast.error("You cannot bid lower than the starting price!")
            }
        } else {
            console.error("STOMP connection is not established.");
        }
    }

    function endAuction() {
        if (role === "ADMIN") {
            if (highestBid > auctionPainting.price) {
                AuctionService.endAuction(auction.id, userToken)
                    .then((response) => {
                        if (response) {
                            toast.warning("Auction has been ended.")
                            if (stompClient && stompClient.connected) {
                                stompClient.publish({
                                    destination: '/topic/end_auction',
                                    body: JSON.stringify({ id: auction.id }),
                                });
                            }
                            console.log("published.")
                        }
                        else console.log("error: " + response.error)
                    })
            }
            else {
                toast.error("Cannot end auction before any bids.")
            }
        }

    }

    const handleChange = (e) => {
        const { value } = e.target;
        setCurrentBidValue(value);
    };

    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         const isConfirmed = window.confirm("Are you sure you do not want to buy the painting?");

    //         if (isConfirmed) {
    //             handleBuyAuctionedPainting();
    //         } else {
    //             handleRefuseToBuyAuctionedPainting();
    //             toast.error("You have refused to purchase the auctioned painting.");
    //         }

    //         if (event) {
    //             event.returnValue = '';
    //         }

    //         return " ";
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);

    function handleBuyAuctionedPainting() {
        localStorage.setItem("auction_won", auction);
        localStorage.setItem("auction_price", highestBid);
        navigator(`/order/${auctionPainting.id}`);
    }

    // function handleRefuseToBuyAuctionedPainting() {
    //     if (role === "CUSTOMER") {
    //         let body =
    //         {
    //             name: auctionPainting.name,
    //             price: auctionPainting.price,
    //             description: auctionPainting.description,
    //             length: auctionPainting.length,
    //             width: auctionPainting.width,
    //             image: [...imageByteArray],
    //             auction: 0,
    //             sold: 0
    //         }

    //         // console.log("body = " + body.name)
    //         // console.log("body = " + body.price)
    //         // console.log("body = " + body.description)
    //         // console.log("body = " + body.length)
    //         // console.log("body = " + body.width)
    //         // console.log("body = " + body.image)

    //         ArtService.updatePainting(id, userToken, body)
    //             .then((response) => {
    //                 if (response) {
    //                     navigator("/home");
    //                 }
    //                 else {
    //                     console.log("error on response: " + response.data)
    //                 }
    //             })
    //             .catch((error) => {
    //                 if (error.response && error.response.status === 404) {
    //                     console.log("404 error");
    //                     console.log(error.response)

    //                     if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
    //                         const firstError = error.response.data.errors[0];
    //                         const { field: messageField, error: messageValue } = firstError;
    //                         console.log(messageField);
    //                         console.log(messageValue);
    //                         console.log("error field: " + messageField);
    //                     } else {
    //                         console.log("No errors array or it is empty.");
    //                     }
    //                 }
    //                 else { console.log("error is " + error) }
    //             })
    //     }
    // }

    function resetPainting() {
        toast.info("Auction deleted and painting reset.")
        AuctionService.deleteAuction(auctionPainting.id, userToken)
            .then((response) => {
                if (response) {
                    let body =
                    {
                        name: auctionPainting.name,
                        price: auctionPainting.price,
                        description: auctionPainting.description,
                        length: auctionPainting.length,
                        width: auctionPainting.width,
                        image: [...imageByteArray],
                        auction: 0,
                        sold: 0
                    }
                    ArtService.updatePainting(auctionPainting.id, userToken, body)
                        .then((response) => {
                            if (response) {
                                navigator("/home");
                            }
                            else {
                                console.log("error on response: " + response.data)
                            }
                        })
                }
            })
    }

    return (
        <>
            {userToken ? (
                <div className="main-content">
                    <div className="login-title-container">
                        <h1 className="display-4 auth-banner fw-bold">LIVE Auction for: {auctionPainting.name}</h1>
                        {stopped ? (
                            <>
                                <h2 className='display-4 bg-white text-danger fw-bold mt-2'>FINISHED</h2>
                                {role === "ADMIN" ? (
                                    <h3>Reset this painting <button onClick={resetPainting} className='bg-danger text-white'>Reset Painting</button></h3>
                                ) : (
                                    null
                                )}
                            </>
                        ) : (
                            <h2 className='display-4 bg-white text-danger fw-bold'>LIVE</h2>
                        )}
                        {role === "ADMIN" ? (
                            <button onClick={endAuction} className='btn btn-danger'>END AUCTION</button>
                        ) : (null)}
                    </div>
                    {auctionPainting ? (
                        <div className='row auction_container m-auto'>
                            <div className='col-12 col-md-8 p-3 border border-5 border-black'>
                                <div className='row'>
                                    <div className='col-12 d-flex justify-content-center'>
                                        <div>
                                            {highestBid ? (
                                                <h2 className='fw-bold text-center'>Highest bid: €{highestBid}</h2>
                                            ) : (
                                                <h2 className='fw-bold text-center'>Starting price: €{auctionPainting.price}</h2>
                                            )}
                                            <img className='img-fluid auction_image mt-3' src={auctionPainting.image} alt={auctionPainting.name + " painting"}></img>
                                        </div>
                                    </div>
                                    <div className='col-12 d-flex flex-column mt-3  '>
                                        <h4 className=' text-center border border-3 border-black'>
                                            Description: {auctionPainting.description}<br />
                                            Length: {auctionPainting.length}cm<br />
                                            Width: {auctionPainting.width}cm
                                        </h4>
                                        {
                                            stopped ? (
                                                <>

                                                </>
                                            ) : (
                                                <>
                                                    <input type="number" className='form-control w-100 border border-5 border-dark mb-3 mt-2 text-center' onChange={handleChange}></input>
                                                    {started && role === "CUSTOMER" ? (
                                                        <button className='w-auto justify-self-end' onClick={UploadHigherBid}>Bid higher</button>
                                                    ) : (
                                                        <button className='w-auto justify-self-end' disabled onClick={UploadHigherBid}>Bid higher</button>
                                                    )}
                                                </>
                                            )
                                        }
                                        {isWinner ? (
                                            <>
                                                <button onClick={handleBuyAuctionedPainting} className='btn btn-primary mt-3'>Purchase painting</button>
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-md-4 border border-5 border-black'>
                                <h1 className='text-center'>Current bid: €{highestBid}</h1>
                                {bidsReceived.length > 0 && (
                                    <>
                                        {stopped ? (
                                            <>
                                                <h2>Winner: {bidsReceived[bidsReceived.length - 1].name}</h2>
                                                <h3>{bidsReceived[bidsReceived.length - 1].money}</h3>
                                            </>
                                        ) : (
                                            <>
                                                <h2>Highest bidder : {bidsReceived[bidsReceived.length - 1].name}</h2>
                                                <h3>{bidsReceived[bidsReceived.length - 1].money}</h3>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div >
                    ) : (
                        <>
                            <h2 className='bg-black text-danger'>There is no auction at the moment.</h2>
                            <button className='btn-danger' onClick={() => navigator(-1)}>
                                Return
                            </button>
                        </>
                    )}

                </div >
            ) : (
                <UnauthorizedPopUp></UnauthorizedPopUp>
            )
            }

        </>
    );
}

export default AuctionPage;