import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { LibsqlError } from "@libsql/client";
import { userService } from "../services/userService.js";
import { passwordBcrypt } from '../utils/passwordBcrypt.js';

export const authController = {
    login: async (req, res) => {
        try {
            const { username, password, role } = req.body;
            const user = await userService.byUsername(username, String(role).toLocaleLowerCase());
            if (!user) {
                res.status(400).json({ success: false, message: "Username yang anda masukkan belum terdaftar." });
            }
            if (!passwordBcrypt.banding(password, user.password)) {
                res.status(400).json({ success: false, message: "Password yang anda masukkan salah." });
            }

            // Masukkan role ke dalam token JWT 
            console.log("Secret Key Access:", process.env.JWT_ACCESS_SECRET);
            // Masukkan role ke dalam token JWT
            // Di dalam authController.js atau file login Anda
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' } // Token akses berumur pendek
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' } // Token penyegar berumur panjang
            );

            // res.status(200).json({
            //     accessToken: accessToken,
            //     refreshToken: refreshToken,
            //     role: user.role,
            //     nama: user.nama
            // });
             res.status(200).json({
        user: {
          id: user.id,
          username: user.username, // atau user.nama sesuai kolom DB Anda
          role: user.role,
          status: user.status || 'aktif',
          last_login: new Date()
        },
        accessToken: accessToken,
        refreshToken: refreshToken
      });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
                // Example codes: "URL_INVALID", "SERVER_ERROR", "SQL_ERROR"
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token tidak ada" });
        }

        try {
            // 1. Verifikasi (Gunakan JWT_REFRESH_SECRET agar sama dengan saat Login)
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            // 2. Cari User menggunakan userService (bukan User.findByPk karena Anda pakai userService)
            const user = await userService.byId(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            // 3. Buat Access Token baru (Gunakan JWT_ACCESS_SECRET agar sama dengan login)
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            // 4. Buat Refresh Token baru (Rotation Strategy agar lebih aman)
            const newRefreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            // 5. Kirim satu respon tunggal yang berisi keduanya
            return res.status(200).json({
                success: true,
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            });

        } catch (error) {
            console.error("Refresh Token Error:", error);
            return res.status(403).json({
                success: false,
                message: "Refresh token tidak valid atau sudah expired"
            });
        }
    },
};
