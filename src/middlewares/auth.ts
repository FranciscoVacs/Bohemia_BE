import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";   

const JWT_TOKEN_SECRET= "secret";

export const generateToken = (email : string) => {
   return jsonwebtoken.sign({email}, JWT_TOKEN_SECRET, {expiresIn: '1h'});
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({message: "Required token"});
    }

    try{
        jsonwebtoken.verify(token, JWT_TOKEN_SECRET); 
        next();
    }
    catch(error) {
        return res.status(401).json({message: "Unauthorized"});
    }
};