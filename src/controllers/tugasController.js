import { LibsqlError } from "@libsql/client";
import { tugasService } from "../services/tugasService.js"
import { tahunAjaranService } from "../services/tahunAjaranService.js";
import { pjgtService } from "../services/pjgtService.js";
import { gtService } from "../services/gtService.js";

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
    },
    create: async (req, res) => {
        try {
            const { idTahunAjaran, idPjgt, idGt } = req.body;
            const ta = await tahunAjaranService.byId(idTahunAjaran);
            const pjgt = await pjgtService.byId(idPjgt);
            const gt = await gtService.byId(idGt);
            if(!ta || !pjgt || !gt) {
                res.status(400).json({success: false, message: "Silahkan periksa lagi id tahun ajaran, pjgt dan gt yang anda input"})
            }
            const cek = await tugasService.cek(req.body)
            const hasil = await tugasService.create(req.body, req.user.id);
            res.status(200).json({success: true, data: hasil})
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
            const { idTahunAjaran, idPjgt, idGt, jenisPenugasan } = req.body;
            const { id } = req.params;
            const data = {
                idTahunAjaran: idTahunAjaran,
                idPjgt: idPjgt,
                idGt: idGt,
                jenisPenugasan: jenisPenugasan
            }
            const tugas = await tugasService.byId(id);
            if(tugas.aktif == 0 ) {
                res.status(400).json({success: false, message: `ID penugasan ${id} sudah tidak berlaku`})
            }
            const ta = await tahunAjaranService.byId(idTahunAjaran);
            const pjgt = await pjgtService.byId(idPjgt);
            const gt = await gtService.byId(idGt);
            if(!ta || ta.aktif == 0 || !pjgt || pjgt.aktif == 0 || !gt || gt.aktif == 0) {
                res.status(400).json({success: false, message: "Silahkan periksa lagi id tahun ajaran, pjgt dan gt yang anda input"})
            }
            const hasil = await tugasService.update(data, id);
            res.status(200).json({success: true, data: hasil})
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
            const {id} = req.params;
            const hasil = await tugasService.delete(id);
            res.status(200).json({success: true, data: hasil})
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
}