import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import LegalContents from '../../components/features/LegalContents';
import FeaturesStore from '../../store/feautresStore';

const About = () => {
    const { LegalRequest } = FeaturesStore();

    // Api Call
    useEffect(() => {

        (async () => {
            await LegalRequest('about');
        })()

    }, [])
    
    return (
        <Layout>
            <LegalContents />
        </Layout>
    );
};

export default About;