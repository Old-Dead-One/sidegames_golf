// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
};

// Required field validation
export const isRequired = (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim().length > 0;
};

// Number validation
export const isValidNumber = (value: string | number): boolean => {
    return !isNaN(Number(value)) && isFinite(Number(value));
};

// Date validation
export const isValidDate = (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
}; 