const express = require("express");
const cors = require("cors");
const port = 5000;

const sequelize = require("./db.config");
sequelize.sync().then(() => console.log("Database ready"));

const userEndpoint = require("./routes/users");
const transportEndpoint = require("./routes/transports");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userEndpoint);
app.use("/transports", transportEndpoint);

app.listen(port, () => console.log(`Running server on port ${port}`));
