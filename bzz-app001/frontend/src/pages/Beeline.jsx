
import React, { useState, useEffect } from "react";

import FullDataTableModule from "@/modules/FullDataTableModule";
import { Table, Input, Button, Space, Form, Row, Col, Select, notification, DatePicker, Typography, Divider } from "antd";
import Highlighter from "react-highlight-words";
import { EyeOutlined, SearchOutlined , PlusOutlined, ConsoleSqlOutlined} from "@ant-design/icons";
import { crud } from "@/redux/crud/actions";
import { useDispatch, useSelector } from "react-redux";
import Modals from "@/components/Modal";
import TextArea from "rc-textarea";
let { request } = require('../request/index');
import { selectAuth } from "@/redux/auth/selectors";
import WhiteDot from "assets/images/white-dot.png"
import RedDot from "assets/images/red-dot.png"
import Socket from "../socket";
import moment from "moment";
import UpdateForm from "@/components/UpdateForm";
import { formatDate, formatDateTime, getDate } from "@/utils/helpers";

const { Option } = Select;

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Beeline() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataTableColorList, setDataTableColorList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("");
  const [items, setItems] = useState([]);
  const [editForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [reload, setReload] = useState(true);
  const [selectedRow, setSelectedRow] = useState("");
  const [loaded, setLoaded] = useState(false)
  const [filters, setFilters] = useState({});
  const [hasFilters, setHasFilters] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const dateFormat = 'YYYY/MM/DD';
  const dateFormatDatePicker = ['MM/DD/YYYY', 'MM-DD-YYYY'];
  
  const [WorkDate, setWorkDate] = useState();
  const [WeekEndDate, setWeekEndDate] = useState();
  const [StatementDate, setStatementDate] = useState();
  const [mode, setMode] = useState('ADD');
  const [errors, setErrors] = useState({})
  const [deleteValue, setDeleteValue] = useState('')

  var date = new Date();
  var utcDate = new Date(date.toUTCString());
  utcDate.setHours(utcDate.getHours());
  var usDate = getDate();

  const currentDate = usDate

  // const currentDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
  const { current } = useSelector(selectAuth);
  const [currentUser, setCurrentUser] = useState();
  const [filteredValue, setFilteredValue] = useState({})
  const [contractors, setContractors] = useState([])
  const [currentContractor,setCurrentContractor] = useState({})
  const [hiringManager, setHiringManager] = useState([])
  const [previous, setPrevious] = useState(true)

  const dispatch = useDispatch()


  const [name, setName] = useState('');

  const onNameChange = event => {
    setName(event.target.value);
  };

  const addItem = (e, entity) => {
    e.preventDefault();

    if(name.trim() == "") {
      return
    }

    let exists = filters[entity].filter((f) => f.value == name)
    if(exists.length == 0) {
      filters[entity].push({text: name, value: name})
    }
    
    setFilters({...filters})
    setName('');
  };

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
    onFilter: (value, record) => {

      return record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : ""
    },

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

  const entity = "beeline";
  const onhandleSave = (data) => {
    dispatch(crud.update(entity, data.ID, { notes: data.Notes }))

    onNotesAction(data.ID, 'Update Note')
    setReload(false)
    setTimeout(() => setReload(true), 1000)
  }


  const onNotesAction = (id, status) => {
    let item = items.filter((item) => item.ID == id)[0]

    // dispatch(crud.create(loggerEntity, { IDWQ5508: id, UserName: current.name, MRN: item['Patient MRN'],Status: status, DateTime: currentDate }))
  }


  useEffect(() => {
   
  }, [])

  const onHandleColorChange = async (selectedRows, data) => {

    if (selectedRows.length > 0) {
      setReload(false)

      const timer = () => new Promise(res => setTimeout(res, 100))
      for (var i = 0; i < selectedRows.length; i++) {

        let item = items.filter((item) => item.ID == selectedRows[i])[0]

        await dispatch(crud.update(entity, selectedRows[i], { Color: data.color, Status: data.text, ActionTimeStamp: currentDate, User: current.name }))
        await dispatch(crud.create(loggerEntity, { IDWQ5508: selectedRows[i], UserName: current.name, MRN: item['Patient MRN'], Color: data.color, Status: data.text, DateTime: currentDate }))

        if (i + 1 == selectedRows.length) {
          setTimeout(() => {
            Socket.emit('update-wqs');
          }, 1500)

          setReload(true)

        }

        await timer();
      }
    }

  }

  const getFilters = async (filters) => {
    let result = await request.list("himsteamroster-contractor");
     let  contractors = (result.result['contractor'].filter((contractor) => contractor['Contractor_Name'] != null))
     let  supervisorName = (result.result['supervisorName'].filter((contractor) => contractor['SUPERVISOR_NAME'] != null))
     
     contractors = contractors.sort((a, b) => a['Contractor_Name'] - b['Contractor_Name']).map((value) => ({ text: value['Contractor_Name'], value: value['Contractor_Name'], EMPID: value['EMPID'], HiringManager: value['SUPERVISOR_NAME'], JobTitle: value['JOBTITLE'], PayCode: value['JOBCODE'] }))
    
      setContractors(contractors)
      setHiringManager(supervisorName.map((s) => ({text: s.SUPERVISOR_NAME, value: s.SUPERVISOR_NAME})))
  }


  const onDateChanges = (entity, date) => {
    delete errors[entity]
    if (entity == 'WorkDate') {
      setWorkDate(date)
    } else if (entity == "WeekEndDate") {
      setWeekEndDate(date)
    } else {
      setStatementDate(date)
    }
  }

  const handleSaveColor = (EMPID, data) => {
    request.update("billingcolorwq5508", EMPID, data);
  }

  const getDefaultColors = (cb) => {
    cb(defaultColors)
  }

  const getPreviousColors = (cb) => {
    load()
  }

  const openEditModal = (id, del, value) => {

    let row = items.filter(item => item.ID == id)[0];
    setSelectedId(id);

    if (del) {
      setModalType("DELETE");

      setOpenModal(true)
      setDeleteValue(value)
      if (value) {
        setModalTitle("Archive ?");

        onNotesAction(id, 'Archive')
      } else {
        setModalTitle("UnArchive ?");

        onNotesAction(id, 'UnArchive')
      }

    } else {
      setModalType("EDIT");
      editForm.setFieldsValue({
        Notes: row.Notes
      })

      setModalTitle("Edit Notes");
      setOpenModal(true)
      onNotesAction(id, 'Edit Note')

    }

  }


  const getFilterValue = (values) => {
    console.log(values)
    console.log(loaded)
    setFilteredValue(values)
  }


  const openAddModal = (id) => {
    let row = items.filter(item => item.ID == id)[0];
    setSelectedRow(row);
    setModalType("VIEW");
    setModalTitle("View Notes");
    setOpenModal(true);
  }



  const handleCancel = () => {
    setModalTitle("");
    setOpenModal(false);
    setOpenAddEditModal(false)
    setWorkDate(null)
    setWeekEndDate(null)
    setStatementDate(null)
    setErrors({})
  }

  const getFullList = (data) => {

    const username = data.username

    if (username !== currentUser) {
      setCurrentUser(username)
      data = (data.filters)

      let filterObject = {}
      data.map((d) => {

        let item1 = d.column

        filterObject[item1] = [...new Set(d.recordset)].map(item => ({ text: item[d.column], value: item[d.column] }))
      })

      console.log(filterObject)
      setFilters(filterObject)
      getFilters(filterObject)
    }

  }


  const getItems = (data) => {


    setItems(data)
  }

  const onEditItem = (value) => {
    onhandleSave({ ID: selectedId, Notes: value.Notes })
    setOpenModal(false)
  }

  const onCopied = (id, mrn) => {
    dispatch(crud.create(loggerEntity, { IDWQ5508: id, UserName: current.name, Color: "", Status: "Copy MRN", DateTime: currentDate, MRN: mrn }))
  }

  const openFindModal = () => {
    setModalType("Find");
    setModalTitle("Assign to");
    setOpenModal(true)
  }



  const onRowMarked = async (row, value) => {
    setReload(false)
    await dispatch(crud.update(entity, row.ID, { Error: value ? '0' : '1' }))
    setReload(true)
  }





  // edit form
  const editModal = (
    <Form
      name="basic"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
      onFinish={onEditItem}
      // onFinishFailed={onEditFailed}
      autoComplete="off"
      form={editForm}
    >
      <Form.Item
        label=""
        name="Notes"
      >
        <TextArea type="text" style={{ width: "100%", marginBottom: "-5px" }} rows={10} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 18 }}>
        <Button type="primary" htmlType="submit" className="mr-3">
          Update
        </Button>
      </Form.Item>
    </Form>
  )

  const onDeleteItem = async (value) => {
    setReload(false)
    handleCancel()


    await dispatch(crud.update(entity, selectedId, { Archive: deleteValue ? 1 : null }))
    setReload(true)
  }

  const deleteModal = (
    <Form
      name="basic"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
      onFinish={onDeleteItem}
      // onFinishFailed={onEditFailed}
      autoComplete="off"
    >

      <p>Row ID {selectedId}?</p>

      <Form.Item wrapperCol={{ offset: 18 }}>
        <Button type="primary" htmlType="submit" className="mr-3">
          Update
        </Button>
      </Form.Item>
    </Form>
  )


  const resetFields = () => {
    setWorkDate(null)
    setWeekEndDate(null)
    setStatementDate(null)
    setCurrentContractor(null)
    setErrors({})

    editForm.resetFields()

  }

  const openingModal = (row) => {
    editForm.resetFields()
    setPrevious(true)

    if (row) {

      setMode('EDIT')
      setSelectedId(row.ID)

      editForm.setFieldsValue({
        EMPID: row.EMPID,
        AssignmentID: row.AssignmentID,
        Contractor: row.Contractor,
        PayCode: row.PayCode,
        JobTitle: row.JobTitle,
        RTRate: row.RTRate,
        OTRate: row.OTRate,
        InvoicedUnits: row.InvoicedUnits,
        InvoicedNet: row.InvoicedNet,
        Supplier: row.Supplier,
        'HiringManager': row.HiringManager,
        DeptBillChartfield: row.DeptBillChartfield
      })

      setOpenAddEditModal(true)
      console.log(row.WorkDate ? row.WorkDate.split('T')[0] : "")

        setWorkDate(row.WorkDate ? row.WorkDate.split('T')[0] : "")
        setWeekEndDate(row.WeekEndDate ? row.WeekEndDate.split('T')[0] : "")
        setStatementDate(row.StatementDate ? row.StatementDate.split('T')[0] : "")
        
    
      setModalTitle("Edit Entry");

    } else {
      setMode('ADD')
      resetFields()
      setOpenAddEditModal(true)
      
      setModalTitle("Add Entry");
    }


  }


  const onReplaceUser = async (value) => {
    setReload(false)

    delete filteredValue['sort']
    filteredValue.Status = ["Review"]
    await request.post('wq5508-user', { user: value.User, filter: filteredValue });
    notification.success({ message: "User Assigned!", duration: 3 })
    userForm.resetFields()
    setOpenModal(false)
    setReload(true)

  }

  const userModal = (
    <Form
      name="basic"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
      onFinish={onReplaceUser}
      // onFinishFailed={onEditFailed}
      autoComplete="off"
      form={userForm}
    >

      <Form.Item
        label=""
        name="User"
        rules={[
          {
            required: true,
          },
        ]}
      >

        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
          }
          styleclassName="w-100" >
          {
            users.map((user, index) => {
              return <Option key={index} value={user.name}>{user.name}</Option>
            })
          }
        </Select>
      </Form.Item>



      <Form.Item wrapperCol={{ offset: 18 }}>
        <Button type="primary" htmlType="submit" className="mr-3">
          Assign
        </Button>
      </Form.Item>
    </Form>
  )



  const onUpdateItem = async (value) => {

    setReload(false)

    value['WorkDate'] = (WorkDate)
    value['WeekEndDate'] = (WeekEndDate) 
    value['StatementDate'] = (StatementDate) 

    

    if (mode == 'ADD') {

      let response = await request.create(entity, value)
      if (response.success) {
        notification.success({ message: "Added successfully!" })
        handleCancel()
        setReload(true)

      } else {
        notification.error({ message: "Something went wrong!" })
        setReload(true)

      }
    } else {

      let response = await request.update(entity, selectedId, value)
      if (response.success) {
        notification.success({ message: "Updated successfully!" })
        handleCancel()
        setReload(true)

      } else {
        notification.error({ message: "Something went wrong!" })
        setReload(true)

      }
    }

    await request.create('previous-entry', {value})
  }

  const copyPreviousData = async() => {
    let response  = await request.list('previous-entry', {
      value: JSON.stringify({EMPID: currentContractor})
    })

    if(response.result.length ==0) {
      return 
    }

    let previous = response.result[0]
    console.log(previous)

debugger
    setPrevious(false)
    
    editForm.setFieldsValue({
      EMPID: previous.EMPID,
      AssignmentID: previous.AssignmentID,
      Contractor: previous.Contractor,
      PayCode: previous.PayCode,
      JobTitle: previous.JobTitle,
      RTRate: previous.RTRate,
      OTRate: previous.OTRate,
      InvoicedUnits: previous.InvoicedUnits,
      InvoicedNet: previous.InvoicedNet,
      Supplier: previous.Supplier,
      'HiringManager': previous.HiringManager,
      DeptBillChartfield: previous.DeptBillChartfield
    })

    // setWorkDate(previous.WorkDate ? previous.WorkDate.split('T')[0] : "")
    // setWeekEndDate(previous.WeekEndDate ? previous.WeekEndDate.split('T')[0] : "")
    // setStatementDate(previous.StatementDate ? previous.StatementDate.split('T')[0] : "")
    console.log(previous.WorkDate ? previous.WorkDate.split('T')[0] : "")
    setWorkDate(previous.WorkDate ? previous.WorkDate.split('T')[0] : "")
    setWeekEndDate(previous.WeekEndDate ? previous.WeekEndDate.split('T')[0] : "")
    setStatementDate(previous.StatementDate ? previous.StatementDate.split('T')[0] : "")
    setPrevious(true)
  
  }

  const onChangeContractor = (value) => {
    debugger
    setCurrentContractor(value)

    if(mode == 'ADD') {
      let contractor = contractors.filter((contractor) => contractor['EMPID'] == value)[0]
    
      editForm.setFieldsValue({
        EMPID: contractor.EMPID,
        Contractor : contractor.text,
        'HiringManager': contractor.HiringManager,
        JobTitle: contractor['JobTitle']
      })
    }
    

  }


  // edit form
  const updateModal = (
    <Form
      name="basic"
      labelCol={{ span: 9 }}
      wrapperCol={{ span: 15 }}
      onFinish={onUpdateItem}
      autoComplete="off"
      form={editForm}
    >

      <Row gutter={[24, 24]} style={{ rowGap: "12px" }}>


        <Col span={8}>
          <Form.Item
            label="EMP ID"
            name="EMPID"
          >
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Contractor"
            name="Contractor"
          >
            <Select

              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (option.children && input.toLowerCase() && option.children.toLowerCase()[0] == input.toLowerCase()[0] ) {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              }
              
              onChange={onChangeContractor}
              >
              {
                contractors && contractors.map((status) => {
                  return <Select.Option
                    value={status.EMPID}>{status.text}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Hiring Manager"
            name="HiringManager"

          >
            <Select

              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (option.children && input.toLowerCase() && option.children.toLowerCase()[0] == input.toLowerCase()[0] ) {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              }
             
              >
              {
                hiringManager && hiringManager.map((value) => {
                  return <Select.Option

                    value={value.text}>{value.text}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item
            label="Supplier"
            name="Supplier"


          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (option.children && input.toLowerCase() && option.children.toLowerCase()[0] == input.toLowerCase()[0] ) {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              }
             
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                    <Input placeholder="Please enter item" value={name} onChange={onNameChange} />
                    <Typography.Link onClick={(e) => addItem(e,'Supplier') } style={{ whiteSpace: 'nowrap' }}>
                      <PlusOutlined /> Add item
                    </Typography.Link>
                  </Space>
                </>
              )}
            >
              {
                filters && filters['Supplier'] && filters['Supplier'].filter((value) => value.value != "").map((status) => {
                  return <Select.Option value={status.value}>{status.text}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item
            label="Job Title"
            name="JobTitle"


          >
            <Select

              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (option.children && input.toLowerCase() && option.children.toLowerCase()[0] == input.toLowerCase()[0] ) {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              }
            
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                    <Input placeholder="Please enter item" value={name} onChange={onNameChange} />
                    <Typography.Link onClick={(e) => addItem(e,'JobTitle') } style={{ whiteSpace: 'nowrap' }}>
                      <PlusOutlined /> Add item
                    </Typography.Link>
                  </Space>
                </>
              )}
              >
              {
                filters && filters['JobTitle'] && filters['JobTitle'].filter((value) => value.value != "").map((status) => {
                  return <Select.Option value={status.value}>{status.text}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Pay Code"
            name="PayCode"


          >
            <Select

              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (option.children && input.toLowerCase() && option.children.toLowerCase()[0] == input.toLowerCase()[0] ) {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              }
              >
              {
                filters && filters['PayCode'] && filters['PayCode'].filter((value) => value.value != "" && value.value != null).map((status) => {
                  return <Select.Option value={status.value}>{status.text}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Col>

        <Divider />

        <Col span={8}>
          <Form.Item
            label="Assignment ID"
            name="AssignmentID"
          >
            <Input />
          </Form.Item>
        </Col>






        <Col span={8}>
          <Form.Item
            label="RT Rate"
            name="RTRate"

          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="OT Rate"
            name="OTRate"

          >
            <Input type="number" />
          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item
            label="Invoiced Units"
            name="InvoicedUnits"

          >
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Invoiced Net"
            name="InvoicedNet"

          >
            <Input type="number" />
          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item
            label="Dept Bill"
            name="DeptBillChartfield"

          >
            <Input />
          </Form.Item>
        </Col>


              {

                previous  ? 
                  <Col span={8}>
                  <Form.Item
                    label="Work Date"
                    name="WorkDate"
                  >
                  
                  {
                      WorkDate ?
                        <DatePicker className="w-100" placeholder="MM/DD/YYYY or MM-DD-YYYY"  format={dateFormatDatePicker} defaultValue={moment(WorkDate, dateFormat)} onChange={(_d, date) => onDateChanges('WorkDate', date)} />
                        :
                        <DatePicker className="w-100" placeholder="MM/DD/YYYY or MM-DD-YYYY" format={dateFormatDatePicker}  onChange={(d, date) => onDateChanges('WorkDate', date)} />
                    } 
                    <span className="ant-form-item-explain">{errors.WorkDate}</span>
        
                  </Form.Item>
                </Col>
        
              
                : null
              }

              {
                previous ? 
                <Col span={8}>
                <Form.Item
                  label="Week End Date"
                  name="WeekEndDate"
      
                >
                
      
                  {
                    WeekEndDate ?
                      <DatePicker className="w-100" placeholder="MM/DD/YYYY or MM-DD-YYYY"  format={dateFormatDatePicker} defaultValue={moment(WeekEndDate, dateFormat)} onChange={(d, date) => onDateChanges('WeekEndDate', date)} />
                      :
                      <DatePicker className="w-100" placeholder="MM/DD/YYYY or MM-DD-YYYY"  format={dateFormatDatePicker} onChange={(d, date) => onDateChanges('WeekEndDate', date)} />
                  }
                  <span className="ant-form-item-explain">{errors.WeekEndDate}</span>
      
                </Form.Item>
              </Col>
        : null
      
    
              }

              {
                previous ? 

                <Col span={8}>
                <Form.Item
                  label="Statement Date"
                  name="StatementDate"
      
                >
      
                
                  {
                    StatementDate ?
                      <DatePicker className="w-100" placeholder="MM/DD/YYYY or MM-DD-YYYY"  format={dateFormatDatePicker} defaultValue={moment(StatementDate, dateFormat)} onChange={(d, date) => onDateChanges('StatementDate', date)} />
                      :
                      <DatePicker className="w-100" placeholder="MM/DD/YYYY or MM-DD-YYYY"  format={dateFormatDatePicker} onChange={(d, date) => onDateChanges('StatementDate', date)} />
                  }
                  
                  <span className="ant-form-item-explain">{errors.StatementDate}</span>
      
                </Form.Item>
              </Col>

              : null
              }
              


      </Row>


      <div style={{ textAlign: "end", marginBottom: "11px" }}>
        {
          currentContractor && mode == 'ADD'  ?
          <Button type="primary" htmlType="button" className="mr-3" onClick={copyPreviousData}>
            Copy Previous Data
          </Button>
        : null
        }
        
        <Button type="primary" htmlType="submit" className="mr-3" >
          {mode == 'ADD' ? "Add" : "Update"}
        </Button>
      </div>

    </Form>
  )


  const panelTitle = "WQ 5508";
  const dataTableTitle = "Beeline Data";
  const progressEntity = "wq5508progress";
  const workEntity = "wq5508Work";
  const showProcessFilters = true;


  const onWorkSaved = async (amount) => {
    var date = new Date();
    var utcDate = new Date(date.toUTCString());
    utcDate.setHours(utcDate.getHours());
    var usDate = new Date().toISOString();
    let day = (new Date().getDay())
    console.log(day)
    console.log('*****************Day*****************************')
    let obj = {}
    obj[days[day]] = 1;
    dispatch(crud.create(workEntity, obj));
  }

  const userList = [
    { name: "Anna Maria", status: 'success' },
    { name: "Ferdinand", status: 'success' },
    { name: "Jacqueline", status: 'success' },
    { name: "Jannet", status: 'success' },
    { name: "Suzanne", status: 'success' }
  ]

  const updateTime = async (id, value, cb, ent) => {
    setReload(false)
    cb(true)
    await request.update(entity, id, value)

    if (ent == 'Start') {
      onNotesAction(id, 'Start')
    } else {
      onNotesAction(id, 'Stop')
    }

    setReload(true)
  }

  const dataTableColumns = [

    {
      title: "Action",
      dataIndex: "Action",
      width: 80,
      fixed: 'left'
    },


    {
      title: "Notes", width: 80, dataIndex: "Notes", filters: [
        { text: <EyeOutlined />, value: 0 },
        { text: "", value: 1 }
      ],
      filteredValue: filteredValue['Notes'] || null

    },
    {
      title: "Assignment ID",
      dataIndex: "AssignmentID",
      width: 140,
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "AssignmentID").length > 0) ? filteredValue.sort.filter((value) => value.field == "AssignmentID")[0].order : null,
      sorter: { multiple: 18 },
    },

    {
      title: "Contractor",
      dataIndex: "Contractor",
      width: 160,
      filters: filters['Contractor'],
      sorter: { multiple: 4 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Contractor").length > 0) ? filteredValue.sort.filter((value) => value.field == "Contractor")[0].order : null,
      filteredValue: filteredValue['Contractor'] || null
    },
    {

      title: "PayCode",
      dataIndex: "PayCode",
      width: 140,
      filters: filters['PayCode'],
      sorter: { multiple: 5 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "PayCode").length > 0) ? filteredValue.sort.filter((value) => value.field == "PayCode")[0].order : null,
      filteredValue: filteredValue['PayCode'] || null
    },


    {
      title: "Job Title",
      dataIndex: "JobTitle",
      width: 220,
      filters: filters['JobTitle'],
      sorter: { multiple: 5 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "JobTitle").length > 0) ? filteredValue.sort.filter((value) => value.field == "JobTitle")[0].order : null,
      filteredValue: filteredValue['JobTitle'] || null
    },

    {
      title: "RT Rate",
      dataIndex: "RTRate",
      width: 110,
      sorter: { multiple: 7 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "RTRate").length > 0) ? filteredValue.sort.filter((value) => value.field == "RTRate")[0].order : null,
      ...getColumnSearchProps("RTRate"),
      filteredValue: filteredValue['RTRate'] || null
    },
    {
      title: "OT Rate",
      dataIndex: "OTRate",
      width: 110,
      sorter: { multiple: 8 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "OTRate").length > 0) ? filteredValue.sort.filter((value) => value.field == "OTRate")[0].order : null,
      ...getColumnSearchProps("OTRate"),
      filteredValue: filteredValue['OTRate'] || null
    },
    {
      title: "Invoiced Units",
      dataIndex: "InvoicedUnits",
      width: 150,
      sorter: { multiple: 9 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "InvoicedUnits").length > 0) ? filteredValue.sort.filter((value) => value.field == "InvoicedUnits")[0].order : null,
      ...getColumnSearchProps("InvoicedUnits"),
      filteredValue: filteredValue['InvoicedUnits'] || null
    },
    {
      title: "Supplier",
      dataIndex: "Supplier",
      width: 180,
      filters: filters['Supplier'],
      sorter: { multiple: 10 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "Supplier").length > 0) ? filteredValue.sort.filter((value) => value.field == "Supplier")[0].order : null,
      filteredValue: filteredValue['Supplier'] || null
    },
    {
      title: "Invoiced Net",
      dataIndex: "InvoicedNet",
      width: 160,
      filters: filters['InvoicedNet'],
      sorter: { multiple: 11 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "InvoicedNet").length > 0) ? filteredValue.sort.filter((value) => value.field == "InvoicedNet")[0].order : null,
      filteredValue: filteredValue['InvoicedNet'] || null
    },
    {
      title: "Hiring Manager",
      dataIndex: "HiringManager",
      width: 160,
      filters: filters['HiringManager'],
      sorter: { multiple: 12 },
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "HiringManager").length > 0) ? filteredValue.sort.filter((value) => value.field == "HiringManager")[0].order : null,
      filteredValue: filteredValue['HiringManager'] || null
    },
    {
      title: "Department/Bill to Chartfield",
      dataIndex: "DeptBillChartfield",
      width: 250,

    },

    {
      title: "Work Date", dataIndex: "WorkDate", width: 140, sorter: { multiple: 13 },
      type: "date",
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "WorkDate").length > 0) ? filteredValue.sort.filter((value) => value.field == "WorkDate")[0].order : null,
    },
    {
      title: "Week End Date", dataIndex: "WeekEndDate", width: 140, sorter: { multiple: 14 },
      type: "date",
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "WeekEndDate").length > 0) ? filteredValue.sort.filter((value) => value.field == "WeekEndDate")[0].order : null,
    },
    {
      title: "Statement Date", dataIndex: "StatementDate", width: 140, sorter: { multiple: 15 },
      type: "date",
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "StatementDate").length > 0) ? filteredValue.sort.filter((value) => value.field == "StatementDate")[0].order : null,
    },

    {
      title: "Upload Date Time", dataIndex: "UploadDateTime", width: 200, sorter: { multiple: 16 },
      type:"datetime",
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "UploadDateTime").length > 0) ? filteredValue.sort.filter((value) => value.field == "UploadDateTime")[0].order : null,
    },
    {
      title: "Action Time Stamp", dataIndex: "ActionTimeStamp", width: 200, sorter: { multiple: 16 },
      type:"datetime",
      sortOrder: (filteredValue.sort && filteredValue.sort.filter((value) => value.field == "ActionTimeStamp").length > 0) ? filteredValue.sort.filter((value) => value.field == "ActionTimeStamp")[0].order : null,
    },
    {
      title: "User",
      dataIndex: "UserName",
      width: 150,
    },
    {
      title: "Archive", width: 80, dataIndex: "Archive", filters: [
        { text: "Yes", value: 0 },
        { text: "", value: 1 }
      ],
      filteredValue: filteredValue['Archive'] || null

    },


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
    dataTableColorList,
    onhandleSave,
    onHandleColorChange,
    handleSaveColor,
    getDefaultColors,
    getPreviousColors,
    openEditModal,
    openAddModal,
    deleteModal,
    getItems,
    reload,
    progressEntity,
    onCopied,
    getFilterValue,
    workEntity,
    showProcessFilters,
    userList: users,
    onWorkSaved,
    onRowMarked,
    getFullList,
    openFindModal,
    updateTime,
    openingModal
  };

  const modalConfig = {
    title: modalTitle,
    openModal,
    handleCancel
  };

  const addEditModalConfig = {
    title: modalTitle,
    openModal: openAddEditModal,
    handleCancel,
    width: 1200,
  };


   // View Modal
   const viewModal = (
    <Row gutter={[24, 24]} style={{marginBottom: "50px"}}>
       <Col className="gutter-row" span={24}>
         {selectedRow.Notes}
       </Col>
   </Row>  
 )

  {
    return (

      <div>
        <Modals config={modalConfig} >
          {
            modalType == "EDIT" ?
              editModal : null
          }
          {
            modalType == "DELETE" ?
              deleteModal : null
          }
          {
            modalType == "VIEW" ?
              viewModal : null
          }
          

        </Modals>

        <Modals config={addEditModalConfig} >
          {updateModal}
        </Modals>

        <FullDataTableModule config={config} />
      </div>
    )
  }
}
