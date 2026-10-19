CREATE TABLE auctions
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    painting_id int,
    highest_bid int DEFAULT NULL,
    highest_bidder_id int DEFAULT NULL,
    start_time DATETIME,
    end_time DATETIME
)