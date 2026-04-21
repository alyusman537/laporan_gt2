import { tahunAjaranService } from "../services/tahunAjaranService.js"
import { LibsqlError } from "@libsql/client";

export const tahunAjaranController = {
    all: async (req, res) => {
        try {
            const hasil = await tahunAjaranService.all();
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    byId: async (req, res) => {
        try {
            const { id } = req.params;
            const hasil = await tahunAjaranService.byId(id);
            res.status(200).json({ success: true, data: hasil })
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
            const { keterangan } = req.body;
            const userId = req.user.id;
            const hasil = await tahunAjaranService.create(keterangan, userId);
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    update: async (req, res) => {
        try {
            const { keterangan } = req.body;
            const id = req.params.id;
            const hasil = await tahunAjaranService.update(keterangan, id);
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    aktif: async (req, res) => {
        try {
            const id = req.params.id;
            const hasil = await tahunAjaranService.aktif(id);
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
}