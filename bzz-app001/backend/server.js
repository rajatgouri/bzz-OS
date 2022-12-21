const app = require("./app");

const sql = require('mssql')
const chokidar = require('chokidar');
const path = require('path')
const dir = path.resolve("/home/node/Beeline");
const LoggerModel = "[COHTEAMS].[dbo].[SA_BeelineFileLogger]";
const BeelineModel = "[COHTEAMS].[dbo].[SA_Beeline]";
const cron = require('node-cron');
const readXlsxFile = require('read-excel-file/node');
const { getDateTime } = require("./controllers/utilController");
const fs = require('fs');

function ExcelDateToJSDate(serial) {

  if(serial == null) {
    return null
  }

  if (typeof serial == 'number') {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = (utc_days * 86400 ) ;                                         
    var date_info = new Date((utc_value ) * 1000);
    return (date_info.toISOString().split('T')[0])
  } else {
    console.log(new Date(serial).toISOString().split('T')[0])
    return new Date(serial).toISOString().split('T')[0]
  }

  
 
}


const PORT = parseInt(process.env.PORT) || 8000;
// Make sure we are running node 10.0+
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 10 || (major === 10 && minor <= 0)) {
  console.log(
    "Please go to nodejs.org and download version 10 or greater. 👌\n "
  );
  process.exit();
}

// import environmental variables from our variables.env file
require("dotenv").config({ path: ".variables.env" });

let dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: { encrypt: false },
  requestTimeout: 300000

};



async function connectToDatabase() {
  console.log(`Checking database connection...`);
  try {
    await sql.connect(dbConfig);
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error);
    process.exit(1);
  }
}
// Start our app!

const timer2 = () => new Promise(res => setTimeout(res, 5000))



