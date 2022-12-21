import { parse } from "querystring";
import moment  from "moment-timezone";
function getPageQuery() {
  parse(window.location.href.split("?")[1]);
}


export function get(obj, key) {
  return key.split(".").reduce(function (o, x) {
    return o === undefined || o === null ? o : o[x];
  }, obj);

  
}

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  let a = s.split(".");
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i];
    if (o !== null) {
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    } else {
      return;
    }
  }
  return o;
};

/* 
 To check only if a property exists, without getting its value. It similer get function.
*/
export function has(obj, key) {
  return key.split(".").every(function (x) {
    if (typeof obj !== "object" || obj === null || x in obj === false)
      /// !x in obj or  x in obj === true *** if you find any bug
      return false;
    obj = obj[x];
    return true;
  });
}


export function getDate() {
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


    console.log(hours)
    if (hours < 10) {
      hours = ('0' + hours.toString() )
      console.log(hours)
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


    console.log(fullDate+ "T"+   hours + ":" + minutes + ":" + seconds  + "." + offset + "Z")
    return (fullDate+ "T"+ hours + ":" + minutes + ":" + seconds  + "." + offset + "Z" )

}


export function getDay() {
  const days = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat']
  var date = new Date();
  var utcDate = new Date(date.toUTCString());
  utcDate.setHours(utcDate.getHours());        
  return days [new Date().getDay()]
}




export function formatDate(param) {

  if(param) {
    if(param.includes('/') > 0) {

      return param
    } else {
      let [year, month, date] = param.split('-') 

    date = month + "/" +date+ "/" +year
    return date
    }
       
  }
  return '';
}


export function formatDateTime(date) {
  if (date) {

    if (date.includes('-')) {
      let time = date.split("T")[1]?.substring(0, 8) 

      date = date.split("T")[0] 
      let [year, month, d] = date.split('-') 

      date = month + "/" +d+ "/" +year
      return date + " " + time
      
    } else  if (date.includes('/')){
      let [month, d, year] = date.split('/')
      
      return (year.toString().trim()+ "-" + month.toString().trim() + "-" + d.toString().trim())
    } else {
      return null
    }
     
  } 
  
  return (null)
} 

export  function setInitailDateValue(date) {
  if (!date) {
    return moment().format('MM/DD/YYYY')
  }
}

/* 
 convert indexes to properties
*/
export function valueByString(obj, string, devider) {
  if (devider === undefined) {
    devider = "|";
  }
  return string
    .split(devider)
    .map(function (key) {
      return get(obj, key);
    })
    .join(" ");
}

/*
 Submit multi-part form using ajax.
*/
export function toFormData(form) {
  let formData = new FormData();
  const elements = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;

    if (name && element.dataset.disabled !== "true") {
      if (element.type === "file") {
        const file = element.files[0];
        formData.append(name, file);
      } else {
        const value = element.value;
        if (value && value.trim()) {
          formData.append(name, value);
        }
      }
    }
  }

  return formData;
}

/*
 Set object value in html
*/
export function bindValue(obj, parentElement) {
  parentElement.querySelectorAll("[data-property]").forEach((element) => {
    const type = element.dataset.type;
    let value = valueByString(obj, element.dataset.property);
    switch (type) {
      case "date":
        value = formatDate(value);
        break;

      case "datetime":
        value = formatDatetime(value);
        break;

      case "currency":
        value = value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        break;

      default:
        break;
    }
    element.innerHTML = value;
  });
}

export default getPageQuery;
