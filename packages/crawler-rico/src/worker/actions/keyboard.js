const clickKeyboardKey = number => {
	const buttons = document.querySelectorAll('user-keyboard button');
	let button;

	for (let i = 0; i < buttons.length; i++) {
		const result = /(\d)\s+ou\s+(\d)/.exec(buttons[i].innerText);

		if (
			result && (
				parseInt(result[1]) === parseInt(number) ||
				parseInt(result[2]) === parseInt(number)
			)
		) {
			button = buttons[i];
			break;
		}
	}

	if (button) {
		button.click();

		return Promise.resolve(true);
	}

	return Promise.resolve(false);
}

exports.enterKeyboardPassword = async (page, password) => {
	await page.waitForSelector('user-keyboard');

	for (let i = 0; i < password.length; i++) {
		const result = await page.evaluate(clickKeyboardKey, password[i]);

		if (result === false) {
			await page.screenshot({ path: `error/tecla_${password[i]}.png` });
			throw new Error(`Unable to find key for ${password[i]}`);
		}

		await page.waitFor(500);
	}

	await page.waitFor(1000);
	await page.click('button[type="submit"]');
}