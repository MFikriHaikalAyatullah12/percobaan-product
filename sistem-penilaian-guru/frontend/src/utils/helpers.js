// This file contains helper functions.

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const total = numbers.reduce((acc, num) => acc + num, 0);
    return total / numbers.length;
};

export const isEmpty = (value) => {
    return value === null || value === undefined || value.trim() === '';
};

export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};