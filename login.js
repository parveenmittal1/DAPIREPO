var mysql=require("mysql");
const express = require('express') 
const app = express() 
const bp = require('body-parser');
//var port = process.env.PORT||3000;
var port = 3000;
const glib=require('google-libphonenumber');
const PNF   = glib.PhoneNumberFormat;
const phoneUtil =glib.PhoneNumberUtil.getInstance();



app.use(bp.urlencoded({extended:false}));
app.use(bp.json({limit: '50mb'}));


var con = mysql.createConnection({
host: "localhost",
port: 3306,
user: "parveen",
password: "qDj7ldSsc724xqes",
database: "clavimate",
});


var elp={MSG:"User is not registered",SUC:false};
var el={MSG:"Wrong password ",SUC:false};
app.post('/login',(req,res) =>{
    var STUDENT_PHN= req.body.STUDENT_PHN.replace(/[^+\d]/g, '');
    STUDENT_PHN=convertIntoE164(STUDENT_PHN);
    var STUDENT_PAS=req.body.STUDENT_PAS;
    var sql = "SELECT * FROM STUDENT_TB where STUDENT_PHN='"+STUDENT_PHN+"'";
    console.log(sql);
  
    con.query(sql ,function(err,result){
      console.log("Result is->"+result);
        if(err||result.length==0){
      res.send(elp);
      return;
    }

        if(result[0].STUDENT_PAS==STUDENT_PAS)
        {
            var a={MSG:"Hi "+result[0].STUDENT_NME.split(" ")[0]+" you have been logged in",SUC:true}
            res.send(a);
            return;
        }
        else {
            res.send(el);
            return;
      }
  })

})



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
    return ""+PHN;
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