const { Op } = require("sequelize");
const JenisKelamin = require("../../models/jenis_kelamin/jenisKelaminModel");
const { dateFields, handleDbError } = require("../../utils/helper");

const resolvers = {
    JenisKelamin: { ...dateFields },

    // QUERY
    Query: {
        // GET SEMUA DATA (yang belum di-soft delete)
        jenisKelamin: async () => {
            return await JenisKelamin.findAll({
                where: { delete_at: null },
                order: [["nama", "ASC"]]
            });
        },

        // CARI DATA BERDASARKAN ID
        jenisKelaminById: async (_, { id }) => {
            const data = await JenisKelamin.findOne({
                where: { id_jenis_kelamin: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Jenis kelamin tidak ditemukan");
            }

            return data;
        },

        // CARI DATA BERDASARKAN KODE ATAU NAMA
        cariJenisKelamin: async (_, { keyword }) => {
            return await JenisKelamin.findAll({
                where: {
                    delete_at: null,
                    [Op.or]: [
                        { kode: { [Op.like]: `%${keyword}%` } },
                        { nama: { [Op.like]: `%${keyword}%` } }
                    ]
                },
                order: [["nama", "ASC"]]
            });
        }
    },

    // MUTATION
    Mutation: {
        // TAMBAH
        tambahJenisKelamin: async (_, { input }) => {
            try {
                const waktu = new Date();

                return await JenisKelamin.create({
                    ...input,
                    create_at: waktu,
                    update_at: waktu,
                    delete_at: null
                });
            } catch (error) {
                handleDbError(error, "Kode jenis kelamin");
            }
        },

        // EDIT
        updateJenisKelamin: async (_, { id, input }) => {
            const data = await JenisKelamin.findOne({
                where: { id_jenis_kelamin: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Jenis kelamin tidak ditemukan");
            }

            try {
                await data.update({
                    ...input,
                    update_at: new Date()
                });
            } catch (error) {
                handleDbError(error, "Kode jenis kelamin");
            }

            return data;
        },

        // SOFT DELETE
        deleteJenisKelamin: async (_, { id }) => {
            const data = await JenisKelamin.findOne({
                where: { id_jenis_kelamin: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Jenis kelamin tidak ditemukan");
            }

            await data.update({
                delete_at: new Date(),
                update_at: new Date()
            });

            return data;
        },

        // RESTORE
        restoreJenisKelamin: async (_, { id }) => {
            const data = await JenisKelamin.findOne({
                where: { id_jenis_kelamin: id }
            });

            if (!data) {
                throw new Error("Jenis kelamin tidak ditemukan");
            }

            await data.update({
                delete_at: null,
                update_at: new Date()
            });

            return data;
        }
    }
};

module.exports = resolvers;
