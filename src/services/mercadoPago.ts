import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import type{ Request, Response, NextFunction } from 'express';

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export const createOrder = (price:number, email:string) =>async (req: Request, res: Response, next: NextFunction) => {

    

    const preference = await new Preference(mercadopago).create({
        body: {
            items: [
                {
                    id: "entrada",
                    quantity: price,
                    unit_price: price,
                    title: "Entrada",
                }
            ],
        }});

    return preference.init_point;



}