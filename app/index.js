const { EventEmitter } = require("events");
const App = new EventEmitter();
const getClient = require("../helpers/graphqlClient");
const registerClient = require("../helpers/registerClient");

const gql = require("graphql-tag");
module.exports = async (address, port, clientId) => {
  console.log("Starting app...");

  // Create the client singleton
  const graphqlClient = getClient(address, port, clientId);

  // Register this app with Thorium as a client
  await registerClient();

  console.log("Registered Client");

  graphqlClient
    .query({
      query: gql`
        query Keyboard {
          keyboard {
            name
            id
          }
        }
      `
    })
    .then(({ data }) => {
      console.log(data);
    });

  // Grab the client object to instantiate it
  const client = require("./client");

  App.on("clientChange", clientObj => {
    if (clientObj.simulator) {
      module.exports.simID = clientObj.simulator.id;
      module.exports.kbID = registerClient.cardData[clientObj.station.name];
    }
  });
};

module.exports.App = App;
