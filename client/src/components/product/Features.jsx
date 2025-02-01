import React from 'react';
import FeaturesStore from '../../store/feautresStore';
import FeaturesSkeleton from '../../skeleton/FeaturesSkeleton';

const Features = () => {
    const {FeaturesList} = FeaturesStore();
    
    if(FeaturesList === null) {
        return <FeaturesSkeleton/>
    }
    
    return (
        <div>
            
        </div>
    );
};

export default Features;