let sudahKlikPrediksi = false;

export function initFormValidationUI() {
	const predictBtn = document.getElementById("predictBtn");

	// =========================
	// HELPER
	// =========================
	function addError(input) {
		input.classList.add("border-red-500");
		input.classList.add("ring-2");
		input.classList.add("ring-red-200");
	}

	function removeError(input) {
		input.classList.remove("border-red-500");
		input.classList.remove("ring-2");
		input.classList.remove("ring-red-200");
	}

	// =========================
	// VALIDASI KLIK (FULL)
	// =========================
	function validateClick(input, min, max) {
		const raw = input.value;
		const value = parseFloat(raw.replace(",", "."));

		if (!raw || isNaN(value) || value < min || value > max) {
			addError(input);
		} else {
			removeError(input);
		}
	}

	// =========================
	// VALIDASI REALTIME (RANGE ONLY)
	// =========================
	function validateRealtime(input, min, max) {
		const raw = input.value;
		const value = parseFloat(raw.replace(",", "."));

		// Kosong = netral
		if (!raw) {
			removeError(input);
			return;
		}

		// Range error = merah
		if (isNaN(value) || value < min || value > max) {
			addError(input);
			return;
		}

		removeError(input);
	}

	// =========================
	// CLICK EVENT
	// =========================
	predictBtn?.addEventListener("click", () => {
		sudahKlikPrediksi = true;

		validateClick(document.getElementById("rapor_avg"), 0, 100);
		validateClick(document.getElementById("nilai_tes_tka"), 0, 100);
		validateClick(document.getElementById("jarak_rumah_km"), 0, 50);
	});

	// =========================
	// REALTIME EVENT
	// =========================
	const fields = [
		{ id: "rapor_avg", min: 0, max: 100 },
		{ id: "nilai_tes_tka", min: 0, max: 100 },
		{ id: "jarak_rumah_km", min: 0, max: 50 },
	];

	fields.forEach(({ id, min, max }) => {
		const input = document.getElementById(id);

		input?.addEventListener("input", () => {
			validateRealtime(input, min, max);
		});
	});

	// =========================
	// STAR REALTIME
	// =========================
	document.querySelectorAll(".input-field").forEach((input) => {
		const key = input.id.split("_")[0];
		const label = document.getElementById("label_" + key);
		const star = label?.querySelector(".required-star");

		input.addEventListener("input", () => {
			star?.classList.toggle("hidden", input.value.trim() !== "");
		});
	});
}

export function resetValidationUI() {
	sudahKlikPrediksi = false;

	// Hapus semua border merah
	document.querySelectorAll(".input-field").forEach((input) => {
		input.classList.remove("border-red-500");
		input.classList.remove("ring-2");
		input.classList.remove("ring-red-200");
	});

	// Munculin lagi star
	document.querySelectorAll(".required-star").forEach((star) => {
		star.classList.remove("hidden");
	});
}
