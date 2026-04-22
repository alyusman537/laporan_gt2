import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"


export const laporanGtService = {
    byTahun: async (tahun) => {
        /*
        
        */
        const result = await db.execute({
            sql: `SELECT lp.*, gt.nama as nama_gt, pjgt.nama as nama_pjgt, ta.keterangan as thn_ajaran
            FROM laporan_gt lp
            LEFT JOIN tugas t ON lp.id_tugas = t.id
            LEFT JOIN tahun_ajaran ta ON t.id_tahun_ajaran=ta.id
            LEFT JOIN gt ON t.id_gt = gt.id
            LEFT JOIN pjgt ON t.id_pjgt = pjgt.id
            WHERE ta.id=? ORDER BY lp.created_at DESC`,
            args: [tahun]
        });
        return result.rows
    },
    byBulan: async (tahun, bulan) => {
        const result = await db.execute({
            sql: "SELECT * FROM laporan_gt ORDER BY created_at DESC"
        });
        return result.rows
    },
    create: async (idGt, idTugas, data) => {
        const id = uuidv4();
        await db.execute({
            sql: `INSERT INTO laporan_gt (
            id, bulan_ke, id_gt,id_tugas, status_kelas, wali_kelas, guru_fak,
            jenis_kelamin_murid, kedisiplinan_gt, keigatan_gt, rambut_gt, surat_izin_digunakan,
            pergi_gt, pulang_gt, pelanggaran_gt, hubungan_pjgt, hubungan_km,
            hubungan_guru, hubungan_murid_kelas, hungan_murid_luar_kelas, tanggapan_murid, bisyaroh)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [id, idGt, idTugas, data.bulanKe, data.statusKelas, data.waliKelas, data.guruFak, data.jkMurid, data.kedisiplinanGt, data.kegiatanGt, data.rambutGt, data.suratIzinDigunakan, data.pergiGt, data.pulangGt, data.pelanggaranGt, data.hubunganPjgt, data.hubunganKm, data.hubunganGuru, data.hubunganMuridKelas, data.hubunganMuridLuarKelas, data.tanggapanMurid, data.bisyaroh]
        })
        return {id: id, idGt: idGt, idTugas: idTugas, ...data}
    }
}