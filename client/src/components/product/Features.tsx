import React from 'react';
import FeaturesStore from '../../store/feautresStore.ts';
import FeaturesSkeleton from '../../skeleton/FeaturesSkeleton.tsx';

const Features = () => {
  const { FeaturesList, isFeaturesLoading } = FeaturesStore();

  // Check has Data fetched ohterwise showing loading skeleton
  if (isFeaturesLoading || FeaturesList === null) {
    return <FeaturesSkeleton />;
  }

  return (
    <>
      <div className="container section">
        <div className="row">
          {FeaturesList.length > 0 ? FeaturesList.map((item, index) => {
            return (
              <div key={index} className="col-6 p-2 col-md-3 col-lg-3 col-sm-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-3 d-flex align-items-center">
                        <img className="img-fluid" src={item['img']} />
                      </div>
                      <div className="col-9">
                        <h3 className="bodyXLarge">{item['name']}</h3>
                        <span className="bodySmall">{item['description']}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : <p className="text-center text-secondary py-4">No features found</p>}
        </div>
      </div>
    </>
  );
};

export default Features;
