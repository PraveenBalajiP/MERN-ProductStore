import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authUser(req,res,next){
    const user=req.cookies.login_token;
    if(!user){
        return res.status(401).json({   message:"You need to be logged in to access this resource",
                                        status:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(user,process.env.ACCESS_TOKEN_SECRET);
        req.id=decoded.id;
        next();
    }
    catch(error){
        return res.status(401).json({   message:"You need to be logged in to access this resource",
                                        status:"Unauthorized"});
    }
}

export default authUser;