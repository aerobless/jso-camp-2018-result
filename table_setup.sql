-- Select db
USE kickerbox;

-- CREATE result table
CREATE TABLE result (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  homeTeamScore INT,
  visitorTeamScore INT,
  reservationId INT
);

-- INSERT into result table
INSERT INTO result(homeTeamScore, visitorTeamScore, reservationId) VALUES(2,1,0);