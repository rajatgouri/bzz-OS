const sql = require('mssql')
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat'];



exports.getDateTime = () => {
  
    var date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    var hours = (new Date(date).getHours())
    var minutes = (new Date(date).getMinutes())
    var seconds = (new Date(date).getSeconds())
    var offset = (new Date(date).getTimezoneOffset())

    var year = (new Date(date).getFullYear())
    var month = (new Date(date).getMonth())
    var currentDate = (new Date(date).getDate())

    var fullDate = year

    if (month < 10) {
      month = ('0' + (month + 1))
      fullDate += "-" + month

    } else {
      month = (month + 1)
      fullDate += "-" + month
    }


    if (hours < 10) {
      hours = ('0' + hours.toString() )
    } else {
      hours = (hours)
    }

    if (minutes < 10) {
      minutes = ('0' + minutes)
    } else {
      minutes = (minutes )
    }

    if (seconds < 10) {
      seconds = ('0' + seconds)
    } else {
      seconds = (seconds )
    }


    if (currentDate < 10) {
      currentDate = ('-0' + currentDate)
      fullDate += currentDate
    } else {
      currentDate = ('-' + currentDate)
      fullDate += currentDate
    }


    return (fullDate+ "T"+ hours + ":" + minutes + ":" + seconds  + "." + offset + "Z" )

}


exports.GetSortOrder = (prop) => {    
  return function(a, b) {    
      if (a[prop] > b[prop]) {    
          return 1;    
      } else if (a[prop] < b[prop]) {    
          return -1;    
      }    
      return 0;    
  }    
}
    
exports.checkmark =  async (Model, EMPID, cb) =>  {
  let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    const hours = (new Date(date).getHours())
    const minutes = (new Date(date).getMinutes())

    
    if (hours == 23 && minutes == 50) {
      let { recordset: arr } = await sql.query(
        `select * from ${Model} where EMPID = ${EMPID}`
      );

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].Total < 4) {

          let sum = (arr[i]['Mon'] ? arr[i]['Mon'] : 0) + (arr[i]['Tue'] ? arr[i]['Tue'] : 0) + (arr[i]['Wed'] ? arr[i]['Wed'] : 0) + (arr[i]['Thu'] ? arr[i]['Thu'] : 0) + (arr[i]['Fri'] ? arr[i]['Fri'] : 0) + (arr[i]['Sat'] ? arr[i]['Sat'] : 0) + (arr[i]['Sun'] ? arr[i]['Sun'] : 0);
          let updateQuery = `update ${Model} set Mon = 0, Tue =0, Wed=0, Thu=0, Fri=0, Sat=0, Sun=0, Week${(arr[i].Total == null || arr[i].Total == 0) ? 1 : arr[i].Total + 1}=${sum >= 5 ? 1 : 0}, Total=${((arr[i].Total == null || arr[i].Total == 0) ? 1 : arr[i].Total + 1)} where ID = ${arr[i].ID}`
          await sql.query(updateQuery);

        }

        if (arr[i].Total + 1 == 4) {

          let { recordset: arr1 } = await sql.query(
            `select * from ${Model} where EMPID = ${EMPID}`
          );
    

          let sum = (arr1[i]['Week1'] ? arr1[i]['Week1'] : 0) + (arr1[i]['Week2'] ? arr1[i]['Week2'] : 0) + (arr1[i]['Week3'] ? arr1[i]['Week3'] : 0) + (arr1[i]['Week4'] ? arr1[i]['Week4'] : 0);
          let badge = 0
          if (sum == 4) {
            badge = 1
          }
          await sql.query(
            `update ${Model} set Mon = 0, Tue =0, Wed=0, Thu=0, Fri=0, Sat=0, Sun=0, Week1 = 0 , Week2= 0 , Week3 = 0, Week4 = 0, Total=0, Badge=${badge}  where ID = ${arr1[i].ID}`
          );
        }

      }
      cb(true)
    }

}

exports.BadgeDisappearAfter48Hours = async (Model, cb) => {
  // badge disappers code
  var date1 = new Date();
  var utcDate1 = new Date(date1.toUTCString());
  utcDate1.setHours(utcDate1.getHours() - 7);
  var usDate = new Date(utcDate1)

  const { recordset: arr } = await sql.query(
    `select * from ${Model}`
  );


  for (let i = 0; i < arr.length; i++) {
    if ((usDate - arr[i].ActionTimeStamp) > 0) {
      await sql.query(
        `update ${Model} set AdminAssignedBadge = ${null}, ActionTimeStamp = ${null} where ID = ${arr[i].ID}`
      );
    }
  }

}

