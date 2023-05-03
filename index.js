// Import the packages we need
const dialogflow = require("@google-cloud/dialogflow");
require("dotenv").config();
const express = require("express");

// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Your google dialogflow project-id
const PROJECID = CREDENTIALS.project_id;

// Configuration for the client
const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS["private_key"],
    client_email: CREDENTIALS["client_email"],
  },
};

// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

// Detect intent method
const detectIntent = async (languageCode, queryText, sessionId) => {
  let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

  console.log("sessionPath :>> ", sessionPath);

  // The text query request.
  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: queryText,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };

  try {
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log("responses :>> ", responses);
    const result = responses[0].queryResult;
    console.log("result :>> ", result);
    return {
      response: result.fulfillmentText,
    };
  } catch (error) {
    console.log("error :>> ", error);
    return false;
  }
};

// detectIntent('en', 'hello', 'abcd1234');

// Start the app
const app = express();

// app settings
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Server Port
const PORT = process.env.PORT || 5000;

// Home route
app.get("/", (req, res) => {
  res.send(`Dialogflow API`);
});

// Dialogflow route
app.post("/dialogflow", async (req, res) => {
  let languageCode = req.body.languageCode;
  let queryText = req.body.queryText;
  let sessionId = req.body.sessionId;

  let responseData = await detectIntent(languageCode, queryText, sessionId);

  res.send(responseData.response);
});
// detectIntent("en", "Hello", "shabithkms");
// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
