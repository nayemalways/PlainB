

export const setEmail = (email) => {
    sessionStorage.setItem('email', email)
}

export const getEmail = () => {
    return sessionStorage.getItem('email');
}
