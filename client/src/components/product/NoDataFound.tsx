import React from 'react';
import noDataImage from '../../assets/images/no-data.png';

const NoDataFound = () => {
    return (
        <div className='d-flex vh-100 justify-content-center align-items-center'>
            <img className='w-25' src={noDataImage} alt="No Data" />
        </div>
    );
};

export default NoDataFound;