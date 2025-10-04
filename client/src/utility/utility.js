

export const setEmail = (email) => {
    sessionStorage.setItem('email', email)
}

export const getEmail = () => {
    return sessionStorage.getItem('email');
}

export const unauthorized = (code) => {
    if(code === 401) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href= "/login";
    }
}


// export const BaseServerUrl = "http://localhost:5002";
export const BaseServerUrl = "https://plainb-server.vercel.app";

 