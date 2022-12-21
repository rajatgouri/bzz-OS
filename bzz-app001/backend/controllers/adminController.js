const adminModel = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const sql = require('mssql')
const methods = require("./crudController");
const endpoints = methods.crudController("JWT");

// var sql = null
// require(".../sql")['pool1'].then(pool => {sql = pool});
// require(".../sql")['pool2'].then(pool => {db = pool});





delete endpoints["list"];
delete endpoints["update"];
const Model = "JWT";
const Model1 = "[HIMSRB].[dbo].[JWT]"
const Model2 = "[HIMSDI].[dbo].[JWT]"
const Model3 = "[HIMSDS].[dbo].[JWT]"
const Model4 = "[HIMSCDQ].[dbo].[JWT]"

const TeamMembersModel = "[COHTEAMS].[dbo].[HIMS_MasterStaff_PSoft]";
const adminData = require('../data/admins.json')



// generating a hash

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

setInterval( () => {
    sync()
}, 600000)


setTimeout(async () => {
  sync()
}, 10000)

const timer = () => new Promise(res => setTimeout(res, 2000))

const sync = async () => {
  const {recordset: users} = await sql.query(`select * from ${TeamMembersModel} where (Section = 'OS'  ) and EMPL_STATUS NOT IN ('T','Archive') or FIRST_NAME IN ('William', 'Adrienne')`)  

  const {recordset: admin} = await sql.query(`select * from ${Model} where Email = 'admin@coh.org' and First = 'Admin'`)

  if(admin.length ==  0) {
    users.push(adminData[0])
  }

  for(let i = 0; i< users.length ; i++) {
    const {recordset: user} = await sql.query(`select * from ${Model} where EmpID = ${users[i].EMPID}`)
    

    if(users[i].EMAIL_ADDR == 'aawad@coh.org' ) {
      users[i].ManagementAccess = 'Y'
    }

    if(user.length == 0) {

      if(users[i].EMPL_STATUS == 'T' || users[i].EMPL_STATUS == 'Archive') {
        continue
      }

      let SubSection = 'OS';

      if(users[i].EMAIL_ADDR == 'mvillaluna@coh.org' || users[i].EMAIL_ADDR == 'sarmstro@coh.org'  ) {
        SubSection = 'OSA'
      }

      

       await sql.query(`Insert into ${Model} (
                        UID, 
                        EMPL_Status, 
                        EMPID, 
                        NAME, 
                        First, 
                        Last,
                        Middle, 
                        DEPTNAME, 
                        Section, 
                        SubSection,
                        Name_Section_Old, 
                        PER_ORG, 
                        LoginName, 
                        SUPERVISOR_NAME, 
                        CMPNY_SENIORITY_DT, 
                        BUSINESS_TITLE, 
                        EFFDT, 
                        ORIG_HIRE_DT, 
                        HIRE_DT, 
                        TERMINATION_DT, 
                        SUPERVISOR_ID, 
                        DEPTID, 
                        JOBCODE, 
                        LOCATION, 
                        ROLE, 
                        JOBTITLE, 
                        WORK_PHONE, 
                        AdminAccess,
                        ManagementAccess,
                        AliasEmail, 
                        Contractor_Name,
                        ShowTimeAccountability, 
                        Email, 
                        Password, 
                        StartDay
                        ) 
                        values (
                          ${users[i].UID}, 
                          ${users[i].EMPL_STATUS ? `'${users[i].EMPL_STATUS}'`  :null},
                          ${users[i].EMPID? `'${users[i].EMPID}'` : null}, 
                          ${users[i].NAME ? `'${users[i].NAME}'` : null}, 
                          ${users[i].FIRST_NAME ? `'${users[i].FIRST_NAME}'`: null }, 
                          ${users[i].LAST_NAME ? `'${users[i].LAST_NAME}'` :null}, 
                          ${users[i].MIDDLE_NAME ? `'${users[i].MIDDLE_NAME}'` : null}, 
                          ${users[i].DEPTNAME?  `'${users[i].DEPTNAME}'`: null},
                          ${users[i].Section?  `'${users[i].Section}'` : `'OS'`},
                          ${users[i].ManagementAccess == 'Y' ?  `'AD'` :  "'" + SubSection + "'" },
                          ${users[i].Name_Section_Old ? `'${users[i].Name_Section_Old}'` : null},
                          ${users[i].PER_ORG ? `'${users[i].PER_ORG}'`: null},
                          ${users[i].LoginName ? `'${users[i].LoginName}'` : null},
                          ${users[i].SUPERVISOR_NAME ? `'${users[i].SUPERVISOR_NAME}'` : null},
                          ${users[i].CMPNY_SENIORITY_DT ? `'${new Date(users[i].CMPNY_SENIORITY_DT).toISOString() }'` : null },
                          ${users[i].BUSINESS_TITLE ? `'${users[i].BUSINESS_TITLE}'` : null},
                          ${users[i].EFFDT ? `'${new Date(users[i].EFFDT).toISOString()}'` : null},
                          ${users[i].ORIG_HIRE_DT ? `'${new Date(users[i].ORIG_HIRE_DT ).toISOString()}'`: null },
                          ${users[i].HIRE_DT ? `'${new Date(users[i].HIRE_DT).toISOString()}'`  :null},
                          ${users[i].TERMINATION_DT ? `'${new Date(users[i].TERMINATION_DT).toISOString()}'` : null },
                          ${users[i].SUPERVISOR_ID ? `'${users[i].SUPERVISOR_ID}'` :  null},
                          ${users[i].DEPTID ? `'${users[i].DEPTID}'` :null},
                          ${users[i].JOBCODE ?  `'${users[i].JOBCODE }'`: null},
                          ${users[i].LOCATION ? `'${users[i].LOCATION}'` : null},
                          ${users[i].ROLE ? `'${users[i].ROLE}'`: null},
                          ${users[i].JOBTITLE ? ` '${users[i].JOBTITLE}'` : null},
                          ${users[i].WORK_PHONE ? `'${users[i].WORK_PHONE}'` : null },
                          ${users[i].AdminAccess == 'Y' ? 1 : 0 },
                          ${users[i].ManagementAccess  == 'Y' ? 1 : 0},
                          ${users[i].AliasEmail ? `'${users[i].AliasEmail}'`: null},
                          ${users[i].Contractor_Name ? `'${users[i].Contractor_Name}'` : null },
                          ${users[i].ShowTimeAccountability ? `'${users[i].ShowTimeAccountability}'` : null},
                          ${users[i].EMAIL_ADDR ? `'${users[i].EMAIL_ADDR}'` : null},
                        '${users[i].ManagementAccess == 'N' || !users[i].ManagementAccess  ?  generateHash( '123456') : generateHash( '654321') }',
                          'Mon'
                          )
                          `)


                          if (users[i].EMPID != 1 && users[i].ManagementAccess != 'Y'   ) {
                            console.log(users[i].ManagementAccess != 'Y')
                            await sql.query(`insert into ${progressModel1} (EMPID, First, Last, ChargesProcessed, ChargesToReview, AgingDays, Amount) values (${users[i].EMPID}, '${users[i].FIRST_NAME }', '${users[i].LAST_NAME}', '0', '0', NULL , NULL)`)
                            await sql.query(`insert into ${progressModel2} (EMPID, First, Last, ChargesProcessed, ChargesToReview, AgingDays, Amount) values (${users[i].EMPID}, '${users[i].FIRST_NAME }', '${users[i].LAST_NAME}', '0', '0', NULL , NULL)`)
                            await sql.query(`insert into ${checkMarkModel1} (EMPID) values (${users[i].EMPID})`)
                            await sql.query(`insert into ${checkMarkModel2} (EMPID) values (${users[i].EMPID})`)
                            
                          }
    } 
    else {

      await sql.query(`update ${Model} set 
          EMPL_STATUS= ${users[i].EMPL_STATUS ? `'${users[i].EMPL_STATUS}'`  :null},
          NAME= ${users[i].NAME ? `'${users[i].NAME}'` : null},
          Email = '${users[i].EMAIL_ADDR}',
          First = ${users[i].FIRST_NAME ? `'${users[i].FIRST_NAME}'`: null }, 
          Middle = ${users[i].MIDDLE_NAME ? `'${users[i].MIDDLE_NAME}'` : null}, 
          Last = ${users[i].LAST_NAME ? `'${users[i].LAST_NAME}'` :null}, 
          DEPTNAME = ${users[i].DEPTNAME?  `'${users[i].DEPTNAME}'`: null},
          Section= ${users[i].Section?  `'${users[i].Section}'` : null},
          Name_Section_Old = ${users[i].Name_Section_Old ? `'${users[i].Name_Section_Old}'` : null},
          PER_ORG = ${users[i].PER_ORG ? `'${users[i].PER_ORG}'`: null},
          LoginName = ${users[i].LoginName ? `'${users[i].LoginName}'` : null},
          SUPERVISOR_NAME = ${users[i].SUPERVISOR_NAME ? `'${users[i].SUPERVISOR_NAME}'` : null},
          CMPNY_SENIORITY_DT = ${users[i].CMPNY_SENIORITY_DT ? `'${new Date(users[i].CMPNY_SENIORITY_DT).toISOString() }'` : null },
          BUSINESS_TITLE= ${users[i].BUSINESS_TITLE ? `'${users[i].BUSINESS_TITLE}'` : null},
          EFFDT = ${users[i].EFFDT ? `'${new Date(users[i].EFFDT).toISOString()}'` : null},
          ORIG_HIRE_DT = ${users[i].ORIG_HIRE_DT ? `'${new Date(users[i].ORIG_HIRE_DT ).toISOString()}'`: null },
          HIRE_DT = ${users[i].HIRE_DT ? `'${new Date(users[i].HIRE_DT).toISOString()}'`  :null},
          TERMINATION_DT = ${users[i].TERMINATION_DT ? `'${new Date(users[i].TERMINATION_DT).toISOString()}'` : null },
          SUPERVISOR_ID = ${users[i].SUPERVISOR_ID ? `'${users[i].SUPERVISOR_ID}'` :  null},
          DEPTID = ${users[i].DEPTID ? `'${users[i].DEPTID}'` :null},
          JOBCODE = ${users[i].JOBCODE ?  `'${users[i].JOBCODE }'`: null},
          LOCATION = ${users[i].LOCATION ? `'${users[i].LOCATION}'` : null},
          ROLE = ${users[i].ROLE ? `'${users[i].ROLE}'`: null},
          JOBTITLE = ${users[i].JOBTITLE ? ` '${users[i].JOBTITLE}'` : null},
          WORK_PHONE = ${users[i].WORK_PHONE ? `'${users[i].WORK_PHONE}'` : null },
          AdminAccess = ${users[i].AdminAccess == 'Y' ? 1 : 0 },
          ManagementAccess = ${users[i].ManagementAccess  == 'Y' ? 1 : 0},
          AliasEmail = ${users[i].AliasEmail ? `'${users[i].AliasEmail}'`: null},
          Contractor_Name = ${users[i].Contractor_Name ? `'${users[i].Contractor_Name}'` : null },
          ShowTimeAccountability = ${users[i].ShowTimeAccountability ? `'${users[i].ShowTimeAccountability}'` : null} where EmpID = '${users[i].EMPID}' `)
    }


    
  
  }
} 


