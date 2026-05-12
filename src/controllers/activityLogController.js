import { LibsqlError } from "@libsql/client";
import { activityLogService } from "../services/activityLogService.js"


export const activityLogController = {
    all: async (req, res) => {
        try {
            const hasil = await activityLogService.all();
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
            const hasil = await activityLogService.byId(id);
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },

    byTahun: async (req, res) => {
        try {
            const { tahun } = req.params;
            const hasil = await activityLogService.byTahun(tahun);
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
            const data = req.body;
            const { id, role } = req.user;
            const hasil = await activityLogService.create(data, role, id);
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const hasil = await activityLogService.delete(id);
            res.status(200).json({ success: true, data: hasil })
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    deleteAll: async (req, res) => {
        try {
            // const {id} = req.params;
            const hasil = await activityLogService.delete();
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