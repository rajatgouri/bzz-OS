import React, { useContext, useCallback, useEffect, useState, useRef } from "react";
import {
  Button,
  PageHeader,
  Table,
  Checkbox,
  Input,
  Form,
  notification,
  Radio,
  Popover,
  Select,
  Row,
  Col,
  DatePicker
} from "antd";

// import BarChart from "@/components/Chart/barchat";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";
import { CloseCircleTwoTone } from "@ant-design/icons";
import moment from 'moment';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  IdcardOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import { formatDate } from "@/utils/helpers";
// import { filter } from "@antv/util";

var date = new Date();
var utcDate = new Date(date.toUTCString());
utcDate.setHours(utcDate.getHours());
var usDate = new Date()

const {Option} = Select


export default function DataTable({ config }) {

  const [inCopiedMode, setInCopiedMode] = useState(false);
  const [previousEntity, setPreviousEntity] = useState('');
  let { entity, dataTableColumns, getItems, reload,  getFilterValue, dataTableTitle , userList, showFooter = true, openingModal, confirmModal, AddIcon} = config;
  
  const [users, setUsers] = useState(userList);
  
  useEffect(() => {
    setPreviousEntity(entity)
  }, [entity])


  const newDataTableColumns = dataTableColumns.map((obj) => {

    if (obj.type == "date" ) {
      return ({
        ...obj,
        render: (text, row) => {

          return {
        
            children: (
              <div>
                {text ? formatDate( text.split("T")[0])    : ""}
              </div>
            )
          };
        },
      })
    }

    // if (obj.dataIndex == "Action" ) {
    //   return ({
    //     ...obj,
    //     render: (text, row) => {

    //       return {
        
    //         children: (
    //           <div style={{textAlign: "center"}}>
    //             <span className="actions" >
    //                 <span className="actions">
    //                   <Popover placement="rightTop" content={
    //                     <div>
    //                       <p  className="menu-option" onClick={() => openingModal(row)}><span><EditOutlined /></span> Edit</p>
    //                       <p  className="menu-option" onClick={() => confirmModal(row)}><span><DeleteOutlined /></span>Delete</p>
    //                     </div>
    //                   } trigger="click">
    //                     <EllipsisOutlined />
    //                   </Popover>
    //                 </span>
    //               </span> 
    //           </div>
    //         )
    //       };
    //     },
    //   })
    // }


    // if (obj.dataIndex == "ManagementAccess" ) {
    //   return ({
    //     ...obj,
    //     render: (text, row) => {

    //       return {
        
    //         children: (
    //           <div >
    //             {text } 
    //           </div>
    //         )
    //       };
    //     },
    //   })
    // }

    // if (obj.dataIndex == "AdminAccess" ) {
    //   return ({
    //     ...obj,
    //     render: (text, row) => {

    //       return {
        
    //         children: (
    //           <div >
    //             {text} 
    //           </div>
    //         )
    //       };
    //     },
    //   })
    // }
   

    // if (obj.dataIndex == "DiffinSeconds" ) {
    //   return ({
    //     ...obj,
    //     render: (text, row) => {

    //       return {
        
    //         children: (
    //           <div>
    //             {formatTime(text) }
    //           </div>
    //         )
    //       };
    //     },
    //   })
    // }


    // if (obj.dataIndex == "CMPNY_SENIORITY_DT" ||  obj.dataIndex == "TERMINATION_DT" || obj.dataIndex == "HIRE_DT" || obj.dataIndex == "ORIG_HIRE_DT" || obj.dataIndex == "EFFDT" ) {
    //   return ({
    //     ...obj,
    //     render: (text, row) => {


    //       return {
            
    //         children: (
    //           <div>
    //             {text ? text.split("T")[0] : ""}
    //           </div>
    //         )
    //       };
    //     },
    //   })
    // }

    return ({
      ...obj,
      render: (text, row) => {
        return {
          
          children:
             text,
        };
      },
    })
  });

  var { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  var { pagination, items , filters, sorters } = listResult;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true)
  const [sorter, setSorter] = useState([])
  const [dateValue, setDateValue] = useState(moment())
  const [tableColumns, setTableColumns] = useState([])
  const dateFormat = 'YYYY/MM/DD';


  useEffect(() => {
    setLoading(listIsLoading)
  }, [listIsLoading])



  useEffect(() => {

    if (items.length > 0) {
      getItems(items)
      setDataSource(items)
    }
  }, [items])

  const dispatch = useDispatch();

  const handelDataTableLoad = (pagination, filters = {}, sorter = {}, copied) => {    

  
    let filteredArray = []
    if (sorter.length == undefined && sorter.column) {
      filteredArray.push(sorter)
    } else if (sorter.length > 0) {
      filteredArray = sorter
    }

    
    filteredArray = (filteredArray.map((data) => {
      if(data.column) {
        delete data.column.filters  
      }
      return data
    }))


    setSorter(filteredArray)
    
    const option = {
      page: pagination.current || 1,
      filter: (filters),
      sorter: sorter ? (filteredArray) : JSON.stringify([])
    };

    filters.sort = (filteredArray);

    if (previousEntity == entity) {
      getFilterValue(filters);
    }

    dispatch(crud.list1(entity, option));

  };

  const loadTable = () => {
    
    let filterValue = {};
    
    if(entity == "pageLogger") {
      filterValue= { 'UserName': process == "ALL" ? users.map((user) => user.name): [process] }
    } else if (entity == "epic-productivity" ) {
      filterValue= { 'SubSection': ["PB"], 'WeekEndingDate': dateValue }
    }  else if ( entity == "epic-productivity1" ) {
      filterValue= { 'SubSection': ["PB"] }
    } 
     
    getFilterValue(filterValue);

    const option = {
      page: localStorage.getItem(entity) != 'undefined' && localStorage.getItem(entity) != null ? localStorage.getItem(entity) : 1,
      filter:  filterValue,
      sorter: []
    };


    dispatch(crud.list1(entity, option));

  }

  useEffect(() => {

    items = []
    setDataSource([])
    loadTable()

  }, []);



  useEffect(() => {
   items = []
  },[entity])

  useEffect(() => {

    if(dataSource.length == 0) {
      return 
    }

    if (reload) {



      if (previousEntity == entity) {
        handelDataTableLoad(pagination, filters, sorters)
      } else {
        handelDataTableLoad(pagination, {}, {})
      }

    } else {
      setLoading(true)
    }

  }, [reload])



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


  
  


  return (
    <div className= { "ri_costservices wq-fixed-table "}>
          <Row gutter={[24,24]}>
            <Col span={12}>

            <div style={{ 'display': 'block', 'float': 'left', marginBottom: "20px" }}>
              <h2
                className="ant-page-header-heading-title"
                style={{ fontSize: "36px", marginRight: "18px", width: "170px" }}
              >
                {dataTableTitle}
              </h2>
              </div>
            </Col>
            <Col span={12}  style={{textAlign :"end"}}>
             
            </Col>
          </Row> 
          
      <Table
        columns={columns}
        rowKey="ID"
        rowClassName={(record, index) => {
          return 'wq-rows'
        }}
        scroll={{ y:  'calc(100vh - 20.5em)' }}

        dataSource={dataSource}
        pagination={pagination}
        loading={loading ? true : false}
        // components={components}
        onChange={handelDataTableLoad}
      
        footer={
          () => (
            <Row gutter={[24, 24]} style={{minHeight: "25px "}}>
              <Col style={{ width: "150px" }}>
                
              </Col>
            </Row>
          )
        }
      />
      
    </div>
  );
}