exports.getUserBySection = async (req, res) => {

  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 100;

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model} where Section IN ('RB','AD') order by First `
    );

    const { recordset: arr } = await sql.query(
      `SELECT COUNT(*) from ${Model}`
    );
    const obj = arr[0];
    const count = obj[""];

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    // Getting Pagination Object

    if (count > 0) {
      
      return res.status(200).json({
        success: true,
        result: recordset || [],
        pagination,
        message: "Successfully found all documents",
      });
    }
    else {
      
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }


  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

exports.findALL = async (req, res) => {

  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 100;

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model}  `
    );

    const { recordset: arr } = await sql.query(
      `SELECT COUNT(*) from ${Model}`
    );
    const obj = arr[0];
    const count = obj[""];

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    // Getting Pagination Object

    if (count > 0) {
      for (let admin of recordset) {
        admin.Password = undefined;
      }
      return res.status(200).json({
        success: true,
        result: recordset || [],
        pagination,
        message: "Successfully found all documents",
      });
    }
    else {
      
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }


  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

exports.one = async (req, res) => {
  try {

    var  { data } = req.body;

    let {EMPID} = JSON.parse(data)

    
    const { recordset } = await sql.query(
      `SELECT First, Last, ManagementAccess, StartDay FROM ${Model} where EMPID = ${EMPID} `
    );


    return res.status(200).json({
      success: true,
      result: recordset || [],
      message: "Successfully found user documents",
    });

  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ err: err, success: false, result: [], message: "Oops there is an Error" });
  }
}


