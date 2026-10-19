// StompClientContext.js
import { createContext, useContext, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';

const StompClientContext = createContext();

const useStompClient = () => {
    return useContext(StompClientContext);
};

const StompClientProvider = ({ children }) => {
    const stompClient = setupStompClient();
    const [auctionPainting, setAuctionPainting] = useState(null);

    return (
        <StompClientContext.Provider value={{ stompClient, auctionPainting, setAuctionPainting }}>
            {children}
        </StompClientContext.Provider>
    );
};

const setupStompClient = () => {
    const stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.onConnect = () => {
        stompClient.subscribe(`/topic/start_auction`, (data) => {
            onNotificationReceived(data);
        })

        stompClient.subscribe('/topic/place_bid', (data) => {
            console.log(data);
            onHigherBidReceived(data);
        });
    };

    stompClient.activate();
    return stompClient;
};

const onHigherBidReceived = (data) => {
    try {
        const body = JSON.parse(data.data);

    } catch (error) {
        console.error("Error parsing WebSocket data:", error);
    }
};

const onNotificationReceived = (data) => {
    try {
        const body = JSON.parse(data.data);
        setAuctionPainting(body);
        console.log("auction item set: " + auctionPainting)
    } catch (error) {
        console.error("Error parsing WebSocket data:", error);
    }
};

export { useStompClient, StompClientProvider };
