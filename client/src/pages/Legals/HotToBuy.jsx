import React, { useEffect } from 'react';
import FeaturesStore from '../../store/feautresStore';
import Layout from '../../components/layout/Layout';
import LegalContents from '../../components/features/LegalContents';

const HotToBuy = () => {
    const { LegalRequest } = FeaturesStore();

    // Api Call
    useEffect(() => {

        (async () => {
            await LegalRequest('howtobuy');
        })()

    }, [])
    return (
        <Layout>
            <LegalContents />
        </Layout>
    );
};

export default HotToBuy;