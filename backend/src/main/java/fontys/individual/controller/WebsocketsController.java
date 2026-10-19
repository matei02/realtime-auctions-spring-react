package fontys.individual.controller;

import fontys.individual.business.interfaces.AuctionManager;
import fontys.individual.domain.requests.auction.EndAuctionRequest;
import fontys.individual.domain.requests.auction.PlaceBidRequest;
import fontys.individual.domain.requests.supportchat.SupportMessage;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("notifications")
@CrossOrigin(origins = {"http://localhost:5173"})
public class WebsocketsController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionManager auctionManager;

    @RolesAllowed("CUSTOMER")
    @PostMapping()
    public ResponseEntity<Void> sendNotificationPlaceHigherBid(@RequestBody PlaceBidRequest request) {
//        System.out.println("just accessed the websocket point.");
//        auctionManager.updateBiddingInfoByAuctionId(request.getId(), request.getMoney(), request.getBidderId());
//        System.out.println("this is after updating the bidding info.");
        messagingTemplate.convertAndSend("/topic/place_bid", request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<Void> endAuction(@RequestBody EndAuctionRequest request)
    {
        messagingTemplate.convertAndSend("/topic/end_auction", request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<Void> sendSupportChatMessage(@RequestBody SupportMessage request) {
        messagingTemplate.convertAndSend("/topic/support_message", request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
