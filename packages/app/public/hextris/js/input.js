function addKeyListeners() {
	keypress.register_combo({
		keys: "left",
		on_keydown: function () {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "right",
		on_keydown: function () {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(-1);
			}
		}
	});
	keypress.register_combo({
		keys: "down",
		on_keydown: function () {
			var tempSpeed = settings.speedModifier;
			if (MainHex && gameState !== 0) {
				//speed up block temporarily
				if (settings.speedUpKeyHeld == false) {
					settings.speedUpKeyHeld = true;
					window.rush *= 4;
				}
			}
			//settings.speedModifier = tempSpeed;
		},
		on_keyup: function () {
			if (MainHex && gameState !== 0) {
				//speed up block temporarily

				window.rush /= 4;
				settings.speedUpKeyHeld = false;
			}
		}
	});

	keypress.register_combo({
		keys: "a",
		on_keydown: function () {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "d",
		on_keydown: function () {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(-1);
			}
		}
	});

	keypress.register_combo({
		keys: "s",
		on_keydown: function () {
			var tempSpeed = settings.speedModifier;
			if (MainHex && gameState !== 0) {
				//speed up block temporarily
				if (settings.speedUpKeyHeld == false) {
					settings.speedUpKeyHeld = true;
					window.rush *= 4;
				}
			}
			//settings.speedModifier = tempSpeed;
		},
		on_keyup: function () {
			if (MainHex && gameState !== 0) {
				//speed up block temporarily

				window.rush /= 4;
				settings.speedUpKeyHeld = false;
			}
		}
	});
	keypress.register_combo({
		keys: "p",
		on_keydown: function () { pause(); }
	});

	keypress.register_combo({
		keys: "space",
		on_keydown: function () { pause(); }
	});

	keypress.register_combo({
		keys: "q",
		on_keydown: function () {
			if (devMode) toggleDevTools();
		}
	});

	keypress.register_combo({
		keys: "enter",
		on_keydown: function () {
			if (gameState == 1 || importing == 1) {
				init(1);
			}
			if (gameState == 2) {
				init();
				$("#gameoverscreen").fadeOut();
			}
			if (gameState === 0) {
				resumeGame();
			}
		}
	});

	function attachUniversalClick(selector, callback) {
		$(selector).on('touchstart mousedown', function (e) {
			e.preventDefault();
			e.stopPropagation();
			callback();
			return false;
		});
	}

	attachUniversalClick("#pauseBtn", function () {
		if (gameState != 1 && gameState != -1) return;
		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}
		pause();
	});

	$("#colorBlindBtn").on('touchstart mousedown', function () {
		window.colors = ["#8e44ad", "#f1c40f", "#3498db", "#d35400"];

		window.hexColorsToTintedColors = {
			"#8e44ad": "rgb(229,152,102)",
			"#f1c40f": "rgb(246,223,133)",
			"#3498db": "rgb(151,201,235)",
			"#d35400": "rgb(210,180,222)"
		};

		window.rgbToHex = {
			"rgb(142,68,173)": "#8e44ad",
			"rgb(241,196,15)": "#f1c40f",
			"rgb(52,152,219)": "#3498db",
			"rgb(211,84,0)": "#d35400"
		};

		window.rgbColorsToTintedColors = {
			"rgb(142,68,173)": "rgb(229,152,102)",
			"rgb(241,196,15)": "rgb(246,223,133)",
			"rgb(52,152,219)": "rgb(151,201,235)",
			"rgb(46,204,113)": "rgb(210,180,222)"
		};
	});


	attachUniversalClick("#restart", function () {
		init();
		canRestart = false;
		$("#gameoverscreen").fadeOut();
	});

	attachUniversalClick("#restartBtn", function () {
		init(1);
		canRestart = false;
		$("#gameoverscreen").fadeOut();
	});

}
function inside(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	var x = point[0], y = point[1];

	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
};

function handleClickTap(x, y) {
	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}

	// Attempt to enter fullscreen on first tap for immersive mobile experience
	try {
		if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen().catch(() => { });
		}
	} catch (e) { }

	if (!MainHex || gameState === 0 || gameState == -1) {
		return;
	}

	if (x < window.innerWidth / 2) {
		MainHex.rotate(1);
	} else {
		MainHex.rotate(-1);
	}

	// Haptic feedback for rotation
	if (navigator.vibrate) {
		navigator.vibrate(10);
	}
}

// Swipe detection for Fast Drop
var touchStartY = 0;
var touchStartTime = 0;

function handleTouchStart(e) {
	touchStartY = e.changedTouches[0].clientY;
	touchStartTime = Date.now();
	handleTap(e);
}

function handleTouchEnd(e) {
	if (!gameState || gameState == 0) return;

	var touchEndY = e.changedTouches[0].clientY;
	var touchEndTime = Date.now();

	var yDiff = touchEndY - touchStartY;
	var timeDiff = touchEndTime - touchStartTime;

	// Detect swipe down (significant distance in short time)
	if (yDiff > 50 && timeDiff < 300) {
		if (MainHex && gameState !== 0) {
			window.rush = 4;
			if (navigator.vibrate) navigator.vibrate(20);

			// Auto-reset rush after 500ms
			setTimeout(function () {
				window.rush = 1;
			}, 500);
		}
	}
}


