export function generateOrderCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const randomLetters = Array.from({ length: 3 }, () =>
        letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const randomNumbers = Array.from({ length: 3 }, () =>
        numbers.charAt(Math.floor(Math.random() * numbers.length))
    ).join('');

    return `VLO-${randomLetters}${randomNumbers}`;
}