const methods = require("./crudController");
const endpoints = methods.crudController("PageLogger");
const utilController = require('./utilController');
const sql = require('mssql')

const Model = "PageLogger";
delete endpoints["update"];
delete endpoints['list'];



endpoints.list = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const limit = parseInt(req.query.items) || 100;
    const skip = page * limit - limit;
    const order = req.query.order || "DESC";
    // const filter = req.query.filter || "New";

    var filter = JSON.parse(req.query.filter);
    var sorter = JSON.parse(req.query.sorter);


    console.log(sorter)

    let filterQuery = "";
    for (key in filter) {
      if (filter[key]) {

        switch (key) {
          case "UserName": {
            let values = filter[key];
            valueQuery = values.map(v => ("'" + v + "'"))
            filterQuery += +filter[key] !== null ? "Convert(varchar,"+ key + ") IN (" + valueQuery + ") and " : "";
            break
          }

          case "Status": {
            let values = filter[key];
            valueQuery = values.map(v => ("'" + v + "'"))
            filterQuery += +filter[key] !== null ? "Convert(varchar,"+ key + ") IN (" + valueQuery + ") and " : "";
            break
          }
          
          default: {
            filterQuery += filter[key] !== null ? (key.split(" ").length > 1 ? '[' + key + ']' : key) + " Like '%" + filter[key] + "%' and " : "";
            break
          }
        }
      }
    }
    filterQuery = filterQuery.slice(0, -4);
    let sorterQuery = "";

    
    if (sorter[0] && sorter[0].field) {
      sorterQuery += `[${sorter[0].field}] ${sorter[0].order == "ascend" ? "ASC" : "DESC"}`
    }

    var query = `select ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS SNo, * from ${Model}   `;
    var totalQuery = `select count(*) from ${Model}  `;

    if (filterQuery || sorterQuery) {
      if (filterQuery) {
        query += "where " + filterQuery + " "
        totalQuery += "where " + filterQuery + " "
      }

      if (sorterQuery) {
        query += " ORDER BY " + sorterQuery + " "
      } else {
        query += ` ORDER BY ${Model}.DateTime DESC ` 
      }

    } else {
      query += `ORDER BY ${Model}.DateTime OFFSET ` + skip + " ROWS FETCH NEXT " + limit + " ROWS ONLY "
    }


    var recordset;
    var arr;

    console.log(query)
    const { recordset: result } = await sql.query(query);
    recordset = result;
    const { recordset: coun } = await sql.query(totalQuery);
    arr = coun
   
    const obj = arr[0];
    const count = obj[""];

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    // Getting Pagination Object
    return res.status(200).json({
      success: true,
      result: recordset,
      pagination,
      message: "Successfully found all documents",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: [],
      message: "Oops there is error",
      error: err,
    });
  }
};



endpoints.create = async (req, res) => {

    try {


      const values = req.body;
      values.EMPID = req.admin ? req.admin.EMPID : null
      

    

      var date = new Date();
      var utcDate = new Date(date.toUTCString());
      utcDate.setHours(utcDate.getHours()- 7);
      var usDate = new Date(utcDate).toISOString();

      var usDate1 = utilController.getDateTime()
      values.DateTime = usDate1;
      const columnsQ = "(" + Object.keys(values).toString() + ")"
  
      let valuesQuery = "";
      for (key in values) {
            if (values[key] === "null" || values[key] === null) {
                valuesQuery += "NULL" + ",";
            } else {
                valuesQuery += "'" + values[key] + "',";
            }
        }
      valuesQuery = "(" + valuesQuery.slice(0, -1) + ")" ;
    
      const insertQuery = `insert into ${Model} ${columnsQ} values ${valuesQuery}`
      await sql.query(insertQuery);
  
      

      return res.status(200).json({
        success: true,
        result: {},
        message: "Success",
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
  
  
  module.exports = endpoints;
  

