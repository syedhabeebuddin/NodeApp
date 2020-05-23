const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "assessment",
  password: "assessment",
  database: "a232020_db",
});

/*
connection.connect((err) => {
  if (err) {
    console.log("Error connecting to DB");
    console.log(err);
    return;
  }
  console.log("Connected !");
});

const question = {
  questiontext: "aaaa",
  questiontype: "YesOrNo",
  numberofoptions: 2,
  relativescore: 22,
  isactive: true,
};

connection.query("INSERT INTO questions SET ?", question, (err, res) => {
  if (err) {
    console.log("Error connecting to DB");
    console.log(err);
    throw err;
  }

  console.log("Last inserted Id:", res.insertId);
});

connection.end((err) => {}); */

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to DB");
    console.log(err);
    return;
  }
  console.log("Connected !");
});

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/addquestion", function (request, response) {
  console.log("its addquestion");
  console.log(request.body.qu.options);

  let question = {
    questiontext: request.body.qu.questiontext,
    questiontype: request.body.qu.qtype,
    numberofoptions: 2,
    relativescore: parseInt(request.body.qu.qWeightage),
    isactive: true,
  };

  /*
  connection.connect((err) => {
    if (err) {
      console.log("Error connecting to DB");
      console.log(err);
      return;
    }
    console.log("Connected !");
  }); */

  connection.beginTransaction(function (err) {
    /*connection.connect((err) => {
      if (err) {
        console.log("Error connecting to DB");
        console.log(err);
        return;
      }
      console.log("Connected !");
    }); */
    if (err) {
      throw err;
    }

    connection.query("INSERT INTO questions SET ?", question, (err, res) => {
      if (err) {
        console.log("Error connecting to DB");
        console.log(err);
        connection.rollback(function () {
          throw err;
        });
      }
      let questionInsertId = res.insertId;
      request.body.qu.options.forEach((opt) => {
        let optionk = {
          question_id: res.insertId,
          optiontext: opt.optiontext,
          optiontype: opt.type,
          optionweightage: parseInt(opt.weightage),
          isactive: true,
        };

        connection.query("INSERT INTO options SET ?", optionk, (err, res) => {
          if (err) {
            console.log("Error connecting to DB");
            console.log(err);
            connection.rollback(function () {
              throw err;
            });
          }
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }
            console.log("success!");
            //connection.end((err) => {});
          });

          console.log("Last inserted Id for Options:", res.insertId);
        });

        console.log("Last inserted Id:", res.insertId);
      });

      response.statusCode = 201;
      response.body = { insertId: questionInsertId };
      //response.json({ insertId: questionInsertId });
      //response.send(res.insertId);

      //response.end();
    });
  });
});

app.listen(3000);
