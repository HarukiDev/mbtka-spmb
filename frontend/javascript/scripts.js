document.addEventListener("DOMContentLoaded", function () {
	/* ===============================
       SLIDER DAYA TAMPUNG
    =============================== */
	const slider = document.getElementById("daya_tampung");
	const label = document.getElementById("daya_label");

	function updateDaya(v) {
		label.textContent = v + " Kursi";

		label.classList.remove("text-red-600", "text-yellow-600", "text-green-600");

		if (v <= 80) {
			label.classList.add("text-red-600");
		} else if (v <= 120) {
			label.classList.add("text-yellow-600");
		} else {
			label.classList.add("text-green-600");
		}
	}

	if (slider && label) {
		updateDaya(slider.value);
		slider.addEventListener("input", () => updateDaya(slider.value));
	}

	/* ===============================
       LOADING ANIMATION
    =============================== */
	let loadingInterval = null;

	function startLoading() {
		const el = document.getElementById("resultValue");
		let dots = 0;

		el.textContent = "Tunggu";

		loadingInterval = setInterval(() => {
			dots = (dots + 1) % 4;
			el.textContent = "Tunggu" + ".".repeat(dots);
		}, 500);
	}

	function stopLoading(html) {
		clearInterval(loadingInterval);
		document.getElementById("resultValue").innerHTML = html;
	}

	/* ===============================
       PREDICT BUTTON
    =============================== */
	function validateForm() {
		const raporInput = document.getElementById("rapor_avg");
		const tkaInput = document.getElementById("nilai_tes_tka");
		const jarakInput = document.getElementById("jarak_rumah_km");

		const rapor = parseFloat(raporInput.value);
		const tka = parseFloat(tkaInput.value);
		const jarak = parseFloat(jarakInput.value.replace(",", "."));

		let isValid = true;

		// Reset style dulu
		[raporInput, tkaInput, jarakInput].forEach((input) => {
			input.classList.remove("border-red-500", "ring-2", "ring-red-200");
		});

		// 🔥 Built-in validation (min/max/required)
		if (!raporInput.checkValidity()) {
			raporInput.classList.add("border-red-500", "ring-2", "ring-red-200");
			isValid = false;
		}

		if (!tkaInput.checkValidity()) {
			tkaInput.classList.add("border-red-500", "ring-2", "ring-red-200");
			isValid = false;
		}

		if (isNaN(jarak)) {
			jarakInput.classList.add("border-red-500", "ring-2", "ring-red-200");
			isValid = false;
		}

		return isValid;
	}

	const predictBtn = document.getElementById("predictBtn");

	if (!predictBtn) return;

	predictBtn.addEventListener("click", async function () {
		if (!validateForm()) {
			alert("Pastikan semua data terisi dan sesuai range.");
			return; // ⛔ STOP. Tidak masuk backend.
		}

		const rapor = parseFloat(document.getElementById("rapor_avg").value);
		const tka = parseFloat(document.getElementById("nilai_tes_tka").value);
		const jarak = parseFloat(
			document.getElementById("jarak_rumah_km").value.replace(",", "."),
		);
		const daya = parseInt(slider.value);
		const sekolah = document.getElementById("sekolah_tujuan").value;

		startLoading();

		try {
			const response = await fetch("http://127.0.0.1:5000/predict", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					rapor_avg: rapor,
					nilai_tes_tka: tka,
					jarak_rumah_km: jarak,
					daya_tampung: daya,
					sekolah_tujuan: sekolah,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				stopLoading("Error");
				alert(result.message || "Terjadi kesalahan");
				return;
			}

			stopLoading(
				`${(result.probability * 100).toFixed(1)}
            <span class="text-xl">%</span>`,
			);
		} catch (err) {
			console.error(err);
			stopLoading("Error");
		}
	});

	/* ===============================
   RESET BUTTON
=============================== */
	const resetBtn = document.getElementById("resetBtn");

	if (resetBtn) {
		resetBtn.addEventListener("click", function () {
			// Reset input
			document.getElementById("rapor_avg").value = "";
			document.getElementById("nilai_tes_tka").value = "";
			document.getElementById("jarak_rumah_km").value = "";

			// Reset select sekolah
			document.getElementById("sekolah_tujuan").selectedIndex = 0;

			// Reset slider daya tampung
			const slider = document.getElementById("daya_tampung");
			const label = document.getElementById("daya_label");

			slider.value = 120;
			label.textContent = "120 Kursi";

			label.classList.remove(
				"text-red-600",
				"text-yellow-600",
				"text-green-600",
			);
			label.classList.add("text-yellow-600");

			// Stop loading kalau lagi jalan
			if (typeof loadingInterval !== "undefined" && loadingInterval) {
				clearInterval(loadingInterval);
			}

			// Reset hasil
			document.getElementById("resultValue").innerHTML =
				`0<span class="text-xl">%</span>`;
		});
	}
});

const jarak = parseFloat(
	document.getElementById("jarak_rumah_km").value.replace(",", "."),
);
