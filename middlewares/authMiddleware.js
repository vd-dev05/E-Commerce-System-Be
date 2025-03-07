import jwt from 'jsonwebtoken'
import UserModel from '../models/auth/userModel.js';
import ManagerModel from '../models/shop/managerModel.js';
import { UnauthorizedError } from '../error/user/userError.js';

const validateUserInput = async (req, res, next) => {
    const { username, email, password, gender, birthday, phone, isLoginGoogle } = req.body;
    try {
        const emailExists = await UserModel.findOne({ email })
        if (emailExists) {
            return res.json({
                success: false,
                message: "Địa chỉ email này đã tồn tại"
            });
        }

        if (isLoginGoogle === true) {
            return next()
        }
        if (!username || !email || !password || !gender || !birthday || !phone) {
            return res.json({
                success: false,
                message: 'Vui lòng điền các vào chỗ trống'
            })
        }
        const usernameRegex = /^[A-Za-z\s]+$/;
        if (!usernameRegex.test(username)) {
            return res.json({
                success: false,
                message: "Tên người dùng chỉ được chứa chữ cái"
            });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: 'Định dạng email không hợp lệ'
            });
        }
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(Number(phone))) {
            return res.json({
                success: false,
                message: 'Số điện thoại phải là số và có 10 chữ số'
            });
        }


        const phoneExists = await UserModel.findOne({ phone })
        if (phoneExists) {
            return res.json({
                success: false,
                message: "Số điện thoại này đã tồn tại"
            });
        }
        next()
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}
const authMiddleware = async (req, res, next) => {

    const token = req.cookies.token;


    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next()
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


const validateManagerInput = async (req, res, next) => {
    const { manager_name, email, password, phone } = req.body;
    try {
        if (!manager_name || !email || !password || !phone) {
            return res.json({
                success: false,
                message: 'Vui lòng điền các vào chỗ trống'
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: 'Định dạng email không hợp lệ'
            });
        }
        const phoneRegex = /^0[1-9][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            return res.json({
                success: false,
                message: 'Số điện thoại phải là số và có 10 chữ số'
            });
        }

        const emailExists = await ManagerModel.findOne({ email })
        if (emailExists) {
            return res.json({
                success: false,
                message: "Địa chỉ email này đã tồn tại"
            });
        }
        const phoneExists = await ManagerModel.findOne({ phone })
        if (phoneExists) {
            return res.json({
                success: false,
                message: "Số điện thoại này đã tồn tại"
            });
        }
        next()
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }

}

const managerAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.manager_token;

    if (!token) return res.json({
        success: false,
        message: 'Unauthorised user !'

    })
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.manager = decoded;
        next()
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

const saleProductAuthMiddleware = async (req, res, next) => {
    try {
        if (req.headers['authorization'] === undefined) throw new Error('Authentication required')
        const token = req.headers['authorization'];
        const split = token.split(' ')[1]

        const decoded = jwt.verify(split, process.env.JWT_SECRET_SALE);

        if (!decoded) {
            return res.json({
                success: false,
                message: 'Unauthorised Sale not found !'
            })
        }
        req.socketSale = decoded;
        next()
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { authMiddleware, validateUserInput, validateManagerInput, managerAuthMiddleware, saleProductAuthMiddleware }