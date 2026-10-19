import React, { useEffect, useState } from "react";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp"
import ErrorPopUp from "../components/ErrorPopUp"
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Client } from '@stomp/stompjs';
import AdminService from "../services/AdminService";
import CustomerService from "../services/CustomerService";
import "../pages/SupportChat.css"
import { useNavigate } from "react-router-dom";

function SupportChat() {

    const [messagesReceived, setMessagesReceived] = useState([]);
    const role = localStorage.getItem("role");
    const userToken = useSelector(state => state.token);
    const [stompClient, setStompClient] = useState();
    const [currentMessage, setCurrentMessage] = useState();
    const [customer, setCustomer] = useState('');
    const [admin, setAdmin] = useState('');
    const [currentTime, setCurrentTime] = useState();
    const navigator = useNavigate();

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
            stompClient.subscribe('/topic/support_message', (data) => {
                onMessageReceived(data);
            });

        };

        stompClient.activate();

        setStompClient(stompClient);
    };

    function stopChat() {
        stompClient.unsubscribe('/topic/support_message');
        navigator("/products")
    }

    useEffect(() => {
        setupStompClient();
    }, [])

    function onMessageReceived(data) {
        const message = JSON.parse(data.body);
        setMessagesReceived(messagesReceived => [...messagesReceived, message]);
    }

    const handleMessageChange = (e) => {
        const { value } = e.target;
        setCurrentMessage(value);
    };

    function sendMessage() {
        let name = "";
        if (role === "ADMIN") {
            AdminService.getAdminById(localStorage.getItem("id"), userToken)
                .then((response) => {
                    if (response) {
                        setAdmin(response.data.admin);
                        name = response.data.admin.name;
                    }
                    else {
                        console.log("error.")
                    }
                })
        }
        else if (role === "CUSTOMER") {
            CustomerService.getCustomerById(localStorage.getItem("id"), userToken)
                .then((response) => {
                    if (response) {
                        setCustomer(response.data.customer);
                        name = response.data.customer.name;
                    }
                    else {
                        console.log("error.");
                    }
                })
        }
        console.log("user retrieved")
        //setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        if (stompClient && currentMessage) {
            stompClient.publish({
                destination: '/topic/support_message',
                body: JSON.stringify({ role: role, name: name, message: currentMessage }),
            });

            setCurrentMessage('');
        }
    }

    return (
        <>
            {userToken ? (
                <>
                    <div className="main-content">
                        <div className="container p-0">
                            <div className="detail-title-container">
                                <h1 className="display-4 detail-banner fw-bold">Support chat</h1>
                            </div>
                            <button className="btn btn-danger btn-lg mb-4 border border-3" onClick={stopChat}>
                                End Chat
                            </button>
                            <div className="card">
                                <div className="row g-0">
                                    <div className="col-12 col-lg-12">
                                        <div className="position-relative">
                                            <div className="chat-messages p-4">
                                                {messagesReceived.map((message, index) => {
                                                    if (message.role === "ADMIN") {
                                                        return (
                                                            <div key={index} className="chat-message-left pb-4">
                                                                <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                                                    <div className="font-weight-bold mb-1">Admin</div>
                                                                    {message.message}
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (message.role === "CUSTOMER") {
                                                        return (
                                                            <div key={index} className="chat-message-right mb-4">
                                                                <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                                    <div className="font-weight-bold mb-1">Customer</div>
                                                                    {message.message}
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex-grow-0 py-3 px-4 border-top">
                                            <div className="input-group">
                                                <input name="message" type="text" value={currentMessage} className="form-control" onChange={handleMessageChange} placeholder="Type your message"></input>
                                                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <UnauthorizedPopUp></UnauthorizedPopUp>
            )}
        </>
    );


    // {messagesReceived.role === "CUSTOMER" ? (
    //     <>
    //         {/* Render Customer-specific components */}
    //     </>
    // ) : messagesReceived.role === "ADMIN" ? (
    //     <>
    //         {/* Render Admin-specific components */}
    //     </>
    // ) : (
    //     <>
    //         {/* Render components for other roles */}
    //     </>
    // )}


}

export default SupportChat;