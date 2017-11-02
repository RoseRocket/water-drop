import { toUnderscore } from './utils.js';

function ucase(value) {
    const [firstChar, ...rest] = value;
    return [firstChar.toUpperCase(), ...rest].join('');
}

function lcase(value) {
    const [firstChar, ...rest] = value;
    return [firstChar.toLowerCase(), ...rest].join('');
}

function u_case_all(value) {
    return toUnderscore(value)
        .toUpperCase()
        .replace(/^_+|_+$/g, '');
}

function l_case_all(value) {
    return toUnderscore(value)
        .toLowerCase()
        .replace(/^_+|_+$/g, '');
}

function ucaseall(value) {
    return value.toUpperCase();
}

function lcaseall(value) {
    return value.toLowerCase();
}

export default function hbsHelpers(hbs) {
    hbs.registerHelper('ucase', ucase);
    hbs.registerHelper('lcase', lcase);
    hbs.registerHelper('u_case_all', u_case_all);
    hbs.registerHelper('l_case_all', l_case_all);
    hbs.registerHelper('ucaseall', ucaseall);
    hbs.registerHelper('lcaseall', lcaseall);

    return hbs;
}
