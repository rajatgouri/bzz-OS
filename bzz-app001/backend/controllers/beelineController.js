const methods = require("./crudController");
const { getDateTime } = require("./utilController");
const endpoints = methods.crudController("[COHTEAMS].[dbo].[SA_Beeline]");
const sql = require('mssql')

delete endpoints["list"];
const Model = "[COHTEAMS].[dbo].[SA_Beeline]";
const PreviousDataModel = "[COHTEAMS].[dbo].[SA_BeelinePreviousValue]";



endpoints.list = async (req, res,) => {
    try {

        const ID = req.admin.EMPID;
        const First = req.admin.Nickname;
        const managementAccess = req.admin.ManagementAccess

        var page = req.query.page || 1;
        var filter = JSON.parse(req.query.filter);
        var sorter = JSON.parse(req.query.sorter);
            

        var top10 = false;
        
        let filterQuery = "";
        let sorterQuery = "";

        for (key in filter) {
            if(filter[key]) {

                switch (key) {
                    
                 
                    case "" : {
                        let values = filter[key];
                        valueQuery = values.map(v => ( "'" + v + "'"))
                        if(valueQuery.length > 0) {
                            filterQuery += filter[key] !== null ? "["+ key + "] IN (" + valueQuery + ") and " : "" ;
                        }
                        break
                    }

                    case "Notes": {

                        let values = filter[key];
                        if (values.length < 2 && values[0] == 0) {
                            filterQuery += `CONVERT(VARCHAR, ${key})`  + " NOT IN ( '' )  and " 
                        } else if ((values.length < 2 && values[0] == 1)) {
                            filterQuery += "("+ `CONVERT(VARCHAR, ${key})`+ " IN ( '' ) or Notes IS NULL) and " ;
                        } 
                        break;
                    } 

                    case "Error": {

                        let values = filter[key];
                        if (values.length < 2 && values[0] == 0) {
                            filterQuery +=  key + " NOT IN ( '' )  and " 
                        } else if ((values.length < 2 && values[0] == 1)) {
                            filterQuery += "("+ key + " IN ( '' ) or Error IS NULL) and " ;
                        } 
                        break;
                    } 

                    case "Archive": {

                        let values = filter[key];
                        if (values.length < 2 && values[0] == 0) {
                            filterQuery +=  key + " NOT IN ( '' )  and " 
                        } else if ((values.length < 2 && values[0] == 1)) {
                            filterQuery += "("+ key + " IN ( '' ) or Archive IS NULL) and " ;
                        } 
                        break;
                    } 

                    default: {
                        let values = filter[key];

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            values.splice(values.indexOf(null), 1)
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  filter[key] != null ?  "(" + "["+ key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery +=  '['+ key + '] IS NULL) and '
            
                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ? "["+ key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
            
                        // filterQuery += filter[key] !== null ? ( key.split(" ").length > 1 ? '[' + key + ']': key ) + " Like '%" + filter[key] + "%' and " : "" ;
                        break
                    } 
                }
            } 
        }

        filterQuery = filterQuery.slice(0, -4);

    
        sorter.map((sort) => {
            sorterQuery += `[${sort.field}] ${sort.order == "ascend" ? "ASC" : "DESC"} ,`
        })


        let sq = sorterQuery.slice(0, -1)
         
        const limit = parseInt(req.query.items) || 100;
        const skip = page * limit - limit;

        var recordset;
        
        // if (managementAccess) { 
            //  Query the database for a list of all results
            var query = `select  * from ${Model}  `;    
            var totalQuery = `select count(*) from ${Model} `;    

            if(filterQuery || sorterQuery) {
                if(filterQuery ) {
                    query += " where  " + filterQuery + " "
                    totalQuery += " where  " + filterQuery + " "
                }  
                
                if (sorterQuery) {
                    query += " ORDER BY " + sq +  " "   
                } 

                if (top10) {
                    query += "OFFSET  0  ROWS FETCH NEXT 10 ROWS ONLY "     
                }

            } else {
                query +="where   Archive IS NULL  ORDER BY ID ASC OFFSET "+ skip + " ROWS FETCH NEXT " + limit + " ROWS ONLY "   
            }
            


            console.log(query)
            const { recordset: result } = await sql.query(query);
            
                recordset = result
            const { recordset: coun } = await sql.query(totalQuery);
            arr = coun
         
        const obj = arr[0];
        var count = obj[""];

        if (top10) {
            count = 10
        }
  
        const pages = Math.ceil(count / limit);

        // Getting Pagination Object
        const pagination = { page, pages, count };

        const filters = filter;
        const sorters = sorter
        // Getting Pagination Object

        return res.status(200).json({
            success: true,
            result: recordset,
            pagination,
            filters,
            sorters,
            message: "Successfully found all documents",
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            result: [],
            message: "Oops there is error",
            error: err,
        });
    }
};

