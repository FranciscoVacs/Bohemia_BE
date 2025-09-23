import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { throwError } from "../shared/errors/ErrorUtils.js";   

interface JWTPayload {
    id: number | undefined;
    email: string;
    isAdmin: boolean;
}
  
  // Extender la interfaz Request de Express para incluir el usuario
declare global {
    namespace Express {
      interface Request {
        user?: JWTPayload;
      }
    }
}


export const generateToken = (id:number|undefined,email : string, isAdmin: boolean) => {
   return jsonwebtoken.sign({id,email,isAdmin}, process.env.JWT_TOKEN_SECRET || 'tokentest', {expiresIn: '1h'});
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        throwError.custom("Required token", 401);
        return;
    }

    try{
        const secretKey = process.env.JWT_TOKEN_SECRET || 'tokentest';
        const decoded = jsonwebtoken.verify(token, secretKey) as unknown as JWTPayload;
        req.user = decoded;
        next();
    }
    catch(error) {
        throwError.custom("Unauthorized", 401);
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
      throwError.custom("Access denied: Admin only", 403);
    }
    next();
  };


  
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throwError.custom("Access denied: Authentication required", 401);
    }
    next();
  };

