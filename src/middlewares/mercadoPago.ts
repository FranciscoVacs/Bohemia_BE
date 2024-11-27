import { MercadoPagoConfig, Payment } from 'mercadopago';
import type{ Request, Response, NextFunction } from 'express';

export const createOrder = (price:number, email:string) =>{

    const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN || '',
        options: {timeout: 10000}
    });

    const payment = new Payment(client);


    const body = {
        transaction_amount: price,
        description: 'Compra de entradas',
        payment_method_id: 'rapipago',
        payer: {
            email: email
        },
    };

    payment.create({ body }).then(console.log).catch(console.log);



}