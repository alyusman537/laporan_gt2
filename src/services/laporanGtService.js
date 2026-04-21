import db from "../config/db.js"

export const laporanGtService = {
    byTahun: async (tahun) => {
        const result = await db.execute({
            sql: `SELECT lp.*, ta.keterangan,  
            FROM laporan_pjgt lp
            LEFT JOIN tugas t ON lp.id_tugas = t.id
            LEFT JOIN tahun_ajaran ta ON t.id_tahun_ajaran=ta.id
            WHERE ta.id=? ORDER BY lp.created_at DESC`,
            args: [tahun]
        });
        return result.rows
    },
    byBulan: async (tahun, bulan) => {
        const result = await db.execute({
            sql: "SELECT * FROM laporan_pjgt ORDER BY created_at DESC"
        });
        return result.rows
    }
}