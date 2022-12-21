import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { request } from "@/request";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/images/logo.png";

import {
  SettingOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  TeamOutlined,
  ProfileOutlined,
  SlackOutlined ,
  BarsOutlined ,
  SearchOutlined
} from "@ant-design/icons";
import uniqueId from "@/utils/uinqueId";
import { selectListItems } from "@/redux/crud/selectors";
import { crud } from "@/redux/crud/actions";
import { logout } from "@/redux/auth/actions";
import { selectAuth } from "@/redux/auth/selectors";
import {user} from '@/redux/user/actions'

const { Sider } = Layout;
const { SubMenu } = Menu;

const showNew = true

function Navigation() {
  const { current } = useSelector(selectAuth);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };


  useEffect(() => {
    dispatch(user.list('admin'))
}, [])



  const switchUser = async (ID) => {
    // const response = await request.post("/admin/switch", {ID});
    // console.log(response)
  }

  const menu = (
    <Menu>
      <Menu.Item key={`${uniqueId()}`} style={{ fontWeight: 'bold ' }} onClick={() => dispatch(logout())}>Log Out </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{
          zIndex: 1000,
          background: "#fff",
          overflow: "hidden"
        }}
      >
        <div className="logo">
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <div>
            
                <div style={{width: "180px"}}>
                  <div style={{width: "50px", display: "contents"}}> 
                    <img style={{ height: "50px", marginTop: "-5px" }} src={logo} />
                  </div>  
                  <div  className="" style={{width: "150px", display: "contents" }} >
                    <span style={{verticalAlign: "top", width: "125px", display: "inline-flex", flexDirection: "column"}}>
                        <span className="text-center sub-header">Operations Support</span>
                        <span className="header username">{current ? current.name.split(" ")[0] : ""}</span>
                    </span>
                </div>
                </div>  
            </div>

          </Dropdown>
        </div>

        {
        
            current.managementAccess ?
              (
                <Menu 
                defaultOpenKeys={['sub9']}
                mode="inline"
                
                >

                  <SubMenu
                    key="sub9"
                    icon={<DashboardOutlined />}
                    title="OS Team Dashboard"
                  >
                    <Menu.Item key="92">
                      <NavLink to="/os-team-dashboard-cards" />
                      Performance Cards
                    </Menu.Item>
                    <Menu.Item key="91">
                      <NavLink to="/os-team-dashboard-reminders" />
                        Reminders
                    </Menu.Item>
                    
                    <Menu.Item key="93">
                      <NavLink to="/os-team-dashboard-calendar" />
                        Calendar
                    </Menu.Item>
                    <Menu.Item key="94">
                      <NavLink to="/os-team-dashboard-avatars" />
                        Avatars
                        {
                          showNew ?
                          <span style={{color: "#1DA57A", fontSize: "9px", marginLeft: "5px"}}>(New)</span>
                          : null
                        }
                    </Menu.Item>
                  </SubMenu>

                  <Menu.Item key="2" icon={<ProfileOutlined />}>
                    <NavLink to="/beeline-data" />
                    <span  >Beeline Data</span>
                  </Menu.Item>

                  <Menu.Item key="50" icon={<ProfileOutlined />}>
                    <NavLink to="/beeline-file-logger" />
                    <span >Beeline File Logger</span>
                  </Menu.Item>


                  <SubMenu
                    key="sub34"
                    icon={<TeamOutlined />}
                    title="Data Services"
                  >
                   
                    <Menu.Item key="2222" className="large-content" >
                      <NavLink to="/ri" />
                      RI
                    </Menu.Item>

                  </SubMenu>
                  <SubMenu
                    key="sub3"
                    icon={<TeamOutlined />}
                    title="Administration"
                  >
                    <Menu.Item key="18">
                      <NavLink to="/documentation" />
                        Documentation
                    </Menu.Item>  
                   
                    <Menu.Item key="222" className="large-content" >
                      <NavLink to="/hims-master-task-list" />
                      HIMS Master Task List
                    </Menu.Item>

                    <Menu.Item key="221" className="large-content" >
                      <NavLink to="/hims-staff-schedule" />
                      HIMS Staff Schedule
                    </Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="sub6"
                    icon={<AppstoreOutlined />}
                    title={<div style={{ display: "flex", flexDirection: "column" }}><span className="header italic" style={{ marginTop: "5px", fontSize: "14px !important" }} >Executive Services</span>  </div>}
                  >
                    
                    {
                      current.managementAccess ?
                        <Menu.Item key="71" className="large-content" >
                          <NavLink to="/milestones-and-roadmap" />
                          <span className="first-span">Milestones &</span>
                          <span>Roadmap</span>
                        </Menu.Item>
                    : null  
                  }
                      
                  </SubMenu>


                  <SubMenu
                    key="sub2"
                    icon={<AppstoreOutlined />}
                    title={<div style={{ display: "flex", flexDirection: "column" }}><span className="header italic" style={{ marginTop: "5px", fontSize: "14px !important" }} >Management Services</span>  </div>}
                  >
                           
                    <Menu.Item key="24">
                      <NavLink to="/reminders" />
                      Reminders
                    </Menu.Item>
                    <Menu.Item key="25">
                      <NavLink to="/team-calendar" />
                      Team Calendar
                    </Menu.Item>
                    
                    <Menu.Item key="27">
                      <NavLink to="/management-milestones" />
                       Milestones
                    </Menu.Item>
                    <Menu.Item key="29">
                      <NavLink to="/pagelogger" />
                       Page Logger
                    </Menu.Item>
                    {/* <Menu.Item key="292">
                      <NavLink to="/outlooklogger" />
                       Outlook Logger
                    </Menu.Item> */}
                     <Menu.Item key="2923">
                      <NavLink to="/emaillogger" />
                       Email Logger
                    </Menu.Item>     
                    <Menu.Item key="28">
                      <NavLink to="/management-roadmap" />
                       Roadmap
                    </Menu.Item>

                    <Menu.Item key="220" className="large-content" >
                      <NavLink to="/master-staff-list" />
                      Master Staff List
                    </Menu.Item>

                                        


                  </SubMenu>


                  {/* <SubMenu
                    key="sub4"
                    icon={
                      <img src="https://img.icons8.com/ios/50/000000/progress-indicator.png"  height="15" width="15"/>
                    }
                    title={<span style={{fontSize: "12.8px"}}>Professionals Center</span>}
                  >
                    {
                      users.map((user , index) => {
                        return <Menu.Item key={100 + index}>
                          <NavLink to={"/professionals-center?id="+user.EMPID } />
                              {user.First}
                          </Menu.Item>
                      })
                    }
                               
                  </SubMenu> */}
                  

              

                  <SubMenu
                    key="sub123"
                    icon={<SettingOutlined />}
                    title={'Settings'}
                    style={{fontSize: "12.8px"}}
                  >
                    <Menu.Item key="1900">
                      <NavLink to="/change-password" />
                        Change Password
                    </Menu.Item>
                    
                  </SubMenu>
                </Menu>
              )
              :
              current.subSection == 'OS' ?
              
              (
                <Menu 
                defaultOpenKeys={['sub9']}
                mode="inline"
                
                >

                  <SubMenu
                    key="sub9"
                    icon={<DashboardOutlined />}
                    title="OS Team Dashboard"
                  >
                    <Menu.Item key="92">
                      <NavLink to="/os-team-dashboard-cards" />
                      Performance Cards
                    </Menu.Item>
                    <Menu.Item key="91">
                      <NavLink to="/os-team-dashboard-reminders" />
                        Reminders
                    </Menu.Item>
                    
                    <Menu.Item key="93">
                      <NavLink to="/os-team-dashboard-calendar" />
                        Calendar
                    </Menu.Item>
                    <Menu.Item key="94">
                      <NavLink to="/os-team-dashboard-avatars" />
                        Avatars
                        {
                          showNew ?
                          <span style={{color: "#1DA57A", fontSize: "9px", marginLeft: "5px"}}>(New)</span>
                          : null
                        }
                    </Menu.Item>
                  </SubMenu>

                  <Menu.Item key="2" icon={<ProfileOutlined />}>
                    <NavLink to="/beeline-data" />
                    <span  >Beeline Data</span>
                  </Menu.Item>

                  <Menu.Item key="50" icon={<ProfileOutlined />}>
                    <NavLink to="/beeline-file-logger" />
                    <span >Beeline File Logger</span>
                  </Menu.Item>

                  {
                    current.name == 'Afif' ? 
                <SubMenu
                    key="sub34"
                    icon={<TeamOutlined />}
                    title="Data Services"
                  >
                   
                    <Menu.Item key="2222" className="large-content" >
                      <NavLink to="/ri" />
                      RI
                    </Menu.Item>

                  </SubMenu>
                  : null
                  }
                  


                  <SubMenu
                    key="sub3"
                    icon={<TeamOutlined />}
                    title="Administration"
                  >
                   
                    <Menu.Item key="222" className="large-content" >
                      <NavLink to="/hims-master-task-list" />
                      HIMS Master Task List
                    </Menu.Item>

                    <Menu.Item key="221" className="large-content" >
                      <NavLink to="/hims-staff-schedule" />
                      HIMS Staff Schedule
                    </Menu.Item>
                  </SubMenu>

                  
                 
                  

                  <SubMenu
                    key="sub5"
                    icon={<SearchOutlined />}
                    title={'Collaboration Center'}
                    style={{fontSize: "12.8px"}}
                  >
                    <Menu.Item key="18">
                      <NavLink to="/documentation" />
                        Documentation
                    </Menu.Item>
                    
                  </SubMenu>


                  <SubMenu
                    key="sub123"
                    icon={<SettingOutlined />}
                    title={'Settings'}
                    style={{fontSize: "12.8px"}}
                  >
                    <Menu.Item key="1900">
                      <NavLink to="/change-password" />
                        Change Password
                    </Menu.Item>
                    
                  </SubMenu>
                </Menu>
              )
              :
              (
                <Menu 
                defaultOpenKeys={['sub1']}
                mode="inline"                
                >

                <SubMenu
                    key="sub1"
                    icon={<TeamOutlined />}
                    title="Data Services"
                  >
                   
                    <Menu.Item key="1" className="large-content" >
                      <NavLink to="/ri" />
                      RI
                    </Menu.Item>

                  </SubMenu>
                 



                  <SubMenu
                    key="sub2"
                    icon={<SettingOutlined />}
                    title={'Settings'}
                    style={{fontSize: "12.8px"}}
                  >
                    <Menu.Item key="2">
                      <NavLink to="/change-password" />
                        Change Password
                    </Menu.Item>
                    
                  </SubMenu>
                </Menu>
              )
        }
      </Sider>
    </>
  );
}
export default Navigation;
