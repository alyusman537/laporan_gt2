import { StatusPjgtService } from "../services/statusPjgtService.js";
import { LibsqlError } from "@libsql/client";


export const statusPjgtController = {
    // getStatus: async (req, res) => {
    //     try {
    //         const data = await statusPjgtService.getDataStatus();
    //         res.status(200).json({ status: "success", data });
    //     } catch (error) {
    //         res.status(500).json({ status: "error", message: error.message });
    //     }
    // },


    getAllStatus: async (req, res) => {
        try {
            const data = await statusPjgtService.getAllDataStatus();
            res.status(200).json({ status: "success", data });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

    createStatus: async (req, res) => {
        try {
            // Validasi sederhana
            if (!req.body.id_pjgt || !req.body.alasan) {
                return res.status(400).json({ status: "error", message: "Data tidak lengkap" });
            }

            const newData = await statusPjgtService.create(req.body);
            res.status(201).json({ status: "success", data: newData });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },
    getByPjgtId: async (req, res) => {
        try {
            const data = await statusPjgtService.getLatestStatusById(req.params.idPjgt);
            res.status(200).json({ status: "success", data });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

    getHistoryStatus: async (req, res) => {
        try {
            const data = await statusPjgtService.getHistoryStatusById(req.params.idPjgt);
            res.status(200).json({ status: "success", data });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            // req.params.id merujuk pada ID unik di tabel statusPJGT
            const data = await StatusPjgtService.update(req.params.id, req.body);
            res.status(200).json({ status: "success", data });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}