import React from 'react';

const Success = ({tran_id}) => {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const shortDate = date.toLocaleDateString('en-US', options);
 
    return (
        <div>
             <div className="container">
                <div className="card success-card text-center p-4">
                    <div className="card-body">
                        <div className="success-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2 className="card-title mb-3">Payment Successful!</h2>
                        <p className="card-text text-muted mb-4">
                            Your payment has been processed successfully. 
                            We've sent you an email with the details of your transaction.
                        </p>
                        
                        <div className="order-details mb-4 text-start">
                            <h5 className="mb-3">Order Details</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Order ID:</span>
                                <span>#{tran_id}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Amount Paid:</span>
                                <span>$49.99</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Date:</span>
                                <span>{shortDate}</span>
                            </div>
                        </div>
                        
                        <a href="/" className="btn btn-continue btn-lg rounded-pill mt-3">
                            Continue Shopping <i className="fas fa-arrow-right ms-2"></i>
                        </a>
                        
                        <div className="mt-4">
                            <p className="text-muted small">Need help? <a href="#">Contact Support</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;