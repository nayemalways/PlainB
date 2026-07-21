const UserOTP = async (req, res) => {
    const result = await UserOTPService(req);
    res.json(result);
};
export const userController = {
    UserOTP
};
//# sourceMappingURL=user.controller.js.map