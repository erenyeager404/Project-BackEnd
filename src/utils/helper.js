// Mengubah Date menjadi string ISO agar aman dikirim sebagai String di GraphQL
const toISO = (value) => (value ? new Date(value).toISOString() : null);

// Field resolver untuk kolom waktu (dipakai di semua type)
const dateFields = {
    create_at: (parent) => toISO(parent.create_at),
    update_at: (parent) => toISO(parent.update_at),
    delete_at: (parent) => toISO(parent.delete_at)
};

// Mengubah error database menjadi pesan yang mudah dibaca
const handleDbError = (error, namaData) => {
    if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error(`${namaData} sudah digunakan`);
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new Error(`Relasi data tidak valid atau data masih dipakai oleh data lain`);
    }
    throw error;
};

// Pastikan data referensi (FK) ada dan masih aktif
const pastikanAda = async (Model, pk, id, pesan) => {
    const data = await Model.findOne({ where: { [pk]: id, delete_at: null } });
    if (!data) {
        throw new Error(pesan);
    }
    return data;
};

module.exports = { toISO, dateFields, handleDbError, pastikanAda };
