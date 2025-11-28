DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    user        VARCHAR(25)     NOT NULL UNIQUE,
    pass        VARCHAR(255)    NOT NULL,
    update_at   TIMESTAMP       DEFAULT     CURRENT_TIMESTAMP
                                ON UPDATE   CURRENT_TIMESTAMP,
    email       VARCHAR(254)    NOT NULL,
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);