import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({children}) => {
    return (
        <>
            <Navbar/>
                {children}
                <Toaster position="bottom-right"/>
            <Footer/>
        </>
    );
};

export default Layout;