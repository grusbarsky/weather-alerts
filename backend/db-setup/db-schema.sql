CREATE TABLE Users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
        CHECK (position('@' IN email) > 1),
    enable_alerts BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    article_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    date_published TEXT,
    source_name TEXT,
    ar_description TEXT
);

CREATE TABLE Locations (
    id SERIAL PRIMARY KEY,
    formatted_address TEXT NOT NULL,
    coordinates TEXT NOT NULL UNIQUE
);

CREATE TABLE User_articles (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles ON DELETE CASCADE NOT NULL,
    username  VARCHAR(25) REFERENCES users ON DELETE CASCADE NOT NULL
);

CREATE TABLE User_locations(
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations ON DELETE CASCADE NOT NULL,
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE NOT NULL
);