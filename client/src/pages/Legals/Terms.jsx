import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import LegalContents from '../../components/features/LegalContents';
import FeaturesStore from '../../store/feautresStore';

const Terms = () => {
    const { LegalRequest } = FeaturesStore();

    // Api Call
    useEffect(() => {

        (async () => {
            await LegalRequest('contact');
        })()

    }, [])
    return (
        <Layout>
            <LegalContents />
        </Layout>
    );
};

export default Terms;