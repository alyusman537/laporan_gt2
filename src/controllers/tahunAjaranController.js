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
        const result = await tahunAjaranService.create(keterangan);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        // Deteksi error duplikat dari SQLite/LibSQL
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ 
                success: false, 
                message: "Tahun ajaran tersebut sudah terdaftar." 
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
},
    // create: async (req, res) => {
    //     try {
    //         const { keterangan } = req.body;
    //         const hasil = await tahunAjaranService.create(keterangan);
    //         res.status(200).json({ success: true, data: hasil })
    //     } catch (error) {
    //         if (error instanceof LibsqlError) {
    //             res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
    //         } else {
    //             res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
    //         }
    //     }
    // },
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
    getAktif: async (req, res) => {
    try {
        const resultData = await tahunAjaranService.getActive();
        
        // Log untuk debug di terminal nodejs
        console.log("Data yang akan dikirim ke client:", resultData);

        if (!resultData) {
            return res.status(200).json({ 
                status: false, 
                message: "Database kosong", 
                data: null  // Pastikan eksplisit menulis null
            });
        }

        // Kirim data dalam objek
        res.status(200).json({
            status: true,
            message: "Berhasil mengambil tahun ajaran aktif",
            data: {
                id: resultData.id,
                keterangan: resultData.keterangan,
                aktif: resultData.aktif
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            message: error.message,
            data: null 
        });
    }
    }
}