import React from 'react';
import UserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SubmitButton from './SubmitButton';

const OtpForm = () => {
    const { OtpVerifyRequest, OTPOnchange, OTPFormData } = UserStore();
    const navigate = useNavigate();

  
  

    const onFormSubmit = async () => {
         // API Request
        if(OTPFormData.otp.length === 6) {
            const res = await OtpVerifyRequest(OTPFormData.otp);

            if (res === true) {
                toast.success("Login success!");
                navigate("/");
            }else {
                toast.error(res);
            }
            
        } else {
            toast.error("OTP should be 6 digit")
        }
    }

    return (
        <>
            <div className="container section">
                <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <div className="card p-5">
                        <h4>Enter Verification Code</h4>
                        <p>A verification code has been sent to the email address you provide</p>
                        <input 
                            value={OTPFormData.opt} 
                            onChange={(e) => OTPOnchange("otp", e.target.value)}
                            placeholder="Verification" 
                            type="text" 
                            className="form-control"
                        />
                        {/* <SubmitButton submit={false} className="btn mt-3 btn-success" text="Submit"/> */}
                        <SubmitButton 
                                className="btn mt-3 btn-success" 
                                text="Verify"
                                onClick={onFormSubmit}
                        />
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OtpForm;