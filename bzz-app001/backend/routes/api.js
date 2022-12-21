const express = require("express");

const { catchErrors } = require("../handlers/errorHandlers");

const router = express.Router();

const adminController = require("../controllers/adminController");
const beelineController = require("../controllers/beelineController");

const DailyProductivityController = require("../controllers/dailyProductivityController");
const DailyProgressController = require("../controllers/dailyProgressController");
const irbController = require("../controllers/irbController");
const coverageGovermentController = require("../controllers/coverageGovermentController");
const billingCalendarStaffController = require("../controllers/billingCalendarStaffController");
const billingColorController = require("../controllers/billingColorController");
const billingTeamListController = require("../controllers/billingTeamListController");
const billingReminderController = require('../controllers/billingReminderController');
const performanceCardsController = require('../controllers/performanceCardsController');
const authController = require('../controllers/authController');

const ProgressController = require("../controllers/ProgressController");
const feedbackController = require("../controllers/feedbackController");

const BillingIrbBudgetStatusController = require("../controllers/billingIrbBudgetStatusController");
const BillingNoPccStudiesController = require("../controllers/billingNoPccStudiesController");
const coveragesLLoggerController = require('../controllers/coveragesGovernmentLoggerController');
const pageLoggerController = require("../controllers/pageLoggerController");
const himsteamrosterController = require("../controllers/himsTeamRosterController");
const himsTeamUserScheduleController = require("../controllers/himsTeamUserScheduleController");
const epicProductivityController = require("../controllers/epicProductivityController");
const epicProductivity1Controller = require("../controllers/epicProductivity1Controller");
const emailLoggerController = require("../controllers/emailLoggerController");
const masterTaskListController = require("../controllers/masterTaskListController");
const beelinefileloggerController = require("../controllers/beelineFileLoggerController")
const settingsLoggerController = require('../controllers/settingsLoggerController');
const RICostServicesController = require('../controllers/RICostServicesController')
const databaseController = require('../controllers/databaseController')
const avatarController = require('../controllers/avatarController')


// ______________________________ Page Logger __________________________________
router.route("/pageLogger/list").get(catchErrors(pageLoggerController.list));


//_______________________________ Database _______________________________________
router.route("/database/query").post(catchErrors(databaseController.query));

router.route("/avatar-tabs/list").get(catchErrors(avatarController.tabs));
router.route("/avatar-images/list").get(catchErrors(avatarController.photos));



//_____________________________________ API for coverages Governemt Logger __________________________
router.route("/settingsLogger/create").post(catchErrors(settingsLoggerController.create));

// ______________________________ Page Logger __________________________________
router.route("/emailLogger/list").get(catchErrors(emailLoggerController.list));
router.route("/emailuserfilter/list").get(catchErrors(emailLoggerController.userFilter));
router.route("/emailLogger1/list").get(catchErrors(emailLoggerController.list1));
router.route("/emailLogger-search/list").get(catchErrors(emailLoggerController.search));


// ______________________________ Epic Productivity __________________________________
router.route("/epic-productivity/list").get(catchErrors(epicProductivityController.list));

// ______________________________ Epic Productivity 1 __________________________________
router.route("/epic-productivity1/list").get(catchErrors(epicProductivity1Controller.list));


//_______________________________ Admin management_______________________________
router.route("/change-password/create").post(catchErrors(adminController.changePassword));

router.route("/admin/create").post(catchErrors(adminController.create));
// router.route("/admin/read/:id").get(catchErrors(adminController.read));
router.route("/admin/update/:id").patch(catchErrors(adminController.update));
router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
// router.route("/admin/search").get(catchErrors(adminController.search));
router.route("/admin/list").get(catchErrors(adminController.list));
router.route("/admin-fulllist/list").get(catchErrors(adminController.fullList));
router.route("/admin-findall/list").get(catchErrors(adminController.findALL));
router.route("/getuserbysection/list").get(catchErrors(adminController.getUserBySection));


