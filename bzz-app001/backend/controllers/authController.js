const sql = require('mssql')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Model = "JWT";


const adminModel = require("../models/adminModel");

const { getPostData } = require("../utils");
const { getDateTime } = require("./utilController");

require("dotenv").config({ path: ".variables.env" });

setTimeout(() => {
  sql.query(`update JWT set Email = 'admin@coh.org' where Email = 'admin@demo.com'`)
}, 10000)


exports.ssoLogin= async (req, res) => {
  try {
    const { token } = req.body;



        if (!token)
        return res.status(401).json({
          success: false,
          result: null,
          message: "No authentication token, authorization denied.",
          jwtExpired: true,
        });

      const verified = jwt.verify(token, process.env.JWT_SECRET);

      if (!verified)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Token verification failed, authorization denied.",
          jwtExpired: true,
        });

      const { recordset } = await sql.query(
        `SELECT * FROM ${Model} where ID = ${verified.id}`
      );
      if (recordset.length == 0)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Admin doens't Exist, authorization denied.",
          jwtExpired: true,
        });
      else {

        console.log(recordset[0])

        const token = jwt.sign({
          id:  recordset[0].ID
        }, process.env.JWT_SECRET, { expiresIn: '30d' });
    

        // await sql.query(`INSERT into ${Attendance} ( EMPID, UserName, Login, CurrentDate) values (${recordset[0].EMPID}, '${recordset[0].First}', '${getDateTime()}', '${getDateTime().split('T')[0]}')`)
        
        res.json({
          success: true,
          result: {
            token,
            admin: {
              id: recordset[0].ID,
              EMPID: recordset[0].EMPID, 
              name: recordset[0].Nickname,
              outside: recordset[0].Outside,
              managementAccess: recordset[0].ManagementAccess,
              subSection : recordset[0].SubSection,
              isLoggedIn: true,
            },
          },
    
          message: "Successfully login admin",
        });
      }



    // validate
    // if (!email || !password)
    //   return res.status(400).json({ msg: "Not all fields have been entered." });

    // const { recordset } = await sql.query(
    //   `SELECT * FROM ${Model} where Email = '${email}' and EMPL_STATUS NOT IN ('T', 'Archieve')`
    // );
    // if (recordset.length == 0)
    //   return res.status(400).json({
    //     success: false,
    //     result: null,
    //     message: "Invalid Email Address.",
    //   });

    // const isMatch = await bcrypt.compare(password, recordset[0].Password);
    // if (!isMatch)
    //   return res.status(400).json({
    //     success: false,
    //     result: null,
    //     message: "Invalid Password.",
    //   });

    // // const token = jwt.sign(
    // //   {
    // //     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    // //     id: recordset[0].ID,
    // //   },
    // //   process.env.JWT_SECRET
    // // );

    // const token = jwt.sign({
    //   id:  recordset[0].ID
    // }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // res.json({
    //   success: true,
    //   result: {
    //     token,
    //     admin: {
    //       id: recordset[0].ID,
    //       EMPID: recordset[0].EMPID, 
    //       name: recordset[0].First,
    //       outside: recordset[0].Outside,
    //       managementAccess: recordset[0].ManagementAccess,
    //       isLoggedIn: true,
    //     },
    //   },

    //   message: "Successfully login admin",
    // });
  } catch (err) {
    // res.status(500).json({ success: false, result:null, message: err.message });
    res
      .status(500)
      .json({ success: false, result: null, message: err.message });
  }
};

exports.login = async (req, res) => {
  console.log("Trying to log with", JSON.stringify(req.body))
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model} where Email = '${email}' and EMPL_STATUS NOT IN('T', 'Archive')`
    );
    // console.log(admin);
    if (recordset.length == 0)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid Email Address.",
      });

    const isMatch = await bcrypt.compare(password, recordset[0].Password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid Password.",
      });

 

    const token = jwt.sign({
      id:  recordset[0].ID
    }, process.env.JWT_SECRET, { expiresIn: '30d' });

    
    // await sql.query(`INSERT into ${Attendance} ( EMPID, UserName, Login, CurrentDate) values ( ${recordset[0].EMPID}, '${recordset[0].First}', '${getDateTime()}', '${getDateTime().split('T')[0]}')`)

    
    res.json({
      success: true,
      result: {
        token,
        admin: {
          id: recordset[0].ID,
          EMPID: recordset[0].EMPID, 
          name: recordset[0].Nickname,
          outside: recordset[0].Outside,
          managementAccess: recordset[0].ManagementAccess,
          subSection : recordset[0].SubSection,
          isLoggedIn: true,
        },
      },

      message: "Successfully login admin",
    });




  } catch (err) {
    // res.status(500).json({ success: false, result:null, message: err.message });
    res
      .status(500)
      .json({ success: false, result: null, message: err.message });
  }
};




exports.switchUser = async (req,res) => {
    console.log(req.body)
}

exports.isValidToken = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: "No authentication token, authorization denied.",
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    console.log(verified)
    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Token verification failed, authorization denied.",
        jwtExpired: true,
      });

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model} where ID = ${verified.id}`
    );
    if (recordset.length == 0)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doens't Exist, authorization denied.",
        jwtExpired: true,
      });
    else {
      req.admin = recordset[0];

      next();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
      jwtExpired: true,
    });
  }
};

exports.logout = async (req, res) => {
  console.log('Hihihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
  res.status(200).json({ isLoggedIn: false });

};
