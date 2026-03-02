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
