class ValidationHelper {
    static isEmail (value) {
        const EmailRegx = /\S+@\S+\.\S+/;
        return EmailRegx.test(value);
    }
}

export default ValidationHelper;