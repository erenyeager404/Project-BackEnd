const typeDefs = `#graphql
    type Mahasiswa {
        id_mahasiswa: ID!
        nim: String!
        nama: String!
        tempat_lahir: String
        tanggal_lahir: String
        alamat: String
        no_hp: String
        email: String

        id_jenis_kelamin: ID!
        id_program_studi: ID
        id_angkatan: ID

        # Relasi (diambil lewat field resolver)
        jenis_kelamin: JenisKelamin
        program_studi: ProgramStudi
        angkatan: Angkatan

        create_at: String
        update_at: String
        delete_at: String
    }

    input MahasiswaInput {
        nim: String!
        nama: String!
        id_jenis_kelamin: ID!
        tempat_lahir: String
        tanggal_lahir: String
        alamat: String
        no_hp: String
        email: String
        id_program_studi: ID
        id_angkatan: ID
    }

    # Pada update, semua field bersifat opsional
    input MahasiswaUpdateInput {
        nim: String
        nama: String
        id_jenis_kelamin: ID
        tempat_lahir: String
        tanggal_lahir: String
        alamat: String
        no_hp: String
        email: String
        id_program_studi: ID
        id_angkatan: ID
    }

    extend type Query {
        mahasiswa: [Mahasiswa]
        mahasiswaById(id: ID!): Mahasiswa
        cariMahasiswa(keyword: String!): [Mahasiswa]
    }

    extend type Mutation {
        tambahMahasiswa(input: MahasiswaInput!): Mahasiswa
        updateMahasiswa(
            id: ID!
            input: MahasiswaUpdateInput!
        ): Mahasiswa
        deleteMahasiswa(id: ID!): Mahasiswa
        restoreMahasiswa(id: ID!): Mahasiswa
    }
`;

module.exports = typeDefs;
