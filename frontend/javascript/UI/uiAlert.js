export function showFormAlert() {
	const alertBox = document.getElementById("formAlert");
	if (!alertBox) return;

	alertBox.classList.remove("hidden");

	// auto hide setelah 3 detik
	setTimeout(() => {
		alertBox.classList.add("hidden");
	}, 3000);
}
