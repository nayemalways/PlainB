import React from 'react';

const LoginFrom = () => {
    return (
        <>
            <div className="container section">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-5">
                        <div className="card p-5">
                            <h4>Enter Your Email</h4>
                            <p>A verification code will be sent to the email address you provide</p>
                            <input placeholder="Email Address" type="email" className="form-control"/>
                            <button className='btn mt-3 btn-success'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginFrom;