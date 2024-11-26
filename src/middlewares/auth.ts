import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";   

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
        const message = "Required token";
        return res.status(401).send({message});
    }

    try{
        const decoded = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET || 'tokentest') as JWTPayload;
        req.user = decoded;
        console.log(decoded);
        next();
    }
    catch(error) {
      const message = "Unauthorized";
      return res.status(401).send({message});
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
      const message = "Access denied: Admin only";
      return res.status(403).send({ message });
    }
    next();
  };

  
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const message = "Access denied: Authentication required";
      return res.status(401).send({ message});
    }
    next();
  };