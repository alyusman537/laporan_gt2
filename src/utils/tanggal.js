export const tanggal = {
    hijri: () => {
        process.env.TZ = "Asia/Jakarta";
        const date = new Date();
        const day = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { month: 'numeric' }).format(date);
        const monthName = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { month: 'long' }).format(date);
        const year = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { year: 'numeric' }).format(date);

        return {
            day,
            month,
            monthName,
            year
        };
    },
    getYmdhis: () => {
        const d = new Date();

        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }); // dddd
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // m (01-12)
        const year = d.getFullYear(); // yyyy
        const hours = d.getHours().toString().padStart(2, '0'); // H
        const minutes = d.getMinutes().toString().padStart(2, '0'); // i
        const seconds = d.getSeconds().toString().padStart(2, '0'); // s

        const formattedDate = `${year}-${month}-${dayName} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate);
        return formattedDate;
    }
}