exports.list = async (req, res) => {

  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 100;

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model} where  SubSection IN ('OS', 'AD') and EMPL_STATUS NOT IN ('T')   order by First `
    );

    const { recordset: arr } = await sql.query(
      `SELECT COUNT(*) from ${Model}`
    );
    const obj = arr[0];
    const count = obj[""];

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    // Getting Pagination Object

    if (count > 0) {
      for (let admin of recordset) {
        admin.Password = undefined;
      }
      return res.status(200).json({
        success: true,
        result: recordset || [],
        pagination,
        message: "Successfully found all documents",
      });
    }
    else {
      
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }


  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};



exports.fullList = async (req, res) => {

  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 100;

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model} where First NOT IN ('jason', 'Admin') order by First `
    );

    const { recordset: arr } = await sql.query(
      `SELECT COUNT(*) from ${Model}`
    );
    const obj = arr[0];
    const count = obj[""];

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    // Getting Pagination Object

    if (count > 0) {
      for (let admin of recordset) {
        admin.Password = undefined;
      }
      return res.status(200).json({
        success: true,
        result: recordset || [],
        pagination,
        message: "Successfully found all documents",
      });
    }
    else {
      
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }


  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

exports.create = async (req, res) => {
  let { Email, Password } = req.body;
  if (!Email || !Password)
    return res.status(400).json({
      success: false,
      result: null,
      message: "Email or password fields they don't have been entered.",
    });
  const { recordset } = await sql.query(
    `SELECT * FROM ${Model} where Email = '${Email}'`
  );


  if (recordset.length > 0)
    return res.status(400).json({
      success: false,
      result: null,
      message: "An account with this email already exists.",
    });

  if (Password.length < 6)
    return res.status(400).json({
      success: false,
      result: null,
      message: "The password needs to be at least 6 characters long.",
    });

  const passwordHash = generateHash(Password);
  const values = req.body;

  values.Password = passwordHash;

  const columnsQ = "(" + Object.keys(values).toString() + ")"

  let valuesQuery = "";
  for (key in values) {
    if (values[key] === "null") {
      valuesQuery += "NULL" + ",";
    } else {
      valuesQuery += "'" + values[key] + "',";
    }
  }
  valuesQuery = "(" + valuesQuery.slice(0, -1) + ")";


  const insertQuery = `insert into ${Model} ${columnsQ} values ${valuesQuery}`
  try {

    const result = await sql.query(insertQuery);

    if (!result) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "document couldn't save correctly",
      });
    }
    return res.status(200).send({
      success: true,
      result: {},
      message: "Admin document save correctly",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "there is error", error: e, params: req.body, query: insertQuery });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { EMPID, password } = req.body;
    const passwordHash = generateHash(password);
    await sql.query(
     ` update ${Model} set Password = '${passwordHash}' where EMPID = '${EMPID}'`
    );
    await sql.query(
      `update ${Model1} set Password = '${passwordHash}' where EMPID = '${EMPID}'`
    );
    await sql.query(
     `update ${Model2} set Password = '${passwordHash}' where EMPID = '${EMPID}'`
    );
    await sql.query(
      `update ${Model3} set Password = '${passwordHash}' where EMPID = '${EMPID}'`
    );
    await sql.query(
      `update ${Model4} set Password = '${passwordHash}' where EMPID = '${EMPID}'`
    );
    return res.status(200).json({
      success: true,
      result:  [],
      message: "Password change successfully!",
    });
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ err: err, success: false, result: [], message: "Oops there is an Error" });
  }
}
exports.updateImage = async (req,res) => {
  const { id } = req.params;
  const values = req.body;
  try {
    let valuesQuery = "";
    for (key in values) {
      valuesQuery += key + "='" + values[key] + "',";
    }
    valuesQuery = valuesQuery.slice(0, -1);
    await sql.query(`update ${Model} set ${valuesQuery} where EMPID = ${id}`);
    await sql.query(`update ${Model1} set ${valuesQuery} where EMPID = ${id}`);
    await sql.query(`update ${Model2} set ${valuesQuery} where EMPID = ${id}`);
    await sql.query(`update ${Model3} set ${valuesQuery} where EMPID = ${id}`);
    await sql.query(`update ${Model4} set ${valuesQuery} where EMPID = ${id}`);
    return res.status(200).json({
      success: true,
      result: {},
      message: "we update this document by this id: " + id,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
      error: err,
    });
  }
} 

