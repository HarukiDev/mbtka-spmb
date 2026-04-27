export class Form {
    getFormData() {
        return {
            rapor: parseFloat(document.getElementById("rapor_avg").value),
            tka: parseFloat(document.getElementById("nilai_tes_tka").value),
            jarak: parseFloat(
                document.getElementById("jarak_rumah_km").value.replace(",", ".")
            ),
            sekolah: document.getElementById("sekolah_tujuan").value,
        };
    }

    validateForm() {
        const rapor = document.getElementById("rapor_avg").value;
        const tka = document.getElementById("nilai_tes_tka").value;
        const jarak = document.getElementById("jarak_rumah_km").value;

        const raporVal = parseFloat(rapor);
        const tkaVal = parseFloat(tka);
        const jarakVal = parseFloat(jarak.replace(",", "."));

        let isValid = true;

        if (!rapor || raporVal < 0 || raporVal > 100) isValid = false;
        if (!tka || tkaVal < 0 || tkaVal > 100) isValid = false;
        if (!jarak || jarakVal < 0 || jarakVal > 50) isValid = false;

        return { isValid };
    }

    reset() {
        document.getElementById("rapor_avg").value = "";
        document.getElementById("nilai_tes_tka").value = "";
        document.getElementById("jarak_rumah_km").value = "";
        document.getElementById("sekolah_tujuan").selectedIndex = 0;
    }
}