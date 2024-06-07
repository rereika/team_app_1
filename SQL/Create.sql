CREATE DATABASE calendar_app;

CREATE TABLE tags (
  PRIMARY KEY (id),
  id       INT         NOT NULL AUTO_INCREMENT,
  tag_name VARCHAR(45) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE reports(
  PRIMARY KEY (id),
  id       INT          NOT NULL AUTO_INCREMENT,
  hour     INT          NOT NULL DEFAULT 0,
  rate     INT          NOT NULL DEFAULT 0,
  studies  VARCHAR(255),
  good     VARCHAR(255),
  more     VARCHAR(255),
  tomorrow VARCHAR(255),
  day      DATE         NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE report_tags (
  reports_id INT NOT NULL,
  tags_id    INT NOT NULL,
  KEY fk_table1_reports_idx (reports_id),
  KEY fk_table1_tags1_idx (tags_id),
  CONSTRAINT fk_table1_reports FOREIGN KEY (reports_id) REFERENCES reports (id),
  CONSTRAINT fk_table1_tags1 FOREIGN KEY (tags_id) REFERENCES tags (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
