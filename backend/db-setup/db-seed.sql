-- Test user has username testuser and password password

INSERT INTO users (username, password, first_name, last_name, email, enable_alerts)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'gretarusbarsky@gmail.com',
        FALSE);

INSERT INTO articles (title, article_url, image_url, date_published)
VALUES  ('testArticle',
        'google.com',
        'https://upload.wikimedia.org/wikipedia/commons/1/11/Test-Logo.svg',
        '01-10-1997');

INSERT INTO locations(formatted_address, coordinates)
VALUES  ('New Orleans, LA, USA',
        '29.95106579999999,-90.0715323');