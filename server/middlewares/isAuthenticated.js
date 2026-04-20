import jwt from 'jsonwebtoken';

const isAuthenticated=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        console.log("COOKIES:", req.cookies);
        if(!token){

            return res.status(401).json({
                message:"User not authenticated",
                success:false
            })
        }
        const decode= jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false 
            })
        }
        req.id=decode.userId;
        
        next();

    } catch (error) {
        return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
    });

    }

}

export default isAuthenticated;