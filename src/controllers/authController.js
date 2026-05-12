import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { LibsqlError } from "@libsql/client";
import { userService } from "../services/userService.js";
import { passwordBcrypt } from '../utils/passwordBcrypt.js';

export const authController = {
    login: async (req, res) => {
        // Contoh Logika di Backend



        try {
            const isDefault = Boolean;
            const { username, password, role } = req.body;
            const passwordDefaultDariEnv = process.env.PASSWORD_DEFAULT; // Mengambil "123456" dari memo .env
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
            // 3. LOGIKA PENGECEKAN PASSWORD DEFAULT
            // Gunakan 'let' agar nilainya bisa diubah, dan jangan pakai 'return' di sini
            let mustChangePassword = false;
            if (password === passwordDefaultDariEnv) {
                mustChangePassword = true;
            }

            // 4. Generate Tokens
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '1d' }
            );

            const refreshToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            // 5. Kirim Respon ke Flutter
            // Pastikan res.status(200).json dipanggil paling akhir
            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    status: user.status || 'aktif',
                    last_login: new Date()
                },
                accessToken: accessToken,
                refreshToken: refreshToken,
                must_change_password: mustChangePassword // Akan bernilai true jika pasw = env
            });

        } catch (error) {
            console.error("Login Error:", error);
            if (error instanceof LibsqlError) {
                return res.status(500).json({ success: false, message: `Database Error: ${error.message}` });
            }
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
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
            const user = await userService.byIdRole(decoded.id, decoded.role);

            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            // 3. Buat Access Token baru (Gunakan JWT_ACCESS_SECRET agar sama dengan login)
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '1d' }
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
    changePassword: async (req, res) => {
        try {
            // 1. Ambil data user dari middleware (hasil decoded JWT)
            const { id, role } = req.user;
            const { oldPassword, newPassword, confirmPassword } = req.body;

            // 2. Ambil data user dari database berdasarkan role
            const user = await userService.byIdRole(id, role);

            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }

            // 3. Validasi Password Lama (Bandingkan dengan hash di DB)
            // Pastikan menggunakan variabel 'user.password', bukan 'gt.password'
            const isOldPasswordMatch = await passwordBcrypt.banding(oldPassword, user.password);
            if (!isOldPasswordMatch) {
                return res.status(400).json({ success: false, message: "Password lama yang Anda masukkan salah." });
            }

            // 4. Validasi Konfirmasi Password Baru
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ success: false, message: "Password baru dan konfirmasi password harus sama." });
            }

            // 5. Enkripsi Password Baru
            const hashedNewPassword = await passwordBcrypt.enkrip(newPassword);

            // 6. Update Password di Database (Gunakan service yang universal)
            // Pastikan userService.updatePassword bisa menangani update berdasarkan role & id
            const hasil = await userService.updatePassword(id, role, hashedNewPassword);

            return res.status(200).json({
                success: true,
                message: "Password berhasil diperbarui",
                data: hasil
            });

        } catch (error) {
            console.error("Change Password Error:", error);
            if (error instanceof LibsqlError) {
                return res.status(500).json({ success: false, message: `Database Error: ${error.message}` });
            }
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
        }
    },

};
