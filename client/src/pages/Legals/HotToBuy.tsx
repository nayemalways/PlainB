import React, { useEffect } from 'react';
import FeaturesStore from '../../store/feautresStore.ts';
import Layout from '../../components/layout/Layout.tsx';
import LegalContents from '../../components/features/LegalContents.tsx';

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