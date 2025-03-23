import React from 'react';
import LegalContentSkeleton from '../../skeleton/LegalContentSkeleton';
import FeaturesStore from '../../store/feautresStore';
import parser from 'html-react-parser';

const LegalContents = () => {
    const { legalList } = FeaturesStore();

 
    if(legalList === null) {
        return <LegalContentSkeleton />
    }else {
        return (
            <>
                <div className="container mt-3">
                     <div className="row">
                         <div className="col-md-12">
                             <div className="card p-4">
     
                                  {
                                   legalList && parser(legalList[0]?.description)
                                  }
                                  
                             </div>
                         </div>
                     </div>
                 </div>       
            </>
        );
    }

   
};

export default LegalContents;