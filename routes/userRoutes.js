const express = require("express");
const { createUser, singIn, checkOtp, forgetPassword, changePassword, getSignIn, resendOtp, logout, getUsers, getUserById, getUsersById, resetPassword, checkPhoneOtp, getUsersByRole, resendPhoneOtp, updateUser, resetUserPassword, searchUser, getUsersInfo, updatePinWithdrawal, saveWalletAddress, logoutDashboard } = require("../controllers/userController");
const bodyParser = require("body-parser");
const catchAsyncError = require("../middleware/catchAsyncError");
const { checkForgetPasswordAuth, checkDevCreateAdmin, checkAdminAuth, checkPassportAuth, checkNotAuth, checkSuperAdminAuth, checkAuth, checkChatAuth, checkNotAuthAdmin } = require("../middleware/checkAuth");
const { createSuperAdminAccount, passportCheckIn, createAdmin, createPracticeUser, getWithdrawalRequests, answerWithdrawalRequest } = require("../controllers/adminController");
const { createProduct, editProducts, deleteProducts, getProducts, getProductById } = require("../controllers/productController");
const { createCommissionLevels, getCommissionLevels, editCommissionLevels, getCommissionLevelsById } = require("../controllers/commissionController");
const { createNewOrder } = require("../controllers/orderController");
const { chargeWallet, getWalletsById, getWalletsByUserId, editWalletValue, withdrawalRequest, getWalletsByUserIdForUser } = require("../controllers/walletController");
// const { getConversations, getAdminConversations, getUserConversations, getClientChat } = require("../controllers/chatController");
const { upload } = require("../helpers/multer");
const Journey = require("../dbConnnection/model/Journey");
const { placeJourney, editJourneys, placeOrder, submitOrder, getLastJourneyInof, cancelJourney, userJourneys, getJourneyHistory, userJourneysByAdmin, getJourneyByIdForAdmin, resetJourney, getSingleJourneyHistory, resetAllCompletedJourneys } = require("../controllers/journeyController");
const { getMyTransactions, getTransaction } = require("../controllers/transactionsController");
const { createCustomJourneys, editCustomJourneys, getCustomJourney, getCustomJourneys } = require("../controllers/customJourneyController");
const { addParameter, updateParameter, getParametersById, getParameters, getParametersByName, getParametersByAdmin, removeParameter } = require("../controllers/parametersController");
const { saveLogs } = require("../middleware/logs");
const router = express.Router();
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))



//admin begin
router.post("/create-super-admin", checkDevCreateAdmin, catchAsyncError(createSuperAdminAccount))//dev
// router.post("/passport-checkIn", checkAdminAuth, catchAsyncError(passportCheckIn))//delete
router.post("/create-admin", checkAdminAuth, catchAsyncError(createAdmin))//super admin
router.post("/create-practice-account", checkAdminAuth, catchAsyncError(createPracticeUser))//admin
// admin end



// user begin
router.post("/signup", catchAsyncError(createUser))
router.post("/signin", catchAsyncError(singIn))
router.delete("/logout", catchAsyncError(logout))
router.delete("/logout-dashboard", catchAsyncError(logoutDashboard))
router.get("/get-signin", checkNotAuth, catchAsyncError(getSignIn))
router.get("/get-signin-dashboard", checkNotAuthAdmin, catchAsyncError(getSignIn))
// router.post("/check-otp", catchAsyncError(checkOtp))
router.post("/check-phone-otp", catchAsyncError(checkPhoneOtp))
// router.post("/resend-otp", catchAsyncError(resendOtp))
router.post("/resend-phone-otp", catchAsyncError(resendPhoneOtp))
router.post("/forget-password", catchAsyncError(forgetPassword))
router.post("/forget-password/change-password", checkForgetPasswordAuth, catchAsyncError(resetPassword))
router.get("/get-users", checkAdminAuth, saveLogs, catchAsyncError(getUsers))
router.get("/get-user-by-role", checkAdminAuth, catchAsyncError(getUsersByRole))
router.get("/get-user-by-id", checkAdminAuth, catchAsyncError(getUsersById))
router.get("/get-user-info", checkAuth, saveLogs, catchAsyncError(getUsersInfo))
router.put("/update-user", checkAdminAuth, catchAsyncError(updateUser))
router.post("/change-password", checkAuth, saveLogs, catchAsyncError(resetUserPassword))
router.get("/search-user", checkAdminAuth, catchAsyncError(searchUser))
// router.post("/save-withdrawal-pin", checkAuth, catchAsyncError(addPinWithdrawal))
router.post("/save-wallet-address", checkAuth, saveLogs, catchAsyncError(saveWalletAddress))
router.post("/change-withdrawal-pin", checkAuth, saveLogs, catchAsyncError(updatePinWithdrawal))
// user end

