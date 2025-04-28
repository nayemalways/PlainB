import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import SubmitButton from './SubmitButton';
import ValidationHelper from '../../utility/validationHelper';
import UserStore from '../../store/userStore';


const LoginFrom = () => {
    const {LoginFormData, inputOnchange , userOtpRequest} = UserStore();
    const navigate = useNavigate();
 
    const onFormSubmit = async () => {
         // API Request
        if(!ValidationHelper.isEmail(LoginFormData.email)) {
            toast.error("Valid email required!")
        }else {
            const res = await userOtpRequest(LoginFormData.email);
            if(res) {
                toast.success("6 digit OTP sent!");
                navigate("/otp-verify")
            }else {
                toast.error("Something went wrong")
            }
        }
    }


    return (
        <>
            <div className="container section">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-5">
                        <div className="card p-5">
                            <h4>Enter Your Email</h4>
                            <p>A verification code will be sent to the email address you provide</p>
                            <input 
                                value={LoginFormData.email} 
                                onChange={(e) => inputOnchange("email", e.target.value)}  
                                placeholder="Email Address" 
                                type="email" 
                                className="form-control"
                            />
                            <SubmitButton 
                                className="btn mt-3 btn-success" 
                                text="Next"
                                onClick={onFormSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginFrom;