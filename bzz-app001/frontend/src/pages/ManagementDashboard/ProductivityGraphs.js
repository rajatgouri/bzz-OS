import React, { useRef, useState, useEffect } from "react";
import { Layout, Form, Breadcrumb, Statistic, Progress, Divider, Tag, Row, Col, Button, notification,  Radio } from "antd";

import { Column, Liquid, Pie, Gauge } from "@ant-design/charts";
import { request } from "@/request";

import { DashboardLayout } from "@/layout";
import Socket from "../../socket";

const DemoGauge = ({ percent }) => {

  var config = {
    percent: +percent / 100,
    type: 'meter',
    innerRadius: 0.75,
    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#F4664A', '#FAAD14', '#30BF78'],
    },

    indicator: {
      pointer: { style: { display: 'none' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    axis: {
      label: {
        formatter: function formatter(v) {
          return Number(v) * 100;
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '18px',
          lineHeight: '20px',
          color: "#000000",
          fontWeight: "600",
          marginTop: "15px"
        },
      },
    },
  };
  return <Gauge height={150} {...config} />;
};

const DemoColumn = () => {


  const [data, setData] = useState([]);
  const [value, setValue] = React.useState("1075");
  

  useEffect(() => {
    asyncFetch(value);
  }, []);

  const asyncFetch = async (value) => {

      let columnData = [];
      const [dailyProgress] = await Promise.all([request.list("dailyprogress", {id: value})]);

        dailyProgress.result.map((d) => {

          columnData.push({
            name: "$ Amount Removed",
            value: d['CHG_SESS_AMT_REMVD'],
            month: d['HX_DATE'].split('T')[0]
          }) 

          columnData.push({
            name: "$ Amount Added",
            value: d['CHG_SESS_AMT_ADDED'],
            month: d['HX_DATE'].split('T')[0]
          }) 
     
          
          columnData.push({
            name: "EOD $ Amount",
            value: d['CHG_SESS_AMT_EOD'],
            month: d['HX_DATE'].split('T')[0]
          }) 
     
          
         
       })

     setData(columnData.reverse())
   
  };
  var config = {
    data: data,
    isGroup: true,
    isStack: false,
    xField: "month",
    yField: "value",
    xAxis : { 
      label: {
        autoHide: true,
        autoRotate: false,
      },  
    },
    dodgePadding:1.8, 
    barWidthRatio: 0.8,
    seriesField: "name",
    label: {
      content: function content(item) {
        return  parseInt(item.value/ 1000) + "K"
      },
    },
    legend: {
      selected: {
        '$ Amount Added': false,
        '$ Amount Removed': false
      },
    },
    slider: {
      start: 0.95,
      end: 0.99,
    },
    color: ["#0CC4E7", "#BE253A", "#04A151"],
  };

  const onChange = e => {
    setData([])
    setValue(e.target.value);
    asyncFetch(e.target.value);

  };
  
  return (
    <div>
      <div className="bar-chart-switcher-container">
          <Radio.Group onChange={onChange} value={value}>
          <Radio value={'1075'}>1075</Radio>
          <Radio value={'5508'}>5508</Radio>
        </Radio.Group>
      </div>
      {
        data.length > 0 ? 
          <Column {...config} />
         : "loading..." 
      }
      {/*  */}
    </div>
    
  )
};


const DemoColumn1 = ({data1}) => {

  

  const [data, setData] = useState([]);
  
  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = async () => {


      let columnData = [];
      const [dailyProgress] = await Promise.all([request.list("dailyprogress")]);

        dailyProgress.result.map((d) => {
          columnData.push({
            name: "CHG_SESS_AMT_EOD",
            value: d['CHG_SESS_AMT_EOD'],
            month: d['HX_DATE'].split('T')[0]
          }) 
       })

     setData(columnData)
     
  };
  var config = {
    data: data,
    isGroup: true,
    minColumnWidth: 20,
    xField: "month",
    yField: "value",
    xAxis : { 
      label: {
        autoRotate: false,
      },
    },
    dodgePadding: 150,
    intervalPadding: 200,
    barStyle : {
      lineWidth: 150,
      stroke: 'red'
    },
    seriesField: "name",
    scrollbar: { type: 'horizontal' },
    color: ["#0CC4E7", "#BE253A", "#04A151"],
  };

 
  return (
    <div>
      <div className="bar-chart-switcher-container">
          hiiiii
      </div>
      <Column {...config} />
    </div>
    
  )
};



const dashboardStyles = {
  content: {
    "boxShadow": "none",
    "padding": "35px",
    "width": "100%",
    "overflow": "auto",
    "background": "#eff1f4"
  },
  section: {
    minHeight: "100vh",
    maxHeight: "100vh",
    minWidth: "1300px"
  }
}

export default function PerformanceCards() {

  const [totalProductivity, setTotalProductivity] = useState(0);
  const [totalWQ1075Productivity, setTotalWQ1075Productivity] = useState(0);
  const [epicData, setEpicData] = useState([])

  useEffect(() => {
    Socket.on('updated-wqs', () => {
      load()
    });

    load()
  }, [])

  const load = () => {
    (async () => {

      const [wq5508Progress, wq1075Progress, dailyProgress] = await Promise.all([request.list("wq5508progress"), request.list("wq1075progress"), request.list("dailyprogress")]);

      let wq5508 = wq5508Progress.result;
      let wq1075 = wq1075Progress.result;
      setEpicData(dailyProgress.result)

      let sumwq5508 = 0;
      let sumwq1075 = 0;

      for (let i = 0; i < wq5508.length; i++) {
        sumwq5508 += +wq5508[i].ChargesProcessed;
        sumwq1075 += +wq1075[i].ChargesProcessed;
      }

      setTotalWQ1075Productivity(((sumwq1075 / (wq1075.length * 100)) * 100).toFixed(2))
      setTotalProductivity(((sumwq5508 / (wq5508.length * 100)) * 100).toFixed(2))

    })()
  }


  return (
    <DashboardLayout style={dashboardStyles}>

      <Row gutter={[24, 24]}>
        <Col className="gutter-row" style={{ width: "60%" }}>
          <div className="whiteBox shadow" style={{ height: "430px" }}>
            <div  className="pad20 demo-chart-container" >
             
              <DemoColumn />
            </div>
          </div>
        </Col>

        <Col className="gutter-row" style={{ width: "20%" }}>
          <div className="whiteBox shadow" style={{ height: "430px" }}>
            <div
              className="pad20"
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              <h3 style={{ color: "#22075e", marginBottom: 30 }}>
                Productivity Preview
              </h3>

              <DemoGauge width={148} percent={totalWQ1075Productivity} />
              <Divider />
              <p style={{ color: "#22075e", margin: " 30px 0" }}>
                Total Work Done
              </p>

              <h1 className="calendar-header">WQ1075</h1>

            </div>
          </div>
        </Col>
        <Col className="gutter-row" style={{ width: "20%" }}>
          <div className="whiteBox shadow" style={{ height: "430px" }}>
            <div
              className="pad20"
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              <h3 style={{ color: "#22075e", marginBottom: 30 }}>
                Productivity Preview
              </h3>

              {/* <Progress type="dashboard" percent={totalProductivity} width={148} /> */}
              <DemoGauge width={148} percent={totalProductivity} />

              <Divider />
              <p style={{ color: "#22075e", margin: " 30px 0" }}>
                Total Work Done
              </p>

              <h1 className="calendar-header">WQ5508</h1>
              {/* <Statistic
                title="Activity"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              /> */}
            </div>
          </div>
        </Col>
      </Row>

    </DashboardLayout>
  );
}
