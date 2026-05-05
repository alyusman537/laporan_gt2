import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/sql';
import sqlite3 from 'sqlite3';
// 1. Inisialisasi Express
const app = express();
const port = 3100;

// 2. Hubungkan ke Database SQLite
const db = new sqlite3.Database('./database.sqlite'); // Nama file DB Anda

// 3. Konfigurasi AdminJS
AdminJS.registerAdapter({ Database, Resource });

const adminJs = new AdminJS({
  databases: [new Database(db)], // Menggunakan DB SQLite
  rootPath: '/admin', // URL untuk admin
  dashboard: {
    component: false // Gunakan false untuk dashboard bawaan
  }
});

// 4. Setup Router AdminJS
const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

// Start Server
app.listen(port, () => {
  console.log(`AdminJS dimulai di http://localhost:${port}${adminJs.options.rootPath}`);
});
