CREATE TABLE IF NOT EXISTS orders
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    price         double,
    name          varchar(50),
    description   varchar(200),
    length        int,
    width         int,
    image         LONGBLOB,
    buyer_id      BIGINT,
--     buyer_email   varchar(50),
--     buyer_address varchar(50),
    status        INT DEFAULT 0
)