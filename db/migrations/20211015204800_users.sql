-- migrate:up

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile_number TEXT NOT NULL
);

-- migrate:down
DROP TABLE users;
