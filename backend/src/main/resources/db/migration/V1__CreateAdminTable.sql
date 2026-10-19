CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name varchar(50),
    email varchar(50),
    password varchar(50),
    image LONGBLOB
)