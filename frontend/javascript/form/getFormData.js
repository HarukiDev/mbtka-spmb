export function getFormData() {
	return {
		rapor: parseFloat(document.getElementById("rapor_avg").value),
		tka: parseFloat(document.getElementById("nilai_tes_tka").value),
		jarak: parseFloat(
			document.getElementById("jarak_rumah_km").value.replace(",", ".")
		),
		sekolah: document.getElementById("sekolah_tujuan").value,
	};
}
