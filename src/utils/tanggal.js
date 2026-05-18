export const tanggal = {
    hijri: () => {
        process.env.TZ = "Asia/Jakarta";
        const date = new Date();
        const day = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { month: 'numeric' }).format(date);
        const monthName = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { month: 'long' }).format(date);
        const year = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { year: 'numeric' }).format(date);

        const formattedHijri = `${day}-${month}-${year} `;

        // console.log(formattedDate);
        return {
            day,
            month,
            monthName,
            year
        };
    },
    getYmdhis: () => {
        const d = new Date();
        const jakartaTime = d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        const localDate = new Date(jakartaTime);
        // const dayName = d.toLocaleDateString('en-US', { timeZone: "Asia/Jakarta" });
        const dayName = d.toLocaleDateString('id-ID', { weekday: 'long' });
        const day = d.getDate().toString().padStart(2, '0'); // Tanggal (01-31)
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // m (01-12)
        const year = d.getFullYear(); // yyyy
        const hours = d.getHours().toString().padStart(2, '0'); // H
        const minutes = d.getMinutes().toString().padStart(2, '0'); // i
        const seconds = d.getSeconds().toString().padStart(2, '0'); // s

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate);
        return formattedDate;
        //     const formattedDate = `${year}-${month}-${day} ${dayName} ${hours}:${minutes}:${seconds}`;

        // return formattedDate;
    },
    // tglIndo: () => {
    //     const d = new Date();

    //     // Format lengkap Indonesia: "Senin, 11 Mei 2026"
    //     const options = {
    //         weekday: 'long',
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric'
    //     };
    //     const datePart = d.toLocaleDateString('id-ID', options);

    //     const hours = d.getHours().toString().padStart(2, '0');
    //     const minutes = d.getMinutes().toString().padStart(2, '0');
    //     const seconds = d.getSeconds().toString().padStart(2, '0');

    //     const formattedDate = `${datePart} ${hours}:${minutes}:${seconds}`;

    //     console.log(formattedDate); // Contoh: "Senin, 11 Mei 2026 09:25:25"
    //     return formattedDate;
    // }
}