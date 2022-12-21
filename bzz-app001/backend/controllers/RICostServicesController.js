const methods = require("./crudController");
const endpoints = methods.crudController("[COHTEAMS].[dbo].[RI_CostServices]");
const sql = require('mssql')

delete endpoints["list"];
const Model = "[COHTEAMS].[dbo].[RI_CostServices]";


endpoints.list = async (req, res,) => {
    try {

       
        var page = req.query.page || 1;
        var filter = (req.body.filter);
        var sorter = (req.body.sorter);
        delete filter['sort']
        console.log(filter)
        console.log(sorter)

        let filterQuery = "";
        let sorterQuery = "";

        for (key in filter) {
            if(filter[key]) {

                switch (key) {
                   
                    case "Account Status" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }
                   
                    case "Account Class" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    case "Financial Class" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    case "Procedure" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    case "Rev Code" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    case "CPT/HCPCS Code" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }
                   

                    case "CPT/HCPCS Code" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }
                   
                    case "Service Area" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }


                    case "Cost Center" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    case "Department" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }
                   

                    case "Transaction Source" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    case "Transition Type" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }


                    case "Posted User" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf(null) > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                    
                    case "Is Late Charge(Y/N)" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf('null') > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }

                   

                    case "Is Reposted Charge(Y/N)" : {
                        let values = filter[key];
                        values = [... new Set(values)]

                        if(values.indexOf('null') > -1) {
                            values.push('')
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            filterQuery +=  +filter[key] !== null ?  "([" + key + "] IN (" + valueQuery + ") or " : "" ;
                            filterQuery += `[${key}] IS NULL) and `

                        } else {
                            
                            valueQuery = values.map(v => ( "'" + v  + "'"))
                            if(values.length > 0) {
                                filterQuery +=  +filter[key] !== null ?  "[" +key + "] IN (" + valueQuery + ") and " : "" ;
                            }
                        }
                    
                        break
                    }
                    

                    
                    case "post Date": {

                        filterQuery += filter[key] !== null ? (key.split(" ").length > 1 ? '[' + key + ']' : key) + " =  FORMAT(TRY_CAST('"+ filter[key] +"' as date),'yyyy-MM-dd')" + " and " : "";

                        break;
                    }

                    case "Service Date": {

                        filterQuery += filter[key] !== null ? (key.split(" ").length > 1 ? '[' + key + ']' : key) + " =  FORMAT(TRY_CAST('"+ filter[key] +"' as date),'yyyy-MM-dd')" + " and " : "";

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

    
        sorter.map((sort) => {
            sorterQuery += `[${sort.field}] ${sort.order == "ascend" ? "ASC" : "DESC"} ,`
        })


        let sq = sorterQuery.slice(0, -1)
         
        const limit = parseInt(req.query.items) || 100;
        const skip = page * limit - limit;

        var recordset;
        
        // if (managementAccess) { 
            //  Query the database for a list of all results
            var query = `select  * from ${Model} `;    
            var totalQuery = `select count(*) from ${Model} `;    

            if(filterQuery || sorterQuery) {
                if(filterQuery ) {
                    query += "where " + filterQuery + " "
                    totalQuery += "where " + filterQuery + " "
                }  
                
                if (sorterQuery) {
                    
                    query += " ORDER BY " + sq +  " "   
                } 

                

            } else {
                query +="ORDER BY ID ASC OFFSET "+ skip + " ROWS FETCH NEXT " + limit + " ROWS ONLY "   
            }
            


            console.log(query)
            const { recordset: result } = await sql.query(query);
            
                recordset = result
            const { recordset: coun } = await sql.query(totalQuery);
            arr = coun

            const obj = arr[0];
            var count = obj[""];

       
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



endpoints.filters = async (req, res) => {

    try {

    const [{recordset: AccountStatus}, {recordset: AccountClass},{recordset: FinancialClass},{recordset: Procedure},{recordset: RevCode},{recordset: CPT},{recordset: ServiceArea},{recordset: CostCenter},{recordset: Department},{recordset: TransactionSource},{recordset: TransactionType},{recordset: PostedUser} ] = await Promise.all([
        await sql.query(`SELECT DISTINCT([Account Status]) from ${Model} ORDER BY [Account Status] ASC`),
        await sql.query(`SELECT DISTINCT([Account Class]) from ${Model} ORDER BY [Account Class] ASC`),
        await sql.query(`SELECT DISTINCT([Financial Class]) from ${Model} ORDER BY [Financial Class] ASC`),
        await sql.query(`SELECT DISTINCT([Procedure]) from ${Model} ORDER BY [Procedure] ASC`),
        await sql.query(`SELECT DISTINCT([Rev Code]) from ${Model} ORDER BY [Rev Code] ASC`),
        await sql.query(`SELECT DISTINCT([CPT/HCPCS Code]) from ${Model} ORDER BY [CPT/HCPCS Code] ASC`),
        await sql.query(`SELECT DISTINCT([Service Area]) from ${Model} ORDER BY [Service Area] ASC`),
        await sql.query(`SELECT DISTINCT([Cost Center]) from ${Model} ORDER BY [Cost Center] ASC`),
        await sql.query(`SELECT DISTINCT([Department]) from ${Model} ORDER BY [Department] ASC`),
        await sql.query(`SELECT DISTINCT([Transaction Source]) from ${Model} ORDER BY [Transaction Source] ASC`),
        await sql.query(`SELECT DISTINCT([Transaction Type]) from ${Model} ORDER BY [Transaction Type] ASC`),
        await sql.query(`SELECT DISTINCT([Posted User]) from ${Model} ORDER BY [Posted User] ASC`)        
    ])
      
    console
    let result = {
        'Account Status': AccountStatus,
        'Account Class': AccountClass,
        'Financial Class' : FinancialClass,
        'Procedure' :Procedure,
        'Rev Code':RevCode,
        'CPT/HCPCS Code' : CPT,
        'Service Area' : ServiceArea,
        'Cost Center': CostCenter,
        'Department': Department,
        'Transaction Source' : TransactionSource,
        'Transaction Type': TransactionType,
        'Posted User': PostedUser
    }
    
      return res.status(200).json({
        success: true,
        // result: recordset,
        result: result,
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

module.exports = endpoints;
