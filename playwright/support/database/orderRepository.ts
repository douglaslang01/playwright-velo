import { OrderDetails } from '../actions/orderLookupActions';
import { db } from './database';
import { OrderTable } from './schema';

function formatPayment(paymentValue: string) {
    return paymentValue
        .normalize("NFD")              // separa os acentos das letras
        .replace(/[\u0300-\u036f]/g, "") // remove os acentos
        .replace(/\s+/g, "")           // remove espaços
        .toLowerCase();                // deixa tudo minúsculo
}

export async function insertOrder(order: OrderDetails, optionals: string[] = []) {

    const data = {
        id: crypto.randomUUID(),
        order_number: order.number,
        color: order.color.toLowerCase().replace(' ', '-'), //'lunar-white',
        wheel_type: order.weels.replace(' Wheels', '').toLocaleLowerCase(), //'sport',
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        customer_cpf: order.customer.document,
        payment_method: formatPayment(order.payment), //'avista',
        total_price: order.total_price,
        status: order.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        optionals: optionals
    } as OrderTable;

    await db.insertInto('orders').values(data).execute();
}

export async function deleteOrderByEmailAndDocument(email: string, document: string) {
    await db.deleteFrom('orders')
        .where('customer_email', '=', email)
        .where('customer_cpf', '=', document)
        .execute();
}

export async function deleteOrderByNumber(orderNumber: string) {
    await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute();
}   
