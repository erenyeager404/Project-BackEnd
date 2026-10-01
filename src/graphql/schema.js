// Schema utama: berisi type Query & Mutation kosong agar bisa di-"extend" di tiap modul
const baseTypeDefs = `#graphql
    type Query {
        _empty: Boolean
    }

    type Mutation {
        _empty: Boolean
    }
`;

const jenisKelaminTypeDefs = require("./jenis_kelamin/schema");
const programStudiTypeDefs = require("./program_studi/schema");
const angkatanTypeDefs = require("./angkatan/schema");
const mahasiswaTypeDefs = require("./mahasiswa/schema");

module.exports = [
    baseTypeDefs,
    jenisKelaminTypeDefs,
    programStudiTypeDefs,
    angkatanTypeDefs,
    mahasiswaTypeDefs
];
