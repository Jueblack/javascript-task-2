/* eslint-disable comma-dangle */
/* eslint-disable quotes */

"use strict";

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
const phoneValidator = /\b\d{10}\b/g;
const nameValidator = /^[А-Я || ё][а-я || ё]*$/gm;

const isInputValid = (phone, name) =>
    phone && name && phone.match(phoneValidator) && name.match(nameValidator);

const isContactExist = (phone, name) =>
    phoneBook.some(
        (contact) => contact.phone === phone || contact.name === name
    );

exports.add = function (phone, name, email) {
    if (isInputValid(phone, name) && !isContactExist(phone, name)) {
        phoneBook.push({
            phone,
            name,
            email,
        });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

exports.update = function (phone, name, email) {
    let updateContact = phoneBook.find((contact) => contact.phone === phone);
    if (updateContact) {
        updateContact.name = name;
        if (!email) {
            delete updateContact.email;
        } else {
            updateContact.email = email;
        }

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */

const result = [];

const formatContact = (contact) => {
    return {
        phone:
            `+7 (${contact.phone.slice(0, 3)})` +
            ` ${contact.phone.slice(3, 6)}` +
            `-${contact.phone.slice(6, 8)}` +
            `-${contact.phone.slice(8, 10)}`,
        name: contact.name,
        ...(contact.email ? { email: contact.email } : {}),
    };
};

const showAllContacts = (fullBook) =>
    fullBook
        .map(formatContact)
        .map((contact) =>
            [contact.name, contact.phone, contact.email ? contact.email : ""]
                .filter(Boolean)
                .join(", ")
        );

const findContacts = (fullBook, findBy) =>
    showAllContacts(fullBook).filter((element) => element.includes(findBy));

const deleteContacts = (fullBook, findAndDelete) => {
    const deletedContacts = findContacts(fullBook, findAndDelete);

    fullBook = fullBook.filter((str) => !deleteContacts.includes(str));

    return deletedContacts.length;
};

exports.findAndRemove = function (query) {
    return deleteContacts(phoneBook, query);
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */

exports.find = function (query) {
    if (!query) {
        return result;
    }
    const copyPhoneBook = phoneBook.slice(0);
    copyPhoneBook.sort((a, b) => a.name.localeCompare(b.name));
    switch (query) {
        case "*":
            return showAllContacts(copyPhoneBook);

        case " ":
            return result;

        default:
            return findContacts(copyPhoneBook, query);
    }
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split("\n").length;
};
