export function validateForm() {
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
