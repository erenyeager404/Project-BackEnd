const express = require("express");
const cors = require("cors");
const app = express();

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

// GraphQL Schema
const typeDefs = require("./graphql/schema");

// GraphQL Resolvers
const jenisKelaminResolvers = require("./graphql/jenis_kelamin/resolvers");
const programStudiResolvers = require("./graphql/program_studi/resolvers");
const angkatanResolvers = require("./graphql/angkatan/resolvers");
const mahasiswaResolvers = require("./graphql/mahasiswa/resolvers");

const resolvers = [
    jenisKelaminResolvers,
    programStudiResolvers,
    angkatanResolvers,
    mahasiswaResolvers
];

app.use(cors());
app.use(express.json());
console.log("Port dari .env:", process.env.PORT);

app.get("/", (req, res) => {
    res.json({
        message: "API Mahasiswa berjalan Dan Sukses",
        port: process.env.PORT
    });
});

// GraphQL
const server = new ApolloServer({
    typeDefs,
    resolvers
});

async function startGraphQL() {
    await server.start();
    app.use(
        "/graphql",
        expressMiddleware(server)
    );
}

startGraphQL();

module.exports = app;
