import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

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