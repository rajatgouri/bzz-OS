const { getDateTime } = require("./controllers/utilController");

const sql = require('mssql')
const AttendanceModel = '[COHTEAMS].[dbo].[SA_OS_Attendance]'


exports.init = function(io) {

    io.on('connection', function(socket) {
        console.log('Connection Setup to socket');

        socket.on('setUserID', async(id, name) => {
            console.log(id)
            socket.user = id;
            
            console.log('Socket online by ID ', id)
            
            sql.query(`update JWT set Online = '1', Login = '${getDateTime()}', Logout = null where EMPID = ${id}`);
            io.sockets.emit('updated-wqs');


            const {recordset : result  } = await sql.query(`SELECT * from ${AttendanceModel} where EMPID = ${id} and Login IS NULL AND Logout IS NULL`)
            if(result.length == 0) {
                const {recordset : user  } = await sql.query(`SELECT * from JWT where EMPID = ${id} `)
                await sql.query(`INSERT INTO ${AttendanceModel} (EMPID, UserName, Login ,  CurrentDate) values (${id}, '${user[0].Nickname}', '${getDateTime()}', '${getDateTime().split('T')[0]}')`)
            }
        })

    
        socket.on('update-wqs', () => {
            io.sockets.emit('updated-wqs');
        })


        socket.on('update-reminder', () => {
            io.sockets.emit('updated-reminder');
        })

        socket.on('disconnect', async function () { 

            if(socket.user == undefined) {
                return 
            }

            console.log('Socket offline by ID', socket.user)

            sql.query(`update JWT set Online = '0', Logout  = '${getDateTime()}' where EMPID = ${socket.user}`);
            io.sockets.emit('updated-wqs');
                await sql.query(`Update  ${AttendanceModel} set Logout = '${getDateTime()}' where EMPID = '${socket.user}' and Login IS NOT NULL and Logout IS NULL` )

        });


        socket.on('disconnected', async function () {

            if(socket.user == undefined) {
                return 
            }

            console.log('Socket offline by ID', socket.user)
            

                sql.query(`update JWT set Online = '0', Logout = '${getDateTime()}' where EMPID = ${socket.user}`);
                io.sockets.emit('updated-wqs');
                await sql.query(`Update  ${AttendanceModel} set Logout = '${getDateTime()}' where EMPID = '${socket.user}' and Login IS NOT NULL and Logout IS NULL` )


        });

        
    })
} 