const getClient = require("../helpers/graphqlClient");
const { clientId } = require("../index");
const gql = require("graphql-tag");
const { App } = require("./index");

const queryData = `
id
flight {
  id
  name
  date
}
simulator {
  id
  name
}
station {
  name
}
`;

const QUERY = `
  query Client($clientId: ID!) {
    clients(clientId: $clientId) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = `
  subscription ClientUpdate($clientId: ID!) {
    clientChanged(client: $clientId) {
${queryData}
    }
  }
`;

class Client {
  constructor() {
    // Set up a query to get the data that we need
    // We can grab the client without parameters, since
    // the client has already been created by this point
    const graphQLClient = getClient();

    graphQLClient
      .query({ query: QUERY, variables: { clientId } })
      .then(({ data: { clients: [clientObj] } }) => {
        this.flight = clientObj.flight;
        this.simulator = clientObj.simulator;
        this.station = clientObj.station;
        App.emit("clientChange", this);
        // // Set up the subscription
        graphQLClient
          .subscribe({
            query: SUBSCRIPTION,
            variables: { clientId }
          })
          .then(observable => {
            observable.subscribe(
              ({
                data: {
                  clientChanged: [clientObj]
                }
              }) => {
                this.flight = clientObj.flight;
                this.simulator = clientObj.simulator;
                this.station = clientObj.station;
                App.emit("clientChange", this);
              },
              error => {
                console.log("Error: ", error);
                // handle error
              }
            );
          })
          .catch(err => console.error(err));
      });
  }
}

const client = new Client();
module.exports = client;