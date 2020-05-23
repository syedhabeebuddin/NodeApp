//const mysql = require("mysql");

var app = (function () {
  "use strict";
  // You are in control and write a great piece of code

  let dsOptions = document.getElementById("dspOptions");
  //console.log(dsOptions);
  dsOptions.addEventListener("click", function () {
    console.log("I'm inside");

    let optionsType = document.getElementById("qoptions");
    let numOfOptions = document.getElementById("numoptions");
    let optionsDiv = document.getElementById("dvoptions");
    clearOptions();
    let optionsTypeValue = optionsType.options[optionsType.selectedIndex].value;

    if (optionsTypeValue === "YesOrNo") {
      let lbl1 = document.createElement("label");
      lbl1.htmlFor = "YesWeightage";
      lbl1.innerHTML = "Yes-Weightage : ";

      let op1 = document.createElement("input");
      op1.type = "text";
      op1.id = "YesWeightage";

      let dvyes = document.createElement("div");
      let newlineyes = document.createElement("br");

      dvyes.appendChild(lbl1);
      dvyes.appendChild(newlineyes);
      dvyes.appendChild(op1);
      optionsDiv.appendChild(dvyes);

      let newline = document.createElement("br");
      optionsDiv.appendChild(newline);

      let lbl2 = document.createElement("label");
      lbl2.htmlFor = "NoWeightage";
      lbl2.innerHTML = "No-Weightage   : ";

      let op2 = document.createElement("input");
      op2.type = "text";
      op2.id = "NoWeightage";

      let dvno = document.createElement("div");
      let newlineno = document.createElement("br");
      dvno.appendChild(lbl2);
      dvno.appendChild(newlineno);
      dvno.appendChild(op2);
      optionsDiv.appendChild(dvno);
    } else if (optionsTypeValue === "radiobutton") {
      let numOptions = document.getElementById("numberOfOptions");
      if (numOptions.value) {
        displayRadiobuttonOptions(numOptions.value);
      } else {
        alert("Please provide number of options");
      }
    } else {
      clearOptions();
    }
  });

  const checkbox = document.getElementById("latestq");
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      let tbl = document.createElement("table");
      tbl.id = "genQTbl";

      let thead = document.createElement("thead");

      let thr = document.createElement("tr");
      fields.forEach((field) => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(field));
        thr.appendChild(th);
      });

      thead.appendChild(thr);
      table.appendChild(thead);
    } else {
      alert("not checked");
    }
  });

  function question(qstring, qWeightage, qtype, options, id, selectedtext) {
    this.questiontext = qstring;
    this.qWeightage = qWeightage;
    this.qtype = qtype;
    this.options = options;
    this.questionid = id;
    this.selectedtext = selectedtext;
  }

  function option(ostring, oweightage, otype, id, isSelected) {
    this.optiontext = ostring;
    this.weightage = oweightage;
    this.type = otype;
    this.optionid = id;
    this.isSelected = isSelected;
  }

  var questions = [];
  var questionid = 0;
  var memqid = 0;
  var score = 0;

  window.onload = function () {
    //displayQuestionDetails();
    //questionid = 0;
    document.getElementById("top").children[1].style.display = "none";
    emptyQuestionDetails();
    emptyOptionsDetails();
  };

  function switchcontext(id) {
    let x = document.getElementById("dvquestions");
    let y = document.getElementById("dvassessment");
    let status = document.getElementById("statusmessage");
    let result = document.getElementById("dvassessmentresult");
    let dvtables = document.getElementById("dvquestiondetails");
    let dvresult = document.getElementById("result");
    let dvline = document.getElementById("dvcentline");

    if (id === "1") {
      x.style.display = "block";
      dvtables.style.display = "block";
      dvline.style.display = "block";
      y.style.display = "none";
      status.style.display = "none";
      result.style.display = "none";
      dvresult.style.display = "none";

      cleardiv(dvresult);
    } else if (id === "2") {
      if (questions.length === 0) {
        alert("No Questions To Assess. Please Add questions.");
        return;
      }
      cleardiv(y);
      score = 0;
      prepareAssessment();
      x.style.display = "none";
      y.style.display = "block";
      dvtables.style.display = "none";
      dvresult.style.display = "none";
      dvline.style.display = "none";
      cleardiv(dvresult);
      //dvresult.children.remove();
    } else if (id === "3") {
      x.style.display = "none";
      dvtables.style.display = "none";
      y.style.display = "none";
      status.style.display = "none";
      result.style.display = "none";
      dvtables.style.display = "none";
      dvline.style.display = "none";
      dvresult.style.display = "block";
      displayresultdashboard();
    } else if (id === "4") {
      reset();
    } else if (id === "5") {
      x.style.display = "none";
      y.style.display = "block";
      dvtables.style.display = "none";
      dvresult.style.display = "none";
      dvline.style.display = "none";
    }
  }

  function reset() {
    let x = document.getElementById("dvquestions");
    let y = document.getElementById("dvassessment");
    let status = document.getElementById("statusmessage");
    let result = document.getElementById("dvassessmentresult");
    cleardiv(y);
    x.style.display = "block";
    y.style.display = "none";
    status.style.display = "none";
    result.style.display = "none";

    questions = [];
    window.questionid = 0;
    score = 0;
  }

  function displayresultdashboard() {
    let dvresult = document.getElementById("result");
    cleardiv(dvresult);

    let para0 = document.createElement("p");
    para0.innerText = `Congratulations !!. Your Assessment Score is : ${score} `;
    para0.style.fontWeight = "bold";
    para0.style.fontSize = "large";
    dvresult.appendChild(para0);

    let para = document.createElement("p");
    para.innerText = "The detailed assessment report is as follows";
    dvresult.appendChild(para);

    let qdata = getQuestionsUnattempted();

    let tblh = document.createElement("table");
    tblh.id = "headtable";

    let trt = document.createElement("tr");
    let tdt = document.createElement("td");
    tdt.style.fontWeight = "bold";
    //tdt.style.width = "250px";
    tdt.appendChild(document.createTextNode("Total Number Of Questions"));
    trt.appendChild(tdt);

    let tdt1 = document.createElement("td");
    tdt1.style.width = "20px";
    tdt1.style.fontWeight = "bold";
    tdt1.appendChild(document.createTextNode(" : "));
    trt.appendChild(tdt1);

    let tdtv = document.createElement("td");
    tdtv.style.fontWeight = "bold";
    tdtv.appendChild(document.createTextNode(questions.length));
    trt.appendChild(tdtv);

    let trq = document.createElement("tr");
    let tdq = document.createElement("td");
    tdq.style.fontWeight = "bold";
    tdq.appendChild(document.createTextNode("Questions Attempted"));
    trq.appendChild(tdq);

    let tdq1 = document.createElement("td");
    tdq1.style.width = "20px";
    tdq1.style.fontWeight = "bold";
    tdq1.appendChild(document.createTextNode(" : "));
    trq.appendChild(tdq1);

    let tdqv = document.createElement("td");
    tdqv.style.fontWeight = "bold";
    tdqv.appendChild(document.createTextNode(qdata[1]));
    trq.appendChild(tdqv);

    let tru = document.createElement("tr");
    let tdu = document.createElement("td");
    tdu.style.fontWeight = "bold";
    tdu.appendChild(document.createTextNode("Questions Un-answered"));
    tru.appendChild(tdu);

    let tdu1 = document.createElement("td");
    tdu1.style.width = "20px";
    tdu1.style.fontWeight = "bold";
    tdu1.appendChild(document.createTextNode(" : "));
    tru.appendChild(tdu1);

    let tduv = document.createElement("td");
    tduv.style.fontWeight = "bold";
    tduv.appendChild(document.createTextNode(qdata[0]));
    tru.appendChild(tduv);

    let tblbd = document.createElement("tbody");
    tblbd.appendChild(trt);
    tblbd.appendChild(trq);
    tblbd.appendChild(tru);

    tblh.appendChild(tblbd);
    dvresult.appendChild(tblh);

    let newline = document.createElement("br");
    dvresult.appendChild(newline);

    let fields = [
      "S.NO",
      "Question",
      "IsAttempted",
      "Your Answer",
      "Question Rel Score",
      "Answer Weightage",
      "Score",
    ];

    let table = document.createElement("table");
    table.id = "resultstable";
    table.setAttribute("class", "table");
    let thead = document.createElement("thead");

    let thr = document.createElement("tr");
    fields.forEach((field) => {
      let th = document.createElement("th");
      th.appendChild(document.createTextNode(field));
      thr.appendChild(th);
    });

    thead.appendChild(thr);
    table.appendChild(thead);

    let tblbody = document.createElement("tbody");
    questions.forEach((qe) => {
      let tr = document.createElement("tr");

      let td = document.createElement("td");
      td.appendChild(document.createTextNode(qe.questionid));
      tr.appendChild(td);

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(qe.questiontext));
      tr.appendChild(td1);

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode("Yes"));
      tr.appendChild(td2);

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(qe.selectedtext));
      tr.appendChild(td3);

      let td4 = document.createElement("td");
      td4.appendChild(document.createTextNode(qe.qWeightage / 100));
      tr.appendChild(td4);

      let td6 = document.createElement("td");
      var ansWeightage = 1;
      qe.options.forEach((oo) => {
        if (oo.optiontext === qe.selectedtext) {
          ansWeightage = oo.weightage;
        }
      });

      td6.appendChild(document.createTextNode(ansWeightage));
      tr.appendChild(td6);

      let td5 = document.createElement("td");
      let n = qe.qWeightage / 100;
      td5.appendChild(document.createTextNode(n * ansWeightage));
      tr.appendChild(td5);

      tblbody.appendChild(tr);
    });

    let tr7 = document.createElement("tr");
    let td71 = document.createElement("td");
    td71.colSpan = "6";
    td71.style.fontWeight = "bold";
    td71.appendChild(document.createTextNode("Total Score"));
    tr7.appendChild(td71);

    let td72 = document.createElement("td");
    td72.style.fontWeight = "bold";
    td72.appendChild(document.createTextNode(score));
    tr7.appendChild(td72);
    tblbody.appendChild(tr7);

    table.appendChild(tblbody);
    dvresult.appendChild(table);
  }

  function getanswerweightage(answer, qeid) {
    questions.forEach((qn) => {
      if (qn.questionid === qeid) {
        qn.options.forEach((os) => {
          if (os.optiontext === answer) {
            return parseInt(os.weightage);
          }
        });
      }
    });
  }

  function getQuestionsUnattempted() {
    let una = parseInt("0");
    let atm = parseInt("0");
    let qdata = [];
    questions.forEach((qs) => {
      if (qs.selectedtext) {
        atm++;
      } else {
        una++;
      }
    });
    qdata.push(una);
    qdata.push(atm);

    return qdata;
  }

  function prepareAssessment() {
    var questionNumber = 0;
    questions.forEach((question) => {
      questionNumber++;
      var questionDiv = document.createElement("div");
      questionDiv.id = question.questionid;

      let questionElement = document.createElement("P");
      questionElement.innerText = questionNumber + ". " + question.questiontext;
      questionDiv.appendChild(questionElement);

      let tempId = question.questionid.toString();

      question.options.forEach((opt) => {
        if (opt.type === "radio") {
          let op = document.createElement("input");
          op.type = opt.type;
          op.id = opt.optiontext;
          op.value = opt.optiontext;
          op.name = tempId;

          let lbl = document.createElement("label");
          lbl.htmlFor = opt.optiontext;
          lbl.innerHTML = opt.optiontext;

          questionDiv.appendChild(op);
          questionDiv.appendChild(lbl);
          let newline = document.createElement("br");
          questionDiv.appendChild(newline);
        }
      });
      dvassessment.appendChild(questionDiv);
    });

    //dvassessment.appendChild(questionDiv);
    let line = document.createElement("br");
    var btn = document.createElement("input");
    btn.type = "button";
    btn.id = "SubmitAssessment";
    btn.value = "Submit";
    btn.addEventListener("click", evaluateAssessment);
    dvassessment.appendChild(line);
    dvassessment.appendChild(btn);
  }

  function evaluateAssessment() {
    let assmdiv = document.getElementById("dvassessment");
    let divs = assmdiv.getElementsByTagName("div");

    let resultdv = document.getElementById("dvassessmentresult");
    resultdv.style.display = "block";

    for (let i = 0; i < divs.length; i++) {
      var qt = questions.filter((obj) => {
        return obj.questionid === parseInt(divs[i].id);
      });

      if (qt[0].qtype === "YesOrNo" || qt[0].qtype === "radiobutton") {
        let childElems = divs[i].children;
        for (let k = 0; k < childElems.length; k++) {
          let elm = childElems[k];
          if (elm.type === "radio") {
            if (elm.checked) {
              updateObjectWithResult(qt[0], elm.value.toString());
              score += calculateScore(qt[0], elm.value);
              break;
            }
          }
        }
      } else {
      }
    }

    let result = document.getElementById("resultmessage");
    result.innerText =
      "Congratulations !!. Your assessment Score is : " + score;
  }

  function updateObjectWithResult(question, val) {
    let qsequence = 0;
    var osequence = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].questionid === question.questionid) {
        qsequence = i;
      }
    }
    questions[qsequence].selectedtext = val;
    for (let j = 0; j < questions[qsequence].options.length; j++) {
      if (questions[qsequence].options[j].optiontext === val) {
        osequence = j;
      }
    }
    questions[qsequence].options[osequence].isSelected = true;
  }

  function calculateScore(question, val) {
    let w1 = question.qWeightage;
    let w2 = 0;
    question.options.forEach((option) => {
      if (option.optiontext === val) {
        w2 = option.weightage;
      }
    });
    let res = w2 * (w1 / 100);
    return res;
  }

  function displayOptions() {
    let optionsType = document.getElementById("qoptions");
    let numOfOptions = document.getElementById("numoptions");
    let optionsDiv = document.getElementById("dvoptions");
    clearOptions();
    let optionsTypeValue = optionsType.options[optionsType.selectedIndex].value;

    if (optionsTypeValue === "YesOrNo") {
      let lbl1 = document.createElement("label");
      lbl1.htmlFor = "YesWeightage";
      lbl1.innerHTML = "Yes-Weightage : ";

      let op1 = document.createElement("input");
      op1.type = "text";
      op1.id = "YesWeightage";

      let dvyes = document.createElement("div");
      let newlineyes = document.createElement("br");

      dvyes.appendChild(lbl1);
      dvyes.appendChild(newlineyes);
      dvyes.appendChild(op1);
      optionsDiv.appendChild(dvyes);

      let newline = document.createElement("br");
      optionsDiv.appendChild(newline);

      let lbl2 = document.createElement("label");
      lbl2.htmlFor = "NoWeightage";
      lbl2.innerHTML = "No-Weightage   : ";

      let op2 = document.createElement("input");
      op2.type = "text";
      op2.id = "NoWeightage";

      let dvno = document.createElement("div");
      let newlineno = document.createElement("br");
      dvno.appendChild(lbl2);
      dvno.appendChild(newlineno);
      dvno.appendChild(op2);
      optionsDiv.appendChild(dvno);
    } else if (optionsTypeValue === "radiobutton") {
      let numOptions = document.getElementById("numberOfOptions");
      if (numOptions.value) {
        displayRadiobuttonOptions(numOptions.value);
      } else {
        alert("Please provide number of options");
      }
    } else {
      clearOptions();
    }
  }

  function addYesNoOptions() {}
  function displayRadiobuttonOptions(num) {
    let optionsDiv = document.getElementById("dvoptions");
    for (let i = 1; i <= num; i++) {
      let dv = document.createElement("div");
      let op = document.createElement("input");
      op.type = "text";
      op.id = "option" + i;
      op.style.width = "400px";
      op.placeholder = "Option Text";

      let opw = document.createElement("input");
      opw.type = "text";
      opw.id = "optionweightage" + i;
      opw.style.width = "30px";
      opw.style.marginLeft = "10px";
      //opw.placeholder = "Wieghtage";
      opw.setAttribute("data-toggle", "tooltip");
      opw.setAttribute("title", "Option Weightage");

      dv.appendChild(op);
      dv.appendChild(opw);
      optionsDiv.appendChild(dv);

      let newline = document.createElement("br");
      optionsDiv.appendChild(newline);
    }
  }

  function addquestion() {
    let status = document.getElementById("statusmessage");
    if (!isValid()) {
      status.innerText = "Please verify the inputs.";
      return;
    }
    let questionElement = document.getElementById("question");
    let assessmentDiv = document.getElementById("dvexam");
    let optionsType = document.getElementById("qoptions");
    var optionsTypeValue = optionsType.options[optionsType.selectedIndex].value;

    let numOfOptions = document.getElementById("numoptions");
    let optionWeightage = document.getElementById("YesWeightage");
    let optionNoWeightage = document.getElementById("NoWeightage");
    let questionWeightage = document.getElementById("qweightage");

    var para = document.createElement("P"); // Create a <p> element
    para.innerText = questionElement.value;

    var options = [];
    let optionid = 0;

    if (optionsTypeValue === "YesOrNo") {
      let opt = Object.create(option);
      opt.optiontext = "Yes";
      opt.type = "radio";
      opt.weightage = optionWeightage.value;
      opt.optionid = ++optionid;
      options.push(opt);

      opt = Object.create(option);
      opt.optiontext = "No";
      opt.type = "radio";
      opt.weightage = optionNoWeightage.value;
      opt.optionid = ++optionid;
      options.push(opt);
    } else if (optionsTypeValue === "radiobutton") {
      let numOptions = document.getElementById("numberOfOptions").value;
      var objects = new Array();
      for (var i = 0; i < numOptions; i++) {
        options[i] = {
          optiontext: document.getElementById("option" + (i + 1)).value,
          weightage: document.getElementById("optionweightage" + (i + 1)).value,
          type: "radio",
          optionid: i + 1,
        };
      }
    }

    let qst = Object.create(question);
    qst.questiontext = questionElement.value;
    qst.qWeightage = questionWeightage.value;
    qst.qtype = optionsTypeValue;
    qst.options = options;

    qst.questionid = ++questionid;

    questions.push(qst);

    //db
    addquestionstodb(qst);
    status.innerText = "Quastion added successfully !!.";
    displayQuestionDetails();

    displayOptionDetails(questionid);
    clearAllControls();
  }

  function addquestionstodb(qu) {
    console.log(JSON.stringify(qu));
    fetch("/addquestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qu }),
    })
      .then(function (response) {
        console.log(response);
        console.log(response.body.insertId);
        if (response.ok) {
          console.log("Click was recorded");
          return;
        }
        throw new Error("Request failed.");
      })
      .catch(function (error) {
        console.log(error);
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

    let qn = {
      questiontext: qu.questiontext,
      questiontype: qu.questiontype,
      numberofoptions: 2,
      relativescore: qu.qWeightage,
      isactive: true,
    };

    connection.query("INSERT INTO questions SET ?", qn, (err, res) => {
      if (err) {
        console.log("Error connecting to DB");
        console.log(err);
        throw err;
      }

      console.log("Last inserted Id:", res.insertId);
    });*/
  }

  function emptyQuestionDetails() {
    let fields = [
      "ID",
      "Question",
      "Question Type",
      "Relative Score",
      "Actions",
    ];

    let dvtbl = document.getElementById("dvtable");
    if (dvtbl.children.length === 0) {
      let table = document.createElement("table");
      table.id = "questionstable";
      table.setAttribute("class", "table");
      let thead = document.createElement("thead");

      let thr = document.createElement("tr");
      fields.forEach((field) => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(field));
        thr.appendChild(th);
      });

      thead.appendChild(thr);
      table.appendChild(thead);

      let tblbody = document.createElement("tbody");
      let tr = document.createElement("tr");

      let td = document.createElement("td");
      td.colSpan = "5";
      td.appendChild(document.createTextNode("No Content To Display."));
      tr.appendChild(td);
      tblbody.appendChild(tr);
      table.appendChild(tblbody);
      dvtbl.appendChild(table);
    }
  }

  function emptyOptionsDetails() {
    let fields = ["ID", "Question ID", "Option", "Option Type", "Weightage"];
    let dvtbloptions = document.getElementById("dvoptionstable");
    if (dvtbloptions.children.length === 0) {
      let table = document.createElement("table");
      table.id = "optionstable";
      table.setAttribute("class", "table");
      let thead = document.createElement("thead");

      let thr = document.createElement("tr");
      fields.forEach((field) => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(field));
        thr.appendChild(th);
      });

      thead.appendChild(thr);
      table.appendChild(thead);

      let tblbody = document.createElement("tbody");
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.colSpan = "5";
      td.appendChild(document.createTextNode("No Content To Display."));
      tr.appendChild(td);
      tblbody.appendChild(tr);
      table.appendChild(tblbody);
      dvtbloptions.appendChild(table);
    }
  }

  function displayQuestionDetails() {
    let fields = [
      "ID",
      "Question",
      "Question Type",
      "Relative Score",
      "Actions",
    ];
    let dvtbl = document.getElementById("dvtable");
    if (dvtbl.children.length === 0) {
      let table = document.createElement("table");
      table.id = "questionstable";
      table.setAttribute("class", "table");
      let thead = document.createElement("thead");

      let thr = document.createElement("tr");
      fields.forEach((field) => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(field));
        thr.appendChild(th);
      });

      thead.appendChild(thr);
      table.appendChild(thead);

      let tblbody = document.createElement("tbody");

      if (questions.length > 0) {
        questions.forEach((question) => {
          let tr = document.createElement("tr");

          let td = document.createElement("td");
          let btn = document.createElement("input");
          btn.type = "button";
          btn.id = "optiondetails" + question.questionid;
          btn.value = question.questionid;
          btn.setAttribute("class", "btn btn-link");
          btn.addEventListener("click", function () {
            app.displayOptionDetails(question.questionid);
          });
          td.appendChild(btn);
          tr.appendChild(td);

          let td1 = document.createElement("td");
          td1.setAttribute("data-toggle", "tooltip");
          td1.setAttribute("title", question.questiontext);
          td1.appendChild(
            document.createTextNode(question.questiontext.substring(0, 10))
          );
          tr.appendChild(td1);

          let td2 = document.createElement("td");
          td2.appendChild(document.createTextNode(question.qtype));
          tr.appendChild(td2);

          let td3 = document.createElement("td");
          //td2.style.width = "5px";
          td3.appendChild(document.createTextNode(question.qWeightage));
          tr.appendChild(td3);

          //let td4 = document.createElement("td");
          var btnEdit = document.createElement("input");
          btnEdit.type = "button";
          btnEdit.id = "optiondetails" + question.questionid;
          btnEdit.value = "Edit";
          btnEdit.setAttribute("class", "btn btn-link");
          btnEdit.addEventListener("click", editQustion);

          var btnDelete = document.createElement("input");
          btnDelete.type = "button";
          btnDelete.id = "optiondetails" + question.questionid;
          btnDelete.value = "Delete";
          btnDelete.setAttribute("class", "btn btn-link");
          btnDelete.addEventListener("click", deleteQuestion);

          let para = document.createElement("p");
          para.innerText = "|";
          para.style.width = "1px";

          var btndiv = document.createElement("div");
          btndiv.appendChild(btnEdit);
          //btndiv.appendChild(para);
          btndiv.appendChild(btnDelete);

          let td4 = document.createElement("td");
          //td4.style.width = "140px";
          td4.appendChild(btndiv);
          //td4.appendChild("|");
          //td4.appendChild(btnDelete);
          tr.appendChild(td4);

          tblbody.appendChild(tr);
        });
      }

      table.appendChild(tblbody);
      dvtbl.appendChild(table);
    } else {
      let tbl = document.getElementById("questionstable");
      tbl = cleantable(tbl);
      tbl.deleteTFoot();

      let len = questions.length;
      let newQuestion = questions[len - 1];

      let row = tbl.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      //var cell6 = row.insertCell(5);

      cell1.innerHTML = `<input type="button" class="btn btn-link" value=${newQuestion.questionid} onclick="app.displayOptionDetails(${newQuestion.questionid});" />`;
      //newQuestion.questionid;
      cell2.innerHTML = newQuestion.questiontext.substring(0, 10);
      cell2.setAttribute("data-toggle", "tooltip");
      cell2.setAttribute("title", newQuestion.questiontext);
      cell3.innerHTML = newQuestion.qtype;
      cell4.innerHTML = newQuestion.qWeightage;

      var btn = document.createElement("input");
      cell5.innerHTML =
        '<input type="button" class="btn btn-link" value="Edit" onclick="app.displayOptionDetails();" /> <input type="button" class="btn btn-link" value="Delete" onclick="displayOptionDetails();" />'; //"Actions";
    }
    addfooter();
  }

  function addfooter() {
    let table = document.getElementById("questionstable");
    if (table.rows.length > 0) {
      let footer = document.createElement("tfoot");
      let tr = document.createElement("tr");
      tr.style.fontWeight = "bold";
      let td = document.createElement("td");
      td.colSpan = "3";
      td.appendChild(document.createTextNode("Total Relative Score"));
      tr.appendChild(td);

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(getTotalRelativeScore()));
      tr.appendChild(td1);

      footer.appendChild(tr);
      table.appendChild(footer);
    }
  }

  function getTotalRelativeScore() {
    let total = parseInt("0");
    questions.forEach((q) => {
      total = total + parseInt(q.qWeightage);
    });
    return total;
  }

  function displayOptionDetails(qnid = 1) {
    let fields = ["ID", "Question ID", "Option", "Option Type", "Weightage"];
    let dvtbloptions = document.getElementById("dvoptionstable");
    cleardiv(dvtbloptions);
    if (dvtbloptions.children.length === 0) {
      let table = document.createElement("table");
      table.id = "optionstable";
      table.setAttribute("class", "table");
      let thead = document.createElement("thead");

      let thr = document.createElement("tr");
      fields.forEach((field) => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(field));
        thr.appendChild(th);
      });

      thead.appendChild(thr);
      table.appendChild(thead);

      let tblbody = document.createElement("tbody");
      if (questions.length > 0) {
        var qt = questions.filter((obj) => {
          return obj.questionid === qnid;
        });
        let options = qt[0].options;
        //question text
        let qtext = document.createElement("p");
        qtext.innerText = qt[0].questiontext;
        dvtbloptions.appendChild(qtext);
        //
        options.forEach((opt) => {
          let tr = document.createElement("tr");

          let td = document.createElement("td");
          td.appendChild(document.createTextNode(opt.optionid));
          tr.appendChild(td);

          let tdqid = document.createElement("td");
          tdqid.appendChild(document.createTextNode(qnid));
          tr.appendChild(tdqid);

          let td1 = document.createElement("td");
          td1.appendChild(document.createTextNode(opt.optiontext));
          tr.appendChild(td1);

          let td2 = document.createElement("td");
          td2.appendChild(document.createTextNode(opt.type));
          tr.appendChild(td2);

          let td3 = document.createElement("td");
          td3.appendChild(document.createTextNode(opt.weightage));
          tr.appendChild(td3);

          tblbody.appendChild(tr);
        });
      }
      table.appendChild(tblbody);
      dvtbloptions.appendChild(table);
    } else {
      let tbl = document.getElementById("optionstable");
      let len = questions.length;
      let newQuestion = questions[len - 1];
      let newOptions = newQuestion.options;

      newOptions.forEach((newOpt) => {
        let row = tbl.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = newOpt.optionid;
        cell2.innerHTML = newOpt.optiontext.substring(0, 10);
        cell2.setAttribute("data-toggle", "tooltip");
        cell2.setAttribute("title", newOpt.optiontext);
        cell3.innerHTML = newOpt.type;
        cell4.innerHTML = newOpt.weightage;
      });
    }
  }

  function editQustion() {}

  function deleteQuestion() {}

  function cleantable(tbl) {
    if (tbl.rows[1].cells[0].innerHTML === "No Content To Display.") {
      tbl.getElementsByTagName("tr")[1].remove();
    }
    return tbl;
  }

  function isValid() {
    let questionElement = document.getElementById("question");
    if (questionElement.value.length === 0) {
      return false;
    }

    let questionWeightage = document.getElementById("qweightage").value;
    if (questionWeightage.length === 0 || isNaN(questionWeightage)) {
      return false;
    }

    let optionsDiv = document.getElementById("dvoptions");
    if (optionsDiv.children.length === 0) {
      return false;
    }

    if (!validateOptions()) {
      return false;
    }

    return true;
  }

  function validateOptions() {
    let optionsType = document.getElementById("qoptions");
    let optionsTypeValue = optionsType.options[optionsType.selectedIndex].value;
    if (optionsTypeValue === "YesOrNo") {
      if (!validateYesOrNoOptions()) return false;
    }

    if (optionsTypeValue === "radiobutton") {
      if (!validateRadioButtonOptions()) return false;
    }
    return true;
  }

  function validateYesOrNoOptions() {
    let optionWeightage = document.getElementById("YesWeightage").value;
    let optionNoWeightage = document.getElementById("NoWeightage").value;
    if (optionWeightage.length === 0 || isNaN(optionWeightage)) {
      return false;
    }
    if (optionNoWeightage.length === 0 || isNaN(optionNoWeightage)) {
      return false;
    }

    return true;
  }

  function validateRadioButtonOptions() {
    let numOptions = document.getElementById("numberOfOptions").value;
    for (var i = 0; i < numOptions; i++) {
      if (document.getElementById("option" + (i + 1)).value.length === 0) {
        return false;
      }

      if (
        document.getElementById("optionweightage" + (i + 1)).value.length ===
          0 ||
        isNaN(document.getElementById("optionweightage" + (i + 1)).value)
      ) {
        return false;
      }
    }

    return true;
  }

  function updateObjectForRadioOptions(num) {
    var options = [];
    let optionid = 0;

    for (let i = 1; i <= num; i++) {
      let opt = Object.create(option);
      opt.optiontext = document.getElementById("option" + i).value;
      opt.type = "radio";
      opt.weightage = document.getElementById("optionweightage" + i).value;
      opt.optionid = ++optionid;
      options.push(opt);
    }

    return options;
  }

  function clearAllControls() {
    let questionElement = document.getElementById("question");
    questionElement.value = "";
    let questionWeightage = document.getElementById("qweightage");
    questionWeightage.value = "";
    let optionsType = document.getElementById("qoptions");
    optionsType.value = "selectone";
    clearOptions();
  }

  function clearOptions() {
    let optionsDiv = document.getElementById("dvoptions");
    cleardiv(optionsDiv);
  }

  function cleardiv(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }

  return {
    displayOptions: displayOptions,
    addquestion: addquestion,
    displayOptionDetails: displayOptionDetails,
    switchcontext: switchcontext,
  };
})();
