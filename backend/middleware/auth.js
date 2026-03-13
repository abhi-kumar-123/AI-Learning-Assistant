import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
    let token;
    //check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            //verify token

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User Not Found',
                    statusCode: 401
                });
            }
            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token has expired',
                    statusCode: 401
                });
            }
            return res.status(401).json({
                success: false,
                error: "Not authorized, token failed",
                statusCode: 401
            });
        }
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token',
            statusCode: 401
        });
    }
};

export default protect;

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const protect = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         // 1️⃣ Check header properly
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Not authorized, no token',
//                 statusCode: 401
//             });
//         }

//         // 2️⃣ Extract token safely
//         const token = authHeader.split(' ')[1];

//         // 3️⃣ Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 4️⃣ Get user
//         const user = await User.findById(decoded.id).select('-password');
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'User not found',
//                 statusCode: 401
//             });
//         }

//         // 5️⃣ Attach user & continue
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Auth middleware error:', error.message);

//         return res.status(401).json({
//             success: false,
//             error:
//                 error.name === 'TokenExpiredError'
//                     ? 'Token has expired'
//                     : 'Invalid token',
//             statusCode: 401
//         });
//     }
// };

// export default protect;
