/*
jQWidgets v4.5.3 (2017-June)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
! function(a) {
	a.jqx.jqxWidget("jqxDragDrop", "", {}), a.extend(a.jqx._jqxDragDrop.prototype, {
		defineInstance: function() {
			var b = {
				restricter: "document",
				handle: !1,
				feedback: "clone",
				opacity: .6,
				revert: !1,
				revertDuration: 400,
				distance: 5,
				disabled: !1,
				tolerance: "intersect",
				data: null,
				dropAction: "default",
				dragZIndex: 999999,
				appendTo: "parent",
				cursor: "move",
				onDragEnd: null,
				onDrag: null,
				onDragStart: null,
				onTargetDrop: null,
				onDropTargetEnter: null,
				onDropTargetLeave: null,
				initFeedback: null,
				dropTarget: null,
				isDestroyed: !1,
				triggerEvents: !0,
				_touchEvents: {
					mousedown: a.jqx.mobile.getTouchEventName("touchstart"),
					click: a.jqx.mobile.getTouchEventName("touchstart"),
					mouseup: a.jqx.mobile.getTouchEventName("touchend"),
					mousemove: a.jqx.mobile.getTouchEventName("touchmove"),
					mouseenter: "mouseenter",
					mouseleave: "mouseleave"
				},
				_restricter: null,
				_zIndexBackup: 0,
				_targetEnterFired: !1,
				_oldOpacity: 1,
				_feedbackType: void 0,
				_isTouchDevice: !1,
				_events: ["dragStart", "dragEnd", "dragging", "dropTargetEnter", "dropTargetLeave"]
			};
			return this === a.jqx._jqxDragDrop.prototype ? b : (a.extend(!0, this, b), b)
		},
		createInstance: function() {
			this._createDragDrop()
		},
		_createDragDrop: function() {
			var b = a.data(document.body, "jqx-draggables") || 1;
			if(this.appendTo = this._getParent(), this._isTouchDevice = a.jqx.mobile.isTouchDevice(), /(static|relative)/.test(this.host.css("position")) && (!this.feedback || "original" === this.feedback)) {
				var c = this._getRelativeOffset(this.host),
					d = this.appendTo.offset();
				"static" != this.appendTo.css("position") && (d = {
					left: 0,
					top: 0
				}), this.element.style.position = "absolute", this.element.style.left = d.left + c.left + "px", this.element.style.top = d.top + c.top + "px"
			}
			this._validateProperties(), this._idHandler(b), this.disabled && this.disable(), "string" == typeof this.dropTarget && (this.dropTarget = a(this.dropTarget)), this._refresh(), b += 1, a.data(document.body, "jqx-draggables", b), this.host.addClass("jqx-draggable"), this.disabled || this.host.css("cursor", this.cursor)
		},
		_getParent: function() {
			var b = this.appendTo;
			if("string" == typeof this.appendTo) switch(this.appendTo) {
				case "parent":
					b = this.host.parent();
					break;
				case "document":
					b = a(document);
					break;
				case "body":
					b = a(document.body);
					break;
				default:
					b = a(this.appendTo)
			}
			return b
		},
		_idHandler: function(a) {
			if(!this.element.id) {
				var b = "jqx-draggable-" + a;
				this.element.id = b
			}
		},
		_refresh: function() {
			this._removeEventHandlers(), this._addEventHandlers()
		},
		_getEvent: function(a) {
			return this._isTouchDevice ? this._touchEvents[a] : a
		},
		_validateProperties: function() {
			"clone" === this.feedback ? this._feedbackType = "clone" : this._feedbackType = "original", "default" !== this.dropAction && (this.dropAction = "nothing")
		},
		_removeEventHandlers: function() {
			this.removeHandler(this.host, "dragstart"), this.removeHandler(this.host, this._getEvent("mousedown") + ".draggable." + this.element.id, this._mouseDown), this.removeHandler(a(document), this._getEvent("mousemove") + ".draggable." + this.element.id, this._mouseMove), this.removeHandler(a(document), this._getEvent("mouseup") + ".draggable." + this.element.id, this._mouseUp)
		},
		_addEventHandlers: function() {
			var b = this;
			this.addHandler(this.host, "dragstart", function(c) {
				return !!b.disabled || (a.jqx.mobile.isTouchDevice() ? void 0 : (c.preventDefault(), !1))
			}), this.addHandler(this.host, this._getEvent("mousedown") + ".draggable." + this.element.id, this._mouseDown, {
				self: this
			}), this.addHandler(a(document), this._getEvent("mousemove") + ".draggable." + this.element.id, this._mouseMove, {
				self: this
			}), this.addHandler(a(document), this._getEvent("mouseup") + ".draggable." + this.element.id, this._mouseUp, {
				self: this
			});
			try {
				if(("" != document.referrer || window.frameElement) && null != window.top && window.top != window.self) {
					var c = "";
					if(window.parent && document.referrer && (c = document.referrer), -1 != c.indexOf(document.location.host)) {
						var d = function(a) {
							b._mouseUp(b)
						};
						window.top.document.addEventListener ? window.top.document.addEventListener("mouseup", d, !1) : window.top.document.attachEvent && window.top.document.attachEvent("onmouseup", d)
					}
				}
			} catch(a) {}
		},
		_mouseDown: function(a) {
			var b = a.data.self,
				c = b._getMouseCoordinates(a),
				d = b._mouseCapture(a);
			if(b._originalPageX = c.left, b._originalPageY = c.top, b.disabled) return !0;
			return b._mouseStarted || (b._mouseUp(a), !0), d && (b._mouseDownEvent = a), !!b._isTouchDevice || (1 !== a.which || !d || void a.preventDefault())
		},
		_mouseMove: function(a) {
			var b = a.data.self;
			return !!b.disabled || (b._mouseStarted ? (b._mouseDrag(a), a.preventDefault && a.preventDefault(), !1) : (b._mouseDownEvent && b._isMovedDistance(a) && (b._mouseStart(b._mouseDownEvent, a) ? b._mouseStarted = !0 : b._mouseStarted = !1, b._mouseStarted ? b._mouseDrag(a) : b._mouseUp(a)), !b._mouseStarted))
		},
		_mouseUp: function(a) {
			var b;
			return b = a.data && a.data.self ? a.data.self : this, !!b.disabled || (b._mouseDownEvent = !1, b._movedDistance = !1, b._mouseStarted && (b._mouseStarted = !1, b._mouseStop(a)), b.feedback && b.feedback[0] && "original" !== b._feedbackType && "function" == typeof b.feedback.remove && !b.revert && b.feedback.remove(), !!b._isTouchDevice && void 0)
		},
		cancelDrag: function() {
			var a = this.revertDuration;
			this.revertDuration = 0, this._mouseDownEvent = !1, this._movedDistance = !1, this._mouseStarted = !1, this._mouseStop(), this.feedback.remove(), this.revertDuration = a
		},
		_isMovedDistance: function(a) {
			var b = this._getMouseCoordinates(a);
			return !!this._movedDistance || (b.left >= this._originalPageX + this.distance || b.left <= this._originalPageX - this.distance || b.top >= this._originalPageY + this.distance || b.top <= this._originalPageY - this.distance) && (this._movedDistance = !0, !0)
		},
		_getMouseCoordinates: function(b) {
			if(this._isTouchDevice) {
				var c = a.jqx.position(b);
				return {
					left: c.left,
					top: c.top
				}
			}
			return {
				left: b.pageX,
				top: b.pageY
			}
		},
		destroy: function() {
			return this._enableSelection(this.host), this.host.removeData("draggable").off(".draggable").removeClass("jqx-draggable jqx-draggable-dragging jqx-draggable-disabled"), this._removeEventHandlers(), this.isDestroyed = !0, this
		},
		_disableSelection: function(b) {
			b.each(function() {
				a(this).attr("unselectable", "on").css({
					"-ms-user-select": "none",
					"-moz-user-select": "none",
					"-webkit-user-select": "none",
					"user-select": "none"
				}).each(function() {
					this.onselectstart = function() {
						return !1
					}
				})
			})
		},
		_enableSelection: function(b) {
			b.each(function() {
				a(this).attr("unselectable", "off").css({
					"-ms-user-select": "text",
					"-moz-user-select": "text",
					"-webkit-user-select": "text",
					"user-select": "text"
				}).each(function() {
					this.onselectstart = null
				})
			})
		},
		_mouseCapture: function(a) {
			return !this.disabled && (!!this._getHandle(a) && (this._disableSelection(this.host), !0))
		},
		_getScrollParent: function(b) {
			var c;
			return c = a.jqx.browser.msie && /(static|relative)/.test(b.css("position")) || /absolute/.test(b.css("position")) ? b.parents().filter(function() {
				return /(relative|absolute|fixed)/.test(a.css(this, "position", 1)) && /(auto|scroll)/.test(a.css(this, "overflow", 1) + a.css(this, "overflow-y", 1) + a.css(this, "overflow-x", 1))
			}).eq(0) : b.parents().filter(function() {
				return /(auto|scroll)/.test(a.css(this, "overflow", 1) + a.css(this, "overflow-y", 1) + a.css(this, "overflow-x", 1))
			}).eq(0), /fixed/.test(b.css("position")) || !c.length ? a(document) : c
		},
		_mouseStart: function(b) {
			var c = this._getMouseCoordinates(b);
			this._getParentOffset(this.host);
			this.feedback = this._createFeedback(b), this._zIndexBackup = this.feedback.css("z-index"), this.feedback[0].style.zIndex = this.dragZIndex, this._backupFeedbackProportions(), this._backupeMargins(), this._positionType = this.feedback.css("position"), this._scrollParent = this._getScrollParent(this.feedback), this._offset = this.positionAbs = this.host.offset(), this._offset = {
				top: this._offset.top - this.margins.top,
				left: this._offset.left - this.margins.left
			}, a.extend(this._offset, {
				click: {
					left: c.left - this._offset.left,
					top: c.top - this._offset.top
				},
				parent: this._getParentOffset(),
				relative: this._getRelativeOffset(),
				hostRelative: this._getRelativeOffset(this.host)
			}), this.position = this._generatePosition(b), this.originalPosition = this._fixPosition(), this.restricter && this._setRestricter(), this.feedback.addClass(this.toThemeProperty("jqx-draggable-dragging"));
			this._raiseEvent(0, b);
			return this.onDragStart && "function" == typeof this.onDragStart && this.onDragStart(this.position), this._mouseDrag(b, !0), !0
		},
		_fixPosition: function() {
			var a = this._getRelativeOffset(this.host);
			this.position;
			return {
				left: this.position.left + a.left,
				top: this.position.top + a.top
			}
		},
		_mouseDrag: function(a, b) {
			return this.position = this._generatePosition(a), this.positionAbs = this._convertPositionTo("absolute"), this.feedback[0].style.left = this.position.left + "px", this.feedback[0].style.top = this.position.top + "px", this._raiseEvent(2, a), this.onDrag && "function" == typeof this.onDrag && this.onDrag(this.data, this.position), this._handleTarget(), !1
		},
		_over: function(b, c, d) {
			if(this.dropTarget) {
				var e = !1,
					f = this;
				a.each(this.dropTarget, function(a, g) {
					if(e = f._overItem(g, b, c, d), e.over) return !1
				})
			}
			return e
		},
		_overItem: function(b, c, d, e) {
			b = a(b);
			var f, g = b.offset(),
				h = b.outerHeight(),
				i = b.outerWidth();
			if(b && b[0] !== this.element) {
				var f = !1;
				switch(this.tolerance) {
					case "intersect":
						c.left + d > g.left && c.left < g.left + i && c.top + e > g.top && c.top < g.top + h && (f = !0);
						break;
					case "fit":
						d + c.left <= g.left + i && c.left >= g.left && e + c.top <= g.top + h && c.top >= g.top && (f = !0)
				}
				return {
					over: f,
					target: b
				}
			}
		},
		_handleTarget: function() {
			if(this.dropTarget) {
				var a = this.feedback.offset(),
					b = this.feedback.outerWidth(),
					c = this.feedback.outerHeight(),
					d = this._over(a, b, c);
				d.over ? (this._targetEnterFired && d.target.length > 0 && this._oldtarget && this._oldtarget.length > 0 && d.target[0] != this._oldtarget[0] && (this._raiseEvent(4, {
					target: this._oldtarget
				}), this.onDropTargetLeave && "function" == typeof this.onDropTargetLeave && this.onDropTargetLeave(this._oldtarget)), (!this._targetEnterFired || d.target.length > 0 && this._oldtarget && this._oldtarget.length > 0 && d.target[0] != this._oldtarget[0]) && (this._targetEnterFired = !0, this._raiseEvent(3, {
					target: d.target
				}), this.onDropTargetEnter && "function" == typeof this.onDropTargetEnter && this.onDropTargetEnter(d.target)), this._oldtarget = d.target) : this._targetEnterFired && (this._targetEnterFired = !1, this._raiseEvent(4, {
					target: this._oldtarget || d.target
				}), this.onDropTargetLeave && "function" == typeof this.onDropTargetLeave && this.onDropTargetLeave(this._oldtarget || d.target))
			}
		},
		_mouseStop: function(a) {
			var b = this._fixPosition(),
				c = {
					width: this.host.outerWidth(),
					height: this.host.outerHeight()
				};
			return this.feedback[0].style.opacity = this._oldOpacity, this.revert || (this.feedback[0].style.zIndex = this._zIndexBackup), this._enableSelection(this.host), this.dropped && (this.dropped, this.dropped = !1), !!(this.element && this.element.parentNode || "original" !== this.feedback) && (this._dropElement(b), this.feedback.removeClass(this.toThemeProperty("jqx-draggable-dragging")), this._raiseEvent(1, a), this.onDragEnd && "function" == typeof this.onDragEnd && this.onDragEnd(this.data), this.onTargetDrop && "function" == typeof this.onTargetDrop && this._over(b, c.width, c.height).over && this.onTargetDrop(this._over(b, c.width, c.height).target), this._revertHandler(), !1)
		},
		_dropElement: function(a) {
			if("default" === this.dropAction && this.feedback && this.feedback[0] !== this.element && "original" !== this.feedback && !this.revert && !/(fixed|absolute)/.test(this.host.css("position"))) {
				this.host.css("position", "relative");
				var b = this._getRelativeOffset(this.host);
				a = this.position, a.left -= b.left, a.top -= b.top, this.element.style.left = a.left + "px", this.element.style.top = a.top + "px"
			}
		},
		_revertHandler: function() {
			if(this.revert || a.isFunction(this.revert) && this.revert()) {
				var b = this;
				"original" != this._feedbackType ? null != this.feedback && ("none" != this.dropAction ? a(this.feedback).animate({
					left: b.originalPosition.left - b._offset.hostRelative.left,
					top: b.originalPosition.top - b._offset.hostRelative.top
				}, parseInt(this.revertDuration, 10), function() {
					b.feedback && b.feedback[0] && "original" !== b._feedbackType && "function" == typeof b.feedback.remove && b.feedback.remove()
				}) : b.feedback && b.feedback[0] && "original" !== b._feedbackType && "function" == typeof b.feedback.remove && b.feedback.remove()) : (this.element.style.zIndex = this.dragZIndex, a(this.host).animate({
					left: b.originalPosition.left - b._offset.hostRelative.left,
					top: b.originalPosition.top - b._offset.hostRelative.top
				}, parseInt(this.revertDuration, 10), function() {
					b.element.style.zIndex = b._zIndexBackup
				}))
			}
		},
		_getHandle: function(b) {
			var c;
			return this.handle ? a(this.handle, this.host).find("*").andSelf().each(function() {
				this == b.target && (c = !0)
			}) : c = !0, c
		},
		_createFeedback: function(a) {
			var b;
			if(b = "function" == typeof this._feedbackType ? this._feedbackType() : "clone" === this._feedbackType ? this.host.clone().removeAttr("id") : this.host, /(absolute|fixed)/.test(b.css("position")) || b.css("position", "absolute"), this.appendTo[0] !== this.host.parent()[0] || b[0] !== this.element) {
				b.css({
					left: this.host.offset().left - this._getParentOffset(this.host).left + this._getParentOffset(b).left,
					top: this.host.offset().top - this._getParentOffset(this.host).top + this._getParentOffset(b).top
				}), b.appendTo(this.appendTo)
			}
			return "function" == typeof this.initFeedback && this.initFeedback(b), b
		},
		_getParentOffset: function(b) {
			var b = b || this.feedback;
			this._offsetParent = b.offsetParent();
			var c = this._offsetParent.offset();
			return "absolute" == this._positionType && this._scrollParent[0] !== document && a.contains(this._scrollParent[0], this._offsetParent[0]) && (c.left += this._scrollParent.scrollLeft(), c.top += this._scrollParent.scrollTop()), (this._offsetParent[0] == document.body || this._offsetParent[0].tagName && "html" == this._offsetParent[0].tagName.toLowerCase() && a.jqx.browser.msie) && (c = {
				top: 0,
				left: 0
			}), {
				top: c.top + (parseInt(this._offsetParent.css("border-top-width"), 10) || 0),
				left: c.left + (parseInt(this._offsetParent.css("border-left-width"), 10) || 0)
			}
		},
		_getRelativeOffset: function(a) {
			this._scrollParent || a.parent();
			if(a = a || this.feedback, "relative" === a.css("position")) {
				var b = this.host.position();
				return {
					top: b.top - (parseInt(a.css("top"), 10) || 0),
					left: b.left - (parseInt(a.css("left"), 10) || 0)
				}
			}
			return {
				top: 0,
				left: 0
			}
		},
		_backupeMargins: function() {
			this.margins = {
				left: parseInt(this.host.css("margin-left"), 10) || 0,
				top: parseInt(this.host.css("margin-top"), 10) || 0,
				right: parseInt(this.host.css("margin-right"), 10) || 0,
				bottom: parseInt(this.host.css("margin-bottom"), 10) || 0
			}
		},
		_backupFeedbackProportions: function() {
			this.feedback[0].style.opacity = this.opacity, this._feedbackProportions = {
				width: this.feedback.outerWidth(),
				height: this.feedback.outerHeight()
			}
		},
		_setRestricter: function() {
			"parent" == this.restricter && (this.restricter = this.feedback[0].parentNode), "document" != this.restricter && "window" != this.restricter || this._handleNativeRestricter(), void 0 !== this.restricter.left && void 0 !== this.restricter.top && void 0 !== this.restricter.height && void 0 !== this.restricter.width ? this._restricter = [this.restricter.left, this.restricter.top, this.restricter.width, this.restricter.height] : /^(document|window|parent)$/.test(this.restricter) || this.restricter.constructor == Array ? this.restricter.constructor == Array && (this._restricter = this.restricter) : this._handleDOMParentRestricter()
		},
		_handleNativeRestricter: function() {
			this._restricter = ["document" === this.restricter ? 0 : a(window).scrollLeft() - this._offset.relative.left - this._offset.parent.left, "document" === this.restricter ? 0 : a(window).scrollTop() - this._offset.relative.top - this._offset.parent.top, ("document" === this.restricter ? 0 : a(window).scrollLeft()) + a("document" === this.restricter ? document : window).width() - this._feedbackProportions.width - this.margins.left, ("document" === this.restricter ? 0 : a(window).scrollTop()) + (a("document" === this.restricter ? document : window).height() || document.body.parentNode.scrollHeight) - this._feedbackProportions.height - this.margins.top]
		},
		_handleDOMParentRestricter: function() {
			var b = a(this.restricter),
				c = b[0];
			if(c) {
				var d = "hidden" !== a(c).css("overflow");
				this._restricter = [(parseInt(a(c).css("borderLeftWidth"), 10) || 0) + (parseInt(a(c).css("paddingLeft"), 10) || 0), (parseInt(a(c).css("borderTopWidth"), 10) || 0) + (parseInt(a(c).css("paddingTop"), 10) || 0), (d ? Math.max(c.scrollWidth, c.offsetWidth) : c.offsetWidth) - (parseInt(a(c).css("borderLeftWidth"), 10) || 0) - (parseInt(a(c).css("paddingRight"), 10) || 0) - this._feedbackProportions.width - this.margins.left - this.margins.right, (d ? Math.max(c.scrollHeight, c.offsetHeight) : c.offsetHeight) - (parseInt(a(c).css("borderTopWidth"), 10) || 0) - (parseInt(a(c).css("paddingBottom"), 10) || 0) - this._feedbackProportions.height - this.margins.top - this.margins.bottom], this._restrictiveContainer = b
			}
		},
		_convertPositionTo: function(b, c) {
			c || (c = this.position);
			var d, e, f;
			return d = "absolute" === b ? 1 : -1, e = "absolute" !== this._positionType || this._scrollParent[0] != document && a.contains(this._scrollParent[0], this._offsetParent[0]) ? this._scrollParent : this._offsetParent, f = /(html|body)/i.test(e[0].tagName), this._getPosition(c, d, f, e)
		},
		_getPosition: function(b, c, d, e) {
			return {
				top: b.top + this._offset.relative.top * c + this._offset.parent.top * c - (a.jqx.browser.safari && a.jqx.browser.version < 526 && "fixed" == this._positionType ? 0 : ("fixed" == this._positionType ? -this._scrollParent.scrollTop() : d ? 0 : e.scrollTop()) * c),
				left: b.left + this._offset.relative.left * c + this._offset.parent.left * c - (a.jqx.browser.safari && a.jqx.browser.version < 526 && "fixed" == this._positionType ? 0 : ("fixed" == this._positionType ? -this._scrollParent.scrollLeft() : d ? 0 : e.scrollLeft()) * c)
			}
		},
		_generatePosition: function(b) {
			var c = "absolute" != this._positionType || this._scrollParent[0] != document && a.contains(this._scrollParent[0], this._offsetParent[0]) ? this._scrollParent : this._offsetParent,
				d = /(html|body)/i.test(c[0].tagName),
				e = this._getMouseCoordinates(b),
				f = e.left,
				g = e.top;
			if(this.originalPosition) {
				var h;
				if(this.restricter) {
					if(this._restrictiveContainer) {
						var i = this._restrictiveContainer.offset();
						h = [this._restricter[0] + i.left, this._restricter[1] + i.top, this._restricter[2] + i.left, this._restricter[3] + i.top]
					} else h = this._restricter;
					e.left - this._offset.click.left < h[0] && (f = h[0] + this._offset.click.left), e.top - this._offset.click.top < h[1] && (g = h[1] + this._offset.click.top), e.left - this._offset.click.left > h[2] && (f = h[2] + this._offset.click.left), e.top - this._offset.click.top > h[3] && (g = h[3] + this._offset.click.top)
				}
			}
			return {
				top: g - this._offset.click.top - this._offset.relative.top - this._offset.parent.top + (a.jqx.browser.safari && a.jqx.browser.version < 526 && "fixed" == this._positionType ? 0 : "fixed" == this._positionType ? -this._scrollParent.scrollTop() : d ? 0 : c.scrollTop()),
				left: f - this._offset.click.left - this._offset.relative.left - this._offset.parent.left + (a.jqx.browser.safari && a.jqx.browser.version < 526 && "fixed" == this._positionType ? 0 : "fixed" == this._positionType ? -this._scrollParent.scrollLeft() : d ? 0 : c.scrollLeft())
			}
		},
		_raiseEvent: function(b, c) {
			if(void 0 == this.triggerEvents || 0 != this.triggerEvents) {
				var d = this._events[b],
					e = a.Event(d),
					c = c || {};
				return c.position = this.position, c.element = this.element, a.extend(c, this.data), c.feedback = this.feedback, e.args = c, this.host.trigger(e)
			}
		},
		disable: function() {
			this.disabled = !0, this.host.addClass(this.toThemeProperty("jqx-draggable-disabled")), this._enableSelection(this.host)
		},
		enable: function() {
			this.disabled = !1, this.host.removeClass(this.toThemeProperty("jqx-draggable-disabled"))
		},
		propertyChangedHandler: function(b, c, d, e) {
			"dropTarget" === c ? "string" == typeof e && (b.dropTarget = a(e)) : "disabled" == c ? e && b._enableSelection(b.host) : "cursor" == c && b.host.css("cursor", b.cursor)
		}
	})
}(jqxBaseFramework),
function(a) {
	jqxListBoxDragDrop = function() {
		a.extend(a.jqx._jqxListBox.prototype, {
			_hitTestBounds: function(a, b, c) {
				var d = a.host.offset(),
					e = c - parseInt(d.top),
					f = b - parseInt(d.left),
					g = a._hitTest(f, e);
				if(e < 0) return null;
				if(null != g) {
					var h = parseInt(d.left),
						i = h + a.host.width();
					return h <= b + g.width / 2 && b <= i ? g : null
				}
				if(a.items && a.items.length > 0) {
					var j = a.items[a.items.length - 1];
					if(a.groups.length < 2 && j.top + j.height + 15 >= e) return j
				}
				return null
			},
			_handleDragStart: function(b, c) {
				a.jqx.mobile.isTouchDevice() && c.allowDrag && b.on(a.jqx.mobile.getTouchEventName("touchstart"), function() {
					a.jqx.mobile.setTouchScroll(!1, c.element.id)
				}), b.off("dragStart"), b.on("dragStart", function(b) {
					if(c.allowDrag && !c.disabled) {
						c.feedbackElement = a("<div style='z-index: 99999; position: absolute;'></div>"), c.feedbackElement.addClass(c.toThemeProperty("jqx-listbox-feedback")), c.feedbackElement.appendTo(a(document.body)), c.feedbackElement.hide(), c.isDragging = !0, c._dragCancel = !1;
						var d = c._getMouseCoordinates(b),
							e = c._hitTestBounds(c, d.left, d.top),
							f = a.find(".jqx-listbox");
						c._listBoxes = f, a.each(c._listBoxes, function() {
							var b = a.data(this, "jqxListBox").instance;
							b._enableHover = b.enableHover, b.enableHover = !1, a.jqx.mobile.setTouchScroll(!1, c.element.id)
						});
						var g = function() {
							c._dragCancel = !0, a(b.args.element).jqxDragDrop({
								triggerEvents: !1
							}), a(b.args.element).jqxDragDrop("cancelDrag"), clearInterval(c._autoScrollTimer), a(b.args.element).jqxDragDrop({
								triggerEvents: !0
							}), a.each(c._listBoxes, function() {
								var b = a.data(this, "jqxListBox").instance;
								void 0 != b._enableHover && (b.enableHover = b._enableHover, a.jqx.mobile.setTouchScroll(!0, c.element.id))
							})
						};
						if(null == e || e.isGroup) null == e && g();
						else {
							if(c._dragItem = e, c.dragStart && 0 == c.dragStart(e)) return g(), !1;
							e.disabled && g(), c._raiseEvent(4, {
								label: e.label,
								value: e.value,
								originalEvent: b.args
							})
						}
					}
					return !1
				})
			},
			_handleDragging: function(b, c) {
				b.off("dragging"), b.on("dragging", function(b) {
					var d = b.args;
					if(!c._dragCancel) {
						var e = c._getMouseCoordinates(b),
							f = e;
						c._lastDraggingPosition = e, c._dragOverItem = null, c.feedbackElement.hide(), a.each(c._listBoxes, function() {
							if(a.jqx.isHidden(a(this))) return !0;
							var b = a(this).offset(),
								g = b.top + 20,
								h = a(this).height() + g - 40,
								i = b.left,
								j = a(this).width(),
								k = i + j,
								l = a.data(this, "jqxListBox").instance,
								m = l._hitTestBounds(l, e.left, e.top),
								n = l.vScrollInstance;
							if(null != m && l.allowDrop && !l.disabled && (c._dragOverItem = m, m.element)) {
								c.feedbackElement.show();
								var o = a(m.element).offset().top + 1;
								f.top > o + m.height / 2 && (o += m.height), c.feedbackElement.css("top", o), c.feedbackElement.css("left", i), "visible" != l.vScrollBar.css("visibility") ? c.feedbackElement.width(a(this).width()) : c.feedbackElement.width(a(this).width() - 20)
							}
							e.left >= i && e.left < k ? d.position.top < g && d.position.top >= g - 30 ? (clearInterval(l._autoScrollTimer), 0 != n.value && c.feedbackElement.hide(), l._autoScrollTimer = setInterval(function() {
								l.scrollUp() || clearInterval(l._autoScrollTimer)
							}, 100)) : d.position.top > h && d.position.top < h + 30 ? (clearInterval(l._autoScrollTimer), "hidden" != l.vScrollBar.css("visibility") && n.value != n.max && c.feedbackElement.hide(), l._autoScrollTimer = setInterval(function() {
								l.scrollDown() || clearInterval(l._autoScrollTimer)
							}, 100)) : clearInterval(l._autoScrollTimer) : (null == c._dragOverItem && c.feedbackElement.hide(), clearInterval(l._autoScrollTimer))
						})
					}
				})
			},
			_handleDragEnd: function(b, c) {
				a.find(".jqx-listbox");
				b.off("dragEnd"), b.on("dragEnd", function(b) {
					clearInterval(c._autoScrollTimer);
					var d = a.jqx.mobile.isTouchDevice(),
						e = d ? c._lastDraggingPosition : c._getMouseCoordinates(b),
						f = a.find(".jqx-listbox"),
						g = null;
					if(c.feedbackElement.remove(), c._dragCancel) return void b.stopPropagation();
					a.each(f, function() {
						if(a.jqx.isHidden(a(this))) return !0;
						var b = parseInt(a(this).offset().left),
							d = b + a(this).width(),
							f = a.data(this, "jqxListBox").instance;
						if(clearInterval(f._autoScrollTimer), void 0 != f._enableHover && (f.enableHover = f._enableHover, a.jqx.mobile.setTouchScroll(!0, c.element.id)), null != c._dragItem && e.left + c._dragItem.width / 2 >= b && e.left < d) {
							var h = parseInt(a(this).offset().top),
								i = h + a(this).height();
							e.top >= h && e.top <= i && (g = a(this))
						}
					});
					var h = c._dragItem;
					if(null != g && g.length > 0) {
						var i = a.data(g[0], "jqxListBox").instance;
						if(i.allowDrop && !i.disabled) {
							var i = a.data(g[0], "jqxListBox").instance,
								j = i._hitTestBounds(i, e.left, e.top);
							if(null == (j = c._dragOverItem) || j.isGroup) {
								if("none" != i.dropAction) {
									if(i.content.find(".draggable").length > 0 && i.content.find(".draggable").jqxDragDrop("destroy"), c.dragEnd) {
										var k = c.dragEnd(c._dragItem, null, b.args);
										if(0 == k) return a(b.args.element).jqxDragDrop({
											triggerEvents: !1
										}), a(b.args.element).jqxDragDrop("cancelDrag"), clearInterval(c._autoScrollTimer), a(b.args.element).jqxDragDrop({
											triggerEvents: !0
										}), b.preventDefault && b.preventDefault(), b.stopPropagation && b.stopPropagation(), !1;
										void 0 == k && (k = !0)
									}
									i.addItem(c._dragItem), "default" == i.dropAction && (h.visibleIndex > 0 && c.selectIndex(h.visibleIndex - 1), c.removeItem(h, !0)), i.clearSelection(), i.selectIndex(i.items.length - 1)
								}
							} else {
								var k = !0;
								if(c.dragEnd) {
									if(0 == (k = c.dragEnd(h, j, b.args))) return a(b.args.element).jqxDragDrop({
										triggerEvents: !1
									}), a(b.args.element).jqxDragDrop("cancelDrag"), clearInterval(c._autoScrollTimer), a(b.args.element).jqxDragDrop({
										triggerEvents: !0
									}), b.preventDefault && b.preventDefault(), b.stopPropagation && b.stopPropagation(), !1;
									void 0 == k && (k = !0)
								}
								if(k) {
									j.visibleIndex;
									if("none" != i.dropAction) {
										if(j.element) var l = a(j.element).offset().top + 1;
										else var l = a(i.element).offset().top + 1;
										i.content.find(".draggable").length > 0 && i.content.find(".draggable").jqxDragDrop("destroy"), e.top > l + j.height / 2 ? i.insertAt(c._dragItem, j.index + 1) : i.insertAt(c._dragItem, j.index), "default" == c.dropAction && (h.visibleIndex > 0 && (c.clearSelection(), c.selectIndex(h.visibleIndex - 1)), c.removeItem(h, !0));
										var m = function() {
											for(var a = j.visibleIndex, b = a - 2; b <= a + 2; b++)
												if(i.items && i.items.length > b) {
													var c = i.items[b];
													if(null != c && c.value == h.value) return c.visibleIndex
												}
											return a
										}();
										i.clearSelection(), i.selectIndex(m)
									}
								}
							}
						}
					} else if(c.dragEnd) {
						var n = c.dragEnd(h, b.args);
						if(0 == n) return b.preventDefault && b.preventDefault(), b.stopPropagation && b.stopPropagation(), !1
					}
					return null != h && c._raiseEvent(5, {
						label: h.label,
						value: h.value,
						originalEvent: b.args
					}), !1
				})
			},
			_enableDragDrop: function() {
				if(this.allowDrag && this.host.jqxDragDrop) {
					var b = this.content.find(".draggable");
					if(b.length > 0) {
						var c = this;
						b.jqxDragDrop({
							cursor: "arrow",
							revertDuration: 0,
							appendTo: "body",
							dragZIndex: 99999,
							revert: !0,
							initFeedback: function(b) {
								var d = a('<span style="white-space: nowrap;" class="' + c.toThemeProperty("jqx-fill-state-normal") + '">' + b.text() + "</span>");
								a(document.body).append(d);
								var e = d.width();
								d.remove(), b.width(e + 5), b.addClass(c.toThemeProperty("jqx-fill-state-pressed"))
							}
						}), this._autoScrollTimer = null, c._dragItem = null, c._handleDragStart(b, c), c._handleDragging(b, c), c._handleDragEnd(b, c)
					}
				}
			},
			_getMouseCoordinates: function(b) {
				if(this._isTouchDevice = a.jqx.mobile.isTouchDevice(), this._isTouchDevice) {
					var c = a.jqx.position(b.args);
					return {
						left: c.left,
						top: c.top
					}
				}
				return {
					left: b.args.pageX,
					top: b.args.pageY
				}
			}
		})
	}, jqxTreeDragDrop = function() {
		a.extend(a.jqx._jqxTree.prototype, {
			_hitTestBounds: function(b, c, d) {
				var e = null;
				if(b._visibleItems) {
					var f = parseInt(b.host.offset().left),
						g = b.host.outerWidth();
					a.each(b._visibleItems, function(h) {
						if(c >= f && c < f + g && this.top + 5 < d && d < this.top + this.height) {
							var i = a(this.element).parents("li:first");
							if(i.length > 0 && null != (e = b.getItem(i[0]))) return e.height = this.height, e.top = this.top, !1
						}
					})
				}
				return e
			},
			_handleDragStart: function(b, c) {
				c._dragOverItem && c._dragOverItem.titleElement.removeClass(c.toThemeProperty("jqx-fill-state-hover")), a.jqx.mobile.isTouchDevice() && c.allowDrag && b.on(a.jqx.mobile.getTouchEventName("touchstart"), function() {
					a.jqx.mobile.setTouchScroll(!1, "panel" + c.element.id)
				}), b.off("dragStart"), b.on("dragStart", function(b) {
					c.feedbackElement = a("<div style='z-index: 99999; position: absolute;'></div>"), c.feedbackElement.addClass(c.toThemeProperty("jqx-listbox-feedback")), c.feedbackElement.appendTo(a(document.body)), c.feedbackElement.hide(), c._dragCancel = !1;
					var d = (b.args.position, a.find(".jqx-tree"));
					return c._trees = d, a.each(d, function() {
						var d = a.data(this, "jqxTree").instance,
							e = d.host.find(".draggable");
						if(d._syncItems(e), d.allowDrag && !d.disabled) {
							var f = a(b.target).parents("li:first");
							if(f.length > 0) {
								var g = d.getItem(f[0]);
								if(g) {
									if(c._dragItem = g, d.dragStart && 0 == d.dragStart(g)) return c._dragCancel = !0, a(b.args.element).jqxDragDrop({
										triggerEvents: !1
									}), a(b.args.element).jqxDragDrop("cancelDrag"), clearInterval(c._autoScrollTimer), a(b.args.element).jqxDragDrop({
										triggerEvents: d
									}), !1;
									d._raiseEvent(8, {
										label: g.label,
										value: g.value,
										originalEvent: b.args
									})
								}
							}
						}
					}), !1
				})
			},
			_getMouseCoordinates: function(b) {
				if(this._isTouchDevice = a.jqx.mobile.isTouchDevice(), this._isTouchDevice) {
					var c = a.jqx.position(b.args);
					return {
						left: c.left,
						top: c.top
					}
				}
				return {
					left: b.args.pageX,
					top: b.args.pageY
				}
			},
			_handleDragging: function(b, c) {
				var b = this.host.find(".draggable");
				b.off("dragging"), b.on("dragging", function(b) {
					var d = b.args,
						e = (d.position, c._trees);
					if(!c._dragCancel) {
						c._dragOverItem && c._dragOverItem.titleElement.removeClass(c.toThemeProperty("jqx-fill-state-hover"));
						var f = !0,
							g = c._getMouseCoordinates(b);
						c._lastDraggingPosition = g, a.each(e, function() {
							if(a.jqx.isHidden(a(this))) return !0;
							var b = a(this).offset(),
								d = b.top + 20,
								e = a(this).height() + d - 40,
								h = b.left,
								i = a(this).width(),
								j = h + i,
								k = a.data(this, "jqxTree").instance;
							if(!k.disabled && k.allowDrop) {
								var l = k.vScrollInstance,
									m = k._hitTestBounds(k, g.left, g.top);
								if(null != m && (c._dragOverItem && c._dragOverItem.titleElement.removeClass(k.toThemeProperty("jqx-fill-state-hover")), c._dragOverItem = m, m.element)) {
									c.feedbackElement.show();
									var n = m.top,
										o = g.top;
									c._dropPosition = "before", o > n + m.height / 3 && (n = m.top + m.height / 2, c._dragOverItem.titleElement.addClass(c.toThemeProperty("jqx-fill-state-hover")), c.feedbackElement.hide(), c._dropPosition = "inside"), o > m.top + m.height - m.height / 3 && (n = m.top + m.height, c._dragOverItem.titleElement.removeClass(c.toThemeProperty("jqx-fill-state-hover")), c.feedbackElement.show(), c._dropPosition = "after"), c.feedbackElement.css("top", n);
									var h = -2 + parseInt(m.titleElement.offset().left);
									c.feedbackElement.css("left", h), c.feedbackElement.width(a(m.titleElement).width() + 12)
								}
								g.left >= h && g.left < j ? (g.top + 20 >= d && g.top <= d + k.host.height() && (f = !1), g.top < d && g.top >= d - 30 ? (clearInterval(k._autoScrollTimer), 0 != l.value && c.feedbackElement.hide(), k._autoScrollTimer = setInterval(function() {
									var a = k.panelInstance.scrollUp(),
										b = k.host.find(".draggable");
									k._syncItems(b), a || clearInterval(k._autoScrollTimer)
								}, 100)) : g.top > e && g.top < e + 30 ? (clearInterval(k._autoScrollTimer), l.value != l.max && c.feedbackElement.hide(), k._autoScrollTimer = setInterval(function() {
									var a = k.panelInstance.scrollDown(),
										b = k.host.find(".draggable");
									k._syncItems(b), a || clearInterval(k._autoScrollTimer)
								}, 100)) : clearInterval(k._autoScrollTimer)) : clearInterval(k._autoScrollTimer)
							}
						}), f && c.feedbackElement && c.feedbackElement.hide()
					}
				})
			},
			_handleDragEnd: function(b, c) {
				b.off("dragEnd"), b.on("dragEnd", function(b) {
					c.host.find(".draggable");
					clearInterval(c._autoScrollTimer);
					var d = (b.args.position, c._trees),
						e = null,
						f = a.jqx.mobile.isTouchDevice(),
						g = f ? c._lastDraggingPosition : c._getMouseCoordinates(b);
					if(c.feedbackElement.remove(), c._dragCancel) return !1;
					c._dragOverItem && c._dragOverItem.titleElement.removeClass(c.toThemeProperty("jqx-fill-state-hover")), a.each(d, function() {
						if(a.jqx.isHidden(a(this))) return !0;
						var b = parseInt(a(this).offset().left),
							d = b + a(this).width(),
							f = a.data(this, "jqxTree").instance;
						if(clearInterval(f._autoScrollTimer), null != c._dragItem && g.left >= b && g.left < d) {
							var h = parseInt(a(this).offset().top),
								i = h + a(this).height();
							g.top >= h && g.top <= i && (e = a(this))
						}
					});
					var h = c._dragItem;
					if(null != e && e.length > 0) {
						if(e.jqxTree("allowDrop")) {
							var i = a.data(e[0], "jqxTree").instance,
								j = c._dragOverItem;
							if(null != j && c._dragOverItem.treeInstance.element.id == i.element.id) {
								var k = !0;
								if(c.dragEnd && (k = c.dragEnd(h, j, b.args, c._dropPosition, e), 0 == k && (a(b.args.element).jqxDragDrop({
										triggerEvents: !1
									}), a(b.args.element).jqxDragDrop("cancelDrag"), clearInterval(c._autoScrollTimer), a(b.args.element).jqxDragDrop({
										triggerEvents: !0
									})), void 0 == k && (k = !0)), k) {
									var l = function() {
										var a = c._dragItem.treeInstance;
										a._refreshMapping(), a._updateItemsNavigation(), a._render(!0, !1), a.checkboxes && a._updateCheckStates(), c._dragItem.treeInstance = i, c._syncItems(c._dragItem.treeInstance.host.find(".draggable"))
									};
									if("none" != i.dropAction && c._dragItem.id != c._dragOverItem.id)
										if("inside" == c._dropPosition) i._drop(c._dragItem.element, c._dragOverItem.element, -1, i), l();
										else {
											var m = 0;
											"after" == c._dropPosition && m++, i._drop(c._dragItem.element, c._dragOverItem.parentElement, m + a(c._dragOverItem.element).index(), i), l()
										}
									i._render(!0, !1);
									var n = i.host.find(".draggable");
									c._syncItems(n), c._dragOverItem = null, c._dragItem = null, i._refreshMapping(), i._updateItemsNavigation(), i.selectedItem = null, i.selectItem(h.element), i.checkboxes && i._updateCheckStates(), i._render(!0, !1)
								}
							} else if("none" != i.dropAction && i.allowDrop) {
								var k = !0;
								if(c.dragEnd && (k = c.dragEnd(h, j, b.args, c._dropPosition, e), 0 == k && (a(b.args.element).jqxDragDrop({
										triggerEvents: !1
									}), a(b.args.element).jqxDragDrop("cancelDrag"), clearInterval(c._autoScrollTimer), a(b.args.element).jqxDragDrop({
										triggerEvents: !0
									})), void 0 == k && (k = !0)), k) {
									c._dragItem.parentElement = null, i._drop(c._dragItem.element, null, -1, i);
									var o = c._dragItem.treeInstance;
									o._refreshMapping(), o._updateItemsNavigation(), o.checkboxes && o._updateCheckStates();
									var n = o.host.find(".draggable");
									c._syncItems(n), c._dragItem.treeInstance = i, i.items[i.items.length] = c._dragItem, i._render(!0, !1), i._refreshMapping(), i.selectItem(h.element), i._updateItemsNavigation();
									var n = i.host.find(".draggable");
									i._syncItems(n), i.checkboxes && i._updateCheckStates(), c._dragOverItem = null, c._dragItem = null
								}
							}
						}
					} else if(c.dragEnd) {
						var p = c.dragEnd(h, b.args);
						if(0 == p) return !1
					}
					return null != h && c._raiseEvent(7, {
						label: h.label,
						value: h.value,
						originalEvent: b.args
					}), !1
				})
			},
			_drop: function(b, c, d, e) {
				if(!(a(c).parents("#" + b.id).length > 0 || null != c && c.id == b.id)) {
					if(e.element.innerHTML.indexOf("UL")) var f = e.host.find("ul:first");
					if(void 0 == c && null == c) void 0 == d || -1 == d ? f.append(b) : 0 == f.children("li").eq(d).length ? f.children("li").eq(d - 1).after(b) : f.children("li").eq(d)[0].id != b.id && f.children("li").eq(d).before(b);
					else if(void 0 == d || -1 == d) {
						c = a(c);
						var g = c.find("ul:first");
						if(0 == g.length) {
							ulElement = a("<ul></ul>"), a(c).append(ulElement), g = c.find("ul:first");
							var h = e.itemMapping["id" + c[0].id].item;
							h.subtreeElement = g[0], h.hasItems = !0, g.addClass(e.toThemeProperty("jqx-tree-dropdown")), g.append(b), b = g.find("li:first"), h.parentElement = b
						} else g.append(b)
					} else {
						c = a(c);
						var g = c.find("ul:first");
						if(0 == g.length) {
							if(ulElement = a("<ul></ul>"), a(c).append(ulElement), g = c.find("ul:first"), c) {
								var h = e.itemMapping["id" + c[0].id].item;
								h.subtreeElement = g[0], h.hasItems = !0
							}
							g.addClass(e.toThemeProperty("jqx-tree-dropdown")), g.append(b), b = g.find("li:first"), h.parentElement = b
						} else 0 == g.children("li").eq(d).length ? g.children("li").eq(d - 1).after(b) : g.children("li").eq(d)[0].id != b.id && g.children("li").eq(d).before(b)
					}
				}
			},
			_enableDragDrop: function() {
				if(this.allowDrag && this.host.jqxDragDrop) {
					var b = this.host.find(".draggable"),
						c = this;
					if(b.length > 0) {
						b.jqxDragDrop({
							cursor: "arrow",
							revertDuration: 0,
							appendTo: "body",
							dragZIndex: 99999,
							revert: !0,
							initFeedback: function(b) {
								var d = a('<span style="white-space: nowrap;" class="' + c.toThemeProperty("jqx-fill-state-normal") + '">' + b.text() + "</span>");
								a(document.body).append(d);
								var e = d.width();
								d.remove(), b.width(e + 5), b.addClass(c.toThemeProperty("jqx-fill-state-pressed"))
							}
						});
						!0 === b.jqxDragDrop("isDestroyed") && b.jqxDragDrop("_createDragDrop"), this._autoScrollTimer = null, c._dragItem = null, c._handleDragStart(b, c), c._handleDragging(b, c), c._handleDragEnd(b, c)
					}
				}
			}
		})
	}
}(jqxBaseFramework);
