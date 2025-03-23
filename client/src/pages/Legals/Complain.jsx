import React, { useEffect } from 'react';
import LegalContents from '../../components/features/LegalContents';
import FeaturesStore from '../../store/feautresStore';
import Layout from '../../components/layout/Layout';

const Complain = () => {
    const { LegalRequest } = FeaturesStore();

    // Api Call
        useEffect(() => {
    
            (async () => {
                await LegalRequest('complain');
            })()
    
        }, [])

    return (
        <Layout>
            <LegalContents />
        </Layout>
    );
};

export default Complain;