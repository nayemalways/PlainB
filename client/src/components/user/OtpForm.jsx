import React from 'react';

const OtpForm = () => {
    return (
        <>
            <div className="container section">
                <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <div className="card p-5">
                        <h4>Enter Verification Code</h4>
                        <p>A verification code has been sent to the email address you provide</p>
                        <input placeholder="Verification" type="text" className="form-control"/>
                        {/* <SubmitButton submit={false} className="btn mt-3 btn-success" text="Submit"/> */}
                        <button className='btn mt-3 btn-success'>Submit</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OtpForm;