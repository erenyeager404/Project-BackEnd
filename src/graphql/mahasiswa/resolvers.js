const { Op } = require("sequelize");
const Mahasiswa = require("../../models/mahasiswa/mahasiswaModel");
const JenisKelamin = require("../../models/jenis_kelamin/jenisKelaminModel");
const ProgramStudi = require("../../models/program_studi/programStudiModel");
const Angkatan = require("../../models/angkatan/angkatanModel");
const { dateFields, handleDbError, pastikanAda } = require("../../utils/helper");

// Validasi relasi (foreign key) sebelum simpan / ubah
const validasiRelasi = async (input) => {
    if (input.id_jenis_kelamin) {
        await pastikanAda(JenisKelamin, "id_jenis_kelamin", input.id_jenis_kelamin, "Jenis kelamin tidak ditemukan");
    }
    if (input.id_program_studi) {
        await pastikanAda(ProgramStudi, "id_program_studi", input.id_program_studi, "Program studi tidak ditemukan");
    }
    if (input.id_angkatan) {
        await pastikanAda(Angkatan, "id_angkatan", input.id_angkatan, "Angkatan tidak ditemukan");
    }
};

const resolvers = {
    // FIELD RESOLVER: mengambil data relasi dari tabel lain
    Mahasiswa: {
        ...dateFields,

        jenis_kelamin: async (parent) => {
            return await JenisKelamin.findByPk(parent.id_jenis_kelamin);
        },

        program_studi: async (parent) => {
            if (!parent.id_program_studi) return null;
            return await ProgramStudi.findByPk(parent.id_program_studi);
        },

        angkatan: async (parent) => {
            if (!parent.id_angkatan) return null;
            return await Angkatan.findByPk(parent.id_angkatan);
        }
    },

    Query: {
        // GET SEMUA DATA
        mahasiswa: async () => {
            return await Mahasiswa.findAll({
                where: { delete_at: null },
                order: [["nama", "ASC"]]
            });
        },

        // CARI BERDASARKAN ID
        mahasiswaById: async (_, { id }) => {
            const data = await Mahasiswa.findOne({
                where: { id_mahasiswa: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Mahasiswa tidak ditemukan");
            }

            return data;
        },

        // CARI BERDASARKAN NIM, NAMA, ATAU EMAIL
        cariMahasiswa: async (_, { keyword }) => {
            return await Mahasiswa.findAll({
                where: {
                    delete_at: null,
                    [Op.or]: [
                        { nim: { [Op.like]: `%${keyword}%` } },
                        { nama: { [Op.like]: `%${keyword}%` } },
                        { email: { [Op.like]: `%${keyword}%` } }
                    ]
                },
                order: [["nama", "ASC"]]
            });
        }
    },

    Mutation: {
        // TAMBAH
        tambahMahasiswa: async (_, { input }) => {
            await validasiRelasi(input);

            try {
                const waktu = new Date();

                return await Mahasiswa.create({
                    ...input,
                    create_at: waktu,
                    update_at: waktu,
                    delete_at: null
                });
            } catch (error) {
                handleDbError(error, "NIM");
            }
        },

        // EDIT
        updateMahasiswa: async (_, { id, input }) => {
            const data = await Mahasiswa.findOne({
                where: { id_mahasiswa: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Mahasiswa tidak ditemukan");
            }

            await validasiRelasi(input);

            try {
                await data.update({
                    ...input,
                    update_at: new Date()
                });
            } catch (error) {
                handleDbError(error, "NIM");
            }

            return data;
        },

        // SOFT DELETE
        deleteMahasiswa: async (_, { id }) => {
            const data = await Mahasiswa.findOne({
                where: { id_mahasiswa: id, delete_at: null }
            });

            if (!data) {
                throw new Error("Mahasiswa tidak ditemukan");
            }

            await data.update({
                delete_at: new Date(),
                update_at: new Date()
            });

            return data;
        },

        // RESTORE
        restoreMahasiswa: async (_, { id }) => {
            const data = await Mahasiswa.findOne({
                where: { id_mahasiswa: id }
            });

            if (!data) {
                throw new Error("Mahasiswa tidak ditemukan");
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
