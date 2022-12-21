import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { DashboardLayout } from "@/layout";
import { request } from "@/request";
import TopCard from "@/components/TopCard";
import Socket from "../../socket";
import PageLoader from "@/components/PageLoader";
import { selectAuth } from "@/redux/auth/selectors";
import { useSelector } from "react-redux";

export default function Cards() {
  const [reminders, setReminders] = useState("");
  const [cardData, setCardData] = useState([]);
  const [admins, setAdmins] = useState([]);
  const { current } = useSelector(selectAuth);


  useEffect(() => {
    Socket.on('updated-wqs', () => {
      load();
    });

    load();
  }, [])

  const load = () => {
    (async () => {

      console.log('Update-WQ')
      const [adminlist] = await Promise.all([request.list("admin")]);

      let admin = adminlist.result;

      setAdmins(admin.filter(list => list.ManagementAccess == 1 && list.First != "Admin" && list.First != "Afif" && list.First != "Jason"))
     let user = (admin.filter(list => list.ManagementAccess != 1 ||  list.First == "Afif"))

      let merged = [];

      if (current.managementAccess == 0) {
        let emp = user.filter((u) => u.EMPID == current.EMPID)[0]
        user =user.filter((u) => u.EMPID != current.EMPID)
  
        user.unshift(emp)
      }
      for (let i = 0; i < user.length; i++) {
        merged.push({
          EMPID: user[i].EMPID,
          user: user[i],
        });
      }

      console.log(merged)
      setCardData(merged)


    })()
  }

  const ratingChanged = async (id, rating) => {
    const feedback = await request.create("feedback", { EMPID: id, Stars: rating });
    if (feedback.success) {
      notification.success({ message: "Feedback given successfully!" })
    }
  }


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

  return (
    <DashboardLayout style={dashboardStyles}>
      {
        cardData.length > 0 ?
          <Row gutter={[20, 20]}style={{ width: "100%", display: "block", marginLeft: "0px" }}>
            <Col className="" style={{ width: "100%", textAlign: "left", padding: "0px"  }}>
              <div
                className="whiteBox shadow"
                style={{ color: "#595959", fontSize: 13 }}
              >

                <Row gutter={[24, 24]} className="texture">
                  {
                    admins && admins.map((admin) => {
                      return <Col style={{ width: "20%", height: "142px" }}>
                        <div
                          className="pad5 strong"
                          style={{ textAlign: "left" }}
                        >
                          <h3 style={{ color: "#22075e", margin: "3px auto", fontSize: "10px !important", textAlign: "center" }} className="header">

                            {admin.Nickname}

                          </h3>

                          <div style={{ textAlign: "center", height: "55px", marginBottom: "7px" }}>
                            {
                              admin && admin.Avatar && admin.Avatar != "null"  ?
                                <img src={admin.Avatar} className="user-avatar scale2"></img>
                                : null
                            }
                          </div>

                        </div>
                      </Col>
                    })
                  }


                  
                <Col  style={{ width: "260px", position: "absolute", right: "0px", display: "flex" ,height: "142px"}}>
                      <span  className="topbar-header">Management</span>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          : null
      }

      <div className="space30"></div>

      <Row gutter={[20, 20]}>

        {
          cardData.length > 0 ?
            cardData.map((data) => {
              return <TopCard
                EMPID={data.EMPID}
                user={data.user}
                title={data.user.Nickname}
              />
            })

            :
            <PageLoader />
        }
      </Row>
    </DashboardLayout>
  );
}
