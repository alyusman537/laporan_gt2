import db from "../config/db.js"

export const tugasService = {
    all: async () => {
        const result = await db.execute(`SELECT t.*, a.keterangan FROM tugas t LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id ORDER BY a.keterangan DESC, t.created_at ASC`)
        return result.rows
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: `SELECT t.*, a.keterangan FROM tugas t LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id WHERE t.id=?`,
            args: [id]
        })
        return result.rows
    }
}