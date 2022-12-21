import React, { useContext, useCallback, useEffect, useState, useRef } from "react";
import {
  Button,
  PageHeader,
  Table,
  Checkbox,
  Dropdown,
  Input,
  Form,
  Badge,
  notification,
  Tabs,
  Radio,
  Popover,
  Row,
  Col
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from "recharts";

// import BarChart from "@/components/Chart/barchat";
import { CaretDownOutlined, CloseOutlined, CopyOutlined, EditOutlined, EyeFilled, ReloadOutlined, SettingOutlined, EllipsisOutlined, IdcardOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";
import { CloseCircleTwoTone, DollarTwoTone , SearchOutlined} from "@ant-design/icons";
import moment from 'moment';
import uniqueId from "@/utils/uinqueId";
import inverseColor from "@/utils/inverseColor";
const EditableContext = React.createContext(null);
let { request } = require('../../request/index')
import LiquidChart from "@/components/Chart/liquid";
import { selectAuth } from "@/redux/auth/selectors";
// import { filter } from "@antv/util";
import CheckerFlags from "../../assets/images/checker-flags.png";
import ProgressChart from "@/components/Chart/progress";
import { getDate, getDay } from "@/utils/helpers";
import WhiteDot from "assets/images/white-dot.png"
import RedDot from "assets/images/red-dot.png"
import Modals from "@/components/Modal";
import {formatDate, formatDateTime} from '@/utils/helpers'




const { TabPane } = Tabs;


var date = new Date();
var utcDate = new Date(date.toUTCString());
utcDate.setHours(utcDate.getHours());
var usDate = new Date()


export default function DataTable({ config }) {

  const inputColorRef = useRef(null);
  const [timer, setTimer] = useState(0)
  const countRef = useRef(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableItemsList, setTableItemsList] = useState([]);
  const [coloredRow, setColoredRow] = useState({});
  const [isDropDownBox, setDropDownBox] = useState(false);
  const [pickerColor, setPickerColor] = useState("#FFFFFF");
  const [colorIndex, setColorIndex] = useState(null);
  const [status, setStatus] = useState("Done")
  const [colorList, setColorList] = useState([]);
  const [EMPID, setUserID] = useState(1);
  const [month, setMonth] = React.useState(moment().month() + 1)
  const [year, setYear] = React.useState(moment().year())
  const [amountList, setAmountList] = useState([]);
  const [inCopiedMode, setInCopiedMode] = useState(false);
  const [previousEntity, setPreviousEntity] = useState('');
  const [startTime, setStartTime] = useState()
  const [selectedRowID, setSelectedRowID] = useState();
  const [activeButton, setActiveButton] = useState();
  const [openModal, setOpenModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  let { entity, dataTableColumns, dataTableTitle, onhandleSave, openEditModal, openAddModal, openingModal,getItems, reload, progressEntity, workEntity, onWorkSaved, onCopied, getFilterValue, showProcessFilters, userList, onRowMarked, getFullList, openFindModal, updateTime, logger } = config;

  const [users, setUsers] = useState(userList)
  const [process, setProcess] = useState(entity == "wq1075" ? '60 Days and Over' : 'Expedite');

  const getCurrentDate = () => {
    console.log(getDate())
   return getDate()
  }
  
  const handleStart = async  (id) => {
    
    if(selectedRowID != null ) {
      setActiveButton(null) 
      clearInterval(countRef.current)
      setSelectedRowID(null)
      setStartTime(null)
      setTimer(0)
      return 
    }
  
    setActiveButton(id)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  
    setSelectedRowID(id);
  
    let date = getCurrentDate();  
    setStartTime(date);

    updateTime(id, {StartTimeStamp: date}, () => {
      (dataSource)
    }, 'Start')  
  }
  
  
  const handleReset = (id) => {
    
    if(selectedRowID != id ) {
      return 
    }
  
    let date = getCurrentDate()
  
    setActiveButton(null) 
    updateTime(id, {FinishTimeStamp: date, Duration: (new Date(date) - new Date(startTime)).toString()}, () => {
        setShowModal(true)
    }, 'Stop')

    // clearInterval(countRef.current)
    // // setSelectedRowID(null)
    // setStartTime(null)
    // setTimer(0)
  }
  
  const formatTime = (timer) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)
  
    return (
      <div className="timer-box-container">
      <span className="time-box">{getHours}</span> <span className="time-box">{getMinutes}</span>  <span className="time-box">{getSeconds}</span> 
  
      </div>
    )
  }
  
  const formatTime1 = (timer) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)
  
    return (
      <div>
      <span >{getHours} </span> :  <span>{getMinutes}</span> : <span>{getSeconds}</span> 
  
      </div>
    )
  }
  
  

  useEffect(() => {
    setPreviousEntity(entity)
    setDataSource([])
  }, [entity])
  /***************/
  const handleColorChange = (color) => {
    const tmpObj = {};
    selectedRowKeys.map((x) => {
      tmpObj[x] = color;
    });



    clearInterval(countRef.current)
    setSelectedRowID(null)
    setStartTime(null)
    setTimer(0)
    
    let data = colorList.filter(list => list.color == color)[0]
    // saves the color to database //
    config.onHandleColorChange(selectedRowKeys, data)

    setColoredRow({ ...coloredRow, ...tmpObj });
    setSelectedRowID(null)
    setOpenModal(false)
    setSelectedRowKeys([]);
  };

  const load = async () => {
    const { result = [] } = await request.listinlineparams('billingcalendarstaff', { month, year, date_column: 'WhenPosted' })
    // let currentDate = new Date().toISOString().split('T')[0];

    let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    const y = (new Date(date).getFullYear())
    var m = (new Date(date).getMonth())
    var d = (new Date(date).getDate())

    var fullDate = y

    if (m < 9) {
      m = ('0' + m + 1)
    } else {
      m = (m + 1)
      fullDate += "-" + m
    }


    if (d < 10) {
      d = ('-0' + d)
      fullDate += d
    } else {
      d = ('-' + d)
      fullDate += d
    }

    let getTodayResults = (result.filter(res => res['WhenPosted'].split("T")[0] == fullDate));

    console.log(getTodayResults)
    console.log(users)

    const foundOnCalendar = getTodayResults.map(c => {
      return users.findIndex((el) => {
        console.log(el)
        return el.EMPID == c.EMPID
      })
    })

    for (let i = 0; i < foundOnCalendar.length; i++) {
      if (foundOnCalendar[i] >= 0) {
        let userList = users;

        userList[foundOnCalendar[i]].status = 'error'
        setUsers(userList)
      }
    }
  }

  React.useEffect(() => {
    load();

  }, [month, year])




  function ColorListBox({ colorsList, show }) {

    const onDefault = () => {
      config.getDefaultColors((colors) => {
        setColorList(colors)
        onSaveColors(colors)
      })
    }

    const onChangeColorPicker = (e) => {
      if (colorList[colorIndex].color !== '#FFFFFF') {
        setPickerColor(e.target.value)
        if (colorIndex == null || e.target.value.substring(0, 2) == "#f") return

        colorList[colorIndex].color = e.target.value;
        setColorList(colorList)
      }
    };

    const onSelectColor = (index, color) => {

      setColorIndex(index);
      setPickerColor(color);
      setStatus(colorList[index].text)
      handleColorChange(color);
      makeSelectedHightlight(index)
    }

    const makeSelectedHightlight = (index) => {
      let list = colorList;
      for (let i = 0; i < colorList.length; i++) {
        list[i].selected = false
      }
      list[index].selected = true;
    }

    const colorsButton = colorsList.map((element, index) => {
      let borderStyleColor = "lightgrey"
      return (
        <div className="colorPicker" key={uniqueId()}>
          <div style={{ marginBottom: "5px", fontSize: "9px", fontWeight: element.text == "Review" ? "bold" : "" }} className="digital"> {('000' + element.total).substr(-3)}</div>
          <Button
            type="primary"
            shape="circle"
            style={{
              background: element.color,
              borderColor: element.selected ? '#000000' : borderStyleColor,
              margin: "auto",
              marginBottom: "5px",
              display: element.text == "Review" ? "block" : "inline-block"

            }}
            onClick={(e) => {
              onSelectColor(index, element.color)
            }}
          >
            &nbsp;
          </Button>
          <span >{element.text}</span>
        </div>
      );
    });

    


    const onCloseColor = () => {
      config.getPreviousColors()
      setColorIndex(null)
      setPickerColor("#FFFFFF")
      setStatus("Done")
      setDropDownBox(!isDropDownBox)
    }

    const onSaveColors = (colors) => {

      const data = {
        Color1: colors[0].color,
        Color2: colors[1].color,
        Color3: colors[2].color,
        Color4: colors[3].color,
        Color5: colors[4].color,
        Color6: "#FFFFFF",
        Category1: colors[0].text,
        Category2: colors[1].text,
        Category3: colors[2].text,
        Category4: colors[3].text,
        Category5: colors[4].text,
        Category6: 'Review'
      }

      config.handleSaveColor(EMPID, data);
      onCloseColor()

    }


    return (
      <>
        {
          show ? 

          <div style={{ 'display': 'block', 'float': 'left' }}>
          <div>
          <h2
            className="ant-page-header-heading-title"
            style={{ fontSize: "36px", marginRight: "18px", width: "170px" }}
          >
            {dataTableTitle}
          </h2>
          </div>
          <div style={{marginTop: "-32px"}}>
            <div className="timer-container">
                <div className="timer">
                  <p style={{marginBottom: "3px"}}>{formatTime(timer)}</p>
                </div>
              </div>
          </div> 
        </div>

        : null
        }
        

        <div style={{ display: "inline-block", position: "relative", width: "375px" }} className="color-box">
          {colorsButton}
        </div>

      </>
    );
  }

  function MakeNewColor({ colorsList }) {

    if(colorList.length > 0) {

    const onDefault = () => {
      config.getDefaultColors((colors) => {
        setColorList(colors)
        onSaveColors(colors)
      })
    }

    const onChangeColorPicker = (e) => {
      if (colorList[colorIndex].color !== '#FFFFFF') {
        setPickerColor(e.target.value)
        if (colorIndex == null || e.target.value.substring(0, 2) == "#f") return

        colorList[colorIndex].color = e.target.value;
        setColorList(colorList)
      }
    };

    const onSelectColor = (index, color) => {

      setColorIndex(index);
      setPickerColor(color);
      setStatus(colorList[index].text)
      handleColorChange(color);
      makeSelectedHightlight(index)
    }

    const makeSelectedHightlight = (index) => {
      let list = colorList;
      for (let i = 0; i < colorList.length; i++) {
        list[i].selected = false
      }
      list[index].selected = true;
    }

    const colorsButton = colorsList.map((element, index) => {
      let borderStyleColor = "lightgrey"
      return (
        <div className="colorPicker" key={uniqueId()}>
          <div style={{ marginBottom: "5px", fontSize: "9px", fontWeight: element.text == "Review" ? "bold" : "" }} className="digital"> {('000' + element.total).substr(-3)}</div>
          <Button
            type="primary"
            shape="circle"
            style={{
              background: element.color,
              borderColor: element.selected ? '#000000' : borderStyleColor,
              margin: "auto",
              marginBottom: "5px",
              display: element.text == "Review" ? "block" : "inline-block"

            }}
            onClick={(e) => {
              onSelectColor(index, element.color)
            }}
          >
            &nbsp;
          </Button>
          <span >{element.text}</span>
        </div>
      );
    });

    const popUpContent = (
      <div className="dropDownBox">
        <div >
          <span className="float-left"></span>
          <span className="float-right padding-right padding-top" >
            <CloseOutlined onClick={() => onCloseColor()} />
          </span>
        </div>

        <div className="pad20" style={{ width: "400px", height: "180px", marginTop: "20px" }}>
          <div >{colorsButton}</div>
          <div >

            <input
              type="color"
              autoFocus
              ref={inputColorRef}
              value={pickerColor}
              onChange={onChangeColorPicker}
              style={{
                width: "94%",
                marginBottom: '18px',
                marginTop: '5px',
                float: "left",
                marginLeft: "10px"
              }}
            />
            <Button style={{ float: "left" }} type="link" onClick={() => onDefault()}>Reset to Default Colors</Button>
            <Button style={{ float: "right", marginRight: "12px" }} type="primary" className="mb-1" onClick={() => onSaveColors(colorList)}>Save</Button>
          </div>

        </div>
      </div>
    );


    const onCloseColor = () => {
      config.getPreviousColors()
      setColorIndex(null)
      setPickerColor("#FFFFFF")
      setStatus("Done")
      setDropDownBox(!isDropDownBox)
    }

    const onSaveColors = (colors) => {

      console.log(colorList)
      console.log(colors)

      const data = {
        Color1: colors[0].color,
        Color2: colors[1].color,
        Color3: colors[2].color,
        Color4: colors[3].color,
        Color5: colors[4].color,
        Color6: "#FFFFFF",
        Category1: colors[0].text,
        Category2: colors[1].text,
        Category3: colors[2].text,
        Category4: colors[3].text,
        Category5: colors[4].text,
        Category6: 'Review'
      }

      config.handleSaveColor(EMPID, data);
      config.getPreviousColors()
      onCloseColor()

    }

    const handleDropDownClick = () => {
      if (selectedRowID) {
        return
      }
      
      setDropDownBox(!isDropDownBox);
    };

    return (
      <>
        <div >

          <Dropdown
            overlay={popUpContent}
            trigger={["click"]}
            visible={isDropDownBox}
            // onVisibleChange={openColorBox}
            onClick={handleDropDownClick}
          >
            <Button shape="circle" style={{marginTop: "5px"}} icon={<SettingOutlined />} />
          </Dropdown>
        </div>

      </>
    );
    }
  }


  function copy(id, textToCopy) {
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
      notification.success({ message: "MRN Copied!", duration: 3 })
      onCopied(id, textToCopy)
      onCopiedEvent(textToCopy)
      // handelDataTableLoad(1,  {'Patient MRN': textToCopy}, {})

      // handelDataTableLoad()
      // setSelectedRowKeys([id]);



    });
  }

  const onCopiedEvent = (textToCopy) => {
    console.log(filters)
    handelDataTableLoad(1, { ...filters,  'Patient MRN': [textToCopy] }, sorters)
    setInCopiedMode(true)
  }

  const newDataTableColumns = dataTableColumns.map((obj) => {

    if (obj.dataIndex == "Notes") {
      return ({
        ...obj,
        render: (text, row) => {
          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
              },
            },
            children: (
              <div>
                <EditOutlined onClick={() => openEditModal(row.ID, false, "")} />  {text ? <EyeFilled onClick={() => openAddModal(row.ID)} style={{ marginLeft: "10px" }} /> : ""}
              </div>
            )
          };
        },
      })
    }

    if (obj.type == "date" ) {
      return ({
        ...obj,
        render: (text, row) => {
          return {            
            children: (
              <div>
                {text ? 
                formatDate(text.toString().split('T')[0])
                 : null }
              </div>
            )
          };
        },
      })
    }

    if (obj.dataIndex == "Archive") {
      return ({
        ...obj,
        render: (text, row) => {
          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
              },
            },
            children: (
              <div>
                {text ? "Yes" : ""}
              </div>
            )
          };
        },
      })
    }

    if (obj.type == "datetime" ) {
      return ({
        ...obj,
        render: (text, row) => {
          return {        
               
            children: (
              <div>

                {text ? 
                 formatDateTime(text)
                 : null }
              </div>
            )
          };
        },
      })
    }

    if (obj.dataIndex == "Action" ) {
      return ({
        ...obj,
        render: (text, row) => {

          return {
        
            children: (
              <div style={{textAlign: "center"}}>
                <span className="actions" >
                    <span className="actions">
                      <Popover placement="rightTop" content={
                        <div>
                          <p  className="menu-option" onClick={() => openingModal(row)}><span><EditOutlined /></span> Edit</p>
                          {
                            row['Archive'] ? 
                        
                            <p  className="menu-option" onClick={() => openEditModal(row.ID, true,"")}><span><DeleteOutlined /></span> UnArchive</p>

                            : 
                          <p  className="menu-option" onClick={() => openEditModal(row.ID, true,1)}><span><DeleteOutlined /></span> Archive</p>
                          }
                        </div>
                      } trigger="click">
                        <EllipsisOutlined />
                      </Popover>
                    </span>
                  </span> 
              </div>
            )
          };
        },
      })
    }

    
    if ( obj.dataIndex == "WorkDate" || obj.dataIndex == "WeekEndDate" || obj.dataIndex == "StatementDate"  ) {
      return ({
        ...obj,
        render: (text, row) => {

          let date = ''

          if(text) {
            date = text.split('T')[0].split('-')[1] + "-" + text.split('T')[0].split('-')[2] + "-" + text.split('T')[0].split('-')[0]  
          }


          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
              },
            },
            children: (
              <div>
                {date}
              </div>
            )
          };
        },
      })
    }

    if (obj.dataIndex == "Error") {
      return ({
        ...obj,
        render: (text, row) => {

          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
                textAlign: "center"
              },
            },
            children: (
              <div>
                {text ? <img src={RedDot} width="9px" onClick={() => onRowMarked(row, true)} /> : <img src={WhiteDot} width="10px" onClick={() => onRowMarked(row, false)} />}
              </div>
            )
          };
        },
      })
    }

    if (obj.dataIndex == "RTRate" || obj.dataIndex == "OTRate" || obj.dataIndex == "InvoicedNet"  ) {
      return ({
        ...obj,
        render: (text, row) => {

          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
              },
            },
            children: (
              <div>
                ${text? text : 0}
              </div>
            )
          };
        },
      })
    }

    if (obj.dataIndex == "UploadDateTime" || obj.dataIndex == "ActionTimeStamp") {
      return ({
        ...obj,
        render: (text, row) => {


          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
              },
            },
            children: (
              <div>
                {text ? text.split("T")[0] + " " + text.split("T")[1]?.substring(0, 8) : ""}
              </div>
            )
          };
        },
      })
    }

    if (obj.dataIndex == "Patient MRN") {
      return ({
        ...obj,
        render: (text, row) => {
          return {
            props: {
              style: {
                background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
                color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
              },
            },
            children: (
              <div>
                {text} <CopyOutlined onClick={() => copy(row.ID, text)} />
              </div>
            )
          };
        },
      })
    }


    return ({
      ...obj,
      render: (text, row) => {
        return {
          props: {
            style: {
              background: coloredRow[row.ID] ? coloredRow[row.ID] : "",
              color: coloredRow[row.ID] ? inverseColor(coloredRow[row.ID]) : "",
            },
          },
          children:
            typeof text === "boolean" ? <Checkbox checked={text} /> : text,
        };
      },
    })
  });

  var { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  var { pagination, items, filters, sorters } = listResult;
  const [dataSource, setDataSource] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [donePercent, setDonePercent] = useState(1);
  const [processPercent, setProcessPercent] = useState(0);
  const { current } = useSelector(selectAuth);
  const [selectedID, setSelectedID] = useState(0);
  const [user, setUser] = useState({});
  const [amountToReview, setAmountToReview] = useState([])
  const [loading, setLoading] = useState(true)
  const [MRNFilter, setMRNFilter] = useState(false)
  var mrnFilterValue = false

  useEffect(() => {
    setLoading(listIsLoading)
  }, [listIsLoading])

  useEffect(() => {
    if (config.dataTableColorList && items && items.length > 0) {
      let list = config.dataTableColorList
      list = list.map(li => {
        if (li.color == "#FFFFFF") {
          li.total = items.filter(item => item.Status === li.text || item.Status === null || item.Status === "").length
          return li
        }
        li.total = items.filter(item => item.Status === li.text).length
        return li
      })

      setColorList(list)
      // localStorage.setItem('MRNFilter', 0)
    }
  }, [config, items])


  useEffect(() => {

    if (config.dataTableColorList && items && items.length == 0) {

      let list = config.dataTableColorList
      list = list.map(li => {
        li.total = 0
        return li
      })
      
      setColorList([...list])
    }
  }, [config])


  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  const preparebarChartData = async (elements, items, dP, pP, amount, checkmark) => {


    let data = elements.map((element => {
      return ({
        name: element,
        value: countOccurrences(items, element)
      })
    }))

    const sortedData = data.sort((a, b) => b.name - a.name).slice(0, 5)


    setChartData(sortedData)

    // get aging days
    if (workEntity == "wq1075Work" && localStorage.getItem('day') != getDay()) {
      localStorage.setItem('day', getDay());
      await request.update("wq1075Work", current.EMPID, { Amount: JSON.stringify(amount), AgingDaysCount: 10, AmountCount: 10 });
    }

    if (!current.managementAccess) {

      // // saving work
      if (checkmark == 1 && workEntity == "wq5508Work") {
        onWorkSaved()
      }

      // saving progress
      dispatch(crud.create(progressEntity, { ChargesProcessed: (pP * 100).toFixed(2), ChargesToReview: (dP * 100).toFixed(2), AgingDays: JSON.stringify(sortedData), Amount: JSON.stringify(amount.slice(0, 5)) }));
    }

  }

  // set Default color to each row //
  const setRowBackgroundColor = (items) => {
    const tmpObj = {};
    items.map(({ ID, Color }) => {
      tmpObj[ID] = Color
    });

    setColoredRow({ ...coloredRow, ...tmpObj });
  }

  useEffect(() => {

    if (items.length > 0) {
      setRowBackgroundColor(items)
      getItems(items)
      setDataSource(items)
      if(selectedRowID) {
        setSelectedRowKeys([selectedRowID])
      }
      if (inCopiedMode) {
        selectAllRows(items)
      }
    } else {
      setDataSource([])
      getItems(items)

    }
  }, [items])


  const selectAllRows = (items) => {
    setSelectedRowKeys(items.map((item) => item.ID))
  }

  const getPercentage = (fullList = []) => {

    console.log(fullList)
    if (fullList ) {

      let chargesProcessedCount = fullList.data.chargesProcessedCount[0]["count"]/fullList.data.total[0]["count"]
      let chargesToReviewCount = fullList.data.chargesReviewCount[0]["count"]/ fullList.data.total[0]["count"]
      let list = fullList.data.notToReview
      let checkmark = fullList.data.chargesReview
      
      setDonePercent(chargesToReviewCount)
      setProcessPercent(chargesProcessedCount)

      const amount = list.map(li => li['Sess Amount']).sort((a, b) => b - a).slice(0, 5)
      const amountReview = list.map(li => li['Sess Amount']).sort((a, b) => b - a).slice(0, 10)
      setAmountList(amount)
      setAmountToReview(amountToReview)

      let agingDays = list.map(item => item['Aging Days'])
      let elements = [...new Set(agingDays)];
      setChartData([])
      preparebarChartData(elements, agingDays, chargesToReviewCount, chargesProcessedCount, amountReview, checkmark)

    }

  }


  const dispatch = useDispatch();

  const handelDataTableLoad = async (pagination, filters = {}, sorter = {}, copied) => {

    delete filters['Process Type']
    setSelectedRowKeys([])
    
    if (inCopiedMode && !filters['Patient MRN']) {
      setInCopiedMode(false)
    }



    let filteredArray = []
    if (sorter.length == undefined && sorter.column) {
      filteredArray.push(sorter)
    } else if (sorter.length > 0) {
      filteredArray = sorter
    } 


    filteredArray = (filteredArray.map((data) => {
      if(data?.column?.filters ) {
        delete data.column.filters
      }
      
      return data
    }))


    const option = {
      page: pagination.current || 1,
      filter: JSON.stringify(filters) || JSON.stringify({}),
      sorter: sorter ? JSON.stringify(filteredArray) : JSON.stringify([]),
    };

    

    dispatch(crud.list(entity, option));

    filters.sort = (filteredArray);

    if (previousEntity == entity) {
      getFilterValue(filters);
    }


    (async () => {
      const responseForFilterQuery = await request.list(entity + "-filters");
      getFullList(responseForFilterQuery.result)
    })()
  };

  const loadTable = () => {


    items = []
    setDataSource([])


    let filterValue = {}
    let sortValue =[]
    
    const option = {
      page: localStorage.getItem(entity) != 'undefined' && localStorage.getItem(entity) != null ? localStorage.getItem(entity) : 1,
      filter: JSON.stringify(filterValue),
      sorter: JSON.stringify(sortValue)
    };

    filterValue.sort = sortValue
    getFilterValue(filterValue)

    dispatch(crud.list(entity, option));

    (async () => {

      const responseForFilterQuery = await request.list(entity + "-filters");
      getFullList(responseForFilterQuery.result)

    })()

  }

  useEffect(() => {

    loadTable()

  }, []);



  useEffect(() => {

    if (dataSource.length == 0) {
      return
    }

    if (reload && inCopiedMode) {

      console.log(MRNFilter)
      console.log('***********************')
      // debugger
      if(!MRNFilter) {
        delete filters['Patient MRN']
       

        sorters = [{
            field: "Sess Amount",
            order: "descend"
          }]  
      } 

      
      if (sorters.filter(sort => sort.field == "Sess Amount").length == 0) {
          sorters.push({
            field: "Sess Amount",
            order: "descend"
          })
      } 
      
      setInCopiedMode(false)

      if (previousEntity == entity) {
        handelDataTableLoad(pagination, filters, sorters)
      }

    } else if (reload) {

      if (previousEntity == entity) {

        handelDataTableLoad(pagination, filters, sorters)
      } else {
        handelDataTableLoad(pagination, {}, {})
      }

    } else {
      setLoading(true)
    }

  }, [reload])

  useEffect(() => {

    const listIds = items.map((x) => x.ID);
    setTableItemsList(listIds);

    if(showModal){
      setOpenModal(true)
      setShowModal(false)
    }


  }, [items]);



  const [firstRow, setFirstRow] = useState();

  const [onSelect, setSelect] = useState(false);
  const onClickRow = (record, rowIndex) => {
    return {
      onClick: () => {
        setSelectedID(record.ID)


        if(inCopiedMode) {
          console.log('Here...')
          setMRNFilter(true)
          localStorage.setItem('MRNFilter', 1) 
          setTimeout(()=> setMRNFilter(true), 10) 


        } else {
          console.log('There...')

          setMRNFilter(false)
          setTimeout(()=> setMRNFilter(false), 10) 
          localStorage.setItem('MRNFilter', 0) 
        
        }



      },
      onMouseDown: (e) => {
        setFirstRow(rowIndex);
        setSelectedRowKeys([record.ID]);

        if(inCopiedMode) {
          console.log('Here...')
          setMRNFilter(true)
          localStorage.setItem('MRNFilter', 1) 
          setTimeout(()=> setMRNFilter(true), 10) 


        } else {
          console.log('There...')

          setMRNFilter(false) 
          localStorage.setItem('MRNFilter', 0) 
          setTimeout(()=> setMRNFilter(false), 10) 
        

        }
        

        setSelect(true);

      },
      onMouseEnter: () => {
        if (onSelect) {
          let tableList = []

          if (tableItemsList.length > 100) {

            tableList = (tableItemsList.filter(list => {
              return (tableItemsList.indexOf(list) < (pagination.current * 100) && tableItemsList.indexOf(list) > ((pagination.current - 1) * 100) - 1)
            }))

            const selectedRange = tableList.slice(firstRow, rowIndex + 1);
            setSelectedRowKeys(selectedRange);

          } else {
            tableList = tableItemsList
            const selectedRange = tableList.slice(firstRow, rowIndex + 1);
            setSelectedRowKeys(selectedRange);

          }
        }

        
      },
      onMouseUp: () => {
        setSelect(false);

        
      },
      onDoubleClick: () => {
        console.log(selectedRowKeys)
        setOpenModal(true)

        // openModal(true)
      }

    };
  };

  const handelColorRow = (checked, record, index, originNode) => {
    return {
      props: {
        style: {
          background: coloredRow[record.ID] ? coloredRow[record.ID] : "",
        },
      },
      // children: originNode,
    };
  };

  const onSelectChange = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    columnWidth: 0,
    renderCell: handelColorRow,
    selectedRowKeys: selectedRowKeys,
  };


  const columns = newDataTableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const handleSave = (row) => {
    const newData = [...items];
    const index = newData.findIndex((item) => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData)
    onhandleSave(row)

    setTimeout(() => handelDataTableLoad({}), 2000)
  }



  const onProcessChanged = (e) => {
    const value = e.target.value;
    setProcess(value)
    handelDataTableLoad(1, { 'Process Type': [value] }, {})
  }

  const barChartConfig = {
    width: 115,
    height: 95,
    data: chartData,
    style: {
      display: "inline-block",
      marginRight: "5px",
      marginTop: "10px"
    }
  }


  const handleCancel = () => {
    setOpenModal(false)
  }

  const modalConfig = {
    title: "",
    openModal,
    handleCancel
  };

  return (
    <div className="wq-table">
      <PageHeader
        style={{
          "padding": "0px",
          "marginTop": "-5px",
          "marginBottom": "10px"
        }}
        ghost={false}
        tags={  
          <h2
            className="ant-page-header-heading-title font-special"
            style={{ fontSize: "36px", height: "45px", marginRight: "18px", width: "170px" }}
          >
            Invoiced Timesheets 
          </h2>
          
        }
        extra={[
          <div className="text-right flex ">
           
            <div style={{ display: "block" }}>
              <Button style={{display: 'inline-block'}} size="small"  onClick={() => openingModal()}  key={`${uniqueId()}`}>
                <IdcardOutlined />
              </Button>
              <Button style={{display: 'inline-block', marginLeft: "10px"}} size="small"  onClick={() => loadTable()}  key={`${uniqueId()}`}>
                <ReloadOutlined />
              </Button>
           
            </div>
          </div>
        ]}
        style={{
          padding: "0px 0px 0px",
          marginTop: "-5px",
          marginBottom: "10px"
        }}
      ></PageHeader>
      <Table
        columns={columns}
        rowKey="ID"
        rowSelection={rowSelection}
        onRow={onClickRow}
        
        scroll={{ y: 'calc(100vh - 21.3em)' }}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading ? true : false}
        // components={components}
        onChange={handelDataTableLoad}
        footer={
          () => (
            <Row gutter={[24, 24]} style={{ rowGap: "0px" }}>
              {/* <Col style={{ "width": "100%" }}>
                <div className="text-center" style={{marginTop: "-4px"}}>
                  <Button type="text" id="scroller">
                    <CaretDownOutlined />
                  </Button>
                </div>
              </Col>
              <Col style={{ width: "100%" }}>
                {
                  showProcessFilters ?
                    <div>
                      {
                        entity == "wq1075" ?
                          <Radio.Group value={process} onChange={onProcessChanged}>
                            <Radio.Button value="60 Days and Over" className="box-shadow">60 Days and Over</Radio.Button>
                            <Radio.Button value="Top 10 $ Amount" className="mr-3 box-shadow">$ Amount (Top 10) </Radio.Button>
                            <Radio.Button value="Top 10 Aging Days" className="mr-3 box-shadow">Aging Days (Top 10)</Radio.Button>
                            {current.name == 'Ferdinand' ?
                              <Radio.Button value="Non-Therapeutic" className="mr-3 box-shadow">Non-Therapeutic</Radio.Button>
                              : null
                            }
                            <Radio.Button value="Under 60 Days" className="mr-3 box-shadow">Under 60 Days</Radio.Button>
                          </Radio.Group>
                          :
                          <Radio.Group value={process} onChange={onProcessChanged}>
                            <Radio.Button value="Expedite" className="box-shadow">Expedite</Radio.Button>
                            <Radio.Button value="Standard" className="mr-3 box-shadow">Standard</Radio.Button>

                          </Radio.Group>
                      }

                    </div>
                    : null
                }
              </Col>

              <Col span={4}>

              </Col> */}

            </Row>
          )
        }
      />


      <Modals config={modalConfig}>
        <div className="color-box-container">
        {
          colorList.length > 0 ?
            <ColorListBox colorsList={colorList} show={false}/>
          : null

        }
        </div> 
        
      </Modals>  
      <div style={{ marginTop: "-30px" }}>
      </div>
    </div>


  );
}
