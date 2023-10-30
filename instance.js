// Database user type :begin
module.exports.SuperAdmin = "Super-Admin"
module.exports.Admin = "Admin"
module.exports.User = "User"
// Database user type :end 

// Errors sentence: begin 
module.exports.AtLeastOneFieldRequired = "Insert at least one value"
module.exports.FieldsMandotry = "All fields are mandotry!"
module.exports.ShortPassword = "Please enter a password that is 1 character or longer."
module.exports.ShortPin = "your pin must be between 4 - 6 digits."
module.exports.NotValidEmail = "Please enter a valid email"
module.exports.NotValidPhone = "Please enter a valid phone"
module.exports.NotSendingOtp = "Error sending Otp"
module.exports.NotValidData = "Data is not valid"
module.exports.UsernameOrPasswordWrong = "Username or password is wrong"
module.exports.passwordIsWrong = "Pin is wrong"
module.exports.oldPasswordWrong = "old password is wrong"
module.exports.OtpWrong = "Please enter valid OTP Number"
module.exports.OtpExpired = "OTP number has Expired"
module.exports.NotValidPassport = "Unauthorized, please enter a valid passport"
module.exports.WrongCheckOtpType = "Check type is wrong"
module.exports.TooLongString = "Too long value"
module.exports.NotAuthenticated = "user not authenticated"
module.exports.ChooseItem = "Please choose item first"
module.exports.NoData = "No data"
module.exports.SomethingWentWrong = "something went wrong"
module.exports.YourJourneyGotCanceled = "your journey got canceled, if you think this is a mistake plase contact the support "
module.exports.UserNotFound = "user not found"
module.exports.ThisIsAnAdminAccount = "admin account can't be an agent"
module.exports.BlackListedToken = "Token black listed."
module.exports.ReferralIdIsWrong = "Wrong referral Id."
module.exports.UserIdIsWrong = "User Id is wrong."
module.exports.sentTooManyOTPs = "Max send attempts reached please wait a while"
module.exports.orderPointBiggerThanLastStage = "order ticket can't be bigger than the max tickets number"
module.exports.NoEnoughMoney = "you don't have enough money please charge your wallet and try again"
module.exports.CompletedYOurJourneysForToday = "you completed your journeys for today"
module.exports.NoProducts = "Sorry there is no more products at this moment, try again later."
module.exports.UserHasAnotherJourney = "the User has another Journey please cancel or reset the other journey."
module.exports.PleaseCompleteYourJourney = "your have a journey on going please complete your journey to withdrawal"
module.exports.YouHavePendingRequest = "you have pending request"
// Errors sentence : end

// Auth Tokens and cookies: begin
module.exports.Authorization = "authorization"
module.exports.AuthorizationAdmin = "authorizationAdmin"
module.exports.UserData = "userData"
module.exports.PassportToken = "passportToken"
module.exports.ForgetPasswordToken = "forget-password-token"
// Auth Tokens and cookies: end

// account status : begin
module.exports.ValidAccount = "Valid"
module.exports.InValid = "InValid"
// account status : end

// product status : begin
module.exports.Deleted = "deleted"
// product status : end

// Otp check type: begin
module.exports.ForgetPasswordCheckOtpType = "forget-password"
module.exports.SignupCheckOtpType = "signup"

module.exports.otpPhoneApproved = "Approved"
module.exports.otpPhonePending = "Pending"
// Otp check type: end

// account levels begin
module.exports.Bronze = "Bronze"
// account levels end

// wallet :begin
module.exports.Charge = "Charging"
module.exports.WithdrawalByAdmin = "Withdrawal-By-Admin"
module.exports.Withdrawal = "Withdrawal"
module.exports.PracticeType = "Practice"
module.exports.NormalType = "Normal"
// wallet :end

// conversation : begin
module.exports.Deal = "Deal"
// conversation : end

// messages : begin
module.exports.File = "File"
// messages : end

// journy status : begin
module.exports.OngoingJourney = "OnGoing"
module.exports.InitJourney = "Init"
module.exports.PendingJourney = "Pending"
module.exports.DoneJourney = "Done"
module.exports.CanceledJourney = "Canceled"
// journy status : end

// Global
module.exports.Submitted = "Submitted"
module.exports.Accepted = "Accepted"
module.exports.Rejected = "Rejected"
// Globald

// account status 
module.exports.Blocked = "Blocked"
module.exports.Active = "Active"
module.exports.BlockedAccount = "Your account has been blocked. Please contact support for assistance."
// account status 

// far date
module.exports.farFutureDate = new Date('2030-12-31T23:59:59');