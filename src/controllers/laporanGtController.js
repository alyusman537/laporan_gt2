import { LibsqlError } from "@libsql/client";
import { laporanGtService } from "../services/laporanGtService.js"
import { tugasService } from "../services/tugasService.js";
import { tahunAjaranService } from "../services/tahunAjaranService.js";
import { gtService } from "../services/gtService.js";
import { pjgtService } from "../services/pjgtService.js";

export const laporanGtController = {
    tahun: async (req, res) => {
        try {
            const { tahun } = req.params;
            const hasil = await laporanGtService.byTahun(tahun);
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
            const hasil = await laporanGtService.byBulan(tahun, bulan);
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
            const hasil = await laporanGtService.byGt(req.params.id_gt);
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
            const hasil = await laporanGtService.byPjgt(req.params.id_pjgt);
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
    gt: async (req, res) => {
        try {
            const hasil = await laporanGtService.byGt(req.user.id);
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
            const laporan = await laporanGtService.detail(id);
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
        // Taruh log di paling atas untuk memastikan request masuk ke fungsi ini
        console.log(">>> [Controller] Request Create Laporan Masuk");

        try {
            // 1. Pastikan req.user ada (proteksi terhadap middleware yang bocor)
            if (!req.user) {
                console.error("!!! Error: req.user tidak ditemukan. Cek Middleware Auth.");
                return res.status(401).json({ success: false, message: 'Unauthorized: No User Data' });
            }

            const idGt = req.user.id;
            console.log("ID Guru Tugas:", idGt);

            // 2. Ambil data pendukung
            const tugas = await tugasService.byGt(idGt);
            const tahunAktif = await tahunAjaranService.getActive();

            console.log('Data Tugas ditemukan:', tugas);
            console.log('Tahun Ajaran Aktif:', tahunAktif);

            // 3. Validasi Penugasan (WAJIB pakai RETURN)
            if (!tugas || tugas.aktif == '0') {
                console.warn("!!! Peringatan: Tugas tidak aktif atau tidak ditemukan");
                return res.status(400).json({
                    success: false,
                    message: 'penugasan anda tidak ada atau sudah berakhir'
                });
            }

            if (!tahunAktif) {
                return res.status(400).json({ success: false, message: 'Tahun ajaran aktif tidak ditemukan' });
            }

            // 4. Proses Insert
            console.log("Sedang mencoba insert ke Database...");
            const hasil = await laporanGtService.create(idGt, tugas.id_tugas, tahunAktif.id, req.body);

            console.log("Insert Berhasil!");
            return res.status(201).json({ success: true, data: hasil });

        } catch (error) {
            // Log error secara detail di terminal
            console.error("--- CRASH DI CONTROLLER ---");
            console.error(error);

            if (error.name === 'LibsqlError') {
                return res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            }

            return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
        }
    },
    update: async (req, res) => {
        console.log(">>> [Controller] Request Update Laporan Masuk");

        try {
            // 1. Ambil ID Laporan dari parameter URL
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: false, message: 'ID Laporan tidak ditemukan' });
            }

            // 2. Pastikan req.user ada (proteksi middleware)
            if (!req.user) {
                console.error("!!! Error: req.user tidak ditemukan.");
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // 3. Proses Update
            // Kita langsung memanggil service update. 
            // idGt, idTugas, dan idTahunAjaran biasanya tidak diupdate karena bersifat relasi tetap.
            console.log(`Sedang mencoba update laporan ID: ${id}...`);

            const hasil = await laporanGtService.update(id, req.body);

            console.log("Update Berhasil!");
            return res.status(200).json({
                success: true,
                message: 'Laporan berhasil diperbarui',
                data: hasil
            });

        } catch (error) {
            console.error("--- CRASH DI CONTROLLER (UPDATE) ---");
            console.error(error);

            if (error.name === 'LibsqlError') {
                return res.status(500).json({
                    success: false,
                    message: `Database Error: ${error.message}`
                });
            }

            return res.status(500).json({
                success: false,
                message: `Server Error: ${error.message}`
            });
        }
    }
}