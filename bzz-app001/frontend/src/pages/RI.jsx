
import React, { useState, useEffect, useRef } from "react";
import { FullCalendarLayout, DashboardLayout } from "@/layout";
import RICostServicesDataTableModule from "@/modules/RICoastDataTableModule";
import { Table, Input, Button, Space , Form, Row, Col , Select, notification} from "antd";
import { request } from "@/request";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { crud } from "@/redux/crud/actions";
import { selectAuth } from "@/redux/auth/selectors";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import Config from "@/components/Editor"

export default function RI() {
  
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [items, setItems] = useState([]);
  
  const [reload, setReload] = useState(true);
 
  const [filters, setFilters] = useState({});

  const {current} = useSelector(selectAuth);
  const [filteredValue, setFilteredValue] = useState({})

  const panelTitle = "RI Cost Services";
  const dataTableTitle = "RI Cost Services";

  const dashboardStyles = {
    content: {
      "boxShadow": "none",
      "padding": "35px 35px 0px 35px",
      "width": "100%",
      "overflow": "auto",
      "background": "#eff1f4",
      "margin": "auto",
    },
    section : {
      maxHeight: "100vh",
      minWidth: "1350px"
    }
  }

  const entity = "ri-costservices"

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          // ref={(node) => {
          //   searchInput = node;
          // }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
   
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };



  const [ID, setID] = useState("");
  var [value, setValue] = useState("");
  const [collapsed, setCollapsed] = useState(false)
  const editor = useRef();


  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
    console.log(sunEditor)
  };

  const onSaveReminder = async () => {

    const resposne = await request.update('billingreminder', ID, {RI: value});
    if(resposne.success) {
      notification.success({message: "RI Updated Successfully!",duration:3})
    }
  }

  const handleChange =(content) => {
    setValue(content)
  }
  

  useEffect(() => {
    (async () => {


      const [resposne, {result}] = await Promise.all([await request.read('billingreminder', 1), await request.list(entity + '-filters')]) ;
      setID(resposne.result[0].ID)
      setValue(resposne.result[0].RI ?  resposne.result[0].RI : "Hello!")        

      let obj = {}
     Object.keys(result).map((o) => {
      obj[o] = ( result[o].map((i) => {      
        return ({text: i[o], value: i[o]})
      }))
     })

     setFilters(obj)
     console.log(obj)

    })()
  }, [])


  const getFilterValue = (values) => {
    setFilteredValue(values)
  }

  const showEditor = () => {
    setCollapsed(!collapsed)
  }

  const getItems = (data) => {

    setItems(data)
  } 


  const dataTableColumns = [
   
    
    {
      title: "Transaction ID",
      dataIndex: "Transaction ID",
      width: 140,
      type:"number",
      ...getColumnSearchProps("Transaction ID"),
      filteredValue: filteredValue['Transaction ID'] || null ,
      sorter: { multiple: 1}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Transaction ID").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Transaction ID")[0].order : null,
    },
    {
      title: "HAR",
      dataIndex: "HAR",
      width: 110,
      type:"number",
      ...getColumnSearchProps("HAR"),
      filteredValue: filteredValue['HAR'] || null ,
      sorter: { multiple: 2}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "HAR").length > 0) ?  filteredValue.sort.filter((value) => value.field == "HAR")[0].order : null,

    },

    {
      title: "Hospital Account",
      dataIndex: "Hospital Account",
      width: 180,
      type:"string",
      ...getColumnSearchProps("Hospital Account"),
      filteredValue: filteredValue['Hospital Account'] || null ,
      sorter: { multiple: 3}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Hospital Account").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Hospital Account")[0].order : null,

    },
    {
      title: "Account Status",
      dataIndex: "Account Status",
      width: 160,
      type:"string",
      filters: filters['Account Status'],
      filteredValue: filteredValue['Account Status'] || null ,
      sorter: { multiple: 4}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Account Status").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Account Status")[0].order : null,


    },
    {
      title: "Account Class",
      dataIndex: "Account Class",
      width: 150,
      type:"string",
      filters: filters['Account Class'],
      filteredValue: filteredValue['Account Class'] || null ,
      sorter: { multiple: 5}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Account Class").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Account Class")[0].order : null,


    },
   
    {
      title: "Financial Class",
      dataIndex: "Financial Class",
      width: 150,
      type:"string",
      filters: filters['Financial Class'],
      
      filteredValue: filteredValue['Financial Class'] || null ,
      sorter: { multiple: 6}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Financial Class").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Financial Class")[0].order : null,

    },
    { title: "Post Date", dataIndex: "Post Date", width: 120, type:"date",
    ...getColumnSearchProps("Post Date"),
      filteredValue: filteredValue['Post Date'] || null ,
      sorter: { multiple: 7}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Post Date").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Post Date")[0].order : null,
    },
    { title: "Service Date", dataIndex: "Service Date", type:"date", width: 140,
    ...getColumnSearchProps("Service Date"),
    filteredValue: filteredValue['Service Date'] || null ,
    sorter: { multiple: 7}, 
    sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Service Date").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Service Date")[0].order : null,
    },
    {
      title: "Procedure",
      dataIndex: "Procedure",
      width: 160,
      type:"string",
      ...getColumnSearchProps("Procedure"),

      filteredValue: filteredValue['Procedure'] || null ,
      sorter: { multiple: 8}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Procedure").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Procedure")[0].order : null,


    },
    {
      title: "Rev Code",
      dataIndex: "Rev Code",
      width: 160,
      type:"string",
      filters: filters['Rev Code'],
      filteredValue: filteredValue['Rev Code'] || null ,
      sorter: { multiple: 9}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Rev Code").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Rev Code")[0].order : null,


    },
    {
      title: "CPT/HCPCS Code",
      dataIndex: "CPT/HCPCS Code",
      width: 160,
      type:"string",
      filters: filters['CPT/HCPCS Code'],
      filteredValue: filteredValue['CPT/HCPCS Code'] || null ,
      sorter: { multiple: 10}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "CPT/HCPCS Code").length > 0) ?  filteredValue.sort.filter((value) => value.field == "CPT/HCPCS Code")[0].order : null,


    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      width: 110,
      type:"string",
      ...getColumnSearchProps("Quantity"),
      filteredValue: filteredValue['Quantity'] || null ,
      sorter: { multiple: 11}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Quantity").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Quantity")[0].order : null,

    },
    {
      title: "Amount",
      dataIndex: "Amount",
      width: 110,
      type:"amount",
      ...getColumnSearchProps("Amount"),
      filteredValue: filteredValue['Amount'] || null ,
      sorter: { multiple: 12}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Amount").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Amount")[0].order : null,


    },
    {
      title: "Location",
      dataIndex: "Location",
      width: 110,
      type:"string",
      filters: filters['Location'],
      filteredValue: filteredValue['Location'] || null ,
      sorter: { multiple: 13}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Location").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Location")[0].order : null,


    },
    {
      title: "Service Area",
      dataIndex: "Service Area",
      width: 150,
      type:"string",
      filters: filters['Service Area'],
      filteredValue: filteredValue['Service Area'] || null ,
      sorter: { multiple: 14}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Service Area").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Service Area")[0].order : null,


    },
  
    {
      title: "Cost Center",
      dataIndex: "Cost Center",
      width: 150,
      type:"string",
      filters: filters['Cost Center'],
      filteredValue: filteredValue['Cost Center'] || null ,
      sorter: { multiple: 15}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Cost Center").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Cost Center")[0].order : null,


    },
  
    {
      title: "Department",
      dataIndex: "Department",
      width: 140,
      type:"string",
      filters: filters['Department'],
      filteredValue: filteredValue['Department'] || null ,
      sorter: { multiple: 16}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Department").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Department")[0].order : null,


    },
    {
      title: "Transaction Source",
      dataIndex: "Transaction Source",
      width: 160,
      type:"string",
      filters: filters['Transaction Source'],
      filteredValue: filteredValue['Transaction Source'] || null ,
      sorter: { multiple: 17}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Transaction Source").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Transaction Source")[0].order : null,


    },
    {
      title: "Transaction Type",
      dataIndex: "Transaction Type",
      width: 140,
      type:"string",
      filters: filters['Transaction Type'],
      filteredValue: filteredValue['Transaction Type'] || null ,
      sorter: { multiple: 18}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Transaction Type").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Transaction Type")[0].order : null,

    },
    {
      title: "Posted User",
      dataIndex: "Posted User",
      width: 160,
      type:"string",
      filters: filters['Posted User'],
      filteredValue: filteredValue['Posted User'] || null ,
      sorter: { multiple: 19}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Posted User").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Posted User")[0].order : null,
    },
    {
      title: "Is Late Charge(Y/N)",
      dataIndex: "Is Late Charge(Y/N)",
      width: 140,
      type:"select",
      filters: [
        { text: 'Y', value: 'Y' },
        { text: 'N', value: 'N' },
        { text: '', value: 'null' }

      ],
      filteredValue: filteredValue['Is Late Charge(Y/N)'] || null ,
      sorter: { multiple: 20}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Is Late Charge(Y/N)").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Is Late Charge(Y/N)")[0].order : null,

    },
    {
      title: "Is Reposted Charge(Y/N)",
      dataIndex: "Is Reposted Charge(Y/N)",
      width: 140,
      type:"select",
      filters: [
        { text: 'Y', value: 'Y' },
        { text: 'N', value: 'N' },
        { text: '', value: 'null' }

      ],
      filteredValue: filteredValue['Is Reposted Charge(Y/N)'] || null ,
      sorter: { multiple: 21}, 
      sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Is Late Charge(Y/N)").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Is Late Charge(Y/N)")[0].order : null,


    }
    
  //   {
  //     title: "Status", width: 80, dataIndex: "Status",
  //     filters: [
  //       { text: "Done", value: "Done" },
  //       { text: "Pending", value: "Pending" },
  //       { text: "Defer", value: "Defer" },
  //       { text: "Misc-I", value: "Misc-I" },
  //       { text: "Misc-II", value: "Misc-II" },
  //       { text: "Review", value: "Review" }
  //     ],
  //     filteredValue: filteredValue['Status'] || null 

  //   },
  //   {
  //     title: "Patient",
  //     dataIndex: "Patient",
  //     width: 220,
  //     ...getColumnSearchProps("Patient"),
  //     filteredValue: filteredValue['Patient'] || null 
  //   },
  //   { title: "IRB",
  //     dataIndex: "Research IRB", 
  //     width: 100, 
  //     // ...getColumnSearchProps("Research IRB"),
  //     filters: 
  //       filteredValue['Process Type'] == "60 Days and Over" ? 
  //         filters['Research IRB-60 Days and Over'] :
  //       filteredValue['Process Type'] == "Under 60 Days" ? 
  //         filters['Research IRB-Under 60 Days']:
  //       filters['Research IRB-Common'],
  //     sorter: { multiple: 4},
  //     sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Research IRB").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Research IRB")[0].order : null, 
  //     filteredValue: filteredValue['Research IRB'] || null 
  //   },
  //   { title: "CPT", 
  //     dataIndex: "CPT Codes", 
  //     width: 110, 
  //     ...getColumnSearchProps("CPT Codes"),
  //     filteredValue: filteredValue['CPT Codes'] || null 
  //   },
  //   { title: "Amount", dataIndex: "Sess Amount", width: 100, sorter: { multiple: 2},
  //     // sortOrder: (filteredValue.sort && filteredValue.sort.column == "Sess Amount") ? filteredValue.sort.order : null,
  //     sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Sess Amount").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Sess Amount")[0].order : null,

  //   },
  //   { title: "Coverage", 
  //     dataIndex: "Primary Coverage", 
  //     width: 350, 
  //     ...getColumnSearchProps("Primary Coverage"), 
  //     filteredValue: filteredValue['Primary Coverage'] || null 

  //   },
  //   { title: "Study Type", dataIndex: "Study Type", width: 160 ,
  //   filters: filteredValue['Process Type'] == "60 Days and Over" ? 
  //         filters['Study Type-60 Days and Over'] :
  //       filteredValue['Process Type'] == "Under 60 Days" ? 
  //         filters['Study Type-Under 60 Days']:
  //       filters['Study Type-Common'],
  //   // filters: [
  //   //   { text: 'Non-Therapeutic', value: 'Non-Therapeutic' },
  //   //   { text: 'Therapeutic', value: 'Therapeutic' }
  //   // ],
  //   filteredValue: filteredValue['Study Type'] || null 
  // },
    
  //   {
  //     title: "Timely",
  //     width: 80,
  //     dataIndex: "Days Until Timely Filing",
  //   },
  //   { title: "Aging", width: 100, dataIndex: "Aging Days", sorter: { multiple: 3},
  //     // sortOrder: (filteredValue.sort && filteredValue.sort.column == "Aging Days") ? filteredValue.sort.order : null,
  //     sortOrder:  ( filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Aging Days").length > 0) ?  filteredValue.sort.filter((value) => value.field == "Aging Days")[0].order : null,
    
  //   },
  //   {
  //     title: "User Assigned", width: 150, dataIndex: "UserAssigned", filters: [
  //       { text: "Anna Maria", value: "Anna Maria" },
  //       { text: "Ferdinand", value: "Ferdinand" },
  //       { text: "Jacqueline", value: "Jacqueline" },
  //       { text: "Jannet", value: "Jannet" },
  //       { text: "Suzanne", value: "Suzanne" },
  //     ],
  //     filteredValue: filteredValue['UserAssigned'] || null 
      
  //   },
    
  //   { title: "User Logged", width: 150, dataIndex: "User" },
  //   {
  //     title: "Start Time", dataIndex: "StartTimeStamp", width: 150, sorter: { multiple: 5 },
  //     sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "StartTimeStamp").length > 0) ? filteredValue.sort.filter((value) => value.field == "StartTimeStamp")[0].order : null,
  //   },
  //   {
  //     title: "Finish Time", dataIndex: "FinishTimeStamp", width: 150, sorter: { multiple: 6 },
  //     sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "FinishTimeStamp").length > 0) ? filteredValue.sort.filter((value) => value.field == "FinishTimeStamp")[0].order : null,
  //   },
  //   {
  //     title: "Duration", dataIndex: "Duration", width: 120, 
  //     ...getColumnSearchProps("Duration"),
  //     filteredValue: filteredValue['Duration'] || null
  //   },

  ];


  const ADD_NEW_ENTITY = "Add new customer";
  const DATATABLE_TITLE = "customers List";
  const ENTITY_NAME = "customer";
  const CREATE_ENTITY = "Create customer";
  const UPDATE_ENTITY = "Update customer";
  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    dataTableColumns,
    getItems,
    reload,
    getFilterValue
  };

  return (
      <div>
<DashboardLayout style={dashboardStyles}>
      {
        value ? 
        <Row gutter={[24, 24]} style={{rowGap: "14px !important" }}>
      <Col className="gutter-row" span={24} style={{marginBottom: "30px"}}>
          <div className="whiteBox shadow" style={{ height: "100%" }}>
            <div
              className="pad20"
            >
               {/* <h3 className="calendar-header" style={{marginBottom: "10px"}}>Management Services</h3> */}
              <Row gutter={[12, 12]} > 
                <Col className="gutter-row reminders-container" span={24}  dangerouslySetInnerHTML={{ __html: value }}>
                    {/* <img src={roadmap1} height="100%" width="100%" style={{ marginBottom: "50px"}}></img> */}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" span={24} style={{height: "calc(100% - 90%)", textAlign: 'right',marginBottom: "15px"}}>
          <Button className="shadow" default onClick={showEditor}>{collapsed ? "Hide" : "Edit" } </Button>
        </Col>
        {
          collapsed ? 
        <Col className="gutter-row" span={24}>
          <div className="whiteBox shadow" style={{ height: "100%", minHeight: "0px" }}>
            <div
              className="pad20"
            >
               {/* <h3 className="calendar-header" style={{marginBottom: "10px"}}>Management Services</h3> */}
              <Row gutter={[12, 12]} className="editor-box-container" >                
                  
                  <Col className="gutter-row" span={24} style={{height: "100%"}}>
                  {/* <img src={roadmap2} height="100%" width="100%" style={{marginTop: "30px", marginBottom: "30px"}}></img> */}
                  <div  style={{height: "100%"}}>
                    <div style={{height: "calc(100% - 30px)"}}>
                      
                        <SunEditor  
                        onChange={handleChange}
                        getSunEditorInstance={getSunEditorInstance}
                        setOptions={{ 
                        font: Config.font,
                        buttonList: Config.buttonList 
                      }} 
                      defaultValue={value}
                      /> 
                      </div>
                        
                         <div className="text-right">
                            <Button type="primary" onClick={onSaveReminder}>Save</Button>
                          </div>
                       
                    </div>
              </Col>
               
              </Row>
            </div>
          </div>
        </Col>
        :
        null }

      </Row>

      : 
      "Loading..."
      }
     
    </DashboardLayout>

   <RICostServicesDataTableModule config={config}></RICostServicesDataTableModule>
      </div>
    
  )
}
