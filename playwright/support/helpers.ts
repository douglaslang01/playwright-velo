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

export function formatDocument(cpf: string) {
    // Remove tudo que não for número
    const digits = cpf.replace(/\D/g, "");

    // Verifica se já está formatado (com pontos e traço)
    const isFormatted = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);

    if (isFormatted) {
        return cpf; // já está formatado
    }

    // Verifica se tem 11 dígitos
    if (digits.length !== 11) {
        throw new Error("CPF inválido");
    }

    // Formata no padrão XXX.XXX.XXX-XX
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
