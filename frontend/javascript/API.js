export class API {
    constructor() {
        this.baseURL = "http://127.0.0.1:5000";
    }

    async predictKelulusan(data) {
        return fetch(`${this.baseURL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rapor_avg: data.rapor,
                nilai_tes_tka: data.tka,
                jarak_rumah_km: data.jarak,
                sekolah_tujuan: data.sekolah,
            }),
        });
    }
}