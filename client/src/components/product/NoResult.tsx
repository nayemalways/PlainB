import React from 'react';

const NoResult = () => {
    return (
        <div className='position-absolute top-50 start-50 transform'>
            <p className='fs-4 font-bold text-secondary'>No result found</p>
        </div>
    );
};

export default NoResult;