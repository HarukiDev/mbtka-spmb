import {
	initFormValidationUI,
	resetValidationUI,
} from "./UI/initFormValidationUI.js";
import { validateForm } from "./form/validateForm.js";
import { getFormData } from "./form/getFormData.js";
import {
	startLoading,
	stopLoading,
	loadingInterval,
} from "./UI/loadingPredict.js";
import { predictKelulusan } from "./API/predictionApi.js";
import { showFormAlert } from "./UI/uiAlert.js";

document.addEventListener("DOMContentLoaded", () => {
	// 🔥 Init UI validation
	initFormValidationUI();

	const predictBtn = document.getElementById("predictBtn");
	const resetBtn = document.getElementById("resetBtn");

	if (predictBtn) {
		predictBtn.addEventListener("click", async () => {
			// =========================
			// VALIDATION (LOGIC ONLY)
			// =========================
			const { isValid } = validateForm();

			if (!isValid) {
				showFormAlert();
				return;
			}

			// =========================
			// GET DATA
			// =========================
			const formData = getFormData();
			startLoading();

			try {
				const response = await predictKelulusan(formData);
				const result = await response.json();

				if (!response.ok) {
					stopLoading("Error");
					alert(result.message || "Terjadi kesalahan");
					return;
				}

				stopLoading(
					`${(result.probability * 100).toFixed(1)}
					<span class="text-xl">%</span>`
				);
			} catch (err) {
				console.error(err);
				stopLoading("Error");
			}
		});
	}

	// =========================
	// RESET
	// =========================
	if (resetBtn) {
		resetBtn.addEventListener("click", () => {
			document.getElementById("rapor_avg").value = "";
			document.getElementById("nilai_tes_tka").value = "";
			document.getElementById("jarak_rumah_km").value = "";
			document.getElementById("sekolah_tujuan").selectedIndex = 0;

			if (loadingInterval) clearInterval(loadingInterval);

			document.getElementById(
				"resultValue"
			).innerHTML = `0<span class="text-xl">%</span>`;

			// RESET VALIDATION SYSTEM
			resetValidationUI();
		});
	}
});
