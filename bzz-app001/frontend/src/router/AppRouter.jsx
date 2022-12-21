import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "@/components/PageLoader";
import Reminder from "@/pages/Reminder";
import { selectAuth } from "@/redux/auth/selectors";
import { useSelector, useDispatch } from "react-redux";



const OSReminders = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/PbDashboard/Reminders")
);

const OSCards = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/PbDashboard/Cards")
);

const OSCalendar = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/PbDashboard/Calendar")
);

const PageLogger = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/PageLogger")
);


const OutlookLogger = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/OutlookLogger")
);

const OSAvatars = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/PbDashboard/Avatars")
);


const ManagementMilestones = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/ManagementMilestones")
);

const ManagementRoadmap = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/ManagementRoadmap")
);




const ChangePassword = lazy(() =>
  import(
    /*webpackChunkName:'ManagementDashboardPage'*/ "@/pages/ChangePassword"
  )
);

const EpicProductivity1 = lazy(() =>
  import(
    /*webpackChunkName:'ManagementDashboardPage'*/ "@/pages/EpicProductivity1"
  )
);

const HIMSMasterTaskList = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/HIMSMasterTaskList"));



const DailyProductivity = lazy(() =>
  import(
    /*webpackChunkName:'ManagementDashboardPage'*/ "@/pages/ManagementDashboard/DailyProductivity"
  )
);

const CalendarBoard = lazy(() =>
  import(/*webpackChunkName:'CalendarBoardPage'*/ "@/pages/CalendarBoard")
);
const TaskCalendar = lazy(() =>
  import(/*webpackChunkName:'CalendarBoardPage'*/ "@/pages/TaskCalendar")
);
const Admin = lazy(() =>
  import(/*webpackChunkName:'AdminPage'*/ "@/pages/Admin")
);

const Beeline = lazy(() =>
  import(/*webpackChunkName:'Wq5508Page'*/ "@/pages/Beeline")
);

const RI = lazy(() =>
  import(/*webpackChunkName:'Wq5508Page'*/ "@/pages/RI")
);

const BeelineFileLogger = lazy(() =>
  import(/*webpackChunkName:'Wq5508Page'*/ "@/pages/BeelineFileLogger")
);




const MilestonesAndRoadmap = lazy(() =>
  import(/*webpackChunkName:'Wq5508Page'*/ "@/pages/MilestonesAndRoadmap")
);

const Irb = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/Irb"));

const HIMSTeamRoster = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/HIMSTeamRoster"));

const HIMSStaffSchedule = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/HIMSUserSchedule"));

const NoPccStudies = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/NoPccStudies"));

const Overview = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/Overview"));

const WorkAssignments = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/workAssignments"));

const IRBBudgetStatus = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/IRBBudgetStatus"));

const Iframe = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/iframe"));

const Documentation = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/Documentation"));

const PredictiveBilling = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/PredictiveBilling"));

const NLPRouting = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/NLPRouting"));

const UsefulChanges = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/UsefulChanges"));

const Pages = lazy(() => import(/*webpackChunkName:'IrbPage'*/ "@/pages/Pages"));

const CoverageGovernment = lazy(() =>
  import(
    /*webpackChunkName:'CoverageGovernmentPage'*/ "@/pages/CoverageGovernment"
  )
);


const EmailLogger = lazy(() =>
  import(/*webpackChunkName:'DashboardPage'*/ "@/pages/EmailLogger")
);


const Logout = lazy(() =>
  import(/*webpackChunkName:'LogoutPage'*/ "@/pages/Logout")
);
const NotFound = lazy(() =>
  import(/*webpackChunkName:'NotFoundPage'*/ "@/pages/NotFound")
);

