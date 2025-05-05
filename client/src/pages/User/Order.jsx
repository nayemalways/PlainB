import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const Order = () => {

    let {trn_id , payment_status} = useParams();

    return (
        <Layout>
            <h1>Your Order status: {payment_status}</h1>
            <p>Order id: {trn_id}</p>
        </Layout>
    );
};

export default Order;