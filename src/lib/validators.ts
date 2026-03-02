export function isValidCPF(cpf: string): boolean {
    if (!cpf) return false;

    // Remove characters that are not digits
    cpf = cpf.replace(/[^\d]/g, '');

    // Check if it has 11 digits
    if (cpf.length !== 11) return false;

    // Check for known invalid CPFs (all digits equal)
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    // Validate first digit
    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    // Validate second digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

export function formatCPF(value: string): string {
    if (!value) return "";

    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Limit to 11 digits
    const cpf = numbers.slice(0, 11);

    return cpf
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
}

export function formatPhone(value: string): string {
    if (!value) return "";

    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Limit to 11 digits (mobile with DDD)
    const phone = numbers.slice(0, 11);

    if (phone.length <= 10) {
        // Format (XX) XXXX-XXXX
        return phone
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        // Format (XX) XXXXX-XXXX
        return phone
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    }
}

export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function isValidPhone(phone: string): boolean {
    if (!phone) return false;
    const digits = phone.replace(/\D/g, '');
    // Aceita 10 (fixo) ou 11 dígitos (celular com 9)
    return digits.length === 10 || digits.length === 11;
}

export function isValidCNPJ(cnpj: string): boolean {
    if (!cnpj) return false;

    const digits = cnpj.replace(/\D/g, '');

    if (digits.length !== 14) return false;

    // Rejeita sequências conhecidas como inválidas
    if (/^(\d)\1+$/.test(digits)) return false;

    const calc = (cnpj: string, weights: number[]) => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += parseInt(cnpj[i]) * weights[i];
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const d1 = calc(digits, w1);
    const d2 = calc(digits, w2);

    return d1 === parseInt(digits[12]) && d2 === parseInt(digits[13]);
}

export function formatCNPJ(value: string): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '').slice(0, 14);

    return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2');
}
