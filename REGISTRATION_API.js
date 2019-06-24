var mysql=require("mysql");
const express = require('express') 
const app = express() 
const bp = require('body-parser');
//var port = process.env.PORT||3000;
var port = 3000;
const glib=require('google-libphonenumber');
const PNF   = glib.PhoneNumberFormat;
const phoneUtil =glib.PhoneNumberUtil.getInstance();
const createTable=require('./CreateTableFunction.js');
app.use(bp.urlencoded({extended:false}));
app.use(bp.json({limit: '50mb'}));


var con = mysql.createConnection({
host: "localhost",
port: 3306,
user: "parveen",
password: "qDj7ldSsc724xqes",
database: "clavimate",
});



 var sql="CREATE TABLE IF NOT EXISTS STUDENT_TB(STUDENT_SID VARCHAR(255) PRIMARY KEY,STUDENT_NME VARCHAR(255),STUDENT_DOB VARCHAR(255),STUDENT_EML VARCHAR(255),STUDENT_PAS VARCHAR(255),STUDENT_CID VARCHAR(255),STUDENT_RED VARCHAR(255),STUDENT_LOC VARCHAR(255),STUDENT_WID VARCHAR(255),STUDENT_COU VARCHAR(255),STUDENT_REF VARCHAR(255),STUDENT_PHN VARCHAR(255),STUDENT_DID VARCHAR(255))";
    con.query(sql ,function(err,result){
       // if(err) throw err;
        console.log("Table created");
        console.log(err);

    })
    app.get('/a',(req,res)=>{
    	console.log("Heloo");
    	res.send();
    	return;
    })

app.post('/registeruser',(req,res) =>{
    var STUDENT_PHN=""+req.body.STUDENT_PHN.replace(/[^+\d]/g, '');//Remove Space,-from phone number 
    var STUDENT_SID= 'S'+""+STUDENT_PHN;
    //var temp=""+req.body.STUDENT_NME;
   // if(!isValidString(temp))
    //{
      //  var temp={MSG:"Name is not valid",SUC:"false"}
       // res.send(temp);
    //}
    var STUDENT_NME=req.body.STUDENT_NME;
    var STUDENT_DOB=req.body.STUDENT_DOB;
    var STUDENT_EML=req.body.STUDENT_EML;
    var STUDENT_PAS=req.body.STUDENT_PAS;
    var STUDENT_CID=req.body.STUDENT_CID;
    var STUDENT_LOC=req.body.STUDENT_LOC;
    var STUDENT_WID=STUDENT_SID;
    var STUDENT_REF=req.body.STUDENT_REF;
    var STUDENT_RED=""+new Date();
    var STUDENT_DID=""+req.body.STUDENT_DID;

    STUDENT_PHN=convertIntoE164(STUDENT_PHN);
     console.log(req.body);
     var sql = "INSERT INTO STUDENT_TB (STUDENT_PHN,STUDENT_SID,STUDENT_NME,STUDENT_DOB,STUDENT_EML,STUDENT_PAS,STUDENT_CID,STUDENT_LOC,STUDENT_WID,STUDENT_REF,STUDENT_RED,STUDENT_DID) VALUES ('"+STUDENT_PHN+"','"+STUDENT_SID +"','"+STUDENT_NME+"','"+STUDENT_DOB+"','"+STUDENT_EML+"','"+STUDENT_PAS+"','"+STUDENT_CID+"','"+STUDENT_LOC+"','"+STUDENT_WID+"','"+STUDENT_REF+"','"+STUDENT_RED+"','"+STUDENT_DID+"')";
     console.log(sql);
     if(STUDENT_PHN!=null)
     {
    con.query(sql ,function(err,result){
        console.log(err);
        if(err){
            var a={MSG:"The STUDENT is already registered",SUC:"false"}
        res.send(a);
        return;
        }
        console.log("1 recored inserted")
        var a={MSG:"The user has been registered",SUC:"true"}
        res.send(a);
        return;
    })
}
else {
	var a={MSG:"Number is not valid",SUC:"false"}
	res.send(a);
  return;
}
})


// function isValidString(inputtxt)
// {
//     var letters = /^[A-Za-z][ ]?[A-za-z]+$/;
//    //   if(inputtxt.value.match(letters))
//       {
//       alert('Your name have accepted : you can try another');
//       return true;
//       }
//       else return false ;
// }


var convertIntoE164=function(PHN)
{
  var PHN=""+PHN.replace(/[^+\d]/g, '');
  try
  {
  var number=phoneUtil.parseAndKeepRawInput(PHN);
  var CCD=phoneUtil.getRegionCodeForNumber(number);
  }
  catch(err)
  {
    console.log("Number is not a valid number ");
      return null;
  }
    var boolValue=isE164(PHN);
    try
    {
    var number =phoneUtil.parseAndKeepRawInput(""+PHN,CCD)
    }
    catch(err)
    {
      console.log("Number is not a valid number ");
      return null;
    }
    if(boolValue==false)
    {
      try{
        console.log("phoneUtil.isValidNumber(number)"+phoneUtil.isValidNumber(number))
      if(!phoneUtil.isValidNumber(number))
      return null;
      }
      catch(err){
        console.log("NOT A VALID NUMBER");
        return null
      }
      PHN=phoneUtil.format(number, PNF.E164);
    }
    else {
       try{
      if(!phoneUtil.isValidNumber(number))
      return null;
      }
      catch(err){
        console.log("NOT A VALID NUMBER");
        console.log("NUMBER WONT BE SAVED");
        return null;
      }
    }
    return PHN;
}


var isE164 = function(phn)
{
  try {
    const number = phoneUtil.parseAndKeepRawInput(phn);
    return true;
  }
  catch(err) {
    console.log("Catch MEEEEEE");
   // console.log(err);
    return false;
  }
}

app.listen(port,function(){
	console.log("Running on Port : "+port)
});