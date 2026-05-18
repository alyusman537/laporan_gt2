import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"


export const laporanPjgtService = {
    byTahun: async (tahun) => {
        const result = await db.execute({
             sql: `SELECT *, lp.id as id_laporan,  
            gt.nama as nama_gt, gt.alamat as alamat_gt, gt.asal_kelas, gt.wali_kelas as wali_kelas_gt,
            pjgt.nama as nama_pjgt, pjgt.nama_madrasah, pjgt.nama_km,pjgt.nama_ponpes, pjgt.alamat_madrasah,pjgt.username as user_pjgt,
            ta.keterangan as tahun_ajaran, t.jenis_penugasan

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
            sql: `SELECT *, lp.id as id_laporan,  
            gt.nama as nama_gt, gt.alamat as alamat_gt, gt.asal_kelas, gt.wali_kelas as wali_kelas_gt,
            pjgt.nama as nama_pjgt, pjgt.nama_madrasah, pjgt.nama_km,pjgt.nama_ponpes, pjgt.alamat_madrasah,pjgt.username as user_pjgt,
            ta.keterangan as tahun_ajaran, t.jenis_penugasan

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
    // src/services/laporanPjgtService.js

    create: async ({ id_pjgt, id_gt, id_tugas, id_tahun_ajaran, data }) => {
        const id = uuidv4();

        // 1. Definisikan urutan kolom secara eksplisit
        const kolom = [
            "id", "id_pjgt", "id_gt", "id_tugas", "id_tahun_ajaran",
            "bulan_ke", "tahun", "status_kelas", "wali_kelas", "guru_fak", "jk_murid",
            "menangani_administrasi", "administrasi", "menangani_kegiatan", "kegiatan_gt",
            "pelanggaran_gt", "tindakan", "kedisiplinan_gt", "rambut_gt",
            "surat_izin_digunakan", "sakit_hari", "izin_hari", "pulang_hari",
            "hub_pjgt", "alasan_pjgt", "hub_km", "alasan_km", "hub_guru", "alasan_guru",
            "hub_murid_dikelas", "alasan_murid_dikelas", "hub_murid_diluar_kelas", "alasan_murid_diluar_kelas",
            "hub_murid_secara_umum", "alasan_murid_secara_umum", "bisyaroh_bln1", "bisyaroh_bln2", "bisyaroh_bln3",
            "usulan_lain_lain"
        ];

        // 2. Susun args SESUAI urutan kolom di atas
        const args = [
            id, id_pjgt, id_gt, id_tugas, id_tahun_ajaran,
            data.bulan_ke ?? "0",
            data.tahun ?? "",
            data.status_kelas ?? "",
            JSON.stringify(data.wali_kelas), // Jika ini Map/Object, harus di-stringify
            JSON.stringify(data.guru_fak),
            data.jk_murid ?? "",
            data.menangani_administrasi ?? 0,
            JSON.stringify(data.administrasi),
            data.menangani_kegiatan ?? 0,
            JSON.stringify(data.kegiatan_gt),
            data.pelanggaran_gt ?? "",
            data.tindakan ?? "",
            data.kedisiplinan_gt ?? "",
            data.rambut_gt ?? "",
            data.surat_izin_digunakan ?? "",
            data.sakit_hari ?? 0,
            data.izin_hari ?? 0,
            data.pulang_hari ?? 0,
            data.hub_pjgt ?? "",
            data.alasan_pjgt ?? "",
            data.hub_km ?? "",
            data.alasan_km ?? "",
            data.hub_guru ?? "",
            data.alasan_guru ?? "",
            data.hub_murid_dikelas ?? "",
            data.alasan_murid_dikelas ?? "",
            data.hub_murid_diluar_kelas ?? "",
            data.alasan_murid_diluar_kelas ?? "",
            data.hub_murid_secara_umum ?? "",
            data.alasan_murid_secara_umum ?? "",
            data.bisyaroh_bln1 ?? 0,
            data.bisyaroh_bln2 ?? 0,
            data.bisyaroh_bln3 ?? 0,
            data.usulan_lain_lain ?? ""
        ];

        const placeholders = args.map(() => "?").join(", ");

        await db.execute({
            sql: `INSERT INTO laporan_pjgt (${kolom.join(", ")}) VALUES (${placeholders})`,
            args: args
        });

        return { id, ...data };
    }
}