endpoints.getPrevious = async (req,res) => {
    try {


        const {value} = req.query

        EMPID = (JSON.parse(value).EMPID)

        const {recordset: result} = await sql.query(`SELECT * from ${PreviousDataModel} where EMPID = ${EMPID}`);

        
        return res.status(200).json({
            success: true,
            result: result,
            message: "fetch data on EMPID! " + EMPID,
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

endpoints.savePrevious = async (req,res) => {
    try {


        const {value} = req.body

        console.log(value)

        const {recordset: result} = await sql.query(`SELECT * from ${PreviousDataModel} where EMPID = ${value.EMPID}`);

        if(result.length > 0) {
            let valueQuery = "";
  

            for (key in value) {
                
              if(value[key]) {
                  valueQuery += key + "='" + value[key] + "',";
              } else if (value[key] == 0) {
                  valueQuery += key + "='" + value[key] + "',";
                } else { 
                     valueQuery += key + "= NULL ,";
                  }
          }
        
            valueQuery = valueQuery.slice(0, -1);
        
            console.log(`update ${PreviousDataModel} set ${valueQuery} where EMPID = ${value.EMPID}`)
            await sql.query(`update ${PreviousDataModel} set ${valueQuery} where EMPID = ${value.EMPID}`);

            return res.status(200).json({
                success: true,
                result: null,
                message: "Insert Previous data Succesfully!",
              });
        } else {
            const columnsQ1 = "(" + Object.keys(value).map(v => ('[' + v + ']')).toString() + ")"
    
            let valuesQuery = "";
            for (key in value) {
                console.log(value[key])
                if(value[key] == 0) {
                    valuesQuery += "'" + value[key] + "',";
                } else if ( value[key] == "" || value[key] == undefined ) {
                valuesQuery += " NULL" + ",";
              } else {
                valuesQuery += "'" + value[key] + "',";
              }
            }
            valuesQuery = "(" + valuesQuery.slice(0, -1) + ")";
          
            const insertQuery = `insert into ${PreviousDataModel} ${columnsQ1} values ${valuesQuery}`
    
            console.log(insertQuery)
            await sql.query(insertQuery);

            return res.status(200).json({
                success: true,
                result: null,
                message: "Insert Previous data Succesfully!",
              });
    
        }
        // // Find document by id and updates with the required fields
        // const values = req.body;
        // values['UserName'] = req.admin.Nickname;
        // values['ActionTimeStamp'] = getDateTime()
        //   const columnsQ1 = "(" + Object.keys(values).map(v => ('[' + v + ']')).toString() + ")"
    
        //     let valuesQuery = "";
        //     for (key in values) {
        //         console.log(values[key])
        //         if(values[key] == 0) {
        //             valuesQuery += "'" + values[key] + "',";
        //         } else if ( values[key] == "" || values[key] == undefined ) {
        //         valuesQuery += " NULL" + ",";
        //       } else {
        //         valuesQuery += "'" + values[key] + "',";
        //       }
        //     }
        //     valuesQuery = "(" + valuesQuery.slice(0, -1) + ")";
          
        //     const insertQuery = `insert into ${Model} ${columnsQ1} values ${valuesQuery}`
    
        //     console.log(insertQuery)
        //     await sql.query(insertQuery);
    
        // return res.status(200).json({
        //   success: true,
        //   result: {},
        //   message: "Entry Add Successfully!"
        // });
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

endpoints.fullList = async (req, res) => {

    try {
      const First = req.admin.Nickname;
      const managementAccess = req.admin.ManagementAccess
    
    let result1 = {} 
    
      if (managementAccess) {
        //  Query the database for a list of all results
       
        const [{recordset: chargesProcessedCount}, {recordset: chargesReviewCount}, {recordset: chargesReview}, {recordset: notToReview}, {recordset: total}]  = await Promise.all([
            await sql.query(`Select count(*) as count from ${Model} where Status IN ('Done', 'Defer')`),
            await sql.query(`Select count(*) as count from ${Model} where Status NOT IN ('Done', 'Defer')`),
            await sql.query(`Select * from ${Model} where Status NOT IN ('Done', 'Defer')`),
            await sql.query(`Select * from ${Model} where Status NOT IN ('Review')`),
            await sql.query(`Select count(*) as count from ${Model} `)

        ])
    
        let data  = {
            chargesProcessedCount,
            chargesReviewCount,
            chargesReview,
            notToReview    ,
            total
        }

        result1 = {
            data,
            username: First
        } 
  
           

      } else {

        
        const [{recordset: chargesProcessedCount}, {recordset: chargesReviewCount}, {recordset: chargesToReview}, {recordset: notToReview}, {recordset: total}]  = await Promise.all([
            await sql.query(`Select count(*) as count from ${Model} where Status IN ('Done', 'Defer') and UserAssigned IN ('${First}')`),
            await sql.query(`Select count(*) as count from ${Model} where Status NOT IN ('Done', 'Defer') and UserAssigned IN ('${First}')`),
            await sql.query(`Select * from ${Model} where Status NOT IN ('Done', 'Defer') and UserAssigned IN ('${First}')`),
            await sql.query(`Select * from ${Model} where Status NOT IN ('Review') and UserAssigned IN ('${First}')`),
            await sql.query(`Select count(*) as count from ${Model} `)

        ])
    
    
        let data  = {
            chargesProcessedCount,
            chargesReviewCount,
            chargesToReview,
            notToReview    ,
            total
        }

        result1 = {
            data,
            username: First
        } 
        
      }

      return res.status(200).json({
        success: true,
        // result: recordset,
        result: result1,
        // pagination,
        message: "Successfully found all documents",
      });
    } catch (err) {
        console.log(err)
      return res.status(500).json({
        success: false,
        result: [],
        message: "Oops there is error",
        error: err,
      });
    }
};

endpoints.update = async ( req, res) => {
    try {
      // Find document by id and updates with the required fields
      const values = req.body;
       values['ActionTimeStamp'] = getDateTime()
       values['UserName']  = req.admin.Nickname

      const id = req['params']['id'];// please do not update this line
      let valuesQuery = "";
  

      for (key in values) {
          
        if(values[key]) {
            valuesQuery += key + "='" + values[key] + "',";
        } else if (values[key] == 0) {
            valuesQuery += key + "='" + values[key] + "',";
          } else { 
               valuesQuery += key + "= NULL ,";
            }
    }
  
      valuesQuery = valuesQuery.slice(0, -1);
  
      console.log(`update ${Model} set ${valuesQuery} where ID = ${id}`)
      await sql.query(`update ${Model} set ${valuesQuery} where ID = ${id}`);
  
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


endpoints.create = async (req,res) => {
    try {
        // Find document by id and updates with the required fields
        const values = req.body;
        values['UserName'] = req.admin.Nickname;
        values['ActionTimeStamp'] = getDateTime()

          const columnsQ1 = "(" + Object.keys(values).map(v => ('[' + v + ']')).toString() + ")"
    
            let valuesQuery = "";
            for (key in values) {
                console.log(values[key])
                if(values[key] == 0) {
                    valuesQuery += "'" + values[key] + "',";
                } else if ( values[key] == "" || values[key] == undefined ) {
                valuesQuery += " NULL" + ",";
              } else {
                valuesQuery += "'" + values[key] + "',";
              }
            }
            valuesQuery = "(" + valuesQuery.slice(0, -1) + ")";
          
            const insertQuery = `insert into ${Model} ${columnsQ1} values ${valuesQuery}`
    
            console.log(insertQuery)
            await sql.query(insertQuery);
    
        return res.status(200).json({
          success: true,
          result: {},
          message: "Entry Add Successfully!"
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


endpoints.filters = async (req, res) => {

    try {

      const First = req.admin.Nickname;

      const managementAccess = req.admin.ManagementAccess
    
      let  columns = [
        {COLUMN_NAME: "Contractor"},
        {COLUMN_NAME: "JobTitle"},
        {COLUMN_NAME: "PayCode"},
        {COLUMN_NAME: "Supplier"},
        {COLUMN_NAME: "HiringManager"},

        
      ]


    columns.unshift({COLUMN_NAME: "Total"})
    columns = columns.filter((column) =>  column['COLUMN_NAME'] == 'Total' || column['COLUMN_NAME'] == 'Contractor' ||  column['COLUMN_NAME'] == 'JobTitle' ||  column['COLUMN_NAME'] == 'PayCode' || column['COLUMN_NAME'] == 'Supplier' || column['COLUMN_NAME'] == 'HiringManager' )

    let queriesToExecute = []

    let result1 = {} 
    
      if (managementAccess) {
        //  Query the database for a list of all results
        queriesToExecute.push(await sql.query(`Select count(*) from ${Model}`))


        for(let i = 0 ;i < columns.length ;i++) {
            if(columns[i].COLUMN_NAME != "Total") {
                queriesToExecute.push(await sql.query(`Select Distinct([${columns[i].COLUMN_NAME}]) from ${Model} Order BY [${columns[i].COLUMN_NAME}] ASC`))
            }
        }
    
        const filterResult = await Promise.all(queriesToExecute)
    
        // filters
        let filters = (filterResult.map((result, index) => ({column:  columns[index].COLUMN_NAME , recordset:   result.recordset})))
    
        result1 = {
            filters,
            username: First
        } 

  
      } else {

        queriesToExecute.push(await sql.query(`Select count(*) from ${Model} `))

        for(let i = 0 ;i < columns.length ;i++) {
            if(columns[i].COLUMN_NAME != "Total") {
                queriesToExecute.push(await sql.query(`Select Distinct([${columns[i].COLUMN_NAME}]) from ${Model} `))
            }
        }
    
        const filterResult = await Promise.all(queriesToExecute)
    
        // filters
        let filters = (filterResult.map((result, index) => ({column:  columns[index].COLUMN_NAME , recordset:   result.recordset})))
        

        result1 = {
            filters,
            username: First
        } 
        
      }

      return res.status(200).json({
        success: true,
        // result: recordset,
        result: result1,
        // pagination,
        message: "Successfully found all documents",
      });
    } catch (err) {
        console.log(err)
      return res.status(500).json({
        success: false,
        result: [],
        message: "Oops there is error",
        error: err,
      });
    }
};

endpoints.updateUser = async (req, res) => {
    try {
        const {user , filter} = req.body
        
        let filterQuery = "";
        for (key in filter) {
            if(filter[key]) {

                switch (key) {
                    case "Status" : {
                        let values = filter[key];
                        
                        console.log(values)
                        if(values.indexOf('Review') > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "(" + key + " IN (" + valueQuery + ") or " : "" ;
                            filterQuery += 'Status IS NULL) and '

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  key + " IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                        break
                    }
                    
                    case "UserAssigned" : {
                        let values = filter[key];
                        valueQuery = values.map(v => ( "'" + v + "'"))
                        if(valueQuery.length > 0) {
                            filterQuery += filter[key] !== null ?  key + " IN (" + valueQuery + ") and " : "" ;
                        }
                        break
                    }
                    case "Process Type" : {
                        let values = filter[key];
                        
                        if (values[0] == 'Top 10 $ Amount' ) {
                            if(limitTop10 != 0) {
                                filterQuery += "ID >= 0 and ";
                            }  else {
                                filterQuery += "ID < 0 and ";

                            }
                            sorterQuery += '[Sess Amount] DESC ,'
                                
                            top10 = true

                        } else if (values[0] == 'Top 10 Aging Days') {
                            console.log('Top 10 Aging Days')

                            if(limitTop10 != 0) {
                                filterQuery += "ID >= 0 and ";
                            }  else {
                                filterQuery += "ID < 0 and ";
                            }

                            sorterQuery += '[Aging Days] DESC ,'
                            top10 = true
                            
                        }
                        
                        else if (values[0] == 'Non-Therapeutic') {
                            console.log('Non-Therapeutic')

                            filterQuery += "ID >= 0 and [Study Type] = 'Non-Therapeutic' and " ;
                
                        }  else {
                            valueQuery = values.map(v =>  {
                                return ( "'" + v + "'")
                            })
                            
                            if(valueQuery.length > 0 ) {
                                filterQuery += filter[key] !== null ?"[" +  key  + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }

                        break
                    }

                    case "Research IRB" : {
                        let values = filter[key];
                        valueQuery = values.map(v => ( "'" + v + "'"))
                        if(valueQuery.length > 0) {
                            filterQuery += filter[key] !== null ? "[" + key + "] IN (" + valueQuery + ") and " : "" ;
                        }
                        break
                    }

                    case "Study Type" : {
                        let values = filter[key];
                        valueQuery = values.map(v => ( "'" + v + "'"))
                        if(valueQuery.length > 0) {
                            filterQuery += filter[key] !== null ? "[" + key + "] IN (" + valueQuery + ") and " : "" ;
                        }
                        break
                    }

                    case "Notes": {

                        let values = filter[key];
                        if (values.length < 2 && values[0] == 0) {
                            filterQuery +=  key + " NOT IN ( '' )  and " 
                        } else if ((values.length < 2 && values[0] == 1)) {
                            filterQuery += "("+ key + " IN ( '' ) or Notes IS NULL) and " ;
                        } 
                        break;
                    } 

                    
                    case "Error": {

                        let values = filter[key];
                        if (values.length < 2 && values[0] == 0) {
                            filterQuery +=  key + " NOT IN ( '' )  and " 
                        } else if ((values.length < 2 && values[0] == 1)) {
                            filterQuery += "("+ key + " IN ( '' ) or Error IS NULL) and " ;
                        } 
                        break;
                    } 


                    default: {
                        filterQuery += filter[key] !== null ? ( key.split(" ").length > 1 ? '[' + key + ']': key ) + " Like '%" + filter[key] + "%' and " : "" ;
                        break
                    }
                }
            } 
        }

        filterQuery = filterQuery.slice(0, -4);
        var query = `update ${Model} set UserAssigned = '${user}' where ${filterQuery}`;    

        console.log(query)
        const { recordset } = await sql.query(query);
        return res.status(200).json({
            success: true,
            result: recordset,
            message: "Successfully found all documents",
        });
        
    } catch (err) {
        console.log(err)
      return res.status(500).json({
        success: false,
        result: [],
        message: "Oops there is error",
        error: err,
      });
    }
};

module.exports = endpoints;
