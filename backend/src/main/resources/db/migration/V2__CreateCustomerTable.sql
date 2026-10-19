CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name varchar(50),
    email varchar(50),
    password varchar(50),
    age INT check ( age>= 16 and age <=100),
    address varchar(50),
    image LONGBLOB
)