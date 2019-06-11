// Load up the Bonjour client
const getThoriumAddress = require("./helpers/bonjour");
const getClient = require("./helpers/graphqlClient");
const registerClient = require("./helpers/registerClient");
const startApp = require("./app");
var HID = require('node-hid');

const { stationName } = require("./config.json");
const { useBonjour } = require("./config.json");
const { serverAddress } = require("./config.json");
const { serverPort } = require("./config.json");
const { vid } = require("./config.json");
const { pid } = require("./config.json");

var graphQLClient;

console.log("Available Devices:\n", HID.devices());

//clientName
module.exports.clientId = stationName;
const clientId = stationName;


function connectToServer() {
    if (useBonjour) {
        console.log("Activating bonjour browser...");
        getThoriumAddress()
            .then(({ address, port, name }) => {
                graphQLClient = getClient(address, port, clientId);
                console.log("Found Thorium server:");
                console.log(`Address: ${address}:${port} ${name}`);

                startApp(address, port, clientId);
            })
            .catch(err => {
                console.error("An error occured");
                console.error(err);
            });
    } else {
        graphQLClient = getClient(serverAddress, serverPort, clientId);
        console.log("Found Thorium server:");
        console.log(`Address: ${serverAddress}:${serverPort} Manual`);

        startApp(serverAddress, serverPort, clientId);
    }
}
connectToServer();









var device = new HID.HID(vid, pid);
process.on("SIGINT", closeDevice);

function closeDevice() {
    console.log("Closed Device");
    device.close();
}

var on_or_off = false;
device.on("data", function(data) {
    if (startApp.simID == undefined || startApp.kbID == undefined) {
        return;
    }
    data = JSON.parse(JSON.stringify(data))
    if (data.data[2] == '40') {
        on_or_off = !on_or_off;
        console.log("Card Scanned!");

        //    console.log(JSON.stringify(registerClient.availcds));
        let meta = [];
        let mutationData = {};
        let key = '';

        if (on_or_off) {
            key = '1';
        } else {
            key = '0';
        }

        console.log("simulatorId: " + startApp.simID);
        console.log("id: " + startApp.kbID);
        console.log("key: " + key);
        console.log("meta: " + meta);

        mutationData["simulatorId"] = startApp.simID;
        mutationData["id"] = startApp.kbID;
        mutationData["key"] = key;
        mutationData["meta"] = [];



        const MUTATION = `
mutation TriggerKeyAction(
  $simulatorId: ID!
  $id: ID!
  $key: String!
  $meta: [String]!
) {
  triggerKeyboardAction(
    simulatorId: $simulatorId
    id: $id
    key: $key
    meta: $meta
  )
}`;

        graphQLClient
            .query({ query: MUTATION, variables: mutationData })
            .then(() => {
                console.log("Sent");
            });

    }
});