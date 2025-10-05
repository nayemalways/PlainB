

const Fail = ({payment_text}) => {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const shortDate = date.toLocaleDateString('en-US', options);
    return (
        <div>
             <div className="container">
                <div className="card fail-card text-center p-4">
                    <div className="card-body">
                        <div className="fail-icon">
                            <i className="bi bi-x-lg fs-4 text-danger"></i>
                        </div>
                        <h2 className="card-title text-danger mb-3"> {payment_text} </h2>
                        <p className="card-text text-muted mb-4">
                            We couldn't process your payment. Please check your payment details and try again.
                        </p>
                        
                        <div className="error-details mb-4 text-start bg-light p-3 rounded">
                            <h5 className="mb-3 text-danger">Error Details</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Error Code:</span>
                                <span className="text-danger">DECLINE-2024</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Amount:</span>
                                <span>$49.99</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Date:</span>
                                <span> {shortDate} </span>
                            </div>
                            <div className="alert alert-warning mt-2 small">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                This might be due to insufficient funds or incorrect card details.
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-center gap-3">
                            <a href="#" className="btn btn-try-again btn-lg rounded-pill">
                                <i className="fas fa-redo me-2"></i> Try Again
                            </a>
                            <a href="#" className="btn btn-outline-secondary btn-lg rounded-pill">
                                Use Different Method
                            </a>
                        </div>
                        
                        <div className="mt-4">
                            <p className="text-muted small">Need help? <a href="#">Contact Support</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fail;