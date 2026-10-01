const { Op } = require("sequelize");
const ProgramStudi = require("../../models/program_studi/programStudiModel");
const { dateFields, handleDbError } = require("../../utils/helper");

const resolvers = {
    ProgramStudi: { ...dateFields },

    Query: {
        // GET SEMUA DATA
        programStudi: async () => {
            return await ProgramStudi.findAll({
                where: { delete_at: null },
                order: [["nama", "ASC"]]
            });
        },

        // CARI BERDASARKAN ID
        programStudiById: async (_, { id }) => {
            const data = await ProgramStudi.findOne({
                where: { id_program_studi: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Program studi tidak ditemukan");
            }

            return data;
        },

        // CARI BERDASARKAN KODE ATAU NAMA
        cariProgramStudi: async (_, { keyword }) => {
            return await ProgramStudi.findAll({
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

    Mutation: {
        // TAMBAH
        tambahProgramStudi: async (_, { input }) => {
            try {
                const waktu = new Date();

                return await ProgramStudi.create({
                    ...input,
                    create_at: waktu,
                    update_at: waktu,
                    delete_at: null
                });
            } catch (error) {
                handleDbError(error, "Kode program studi");
            }
        },

        // EDIT
        updateProgramStudi: async (_, { id, input }) => {
            const data = await ProgramStudi.findOne({
                where: { id_program_studi: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Program studi tidak ditemukan");
            }

            try {
                await data.update({
                    ...input,
                    update_at: new Date()
                });
            } catch (error) {
                handleDbError(error, "Kode program studi");
            }

            return data;
        },

        // SOFT DELETE
        deleteProgramStudi: async (_, { id }) => {
            const data = await ProgramStudi.findOne({
                where: { id_program_studi: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Program studi tidak ditemukan");
            }

            await data.update({
                delete_at: new Date(),
                update_at: new Date()
            });

            return data;
        },

        // RESTORE
        restoreProgramStudi: async (_, { id }) => {
            const data = await ProgramStudi.findOne({
                where: { id_program_studi: id }
            });

            if (!data) {
                throw new Error("Program studi tidak ditemukan");
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
