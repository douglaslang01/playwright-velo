import { db } from './database';
import { OrderTable } from './schema';

const testOrders = [
    {
        id: 'cb2d1ed3-78f3-43b3-ad6f-7e78be5430b5',
        order_number: 'VLO-85DC4D',
        color: 'lunar-white',
        wheel_type: 'sport',
        customer_name: 'Douglas Lang',
        customer_email: 'douglas.lang@velo.dev',
        customer_phone: '(51) 99349-4410',
        customer_cpf: '982.359.660-34',
        payment_method: 'avista',
        total_price: '52500',
        status: 'APROVADO',
        created_at: '2026-01-22 20:26:14.445432+00',
        updated_at: '2026-01-22 20:26:14.445432+00',
        optionals: ['flux-capacitor', 'precision-park']
    },
    {
        id: 'edeadf59-ba4f-423c-a668-b103b24b7036',
        order_number: 'VLO-MSH7ZK',
        color: 'glacier-blue',
        wheel_type: 'aero',
        customer_name: 'Joao  da Silva',
        customer_email: 'joao.silva@velo.dev',
        customer_phone: '(51) 99999-9999',
        customer_cpf: '795.919.250-26',
        payment_method: 'avista',
        total_price: '40000',
        status: 'EM_ANALISE',
        created_at: '2026-02-06 12:47:23.274007+00',
        updated_at: '2026-03-16 12:56:12.112133+00',
        optionals: []
    },
    {
        id: 'ff920c05-45eb-418a-91c7-475a4b42a746',
        order_number: 'VLO-8IER0M',
        color: 'midnight-black',
        wheel_type: 'sport',
        customer_name: 'Steve Jobs',
        customer_email: 'steve.jobs@apple.com',
        customer_phone: '(51) 99999-9999',
        customer_cpf: '288.456.800-02',
        payment_method: 'avista',
        total_price: '52500',
        status: 'REPROVADO',
        created_at: '2026-02-05 14:05:03.339692+00',
        updated_at: '2026-02-05 14:06:49.362716+00',
        optionals: ['flux-capacitor', 'precision-park']
    }
];


export async function insertOrder(order: OrderTable) {
    await db.insertInto('orders').values(order).execute();
}

export async function deleteOrderByNumber(orderNumber: string) {
    await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute();
}   
