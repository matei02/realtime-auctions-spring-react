CREATE TABLE painting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    price double,
    name varchar(50),
    length int,
    width int,
    image LONGBLOB
)