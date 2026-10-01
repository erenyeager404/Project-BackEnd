const { Op } = require("sequelize");
const Angkatan = require("../../models/angkatan/angkatanModel");
const { dateFields, handleDbError } = require("../../utils/helper");

// Format tahun ajaran harus: 2025-2026
const validasiTahunAjaran = (tahun) => {
    if (!/^\d{4}-\d{4}$/.test(tahun)) {
        throw new Error("Format tahun ajaran harus YYYY-YYYY, contoh: 2025-2026");
    }

    const [awal, akhir] = tahun.split("-").map(Number);
    if (akhir !== awal + 1) {
        throw new Error("Tahun akhir harus satu tahun setelah tahun awal");
    }
};

const resolvers = {
    Angkatan: { ...dateFields },

    Query: {
        // GET SEMUA DATA
        angkatan: async () => {
            return await Angkatan.findAll({
                where: { delete_at: null },
                order: [["tahun_ajaran", "ASC"]]
            });
        },

        // CARI BERDASARKAN ID
        angkatanById: async (_, { id }) => {
            const data = await Angkatan.findOne({
                where: { id_angkatan: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Angkatan tidak ditemukan");
            }

            return data;
        },

        // CARI BERDASARKAN TAHUN AJARAN
        cariAngkatan: async (_, { keyword }) => {
            return await Angkatan.findAll({
                where: {
                    delete_at: null,
                    tahun_ajaran: { [Op.like]: `%${keyword}%` }
                },
                order: [["tahun_ajaran", "ASC"]]
            });
        }
    },

    Mutation: {
        // TAMBAH
        tambahAngkatan: async (_, { input }) => {
            validasiTahunAjaran(input.tahun_ajaran);

            try {
                const waktu = new Date();

                return await Angkatan.create({
                    ...input,
                    create_at: waktu,
                    update_at: waktu,
                    delete_at: null
                });
            } catch (error) {
                handleDbError(error, "Tahun ajaran");
            }
        },

        // EDIT
        updateAngkatan: async (_, { id, input }) => {
            validasiTahunAjaran(input.tahun_ajaran);

            const data = await Angkatan.findOne({
                where: { id_angkatan: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Angkatan tidak ditemukan");
            }

            try {
                await data.update({
                    ...input,
                    update_at: new Date()
                });
            } catch (error) {
                handleDbError(error, "Tahun ajaran");
            }

            return data;
        },

        // SOFT DELETE
        deleteAngkatan: async (_, { id }) => {
            const data = await Angkatan.findOne({
                where: { id_angkatan: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Angkatan tidak ditemukan");
            }

            await data.update({
                delete_at: new Date(),
                update_at: new Date()
            });

            return data;
        },

        // RESTORE
        restoreAngkatan: async (_, { id }) => {
            const data = await Angkatan.findOne({
                where: { id_angkatan: id }
            });

            if (!data) {
                throw new Error("Angkatan tidak ditemukan");
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
