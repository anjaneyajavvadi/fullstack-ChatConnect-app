import jwt from 'jsonwebtoken';

export const generateTokens=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    res.cookie("jwt",token,{
        maxAge:1000*60*60*24*7,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development",
    })
}