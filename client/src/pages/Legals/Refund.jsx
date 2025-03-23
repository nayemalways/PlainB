import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import FeaturesStore from '../../store/feautresStore';

const Refund = () => {
    const { LegalRequest } = FeaturesStore();

    // Api Call
    useEffect(() => {

        (async () => {
            await LegalRequest('refund');
        })()

    }, [])
    return (
        <Layout>
            
        </Layout>
    );
};

export default Refund;