exports.update = async (req, res) => {
  let { Email, Password, IDEmployee} = req.body;
  const { id } = req.params;
  const values = req.body;


    if (!Email)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Email or password fields they don't have been entered.",
      });

    const { recordset } = await sql.query(
      `SELECT * FROM ${Model} where Email = '${Email} and IDEmployee != ${IDEmployee}'`
    );

    if (recordset.length > 0)
      return res.status(400).json({
        success: false,
        result: null,
        message: "An account with this email already exists.",
      });


    if (req.body.Password) {
      const passwordHash = generateHash(Password);
      const values = req.body;
      values.Password = passwordHash;
    }

  try {
    let valuesQuery = "";
    for (key in values) {
      valuesQuery += key + "='" + values[key] + "',";
    }

    valuesQuery = valuesQuery.slice(0, -1);

    await sql.query(`update ${Model} set ${valuesQuery} where ID = ${id}`);

    console.log(`update ${Model} set ${valuesQuery} where ID = ${id}`)
    return res.status(200).json({
      success: true,
      result: {},
      message: "we update this document by this id: " + id,
    });

  } catch (err) {

    console.log(err)
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
      error: err,
    });
  }

};

exports.delete = async (req, res) => {
  let { id } = req.params;
  
  try { 

    const deleteQuery = `Delete from ${Model} where ID= ${id}`;
    
    await sql.query(deleteQuery);

    return res.status(200).json({
      success: true,
      result: {},
      message: "Success",
    });

  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: `Error in deleting the user where id = ${id}`});
  }
};



exports.delete = async (req, res) => {
  let { id } = req.params;

  try {

    const deleteQuery = `Delete from ${Model} where ID= ${id}`;

    await sql.query(deleteQuery);

    return res.status(200).json({
      success: true,
      result: {},
      message: "Success",
    });

  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: `Error in deleting the user where id = ${id}` });
  }
};



