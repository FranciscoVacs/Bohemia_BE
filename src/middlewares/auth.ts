import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";   

interface JWTPayload {
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


export const generateToken = (email : string, isAdmin: boolean) => {
   return jsonwebtoken.sign({email,isAdmin}, process.env.JWT_TOKEN_SECRET || 'tokentest', {expiresIn: '1h'});
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({message: "Required token"});
    }

    try{
        const decoded = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET || 'tokentest') as JWTPayload;
        req.user = decoded;
        console.log(decoded);
        next();
    }
    catch(error) {
        return res.status(401).json({message: "Unauthorized"});
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
  };

  
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required. Please log in' });
    }
    next();
  };