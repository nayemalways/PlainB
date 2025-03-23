import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Lottie from 'lottie-react';

 
const LegalContentSkeleton = () => {
    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card p-4">

                            <Skeleton count={25} />
                             
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LegalContentSkeleton;