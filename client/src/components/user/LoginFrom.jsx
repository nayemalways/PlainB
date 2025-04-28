import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import UserStore from '../../store/userStore';

const LoginFrom = () => {
    const {LoginFormData, inputOnchange } = UserStore();

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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginFrom;