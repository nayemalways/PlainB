 
import {UserOTPService, VerifyOTPService, SaveProfileService, ReadProfileService} from "../Services/UserServices.js";




export const UserOTP = async (req, res) => {
    const result = await UserOTPService(req);
    res.json(result);
}


 export const OTPVerifyLogin = async (req, res) => {
    const result = await VerifyOTPService(req);

    // Set cookie
    if(result['status'] === 'Success') {
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,   // prevents JS access (XSS protection)
            secure: true,     // cookie only sent over HTTPS (in production)
            sameSite: "strict" // prevents CSRF (adjust if you need cross-site)
        };

        res.cookie("token", result['Token'], cookieOptions);
        res.json(result);
    }else {
        res.json(result);
    }
} 


export const UserLogout = async (req, res) => {
     // Remove cookie option by minus (-)
     const cookieOptions = {expires: new Date(Date.now() - 24 * 60 * 60 * 1000), httpOnly: false};
     res.cookie("token", "", cookieOptions);
     res.json({status: "Success", message: "Logout success"});

}


export const SaveProfile = async (req, res) => {
    const result = await SaveProfileService(req);
    res.json(result);
}


export const ReadProfile = async (req, res) => {
   const result = await ReadProfileService(req);
   return res.json(result);
}
 