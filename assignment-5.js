"use strict";
const PROMPT = require('readline-sync');
``
const IO = require('fs');
let customers = [], transactions = [];
let transactionLines = [], masterLines = [];
let today;

function main() {
    console.log("Program started.");
    addTransactions();
}

function init() {
    today = new Date();
    load();

}

init();
main();

function load() {
    let masterFile = IO.readFileSync('data/masterlist.csv', 'utf-8');
    masterLines = masterFile.toString().split(/\r?\n/);
    for (let i = 0; i < masterLines.length; i++) {
        customers.push(masterLines[i].toString().split(/,/));
    }
    let transactionFile = IO.readFileSync('data/transactions.csv', 'utf-8');
    transactionLines = transactionFile.toString().split(/\r?\n/);
    for (let i = 0; i < transactionLines.length; i++) {
        transactions.push(transactionLines[i].toString().split(/,/));
    }
}

function addTransactions() {
    console.log("Adding transactions");
    IO.writeFile("data/masterlist.csv", "", (error) => {
    }); //clears masterlist.csv to refresh it
    let totals = [];
    for (let i = 0; i < customers.length; i++) {
        totals[i] = 0;
    }
    for (let i = 0; i < transactions.length; i++) {

        let id = Number(transactions[i][0]);
        // console.log(id);
        // console.log(customers)
        if (id > customers.length) {
            IO.appendFileSync(`data/masterlist.csv`, "Warning, customer for ID of " + id + " not found, is it a new customer? \n");

        } else {
            //ID, First Name, Last Name, Total spent
            if (!isNaN(customers[id][3])) {
            }
            customers[id][3] = Number(transactions[i][2]) + Number(customers[id][3]);

            totals[id] = Number(transactions[i][2] + Number(totals[id]));
            if (Number(totals[id]) > 750) {
                totals[id] = 0;
                couponPrintOut(id);
            }
        }
    }


    rewriteMasterList();

}

function couponPrintOut(customerID) {
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let day = today.getDate() + 1;
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayOfWeek = today.getDay();
    console.log("CONGRATULATIONS, " + customers[customerID][1] + " " + customers[customerID][2]);
    console.log("   You have spent enough money to receive a free haircut!");
    console.log("       Today's Date: " + daysOfWeek[dayOfWeek] + ", " + month + "/" + day + "/" + year);

}

function rewriteMasterList() {
    for (let i = 0; i < customers.length; i++) {
        IO.appendFileSync(`data/masterlist.csv`, customers[i][0] + "," + customers[i][1] + "," + customers[i][2] + "," + customers[i][3] + "\n");

        if (customers[i + 1] > customers.length && customers[i + 1] != "") IO.appendFileSync(`data/masterlist.csv`, "\n");
    }

}