The database "MySQL" objects are :

CREATE TABLE IF NOT EXISTS questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    questiontext VARCHAR(255) NOT NULL,
	questiontype VARCHAR(50) NOT NULL,
	numberofoptions INT NOT NULL,
	relativescore INT NOT NULL,
	isactive BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    optiontext VARCHAR(255) NOT NULL,
	optiontype VARCHAR(50) NOT NULL,	
	optionweightage INT NOT NULL,
	isactive BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (question_id) 
        REFERENCES questions(question_id)
);



CREATE USER 'assessment'@'localhost' IDENTIFIED BY 'assessment';
GRANT ALL PRIVILEGES ON * . * TO 'assessment'@'localhost';

ALTER USER 'assessment'@'localhost' IDENTIFIED WITH mysql_native_password BY 'assessment';