router.route("/admin-one/list1").post(catchErrors(adminController.one));
router.route("/admin-avatar/update/:id").patch(catchErrors(adminController.updateImage));

// ______________________________User ___________________________________________
router.route("/admin/switch").post(catchErrors(authController.switch));

// router
//   .route("/admin/password-update/:id")
//   .patch(catchErrors(adminController.updatePassword));
// //list of admins ends here

router.route("/beeline/list").get(catchErrors(beelineController.list));
router.route("/beeline-full-list/list").get(catchErrors(beelineController.fullList));
router.route("/beeline-filters/list").get(catchErrors(beelineController.filters));
router.route("/previous-entry/create").post(catchErrors(beelineController.savePrevious));
router.route("/previous-entry/list").get(catchErrors(beelineController.getPrevious));
router.route("/beeline/update/:id").patch(catchErrors(beelineController.update));
router.route("/beeline/create").post(catchErrors(beelineController.create));




router.route("/himsteamroster-contractor/list").get(catchErrors(himsteamrosterController.contactor));


//_____________________________________ API for wq5508 Progress __________________________
router.route("/progress/create").post(catchErrors(ProgressController.create));
router.route("/progress/update/:id").post(catchErrors(ProgressController.update));


//_____________________________________ API for Feedback __________________________
router.route("/feedback/list").get(catchErrors(feedbackController.list));
router.route("/feedback/create").post(catchErrors(feedbackController.create));





router.route("/ri-costservices/list1").post(catchErrors(RICostServicesController.list));
router.route("/ri-costservices-filters/list").get(catchErrors(RICostServicesController.filters));



//  ___________________________________ API for DailyProductivy ___________________
router.route("/dailyproductivity/list").get(catchErrors(DailyProductivityController.list));


//  ___________________________________ API for EpicDailyProgress ___________________
router.route("/dailyprogress/list").get(catchErrors(DailyProgressController.list));


//_____________________________________ API for Beeline ___________________________
router.route("/beelinefilelogger/list").get(catchErrors(beelinefileloggerController.list));

//_____________________________________ API for irbs ___________________________
router.route("/irb/create").post(catchErrors(irbController.create));
router.route("/irb/delete/:id").delete(catchErrors(irbController.delete));
// router.route("/irb/read/:id").get(catchErrors(irbController.read));
router.route("/irb/update/:id").patch(catchErrors(irbController.update));
// router.route("/irb/search").get(catchErrors(irbController.search));
router.route("/irb/list").get(catchErrors(irbController.list));

// ____________________________________ API for himsteamroster __________________ 
router.route("/himsteamroster/list").get(catchErrors(himsteamrosterController.list));
router.route("/himsteamroster-department/list").get(catchErrors(himsteamrosterController.department));

router.route("/himsteamroster/update/:id").patch(catchErrors(himsteamrosterController.update));
router.route("/himsteamroster/create").post(catchErrors(himsteamrosterController.create));
router.route("/himsteamroster/delete/:id").delete(catchErrors(himsteamrosterController.delete));

// ____________________________________ API for himsUserSchedule __________________ 
router.route("/himsuserschedule/list").get(catchErrors(himsTeamUserScheduleController.list));
router.route("/himsuserschedule-filters/list").get(catchErrors(himsTeamUserScheduleController.filters));
router.route("/himsuserschedule/create").post(catchErrors(himsTeamUserScheduleController.create));
router.route("/himsuserschedule/delete/:id").delete(catchErrors(himsTeamUserScheduleController.delete));
router.route("/himsuserschedule/update/:id").patch(catchErrors(himsTeamUserScheduleController.update));

// ____________________________________ API for himsUserSchedule __________________ 
router.route("/himsmastertasklist/list").get(catchErrors(masterTaskListController.list));
router.route("/himsmastertasklist-filters/list").get(catchErrors(masterTaskListController.filters));
router.route("/himsmastertasklist/create").post(catchErrors(masterTaskListController.create));
router.route("/himsmastertasklist/delete/:id").delete(catchErrors(masterTaskListController.delete));
router.route("/himsmastertasklist/update/:id").patch(catchErrors(masterTaskListController.update));


