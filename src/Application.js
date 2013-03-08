/* @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with the Game Closure SDK.  If not, see <http://www.gnu.org/licenses/>.
 */

import AudioManager;

exports = Class(GC.Application, function (supr) {

	this.launchUI = function () {
		// turn off screen clearing
		this.engine._opts.alwaysRepaint = false;
		this.engine._opts.repaintOnEvent = false;
		
		// canvas faking
		//  - pretend to be a "direct canvas"
		//  - pretend to support context.present and context.createPattern
		var canvas = GC.app.engine.getCanvas();
		canvas.dc = true;
		var ctx = canvas.getContext('2d');
		ctx.present = function() {};
		ctx.createPattern = ctx.createPattern || function(img) {
			logger.log("CTX CREATEPATTERN:", img._src);
			return "red";
		};
		
		// set up our sound manager
		var sound = new AudioManager({
			path: 'resources/media',
			files: {
				epicarpg: {
					background: true
				},
				explosion_1: {},
				explosion_2: {},
				explosion_3: {},
				explosion_4: {},
				jetloop1: {},
				lazer_fire_1: {},
				lazer_ricochet: {},
				mattoglseby___3: {
					background: true
				},
				retrolaser1: {},
				retrolaser2: {},
				squaremotif1: {},
				tronblast1: {},
				upgrade1: {}
			}
		});
		
		// pretend to be AppMobi
		window.AppMobi = {
			canvas: canvas,
			context: {
				loadSound: function(src) { logger.log('AUDIO (LOAD) - src:', src); },
				playSound: function(src) {
					sound.play(src.slice(16).replace(/ /g, '_').replace(/-/g, '_').replace('.ogg', ''));
				}
			},
			webview: {
				execute: function() {}
			}
		};
		
		// map our input events to Construct2 handlers
		var inputMap = {
			touchstart: "onInputStart",
			touchmove: "onInputMove",
			touchend: "onInputSelect"
		};
		window.Canvas = {
			addEventListener: bind(this, function(name, handler) {
				this[inputMap[name]] = function(e) {
					e.changedTouches = [{ pageX: e.pt[1].x, pageY: e.pt[1].y, identifier: 0 }];
					handler(e);
				};
			})
		};
		
		// humor Construct2
		//  - fake getDocumentById
		//  - fake jquery
		document.getElementById = document.getElementById || function() { return null; };
		window.jQuery = function(w) {
			return {
				width: function() {
					return w.innerWidth || w.screen.width;
				},
				height: function() {
					return w.innerHeight || w.screen.height;
				}
			};
		};
		
		// import game and modify project model
		jsio("external src.c2runtime import cr");
		var oldGetProjModel = cr.getProjectModel;
		function deepReplace (obj, search, replace) {
			if (isArray(obj)) {
				return obj.map(function (item) { return deepReplace(item, search, replace); });
			} else if (typeof obj == 'string') {
				return obj.replace(search, replace);
			} else {
				return obj;
			}
		}
		cr.getProjectModel = function() {
			var data = oldGetProjModel();
			
			// set fullscreen mode to scale
			data[11] = 2;
			
			// overwrite asset paths
			data = deepReplace(data, /^images\//, "resources/images/");
			data = deepReplace(data, /^media\//, "resources/media/");
			
			return data;
		}
		
		// preload audio and run game!
		GCResources.preload('resources/media', function() {
			cr_createDCRuntime(jQuery(window).width(), jQuery(window).height());
		});
	};
	
});
