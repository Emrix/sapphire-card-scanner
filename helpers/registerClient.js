const getClient = require("./graphqlClient");
availableCards = [];
cardData = {};

module.exports = function() {
    module.exports.cardData = cardData;
    const client = getClient();
    const tempclient = getClient();

    function deregister() {
        console.log("Shutting down server...");
        client.query({
                query: `
mutation RemoveClient($id: ID!) {
  clientDisconnect(client: $id)
}
`,
                variables: { id: client.clientId }
            })
            .then(() => {
                console.log("Client unregistered.");
                process.exit();
                return 0;
            });
    }
    process.on("SIGINT", deregister);

    console.log("Obtaining Keyboard Layouts");
    return client.query({
        query: `
query Keyboard {
  keyboard {
    id
    name
  }
}
`
    }).then(({ data }) => {
        for (let x = 0; x < data.keyboard.length; x++) {
            //console.log(data.keyboard[x].name);
            availableCards.push(data.keyboard[x].name);
            cardData[data.keyboard[x].name]={};
            cardData[data.keyboard[x].name]=data.keyboard[x].id
        }
//        console.log(data);
        client.query({
                query: `
mutation RegisterClient($client: ID!, $cards: [String]) {
  clientConnect(client: $client, mobile: true, cards: $cards)
}
`,
                variables: { client: client.clientId, cards: availableCards }
            })
            .then(() => client);
    });
};

