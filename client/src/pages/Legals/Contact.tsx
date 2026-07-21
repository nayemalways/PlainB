import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout.tsx';
import FeaturesStore from '../../store/feautresStore.ts';
import LegalContents from '../../components/features/LegalContents.tsx';

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