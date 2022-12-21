import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Divider } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from "recharts";
import LiquidChart from "@/components/Chart/liquid";
let { request } = require('@/request')
import { CheckOutlined, DollarTwoTone, CheckSquareTwoTone } from "@ant-design/icons";
import ReactTooltip from 'react-tooltip';
import CheckImage from "../../assets/images/check.png";
import Halloween from "../../assets/images/halloween.png";
import logo from "../../assets/images/logo.png";
import SantaBag from "../../assets/images/santa-gift-bag.png";
import ExternalPumpkin from "../../assets/images/external-pumpkin.png";
import CandyCaneBow from "../../assets/images/candy-cane-bow.png";
import CandyCane from "../../assets/images/candy-cane.png";
import Candy from "../../assets/images/candy.png";
import Candy1 from "../../assets/images/candy1.png";
import Autumn from "../../assets/images/autumn.png";
import SealOfExellence from "../../assets/images/seal-of-exellence.png";
import CheckerFlags from "../../assets/images/checker-flags.png";
import BearBadge from "../../assets/images/bear1.png";
import FireworksBadge from "../../assets/images/balloons1.png";
import PencilBadge from "../../assets/images/pencil1.png";
import StarBadge from "../../assets/images/star1.png";
import RibbonBadge from "../../assets/images/ribbon1.png";
import ThumbsupBadge from "../../assets/images/thumbs-up1.png"; 
import ProgressChart from "../Chart/progress";

const barChartConfig = {
  width: 115,
  height: 110,
  style: {
    display: "flex",
    margin: "auto",
    marginTop: "20px"
    
  }
}

// export default function Modals({ config, children }) {
//   let { title,  openModal, handleCancel } = config;

//   return (
//     <>
//     <Modal centered title={title} visible={openModal} onCancel={handleCancel} footer={null}  width={400}>
//         {children}
//       </Modal>
//     </> 
//   );
// }

const renderCustomizedLabel = (props) => {
  const { x, y, width, value } = props;
  const radius = 10;
  return (
    <g>
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#000000"
        style={{
          fontSize: "9px"
        }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    </g>
  );
};


export default function TopCard({ EMPID, user,title, percent1 = 0, percent2 = 0, agingDaysWq1075, agingDaysWq5508, amountWQ5508 = [], amountWQ1075 = [], feedback = {}, WQ5508WorkDone = {}, WQ1075WorkDone = {}, onRatingChanged , showBadge = false, notes}) {

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [badges, setBadges] = useState([
    {badge: StarBadge, index: 1, active: false, notes: ""},
    {badge: BearBadge, index: 2, active: false, notes: ""},
    {badge: RibbonBadge, index: 3, active: false, notes: ""},
    {badge: ThumbsupBadge, index: 4, active: false, notes: ""},
    {badge: PencilBadge, index: 5, active: false, notes: ""},
    {badge: FireworksBadge, index: 6,active: false, notes: ""}
  ])

  const [selectedBadge, setSelectedBadge] = useState({});
  const [WQ5508Rating, setWQ5508Rating] = useState(feedback.Stars);
  
  const [WQ5508Work, setWQ5508Work] = useState(WQ5508WorkDone)
  const [WQ1075Work, setWQ1075Work] = useState(WQ1075WorkDone)

  const [WQ5508WorkingDays, setWQ5508WorkingDays] = useState([]);
  const [WQ1075WorkingDays, setWQ1075WorkingDays] = useState([]);

  const [weeksWQ5508, setWeeksWQ5508] = useState([]);
  const [weeksWQ1075, setWeeksWQ1075] = useState([]);

  useEffect(() => {


    (async () => {
      const response = await request.list1("admin-one", { data: JSON.stringify({
        EMPID: EMPID
      }) });
      let result = (response.result)[0];


    })()


  }, [ EMPID])


  
  useEffect(() => {
    console.log(user)
  } , [user])

  return (
    <Col className="gutter-row topcard" >
      <div
        className="whiteBox shadow"
        style={{ color: "#595959", fontSize: 13 }}
      >
        <div
          className="pad5 strong"
          style={{ textAlign: "left", justifyContent: "center" }}
        >
          <h3 style={{ color: "#22075e", margin: "3px auto", fontSize: "10px !important", textAlign: "center" }} className="header">
           
            {title}
           
          </h3>
          
          <div style={{textAlign: "center", height: "55px", marginBottom: "7px"}}>
          {
            user ?

              user.Avatar  && user.Avatar != "null"  ? 
              <img src={ user.Avatar  } style={{filter : user.Online ? "" : "grayscale(100%)", opacity: user.Online ? 1 : 0.4 }} className="user-avatar scale2"></img>
              : 
              <img src={ logo  } style={{borderRadius: "0px", filter : user.Online ? "" : "grayscale(100%)", opacity: user.Online ? 1 : 0.4 }} className="user-avatar scale2"></img>
            : null
            }  
          </div> 
          
        </div>
        <Divider style={{ padding: 0, margin: 0, borderColor: "#dbdbdb" }}></Divider>
        <div >
          <Row gutter={[0, 0]} style={{ padding: "0px 6px" }}>
            <Col className="gutter-row top-card-left" span={24} style={{ textAlign: "left", paddingBottom: "5px" , paddingLeft: "10px" }}>
              <div className="text-center">
                <div style={{ textAlign: "start", marginTop: "5px", fontWeight: 600, marginBottom: "10px" }}>
                  
                  <span style={{width: "50px", display: "inline-block",  fontWeight: 700, color: '#000'}}>Login:</span>
                  <span>{user.Login ? new Date(user.Login).toUTCString().split('GMT')[0] : null}</span>
                   </div>
                <div style={{ textAlign: "start",  marginTop: "5px", fontWeight: 600, marginBottom: "10px" }}>
                  
                  <span style={{width: "50px",display: "inline-block", fontWeight: 700,  color: '#000' }}>Logout:</span>
                  <span>{user.Logout ? new Date(user.Logout).toUTCString().split('GMT')[0] : null}</span>
                  </div>
              </div>
            </Col>


            {/* <Col
              className="gutter-row top-card-right"
              span={19}
              style={{ paddingBottom: "5px" }}
            >
              <div style={{ textAlign: "start", marginTop: "5px", fontWeight: 600, marginBottom: "10px" }}>{user.Login ? new Date(user.Login).toUTCString().split('GMT')[0] : null}</div>
              <div style={{ textAlign: "start", marginTop: "5px", fontWeight: 600, marginBottom: "10px" }}>{user.Logout ? new Date(user.Logout).toUTCString().split('GMT')[0] : null}</div>

              
                </Col> */}
                
          </Row>
        </div>
      </div>
    </Col>
  );
};


   