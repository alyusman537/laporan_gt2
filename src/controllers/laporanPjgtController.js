import { LibsqlError } from "@libsql/client";
import { laporanPjgtService } from "../services/laporanPjgtService.js"
import { tugasService } from "../services/tugasService.js";
import { tahunAjaranService } from "../services/tahunAjaranService.js";
import { gtService } from "../services/gtService.js";
import { pjgtService } from "../services/pjgtService.js";

export const laporanPjgtController = {
    tahun: async (req, res) => {
        try {
            const { tahun } = req.params;
            const hasil = await laporanPjgtService.byTahun(tahun);
            res.status(200).json({
                success: true,
                data: hasil
            })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    bulan: async (req, res) => {
        try {
            const { tahun, bulan } = req.params;
            const hasil = await laporanPjgtService.byBulan(tahun, bulan);
            res.status(200).json({
                success: true,
                data: hasil
            })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    gtByAdmin: async (req, res) => {
        try {
            const hasil = await laporanPjgtService.byGt(req.params.id_gt);
            res.status(200).json({
                success: true,
                data: hasil
            })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    pjgtByAdmin: async (req, res) => {
        try {
            const hasil = await laporanPjgtService.byPjgt(req.params.id_pjgt);
            res.status(200).json({
                success: true,
                data: hasil
            })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    pjgt: async (req, res) => {
        try {
            const hasil = await laporanPjgtService.byPjgt(req.user.id);
            res.status(200).json({
                success: true,
                data: hasil
            })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const laporan = await laporanPjgtService.detail(id);
            const tugas = await tugasService.byId(laporan.id_tugas);
            const tahunAjaran = await tahunAjaranService.byId(tugas.id_tahun_ajaran);
            const gt = await gtService.byId(tugas.id_gt);
            const pjgt = await pjgtService.byId(tugas.id_pjgt);

            const hasil = {
                laporan: laporan,
                tugas: tugas,
                tahunAjaran: tahunAjaran,
                gt: gt,
                pjgt: pjgt
            }
            res.status(200).json({
                success: true,
                data: hasil
            })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    create: async (req, res) => {
        try {
            const id_pjgt = req.user.id;
            const id_gt = req.body.id_gt;
            const tugas = await tugasService.byPjgt(id_pjgt);
            const tapel = await tahunAjaranService.getActive();
            console.log('Data Tugas ditemukan:', req.body);
            // console.log("data =", idGt, tugas.id, tapel.id, tapel.keterangan);

            // PENTING: Tambahkan return agar tidak lanjut ke kode di bawahnya
            if (!tugas || tugas.aktif == '0') {
                return res.status(400).json({
                    success: false,
                    message: 'Penugasan Anda tidak ada atau sudah berakhir'
                });
            }
            const hasil = await laporanPjgtService.create({
                id_pjgt: req.user.id,
                id_gt: req.body.id_gt,
                id_tugas: tugas.id,
                id_tahun_ajaran: tapel.id,
                data: req.body
            });

            return res.status(201).json({ success: true, data: hasil });
        } catch (error) {
            console.error(error);
            if (error instanceof LibsqlError) {
                return res.status(500).json({ success: false, message: `libSQL Error: ${error.code}` });
            }
            return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
        }
    }
}
