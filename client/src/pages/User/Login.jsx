import React, { useEffect } from 'react';
import LoginFrom from '../../components/user/LoginFrom';
import Layout from '../../components/layout/Layout';
import UserStore from '../../store/userStore';

const Login = () => {
    const { userRequest } = UserStore();

    useEffect(() => {

        (async () => {
            await userRequest();
        })()
    }, [])
    
    return (
        <Layout>
           <LoginFrom /> 
        </Layout>
    );
};

export default Login;