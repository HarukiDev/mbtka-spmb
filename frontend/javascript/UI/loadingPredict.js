export let loadingInterval = null;

export function startLoading() {
	const el = document.getElementById("resultValue");
	let dots = 0;
	el.textContent = "Tunggu";

	loadingInterval = setInterval(() => {
		dots = (dots + 1) % 4;
		el.textContent = "Tunggu" + ".".repeat(dots);
	}, 500);
}

export function stopLoading(html) {
	clearInterval(loadingInterval);
	document.getElementById("resultValue").innerHTML = html;
}
