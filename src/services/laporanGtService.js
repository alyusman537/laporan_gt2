import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js"


export const laporanGtService = {
    byTahun: async (tahun) => {
        const result = await db.execute({
            sql: ` SELECT        
            l.*,
            
            -- Data Guru Tugas (GT)
            g.nama AS nama_gt,
            g.nim AS nim_gt,
            g.hp AS hp_gt,
            g.asal_kelas,
            
            -- Data Penugasan
            t.jenis_penugasan,
            
            -- Data PJGT / Madrasah
            p.nama AS nama_pjgt,
            p.username AS id_pjgt,
            p.nama_madrasah,
            p.alamat_madrasah,
            p.nama_km,
            
            -- Data Tahun Ajaran
            ta.keterangan

            FROM laporan_gt l
            LEFT JOIN gt g ON l.id_gt = g.id
            LEFT JOIN tugas t ON l.id_tugas = t.id
            LEFT JOIN pjgt p ON t.id_pjgt = p.id
            LEFT JOIN tahun_ajaran ta ON l.id_tahun_ajaran = ta.id
            WHERE ta.id=? ORDER BY l.created_at DESC`,
            args: [tahun]
        });
        return result.rows
    },
    byBulan: async (tahun, bulan) => {
        const result = await db.execute({
            sql: `SELECT lp.id as id_laporan, lp.bulan_ke, lp.id_gt, lp.id_tugas, gt.nama as nama_gt, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
            FROM laporan_gt lp
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
            sql: ` SELECT        
            l.*,
            
            -- Data Guru Tugas (GT)
            g.nama AS nama_gt,
            g.nim AS nim_gt,
            g.hp AS hp_gt,
            g.asal_kelas,
            
            -- Data Penugasan
            t.jenis_penugasan,
            
            -- Data PJGT / Madrasah
            p.nama AS nama_pjgt,
            p.username AS id_pjgt,
            p.nama_madrasah,
            p.alamat_madrasah,
            p.nama_km,
            
            -- Data Tahun Ajaran
            ta.keterangan

            FROM laporan_gt l
            LEFT JOIN gt g ON l.id_gt = g.id
            LEFT JOIN tugas t ON l.id_tugas = t.id
            LEFT JOIN pjgt p ON t.id_pjgt = p.id
            LEFT JOIN tahun_ajaran ta ON l.id_tahun_ajaran = ta.id

            WHERE l.id_gt=? ORDER BY l.created_at DESC`,
            args: [idGt]
        });
        return result.rows
    },
    // byGt: async (idGt) => {
    //     const result = await db.execute({
    //         sql: `SELECT lp .*, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
    //         FROM laporan_gt lp
    //         LEFT JOIN tugas t ON lp.id_tugas = t.id
    //         LEFT JOIN tahun_ajaran ta ON t.id_tahun_ajaran=ta.id
    //         LEFT JOIN gt ON t.id_gt = gt.id
    //         LEFT JOIN pjgt ON t.id_pjgt = pjgt.id
    //         WHERE lp.id_gt=? ORDER BY lp.created_at DESC`,
    //         args: [idGt]
    //     });
    //     return result.rows
    // },
    byPjgt: async (idPjgt) => {
        const result = await db.execute({
            sql: `SELECT lp.id as id_laporan, lp.bulan_ke, lp.id_gt, lp.id_tugas, gt.nama as nama_gt, pjgt.nama as nama_pjgt, pjgt.nama_madrasah, ta.keterangan as thn_ajaran
            FROM laporan_gt lp
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
            sql: `SELECT * FROM laporan_gt WHERE id=?`,
            args: [id]
        });
        return result.rows[0]
    },
    create: async (idGt, idTugas, idTahunAjaran, data) => {
        const id = uuidv4();

        // 1. Buat ID baru
        const newId = uuidv4();

        // 2. Eksekusi Query
        await db.execute({
            sql: `INSERT INTO laporan_gt (
    id, id_gt, id_tugas, id_tahun_ajaran, bulan_ke, tahun,
    status_kelas, wali_kelas, guru_fak, jenis_kelamin_murid, 
    menangani_administrasi, administrasi, menangani_kegiatan, kegiatan_gt,
    izin_hari, sakit_hari, pulang_hari, 
    hubungan_pjgt, alasan_pjgt, hubungan_km, alasan_kepala, 
    hubungan_guru, alasan_guru, hubungan_murid, alasan_murid,
    masalah_penyelesaian, tugas_mendatang, tugas_belum_selesai, 
    usulan_lain_lain, bisyaroh, jam_wajib, jam_formal
  ) VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, 
    ?, ?, ?, ?, 
    ?, ?, ?, 
    ?, ?, ?, ?, 
    ?, ?, ?, ?,
    ?, ?, ?, 
    ?, ?,?,?
  )`,
            args: [
                newId,                          // 1. id
                idGt,                           // 2. id_gt
                idTugas,                        // 3. id_tugas
                idTahunAjaran,                  // 4. id_tahun_ajaran
                data.bulanKe ?? null,           // 5. bulan_ke
                data.tahun ?? null,             // 6. tahun
                data.statusKelas ?? 0,          // 7. status_kelas
                data.waliKelas ?? null,         // 8. wali_kelas
                data.guruFak ?? null,           // 9. guru_fak
                data.jkMurid ?? null,           // 10. jenis_kelamin_murid
                data.menanganiAdministrasi ?? 0,// 11. menangani_administrasi
                data.administrasi ?? null,      // 12. administrasi
                data.menanganiKegiatan ?? 0,    // 13. menangani_kegiatan
                data.kegiatanGt ?? null,        // 14. kegiatan_gt
                data.izinHari ?? null,          // 15. izin_hari
                data.pergiHari ?? null,         // 16. pergi_hari
                data.pulangHari ?? null,        // 17. pulang_hari
                data.hubunganPjgt ?? null,      // 18. hubungan_pjgt
                data.alasanPjgt ?? null,        // 19. alasan_pjgt
                data.hubunganKm ?? null,        // 20. hubungan_km
                data.alasanKepala ?? null,      // 21. alasan_kepala
                data.hubunganGuru ?? null,      // 22. hubungan_guru
                data.alasanGuru ?? null,        // 23. alasan_guru
                data.hubunganMurid ?? null,     // 24. hubungan_murid
                data.alasanMurid ?? null,       // 25. alasan_murid
                data.masalahPenyelesaian ?? null,// 26. masalah_penyelesaian
                data.tugasMendatang ?? null,    // 27. tugas_mendatang
                data.tugasBelumSelesai ?? null, // 28. tugas_belum_selesai
                data.usulanLainLain ?? null,    // 29. usulan_lain_lain
                data.bisyaroh ?? null,           // 30. bisyaroh
                data.jamWajib ?? null,           // 31. jam_wajib
                data.jamFormal ?? null            // 32. jam_formal
            ]
        });

        return { id: newId, ...data };

        // 3. Return data (Object return diletakkan setelah execute selesai)
        return {
            id: newId,
            idGt: idGt,
            idTugas: idTugas,
            ...data
        };
    },
    update: async (id, data) => {
        // 1. Eksekusi Query Update
        await db.execute({
            sql: `UPDATE laporan_gt SET 
            bulan_ke = ?, 
            tahun = ?,
            status_kelas = ?, 
            wali_kelas = ?, 
            guru_fak = ?, 
            jenis_kelamin_murid = ?, 
            menangani_administrasi = ?, 
            administrasi = ?, 
            menangani_kegiatan = ?, 
            kegiatan_gt = ?,
            izin_hari = ?, 
            sakit_hari = ?, 
            pulang_hari = ?, 
            hubungan_pjgt = ?, 
            alasan_pjgt = ?, 
            hubungan_km = ?, 
            alasan_kepala = ?, 
            hubungan_guru = ?, 
            alasan_guru = ?, 
            hubungan_murid = ?, 
            alasan_murid = ?,
            masalah_penyelesaian = ?, 
            tugas_mendatang = ?, 
            tugas_belum_selesai = ?, 
            usulan_lain_lain = ?, 
            bisyaroh = ?, 
            jam_wajib = ?, 
            jam_formal = ?
        WHERE id = ?`,
            args: [
                data.bulanKe ?? null,           // 1
                data.tahun ?? null,             // 2
                data.statusKelas ?? 0,          // 3
                data.waliKelas ?? null,         // 4
                data.guruFak ?? null,           // 5
                data.jkMurid ?? null,           // 6
                data.menanganiAdministrasi ?? 0,// 7
                data.administrasi ?? null,      // 8
                data.menanganiKegiatan ?? 0,    // 9
                data.kegiatanGt ?? null,        // 10
                data.izinHari ?? null,          // 11
                data.sakitHari ?? null,         // 12 (Tadi di create pake data.pergiHari, pastikan fieldnya benar)
                data.pulangHari ?? null,        // 13
                data.hubunganPjgt ?? null,      // 14
                data.alasanPjgt ?? null,        // 15
                data.hubunganKm ?? null,        // 16
                data.alasanKepala ?? null,      // 17
                data.hubunganGuru ?? null,      // 18
                data.alasanGuru ?? null,        // 19
                data.hubunganMurid ?? null,     // 20
                data.alasanMurid ?? null,       // 21
                data.masalahPenyelesaian ?? null,// 22
                data.tugasMendatang ?? null,    // 23
                data.tugasBelumSelesai ?? null, // 24
                data.usulan_lain_lain ?? null,  // 25
                data.bisyaroh ?? null,          // 26
                data.jamWajib ?? null,          // 27
                data.jamFormal ?? null,         // 28
                id                              // 29. WHERE id = ?
            ]
        });

        // 2. Return data yang telah diupdate
        return { id, ...data };
    }

}