//_____________________________________ API for billingCalendarStaffController __________________________
router.route("/billingcalendarstaff/list/:month/:year/:date_column").get(catchErrors(billingCalendarStaffController.list));
router.route("/billingcalendarstaff/create").post(catchErrors(billingCalendarStaffController.create));
router.route("/billingcalendarstaff/update/:id").patch(catchErrors(billingCalendarStaffController.update));
router.route("/billingcalendarstaff/delete/:id").delete(catchErrors(billingCalendarStaffController.delete));

//_____________________________________ API for billingColorController __________________________
router.route("/billingcolor/read/:id").get(catchErrors(billingColorController.read));
router.route("/billingcolor/create").post(catchErrors(billingColorController.create));
router.route("/billingcolorwq5508/update/:id").patch(catchErrors(billingColorController.update));


//_____________________________________ API for billingReminderController __________________________
router.route("/billingreminder/read/:id").get(catchErrors(billingReminderController.read));
router.route("/billingreminder/create").post(catchErrors(billingReminderController.create));
router.route("/billingreminder/update/:id").patch(catchErrors(billingReminderController.update));


//_____________________________________ API for billingReminderController __________________________
router.route("/performance-cards/read/:id").get(catchErrors(performanceCardsController.read));
router.route("/performance-cards/create").post(catchErrors(performanceCardsController.create));
router.route("/performance-cards/update/:id").patch(catchErrors(performanceCardsController.update));

//_____________________________________ API for billingteamList __________________________
router.route("/billingteamlist/list").get(catchErrors(billingTeamListController.list));

//_____________________________________ API for coverageGoverments ___________________________
// router
//   .route("/coverageGoverment/create")
//   .post(catchErrors(coverageGovermentController.create));
// router
//   .route("/coverageGoverment/read/:id")
//   .get(catchErrors(coverageGovermentController.read));
router
  .route("/coverageGoverment/update/:id")
  .patch(catchErrors(coverageGovermentController.update));
// router
//   .route("/coverageGoverment/delete/:id")
//   .delete(catchErrors(coverageGovermentController.delete));
// router
//   .route("/coverageGoverment/search")
//   .get(catchErrors(coverageGovermentController.search));
router
  .route("/coverageGoverment/list")
  .get(catchErrors(coverageGovermentController.list));


  
//_____________________________________ API for coverages Governemt Logger __________________________
router.route("/coverageGovermentLogger/create").post(catchErrors(coveragesLLoggerController.create));


//_____________________________________ API for BillingIRBBudgetStatus ___________________________

router
  .route("/billingirbbudgetstatus/update/:id")
  .patch(catchErrors(BillingIrbBudgetStatusController.update));

router
  .route("/billingirbbudgetstatus/list")
  .get(catchErrors(BillingIrbBudgetStatusController.list));

router.route("/billingirbbudgetstatus/create").post(catchErrors(BillingIrbBudgetStatusController.create));
router.route("/billingirbbudgetstatus/delete/:id").delete(catchErrors(BillingIrbBudgetStatusController.delete));
router.route("/billingirbbudgetstatus-status-list/list").get(catchErrors(BillingIrbBudgetStatusController.fullList));
  

//_____________________________________ API for BillingNoPccStatus ___________________________

router
  .route("/billingnopccstudies/update/:id")
  .patch(catchErrors(BillingNoPccStudiesController.update));

router
  .route("/billingnopccstudies/list")
  .get(catchErrors(BillingNoPccStudiesController.list));

router.route("/billingnopccstudies/create").post(catchErrors(BillingNoPccStudiesController.create));
router.route("/billingnopccstudies/delete/:id").delete(catchErrors(BillingNoPccStudiesController.delete));
router.route("/billingnopccstudies-studies-list/list").get(catchErrors(BillingNoPccStudiesController.fullList));
  
module.exports = router;
