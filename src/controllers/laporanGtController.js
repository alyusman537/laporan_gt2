import { LibsqlError } from "@libsql/client";
import { laporanGtService } from "../services/laporanGtService.js"
import { tugasService } from "../services/tugasService.js";

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
    create: async (req, res) => {
        try {
            const idGt = req.user.id;
            const tugas = await tugasService.byGt(idGt);
            const hasil = await laporanGtService.create(idGt, tugas.id, req.body);
            res.status(201).json({success: true, data: hasil})
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    }
}