import { LibsqlError } from "@libsql/client";
import { tugasService } from "../services/tugasService.js"

export const tugasController = {
    all: async (req, res) => {
        try {
            const hasil = await tugasService.all();
            res.status(200).json({success: true, data: hasil})
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
            const {id} = req.params;
            const hasil = await tugasService.byId(id);
            res.status(200).json({success: true, data: hasil})
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    }
}