const processFiles = async(file) => {

  const timer = () => new Promise(res => setTimeout(res, 2000))



  return new Promise (async (resolve, reject) => {

    
    const {recordset: result} = await sql.query(`select * from ${LoggerModel} where [File] like '%${file}%' and CurrentDate <= ('${getDateTime().split('T')[0]}') `)

    if(result.length> 0){ 
      console.log('resolve')
    resolve(true)

    }  else {
      console.log(`insert into ${LoggerModel} ([File], CurrentDate , UploadDateTime) values ('${file}','${getDateTime().split('T')[0]}', '${getDateTime()}')`)

      await sql.query(`insert into ${LoggerModel} ([File], CurrentDate , UploadDateTime) values ('${file}','${getDateTime().split('T')[0]}', '${getDateTime()}')`)

        readXlsxFile(dir + '/' + file).then(async(rows) => {

          let columns = rows[0]
    
          let dept = (columns.findIndex((i) => i == 'Department/Bill to Chartfield'))
          let assignmentID = (columns.findIndex((i) => i == 'Assignment ID'))
          let contractor = (columns.findIndex((i) => i == 'Contractor'))
          let JobTitle = (columns.findIndex((i) => i == 'Job Title'))
          let PayCode = (columns.findIndex((i) => i == 'Pay Code'))
          let RTRate = (columns.findIndex((i) => i == 'RT Rate'))
          let OTRate = (columns.findIndex((i) => i == 'OT Rate'))
          let InvoicedUnits = (columns.findIndex((i) => i == 'Invoiced Units'))
          let invoicedNet = (columns.findIndex((i) => i == 'Invoiced Net'))
          let Supplier = (columns.findIndex((i) => i == 'Supplier'))
          let HiringManager = (columns.findIndex((i) => i == 'Hiring Manager'))
          let WorkDate = (columns.findIndex((i) => i == 'Work Date'))
          let WeekEndingDate = (columns.findIndex((i) => i == 'Week Ending Date'))
          let StatementDate = (columns.findIndex((i) => i == 'Statement Date'))
    
    
          for (let i = 1 ; i<= rows.length ; i++) {
      
            
    
            if(!rows[i] ) {
              console.log('End')
    
              resolve(true)
            }
    
            
            if(rows[i]) {

              console.log(`select * from ${BeelineModel} where 
              [AssignmentID]  ${rows[i][assignmentID] ? ` = '${rows[i][assignmentID]}'` : ' IS NULL'}
              and [Contractor] ${rows[i][contractor] ? ` = '${rows[i][contractor] }'` : ' IS NULL'}
              and [JobTitle] ${rows[i][JobTitle] ? ` = '${rows[i][JobTitle] }'` : ' IS NULL'}
              and [PayCode] ${rows[i][PayCode] ? ` = '${rows[i][PayCode] }'` : ' IS NULL'}
              and [RTRate] ${rows[i][RTRate] ? ` = '${rows[i][RTRate]}'` : ' IS NULL'}
              and [OTRate] ${rows[i][OTRate] ? `= '${rows[i][OTRate]}'` : ' IS NULL'}
              and [Supplier] ${rows[i][Supplier] ? `= '${rows[i][Supplier]}'` : ' IS NULL'}
              and [InvoicedNet] ${rows[i][invoicedNet] ? `= '${rows[i][invoicedNet]}'` : ' IS NULL'}
              and [InvoicedUnits] ${rows[i][InvoicedUnits] ? ` = '${rows[i][InvoicedUnits]}'` : ' IS NULL'}
              ${
                rows[i][WorkDate] ?
              
                `
                and [WorkDate] IN  (${ `'${ExcelDateToJSDate(rows[i][WorkDate])}' `})

                `  : ''
              }
              
              

            `)
      
    
            const {recordset: result} = await sql.query(`select * from ${BeelineModel} where 
              [AssignmentID]  ${rows[i][assignmentID] ? ` = '${rows[i][assignmentID]}'` : ' IS NULL'}
              and [Contractor] ${rows[i][contractor] ? ` = '${rows[i][contractor] }'` : ' IS NULL'}
              and [JobTitle] ${rows[i][JobTitle] ? ` = '${rows[i][JobTitle] }'` : ' IS NULL'}
              and [PayCode] ${rows[i][PayCode] ? ` = '${rows[i][PayCode] }'` : ' IS NULL'}
              and [RTRate] ${rows[i][RTRate] ? ` = '${rows[i][RTRate]}'` : ' IS NULL'}
              and [OTRate] ${rows[i][OTRate] ? `= '${rows[i][OTRate]}'` : ' IS NULL'}
              and [Supplier] ${rows[i][Supplier] ? `= '${rows[i][Supplier]}'` : ' IS NULL'}
              and [InvoicedNet] ${rows[i][invoicedNet] ? `= '${rows[i][invoicedNet]}'` : ' IS NULL'}
              and [InvoicedUnits] ${rows[i][InvoicedUnits] ? ` = '${rows[i][InvoicedUnits]}'` : ' IS NULL'}
              ${
                rows[i][WorkDate] ?
              
                `
                and [WorkDate] IN  (${ `'${ExcelDateToJSDate(rows[i][WorkDate])}' `})

                `  : ''
              }
              
              

            `)
      
              
            if (result.length > 0) { 
              console.log("continue")
              continue
            } else {
    
      
              let x = (`
              insert into ${BeelineModel}
              (
                [AssignmentID]
                ,[Contractor]
                ,[JobTitle]
                ,[PayCode]
                ,[RTRate]
                ,[OTRate]
                ,[InvoicedUnits]
                ,[Supplier]
                ,[InvoicedNet]
                ,[HiringManager]
                ,[DeptBillChartfield]
                ,[WorkDate]
                ,[WeekEndDate]
                ,[StatementDate],
                [UploadDateTime]   
              ) values (
                ${rows[i][assignmentID] ? `'${rows[i][assignmentID]}'` : null},   
                ${rows[i][contractor] ? `'${rows[i][contractor]}'` : null},   
                ${rows[i][JobTitle] ? `'${rows[i][JobTitle]}'` : null},   
                ${rows[i][PayCode] ? `'${rows[i][PayCode]}'` : null},   
                ${rows[i][RTRate] ? `'${rows[i][RTRate]}'` : null},   
                ${rows[i][OTRate] ? `'${rows[i][OTRate]}'` : null},   
                ${rows[i][InvoicedUnits] ? `'${rows[i][InvoicedUnits]}'` : null},   
                ${rows[i][Supplier] ? `'${rows[i][Supplier]}'` : null},   
                ${rows[i][invoicedNet] ? `'${rows[i][invoicedNet]}'` : null},   
                ${rows[i][HiringManager] ? `'${rows[i][HiringManager]}'` : null},   
                ${rows[i][dept] ? `'${rows[i][dept]}'` : null},   
                ${rows[i][WorkDate] ? `'${ExcelDateToJSDate(rows[i][WorkDate])}'` : null},   
                ${rows[i][WeekEndingDate] ? `'${new Date(rows[i][WeekEndingDate]).toISOString()}'` : null},   
                ${rows[i][StatementDate] ? `'${new Date(rows[i][StatementDate]).toISOString()}'` : null},   
                '${getDateTime()}'
    
              )
            `)
    
            // console.log(x)
            await sql.query(x)  
            await timer()
            }
          }
          }
        })
    
  }
  })
 
}

const watcherFunc = async() => {
  
  const watcher = chokidar.watch(dir, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
   
  let files = []
  
  watcher
    .on('add', async(path) => {  
      if (path.indexOf('~$') == -1) {
        console.log(path.replace(/\\/g, '/').split('/').reverse()[0])
        files.push(path.replace(/\\/g, '/').split('/').reverse()[0])
      }
    }).on('ready',async  () => {
      for (let i=0 ; i<files.length ;i++) {
        console.log(files[i].replace(/\\/g, '/').split('/').reverse()[0])

        await processFiles(files[i].replace(/\\/g, '/').split('/').reverse()[0])
        await timer2()
      }
    })
    
}

setInterval(() => {
    watcherFunc()
}, 15000)

async function init() {
  console.log("Waiting 1 minute for MSSQL DB to initialize")
  console.log(dbConfig)
  // await new Promise(resolve => setTimeout(resolve, 60000));
  await connectToDatabase();
  watcherFunc()
  // app.set("port", parseInt(process.env.PORT) || 8000);
  const server = app.listen(PORT, () => {
    console.log(
      `Starting MS SQL + Express → On PORT : ${server.address().port}`
    );
  });
}

init();


