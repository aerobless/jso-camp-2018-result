-- Select db
USE kickerbox;

-- CREATE result table
CREATE TABLE result (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  homeTeamScore INT,
  visitorTeamScore INT,
  reservationId INT
);

-- CREATE challenge table
CREATE TABLE challenge (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  challengerId BIGINT,
  challengeeId BIGINT,
  status ENUM('OPEN','ACCEPTED','DECLINED'),
  dateOfChallenge DATETIME
);


-- INSERT into result table
INSERT INTO result(homeTeamScore, visitorTeamScore, reservationId) VALUES(2,1,0);

-- INSERT into challenge table
INSERT INTO challenge(challengerId, challengeeId, status, dateOfChallenge) VALUES(1,2,'OPEN', NOW());
