const methods = require("./crudController");
const endpoints = methods.crudController("EPICDailyWQSummary");
const sql = require('mssql')

delete endpoints["list"];
const Model = "EPICDailyWQSummary";

endpoints.list = async (req, res,) => {
    try {

        console.log(req.query)
        const {id } = req.query;
        const query = `select * from ${Model} where WORKQUEUE_ID = '${id}' Order By HX_DATE DESC OFFSET 0 ROWS FETCH NEXT 200 ROWS ONLY`;
        const { recordset: result } = await sql.query(query);

    
        return res.status(200).json({
            success: true,
            result: result,
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
