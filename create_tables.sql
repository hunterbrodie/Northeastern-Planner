CREATE TABLE nupath
(
  id INT PRIMARY KEY IDENTITY(1,1),
  nd BIT,
  ei BIT,
  ic BIT,
  fq BIT,
  si BIT,
  ad BIT,
  dd BIT,
  er BIT,
  wf BIT,
  wi BIT,
  wd BIT,
  ex BIT,
  ce BIT
);

CREATE TABLE classes
(
  crn VARCHAR(16) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  fk_id_nupath INT FOREIGN KEY REFERENCES nupath(id),
  credits TINYINT NOT NULL
);

CREATE TABLE taken
(
  id INT PRIMARY KEY IDENTITY(1,1),
  fk_crn_classes VARCHAR(16) NOT NULL,
  FOREIGN KEY (fk_crn_classes) REFERENCES classes(crn),
  sem TINYINT NOT NULL
);

CREATE TABLE cs_req
(
    id INT PRIMARY KEY IDENTITY(1,1),
    fk_crn_classes VARCHAR(16) NOT NULL FOREIGN KEY REFERENCES classes(crn),
    group_num INT
);