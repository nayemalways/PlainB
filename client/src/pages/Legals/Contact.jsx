import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import FeaturesStore from '../../store/feautresStore';
import LegalContents from '../../components/features/LegalContents';

const Contact = () => {
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

export default Contact;