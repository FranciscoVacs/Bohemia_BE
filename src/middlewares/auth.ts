import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";   




export const generateToken = (email : string) => {
   return jsonwebtoken.sign({email}, process.env.JWT_TOKEN_SECRET || 'tokentest', {expiresIn: '1h'});
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({message: "Required token"});
    }

    try{
        jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET || 'tokentest'); 
        next();
    }
    catch(error) {
        return res.status(401).json({message: "Unauthorized"});
    }
};