exports.ResetDays = async (userModel, Model) => {
    let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    const hours = (new Date(date).getHours())
    const minutes = (new Date(date).getMinutes())
    const day = (new Date(date).getDay())
    const year = (new Date(date).getFullYear())

    if (day == 5 && hours == 23 && minutes == 55) {

      const { recordset: user } = await sql.query(
        `select * from ${userModel}`
      );

      user.map(async (u) => {
        const { recordset } = await sql.query(
          `update ${Model} set Mon = 0, Tue =0, Wed=0, Thu=0, Fri=0, Sat=0, Sun=0 where EMPID = ${u.ID}`
        );
      })
    }
}

exports.Absent = async (calendarModel , userModel, Model, cb) => {
 
    let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    const hours = (new Date(date).getHours())
    const minutes = (new Date(date).getMinutes())
    const day = (new Date(date).getDay())
    const year = (new Date(date).getFullYear())
    var month = (new Date(date).getMonth())
    var currentDate = (new Date(date).getDate())

    var fullDate = year

    if (month < 9) {
      month = ('0' + month + 1)
    } else {
      month = (month + 1)
      fullDate += "-" + month
    }

    if (currentDate < 10) {
      currentDate = ('-0' + currentDate)
      fullDate += currentDate
    } else {
      currentDate = ('-' + currentDate)
      fullDate += currentDate
    }

    if (hours == 23 && minutes == 50) {
      const { recordset: result } = await sql.query(
        `SELECT * FROM  ${calendarModel} WHERE month(WhenPosted) = ${month} and year(WhenPosted)= ${year}`
      );

      let getTodayResults = (result.filter(res => res['WhenPosted'].toISOString().split("T")[0] == fullDate));

      getTodayResults.map(async (res) => {
        const { recordset: user } = await sql.query(
          `select * from ${userModel}  where First = '${res.FirstName}'`
        );

        const EMPID = (user[0].ID)

        let firstDay = user[0].StartDay;
        let lastDay = (days[days.indexOf(firstDay) + 4])

        let workingDays = days.slice(days.indexOf(firstDay), days.indexOf(firstDay) + 5)

        if (workingDays.indexOf(days[day]) < 0) {
          return
        }


    

        await sql.query(
          `update ${Model} set ${days[day]} = 1  where EMPID = ${EMPID}`
        );

        if (days[day] == lastDay) {
          cb(EMPID)
        }

      })
    }
}



exports.UpdateDailyData = async (progressModel, userModel, wqModel) => {


  
  const update =  async () => {
    const { recordset } = await sql.query(
      `select * from ${userModel} where ManagementAccess != 1`
    );

    recordset.map(async (u) => {
      const { recordset: wqList } = await sql.query(
        `select * from ${wqModel} where UserAssigned = '${u.Nickname}'`
      );

      let dP = (wqList.filter(item => item.Status != "Done" && item.Status != "Defer").length / wqList.length);
      let pP = (wqList.filter(item => item.Status == "Done" || item.Status == "Defer").length / wqList.length);

      const list = (wqList.filter(item => item.Status != "Done" && item.Status != "Defer"))

      const amount = list.map(li => li['Sess Amount']).sort((a, b) => b - a).slice(0, 5)
      const agingDays = list.map(item => item['Aging Days'])

      const elements = [...new Set(agingDays)];
      const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

      let data = elements.map((element => {
        return ({
          name: element,
          value: countOccurrences(agingDays, element)
        })
      }))

      const agingDaysData = data.sort((a, b) => b.name - a.name).slice(0, 5)

      await sql.query(
        `update ${progressModel} set ChargesProcessed = ${(pP * 100).toFixed(2)}, ChargesToReview = ${(dP * 100).toFixed(2)} , AgingDays = '${JSON.stringify(agingDaysData)}', Amount = '${JSON.stringify(amount)}' where EMPID = ${u.ID}`
      );
    })
  }

  let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  const hours = (new Date(date).getHours())
  const minutes = (new Date(date).getMinutes())


  if (hours == 5 && minutes == 01) {
    update()
  }

  if (hours == 7 && minutes == 01) {
    // Set Data to graphs WQ
    update()
  }

  

}