// product begin
router.post("/create-product", checkAdminAuth, upload.single('productImage'), catchAsyncError(createProduct))
router.post("/edit-product", checkAdminAuth, upload.single('productImage'), catchAsyncError(editProducts))
router.delete("/delete-product", checkAdminAuth, catchAsyncError(deleteProducts))
router.get("/get-products", checkAdminAuth, catchAsyncError(getProducts))
router.get("/get-product", checkAdminAuth, catchAsyncError(getProductById))
// product end

// commission Levels begin
router.post("/create-commission-level", checkSuperAdminAuth, catchAsyncError(createCommissionLevels))
router.post("/edit-commission-level", checkSuperAdminAuth, catchAsyncError(editCommissionLevels))
router.get("/get-commission-levels", checkSuperAdminAuth, catchAsyncError(getCommissionLevels))
router.get("/get-commission-level", checkSuperAdminAuth, catchAsyncError(getCommissionLevelsById))
// commission Levels end

// order begin
// router.post("/place-order", checkAdminAuth, catchAsyncError(createNewOrder))
// order end

// wallet begin
router.get("/get-wallet", checkAdminAuth, catchAsyncError(getWalletsByUserId))
router.get("/get-user-wallet", checkAuth, saveLogs, catchAsyncError(getWalletsByUserIdForUser))
router.post("/charge-wallet", checkAdminAuth, catchAsyncError(chargeWallet))
router.post("/edit-wallet", checkAdminAuth, catchAsyncError(editWalletValue))
router.post("/withdrawal-wallet", checkAuth, saveLogs, catchAsyncError(withdrawalRequest))
router.get("/get-withdrawal-requests", checkSuperAdminAuth, catchAsyncError(getWithdrawalRequests))
router.post("/answer-withdrawal-requests", checkSuperAdminAuth, catchAsyncError(answerWithdrawalRequest))
// wallet end

// chat : begin
// router.get("/get-conversations", checkSuperAdminAuth, catchAsyncError(getConversations))//only super admin could see all the conversations
// router.get("/get-user-conversations", checkSuperAdminAuth, catchAsyncError(getUserConversations))//only super admin could see users conversations
// router.get("/get-admin-conversations", checkAdminAuth, catchAsyncError(getAdminConversations))//get the admin conversations
// router.get("/get-chat", checkAuth, checkChatAuth, catchAsyncError(getClientChat))//need test
// // chat : end

// Journey : begin
router.post("/create-journey", checkAdminAuth, catchAsyncError(placeJourney))
router.post("/edit-journey", checkAdminAuth, catchAsyncError(editJourneys))
router.get("/get-journey", checkAuth, saveLogs, catchAsyncError(getLastJourneyInof))
router.post("/place-order", checkAuth, saveLogs, catchAsyncError(placeOrder))
router.post("/submit-order", checkAuth, saveLogs, catchAsyncError(submitOrder))
router.put("/cancel-journey", checkAdminAuth, catchAsyncError(cancelJourney))
router.put("/reset-journey", checkAdminAuth, catchAsyncError(resetJourney))
router.get("/journeys-history", checkAuth, catchAsyncError(userJourneys))
router.get("/get-single-journey-history", checkAuth, catchAsyncError(getSingleJourneyHistory))
router.get("/get-journey-history", checkAuth, saveLogs, catchAsyncError(getJourneyHistory))
router.get("/user-journeys-history", checkAdminAuth, saveLogs, catchAsyncError(userJourneysByAdmin))
router.get("/get-journey-by-id", checkAdminAuth, catchAsyncError(getJourneyByIdForAdmin))
router.get("/reset-all-journeys", checkAdminAuth, catchAsyncError(resetAllCompletedJourneys))

// Journey : end

// custom journys: begin
router.post("/create-custom-journey", checkAdminAuth, catchAsyncError(createCustomJourneys))
router.put("/edit-custom-journey", checkAdminAuth, catchAsyncError(editCustomJourneys))
router.get("/get-custom-journey-by-id", checkAdminAuth, catchAsyncError(getCustomJourney))
router.get("/get-custom-journeys", checkAdminAuth, catchAsyncError(getCustomJourneys))

// custom journys: end

// transactions : begin
router.get("/get-my-transactions", checkAuth, saveLogs, catchAsyncError(getMyTransactions))
router.get("/get-transactions", checkAdminAuth, catchAsyncError(getTransaction))
// transactions : end


// Parameters: end
router.post("/create-parameter", checkAdminAuth, catchAsyncError(addParameter))
router.put("/update-parameter", checkAdminAuth, catchAsyncError(updateParameter))
router.get("/get-parameter-by-id", checkAdminAuth, catchAsyncError(getParametersById))
router.get("/get-parameters-by-admin", checkAdminAuth, catchAsyncError(getParametersByAdmin))
router.get("/get-user-parameter-by-id", checkAuth, catchAsyncError(getParametersById))
router.get("/get-parameters", checkAuth, catchAsyncError(getParameters))
router.get("/get-parameter-by-name", checkAuth, catchAsyncError(getParametersByName))
router.delete("/remove-parameter", checkAuth, catchAsyncError(removeParameter))
// Parameters: begin


module.exports = router;