import React from 'react';
import FeaturesStore from '../../store/feautresStore';
import FeaturesSkeleton from '../../skeleton/FeaturesSkeleton';

const Features = () => {
    const {FeaturesList} = FeaturesStore();

     // Check has Data fetched ohterwise showing loading skeleton
    if(FeaturesList === null) {
        return <FeaturesSkeleton/>
    }


    return (
        <>
            <div className="container section">
                <div className="row">
                    
                        {
                            FeaturesList.map((item, index) => {
                                return (
                                    <div key={index} className="col-6 p-2 col-md-3 col-lg-3 col-sm-6">
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-3">
                                                        <img className="w-100" src={item['img']} />
                                                    </div>
                                                    <div className="col-9">
                                                        <h3 className="bodyXLarge">{item['name']}</h3>
                                                        <span className="bodySmal">{item['description']}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
                    
                </div>
            </div>
        </>
    );
};

export default Features;