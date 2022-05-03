CREATE TABLE nupath
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  nd BOOL NOT NULL,
  ei BOOL NOT NULL,
  ic BOOL NOT NULL,
  fq BOOL NOT NULL,
  si BOOL NOT NULL,
  ad BOOL NOT NULL,
  dd BOOL NOT NULL,
  er BOOL NOT NULL,
  wf BOOL NOT NULL,
  wi BOOL NOT NULL,
  wd BOOL NOT NULL,
  ex BOOL NOT NULL,
  ce BOOL NOT NULL
);

CREATE TABLE course
(
  crn VARCHAR(16) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  fk_id_nupath INT,
  FOREIGN KEY (fk_id_nupath) REFERENCES nupath(id),
  credits TINYINT NOT NULL
);

CREATE TABLE coreqs
(
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_req VARCHAR(16) NOT NULL,
	FOREIGN KEY (fk_req) REFERENCES course(crn),
	fk_class VARCHAR(16) NOT NULL,
	FOREIGN KEY (fk_class) REFERENCES course(crn),
	group_id INT
);

CREATE TABLE prereqs
(
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_req VARCHAR(16) NOT NULL,
	FOREIGN KEY (fk_req) REFERENCES course(crn),
	fk_class VARCHAR(16) NOT NULL,
	FOREIGN KEY (fk_class) REFERENCES course(crn),
	group_id INT
);