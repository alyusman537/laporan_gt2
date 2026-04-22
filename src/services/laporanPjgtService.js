import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"


export const laporanPjgtService = {
    byTahun: async (tahun) => {
        const result = await db.execute({
            sql: `SELECT lp.id as id_laporan, lp.bulan_ke, lp.id_gt, lp.id_tugas, gt.nama as nama_gt, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
            FROM laporan_pjgt lp
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
            sql: `SELECT lp.id as id_laporan, lp.bulan_ke, lp.id_gt, lp.id_tugas, gt.nama as nama_gt, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
            FROM laporan_pjgt lp
            LEFT JOIN tugas t ON lp.id_tugas = t.id
            LEFT JOIN tahun_ajaran ta ON t.id_tahun_ajaran=ta.id
            LEFT JOIN gt ON t.id_gt = gt.id
            LEFT JOIN pjgt ON t.id_pjgt = pjgt.id
            WHERE ta.id=? AND lp.bulan_ke=? ORDER BY lp.created_at DESC`,
            args: [tahun, bulan]
        });
        return result.rows
    },
    byGt: async (idGt) => {
        const result = await db.execute({
            sql: `SELECT lp.id as id_laporan, lp.bulan_ke, lp.id_gt, lp.id_tugas, gt.nama as nama_gt, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
            FROM laporan_pjgt lp
            LEFT JOIN tugas t ON lp.id_tugas = t.id
            LEFT JOIN tahun_ajaran ta ON t.id_tahun_ajaran=ta.id
            LEFT JOIN gt ON t.id_gt = gt.id
            LEFT JOIN pjgt ON t.id_pjgt = pjgt.id
            WHERE lp.id_gt=? ORDER BY lp.created_at DESC`,
            args: [idGt]
        });
        return result.rows
    },
    byPjgt: async (idPjgt) => {
        const result = await db.execute({
            sql: `SELECT lp.id as id_laporan, lp.bulan_ke, lp.id_gt, lp.id_tugas, gt.nama as nama_gt, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
            FROM laporan_pjgt lp
            LEFT JOIN tugas t ON lp.id_tugas = t.id
            LEFT JOIN tahun_ajaran ta ON t.id_tahun_ajaran=ta.id
            LEFT JOIN gt ON t.id_gt = gt.id
            LEFT JOIN pjgt ON t.id_pjgt = pjgt.id
            WHERE lp.id_pjgt=? ORDER BY lp.created_at DESC`,
            args: [idPjgt]
        });
        return result.rows
    },
    detail: async (id) => {
        const result = await db.execute({
            sql: `SELECT * FROM laporan_pjgt WHERE id=?`,
            args: [id]
        });
        return result.rows[0]
    },
    create: async (idPjgt, idTugas, data) => {
        const id = uuidv4();
        await db.execute({
            sql: `INSERT INTO laporan_pjgt (
            id, id_pjgt, id_tugas, bulan_ke, status_kelas, wali_kelas, guru_fak,
            jenis_kelamin_murid, kedisiplinan_gt, keigatan_gt, rambut_gt, surat_izin_digunakan,
            pergi_gt, pulang_gt, pelanggaran_gt, hubungan_pjgt, hubungan_km,
            hubungan_guru, hubungan_murid_kelas, hungan_murid_luar_kelas, tanggapan_murid, bisyaroh)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [id, idPjgt, idTugas, data.bulanKe, data.statusKelas, data.waliKelas, data.guruFak, data.jkMurid, data.kedisiplinanGt, data.kegiatanGt, data.rambutGt, data.suratIzinDigunakan, data.pergiGt, data.pulangGt, data.pelanggaranGt, data.hubunganPjgt, data.hubunganKm, data.hubunganGuru, data.hubunganMuridKelas, data.hubunganMuridLuarKelas, data.tanggapanMurid, data.bisyaroh]
        })
        return {id: id, idPjgt: idPjgt, idTugas: idTugas, ...data}
    }
}