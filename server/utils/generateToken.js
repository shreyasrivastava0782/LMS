// import jwt from 'jsonwebtoken'

// export const generateToken=(res,user,message)=>{
//     const token=jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
//     return res
//     .status(200)
//     .cookie("token",token,{
//         httpOnly:true,
//         sameSite:'lax',
//         secure: false, 
//         path:"/",
//         // sameSite:'none',
//         // secure:true,
//         maxAge:24*60*60*1000
//     }).json({
//         success:true,
//         message,
//         user
//     })
    
// }


import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  // ✅ SET COOKIE FIRST (separate)
  res.cookie("token", token, {
  httpOnly: true,
  secure: false ,       // 🔥 MUST be true
  sameSite: "lax",      // 🔥 MUST be none
  path: "/",
  maxAge:24*60*60*1000
});
  

  return res.status(200).json({
    success: true,
    message,
    user,
  });
};