export default function AppRouter() {

  const { current } = useSelector(selectAuth);
  
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        {
          current.managementAccess ? 
          <Switch location={location} key={location.pathname}>
         
          <PrivateRoute path="/os-team-dashboard-reminders" component={OSReminders} exact />
          <PrivateRoute path="/os-team-dashboard-cards" component={OSCards} exact />
          <PrivateRoute path="/os-team-dashboard-calendar" component={OSCalendar} exact />
          <PrivateRoute path="/os-team-dashboard-avatars" component={OSAvatars} exact />

         
         
          <PrivateRoute path="/daily-productivity" component={DailyProductivity} exact/>

          <PrivateRoute path="/professionals-center" component={Iframe} exact />
          <PrivateRoute path="/documentation" component={Documentation} exact />
          <PrivateRoute path="/team-calendar" component={CalendarBoard} exact />
          <PublicRoute path="/taskcalendar" component={TaskCalendar} exact />


          <PrivateRoute component={ManagementMilestones} path="/management-milestones" exact />
          <PrivateRoute component={ManagementRoadmap} path="/management-roadmap" exact />
          <PrivateRoute path="/milestones-and-roadmap" component={MilestonesAndRoadmap} exact />
          
          <PrivateRoute path="/emaillogger" component={EmailLogger} exact />
          
          <PrivateRoute path="/pagelogger" component={PageLogger} exact />
          <PrivateRoute path="/outlooklogger" component={OutlookLogger} exact />
          
          <PrivateRoute component={ChangePassword} path="/change-password" exact />
          <PrivateRoute component={RI} path="/ri" exact />


          
          <PrivateRoute path="/master-staff-list" component={HIMSTeamRoster} exact />
          <PrivateRoute path="/hims-staff-schedule" component={HIMSStaffSchedule} exact />

          <PrivateRoute path="/epic-productivity" component={EpicProductivity1} exact />

          <PrivateRoute component={Beeline} path="/beeline-data" exact />
          <PrivateRoute component={BeelineFileLogger} path="/beeline-file-logger" exact />

          <PrivateRoute component={Irb} path="/irb" exact />
          <PrivateRoute component={Overview} path="/overview" exact />
          <PrivateRoute component={IRBBudgetStatus} path="/irbbudgetstatus" exact />
          <PrivateRoute component={WorkAssignments} path="/work-assignments" exact />
          <PrivateRoute component={Reminder} path="/reminders" exact />
          <PrivateRoute component={Pages} path="/pages" exact />
          <PrivateRoute component={PredictiveBilling} path="/predictive-billing" exact />
          <PrivateRoute component={NLPRouting} path="/nlp-routing" exact />
          <PrivateRoute component={UsefulChanges} path="/useful-change" exact />
          <PrivateRoute component={NoPccStudies} path="/no-pcc-studies" exact />
          <PrivateRoute component={HIMSMasterTaskList} path="/hims-master-task-list" exact />
        

          <PrivateRoute
            component={CoverageGovernment}
            path="/coverage"
            exact
          />
          <PrivateRoute component={Admin} path="/team-members" exact />
          <PrivateRoute component={Logout} path="/logout" exact />
          <PublicRoute path="/login" render={() => <Redirect to="/" />} />
          <Route exact path="/">
          {current ? <Redirect to="/os-team-dashboard-cards" /> : <NotFound />}
        </Route>
          <Route
            path="*"
            component={NotFound}
            render={() => <Redirect to="/notfound" />}
          />
        </Switch>
        :
        current.subSection == 'OS' ?
        (
          <Switch location={location} key={location.pathname}>

            <PrivateRoute path="/os-team-dashboard-reminders" component={OSReminders} exact />
            <PrivateRoute path="/os-team-dashboard-cards" component={OSCards} exact />
            <PrivateRoute path="/os-team-dashboard-calendar" component={OSCalendar} exact />
            <PrivateRoute path="/os-team-dashboard-avatars" component={OSAvatars} exact />

            <PrivateRoute path="/milestones-and-roadmap" component={MilestonesAndRoadmap} exact />
            
            <PrivateRoute component={Beeline} path="/beeline-data" exact />
            <PrivateRoute component={BeelineFileLogger} path="/beeline-file-logger" exact />

            <PrivateRoute component={Irb} path="/irb" exact />
            
            <PrivateRoute path="/master-staff-list" component={HIMSTeamRoster} exact />
              <PrivateRoute path="/hims-staff-schedule" component={HIMSStaffSchedule} exact />

            <PrivateRoute component={NoPccStudies} path="/no-pcc-studies" exact />

            <PrivateRoute component={ChangePassword} path="/change-password" exact />
            <PrivateRoute component={RI} path="/ri" exact />


            <PrivateRoute
              component={CoverageGovernment}
              path="/coverage"
              exact
            />
            <PrivateRoute component={Logout} path="/logout" exact />
            <PublicRoute path="/login" render={() => <Redirect to="/" />} />
            <Route exact path="/">
              {current ? <Redirect to="/os-team-dashboard-cards" /> : <NotFound />}
            </Route>
            <Route
              path="*"
              component={NotFound}
              render={() => <Redirect to="/notfound" />}
            />
          </Switch>
    
        ) :
        (
          <Switch location={location} key={location.pathname}>

            <PrivateRoute component={ChangePassword} path="/change-password" exact />
            <PrivateRoute component={RI} path="/ri" exact />

            <PrivateRoute component={Logout} path="/logout" exact />
            <PublicRoute path="/login" render={() => <Redirect to="/" />} />
            <Route exact path="/">
              {current ? <Redirect to="/ri" /> : <NotFound />}
            </Route>
            <Route
              path="*"
              component={NotFound}
              render={() => <Redirect to="/notfound" />}
            />
          </Switch>
    
        )
        
        
        }

      
      </AnimatePresence>
    </Suspense>
  );
}
