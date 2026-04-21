export const roleMiddleware = {
  admin: (req, res, next) => {
    // Pastikan authMiddleware sudah dijalankan sebelumnya sehingga req.user tersedia
    if (req.user.role === "admin") {
      next(); // Izinkan akses
    } else {
      res.status(403).json({ message: "Akses ditolak: Anda bukan Admin" });
    }
  },
  gt: (req, res, next) => {
    // Pastikan authMiddleware sudah dijalankan sebelumnya sehingga req.user tersedia
    if (req.user.role === "gt") {
      next(); // Izinkan akses
    } else {
      res.status(403).json({ message: "Akses ditolak: Anda bukan GT" });
    }
  },
  pjgt: (req, res, next) => {
    // Pastikan authMiddleware sudah dijalankan sebelumnya sehingga req.user tersedia
    if (req.user.role === "pjgt") {
      next(); // Izinkan akses
    } else {
      res.status(403).json({ message: "Akses ditolak: Anda bukan PJGT" });
    }
  },
};