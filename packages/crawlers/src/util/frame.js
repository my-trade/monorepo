const getCorpoFrame = (page) => {
	let corpoFrame;

    for (const frame of page.mainFrame().childFrames()) {
        if (frame.name().includes('CORPO')) {
            corpoFrame = frame;
        }
	}

	return corpoFrame;
}

const getMenuFrame = (page) => {
	let corpoFrame;

    for (const frame of page.mainFrame().childFrames()) {
        if (frame.name().includes('MENU')) {
            corpoFrame = frame;
        }
	}

	return corpoFrame;
}

const getContext = (page, context = 'corpo') => {
	let frame = getCorpoFrame(page);

	if (context === 'menu') {
		frame = getMenuFrame(page);
	}

	return frame || page;
}

module.exports = {
	getContext,
	getCorpoFrame,
	getMenuFrame
}