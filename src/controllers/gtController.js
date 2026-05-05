import { gtService } from "../services/gtService.js";
import { passwordBcrypt } from "../utils/passwordBcrypt.js";
import { LibsqlError } from "@libsql/client";

export const gtController = {
    myProfile: async (req, res) => {
        try {
            const hasil = await gtService.byId(req.user.id);
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    all: async (req, res) => {
        try {
            const hasil = await gtService.all();
            res.status(200).json({ success: true, data: hasil });
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
            const hasil = await gtService.byId(id);
            res.status(200).json({ success: true, data: hasil });
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

        console.log("Filter Tahun diterima:", tahun);
        const hasil = await gtService.byTahun(tahun);

        // 1. Tambahkan pengecekan jika hasil adalah null atau array kosong
        if (!hasil || hasil.length === 0) {
            return res.status(200).json({ 
                success: false, // Berubah jadi false
                message: `Data Guru Tugas tahun ${tahun} tidak ditemukan`, 
                data: [] 
            });
        }

        // 2. Jika ada data, kirim success: true
        res.status(200).json({ 
            success: true, 
            message: `Data Guru Tugas tahun ${tahun} berhasil diambil`, 
            data: hasil 
        });

    } catch (error) {
        // ... logika catch tetap sama ...
        if (error instanceof LibsqlError) {
            res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
        } else {
            res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
        }
    }
},
    create: async (req, res) => {
        try {
            const { nim } = req.body;
            const hasil = await gtService.create(nim, passwordBcrypt.enkrip(nim), req.body);
            res.status(201).json({ success: true, data: hasil });
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
            const { id } = req.params;
            const hasil = await gtService.update(id, req.body);
            res.status(200).json({ success: true, data: hasil });
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
            const hasil = await gtService.delete(id);
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    reset: async (req, res) => {
        try {
            const { id } = req.params;
            const gt = await gtService.byId(id);
            if (!gt) {
                res.status(400).json({ success: false, message: "id gt tidak valid" });
            }
            const hasil = await gtService.update(id, gt.nim);
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    changePassword: async (req, res) => {
        try {
            const id = req.user.id;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const gt = await gtService.byId(id);
            if (!gt) {
                res.status(400).json({ success: false, message: "id gt tidak valid" });
            }
            if (!passwordBcrypt.banding(oldPassword, gt.password)) {
                res.status(400).json({ success: false, message: "password lama yang anda masukkan salah." });
            }
            if (newPassword != confirmPassword) {
                res.status(400).json({ success: false, message: "password baru dan konfirmasi password harus sama" });
            }
            const hasil = await gtService.changePassword(id, passwordBcrypt.enkrip(newPassword));
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
}