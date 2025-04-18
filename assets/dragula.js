const injectDragula = () => {

    window.dragula = (
      function e(n, t, r) {
      function o(u, c) {
        if (!t[u]) {
          if (!n[u]) {
            var a = "function" == typeof require && require;
            if (!c && a) return a(u, !0);
            if (i) return i(u, !0);
            var f = new Error("Cannot find module '" + u + "'");
            throw ((f.code = "MODULE_NOT_FOUND"), f);
          }
          var l = (t[u] = { exports: {} });
          n[u][0].call(
            l.exports,
            function (e) {
              var t = n[u][1][e];
              return o(t ? t : e);
            },
            l,
            l.exports,
            e,
            n,
            t,
            r
          );
        }
        return t[u].exports;
      }
      for (
        var i = "function" == typeof require && require, u = 0;
        u < r.length;
        u++
      )
        o(r[u]);
      return o;
    })(
      {
        1: [
          function (e, n, t) {
            "use strict";
            function r(e) {
              var n = u[e];
              return (
                n ? (n.lastIndex = 0) : (u[e] = n = new RegExp(c + e + a, "g")), n
              );
            }
            function o(e, n) {
              var t = e.className;
              t.length
                ? r(n).test(t) || (e.className += " " + n)
                : (e.className = n);
            }
            function i(e, n) {
              e.className = e.className.replace(r(n), " ").trim();
            }
            var u = {},
              c = "(?:^|\\s)",
              a = "(?:\\s|$)";
            n.exports = { add: o, rm: i };
          },
          {},
        ],
        2: [
          function (e, n, t) {
            (function (t) {
              "use strict";
              function r(e, n) {
                function t(e) {
                  return -1 !== fe.containers.indexOf(e) || ae.isContainer(e);
                }
                function r(e) {
                  var n = e ? "remove" : "add";
                  o(S, n, "mousedown", O), o(S, n, "mouseup", I);
                }
                function c(e) {
                  var n = e ? "remove" : "add";
                  o(S, n, "mousemove", N);
                }
                function m(e) {
                  var n = e ? "remove" : "add";
                  w[n](S, "selectstart", C), w[n](S, "click", C);
                }
                function h() {
                  r(!0), I({});
                }
                function C(e) {
                  ue && e.preventDefault();
                }
                function O(e) {
                  (ee = e.clientX), (ne = e.clientY);
                  var n = 1 !== i(e) || e.metaKey || e.ctrlKey;
                  if (!n) {
                    var t = e.target,
                      r = T(t);
                    r &&
                      ((ue = r),
                      c(),
                      "mousedown" === e.type &&
                        (p(t) ? t.focus() : e.preventDefault()));
                  }
                }
                function N(e) {
                  if (ue) {
                    if (0 === i(e)) return void I({});
                    if (
                      void 0 === e.clientX ||
                      e.clientX !== ee ||
                      void 0 === e.clientY ||
                      e.clientY !== ne
                    ) {
                      if (ae.ignoreInputTextSelection) {
                        var n = y("clientX", e),
                          t = y("clientY", e),
                          r = x.elementFromPoint(n, t);
                        if (p(r)) return;
                      }
                      var o = ue;
                      c(!0), m(), P(), Y(o);
                      var a = u(Q);
                      (W = y("pageX", e) - a.left),
                        (Z = y("pageY", e) - a.top),
                        E.add(oe || Q, "gu-transit"),
                        F(),
                        q(e);
                    }
                  }
                }
                function T(e) {
                  if (!((fe.dragging && G) || t(e))) {
                    for (var n = e; v(e) && t(v(e)) === !1; ) {
                      if (ae.invalid(e, n)) return;
                      if (((e = v(e)), !e)) return;
                    }
                    var r = v(e);
                    if (r && !ae.invalid(e, n)) {
                      var o = ae.moves(e, r, n, g(e));
                      if (o) return { item: e, source: r };
                    }
                  }
                }
                function X(e) {
                  var n = T(e);
                  n && Y(n);
                }
                function Y(e) {
                  V(e.item, e.source) &&
                    ((oe = e.item.cloneNode(!0)),
                    fe.emit("cloned", oe, e.item, "copy")),
                    (J = e.source),
                    (Q = e.item),
                    (te = re = g(e.item)),
                    (fe.dragging = !0),
                    fe.emit("drag", Q, J);
                }
                function B() {
                  return !1;
                }
                function P() {
                  if (fe.dragging) {
                    var e = oe || Q;
                    L(e, v(e));
                  }
                }
                function D() {
                  (ue = !1), c(!0), m(!0);
                }
                function I(e) {
                  if ((D(), fe.dragging)) {
                    var n = oe || Q,
                      t = y("clientX", e),
                      r = y("clientY", e),
                      o = a(G, t, r),
                      i = k(o, t, r);
                    i && ((oe && ae.copySortSource) || !oe || i !== J)
                      ? L(n, i)
                      : ae.removeOnSpill
                      ? R()
                      : A();
                  }
                }
                function L(e, n) {
                  var t = v(e);
                  oe && ae.copySortSource && n === J && t.removeChild(Q),
                    j(n)
                      ? fe.emit("cancel", e, J, J)
                      : fe.emit("drop", e, n, J, re),
                    M();
                }
                function R() {
                  if (fe.dragging) {
                    var e = oe || Q,
                      n = v(e);
                    n && n.removeChild(e),
                      fe.emit(oe ? "cancel" : "remove", e, n, J),
                      M();
                  }
                }
                function A(e) {
                  if (fe.dragging) {
                    var n = arguments.length > 0 ? e : ae.revertOnSpill,
                      t = oe || Q,
                      r = v(t);
                    r === J && oe && r.removeChild(oe);
                    var o = j(r);
                    o === !1 && !oe && n && J.insertBefore(t, te),
                      o || n
                        ? fe.emit("cancel", t, J, J)
                        : fe.emit("drop", t, r, J, re),
                      M();
                  }
                }
                function M() {
                  var e = oe || Q;
                  D(),
                    K(),
                    e && E.rm(e, "gu-transit"),
                    ie && clearTimeout(ie),
                    (fe.dragging = !1),
                    ce && fe.emit("out", e, ce, J),
                    fe.emit("dragend", e),
                    (J = Q = oe = te = re = ie = ce = null);
                }
                function j(e, n) {
                  var t;
                  return (
                    (t = void 0 !== n ? n : G ? re : g(oe || Q)),
                    e === J && t === te
                  );
                }
                function k(e, n, r) {
                  function o() {
                    var o = t(i);
                    if (o === !1) return !1;
                    var u = z(i, e),
                      c = H(i, u, n, r),
                      a = j(i, c);
                    return a ? !0 : ae.accepts(Q, i, J, c);
                  }
                  for (var i = e; i && !o(); ) i = v(i);
                  return i;
                }
                function q(e) {
                  function n(e) {
                    fe.emit(e, f, ce, J);
                  }
                  function t() {
                    s && n("over");
                  }
                  function r() {
                    ce && n("out");
                  }
                  if (G) {
                    e.preventDefault();
                    var o = y("clientX", e),
                      i = y("clientY", e),
                      u = o - W,
                      c = i - Z;
                    (G.style.left = u + "px"), (G.style.top = c + "px");
                    var f = oe || Q,
                      l = a(G, o, i),
                      d = k(l, o, i),
                      s = null !== d && d !== ce;
                    (s || null === d) && (r(), (ce = d), t());
                    var p = v(f);
                    if (d === J && oe && !ae.copySortSource)
                      return void (p && p.removeChild(f));
                    var m,
                      h = z(d, l);
                    if (null !== h) m = H(d, h, o, i);
                    else {
                      if (ae.revertOnSpill !== !0 || oe)
                        return void (oe && p && p.removeChild(f));
                      (m = te), (d = J);
                    }
                    ((null === m && s) || (m !== f && m !== g(f) && m !== re)) &&
                      ((re = m),
                      d.insertBefore(f, m),
                      fe.emit("shadow", f, d, J));
                  }
                }
                function U(e) {
                  E.rm(e, "gu-hide");
                }
                function _(e) {
                  fe.dragging && E.add(e, "gu-hide");
                }
                function F() {
                  if (!G) {
                    var e = Q.getBoundingClientRect();
                    (G = Q.cloneNode(!0)),
                      (G.style.width = d(e) + "px"),
                      (G.style.height = s(e) + "px"),
                      E.rm(G, "gu-transit"),
                      E.add(G, "gu-mirror"),
                      ae.mirrorContainer.appendChild(G),
                      o(S, "add", "mousemove", q),
                      E.add(ae.mirrorContainer, "gu-unselectable"),
                      fe.emit("cloned", G, Q, "mirror");
                  }
                }
                function K() {
                  G &&
                    (E.rm(ae.mirrorContainer, "gu-unselectable"),
                    o(S, "remove", "mousemove", q),
                    v(G).removeChild(G),
                    (G = null));
                }
                function z(e, n) {
                  for (var t = n; t !== e && v(t) !== e; ) t = v(t);
                  return t === S ? null : t;
                }
                function H(e, n, t, r) {
                  function o() {
                    var n,
                      o,
                      i,
                      u = e.children.length;
                    for (n = 0; u > n; n++) {
                      if (
                        ((o = e.children[n]),
                        (i = o.getBoundingClientRect()),
                        c && i.left > t)
                      )
                        return o;
                      if (!c && i.top > r) return o;
                    }
                    return null;
                  }
                  function i() {
                    var e = n.getBoundingClientRect();
                    return u(c ? t > e.left + d(e) / 2 : r > e.top + s(e) / 2);
                  }
                  function u(e) {
                    return e ? g(n) : n;
                  }
                  var c = "horizontal" === ae.direction,
                    a = n !== e ? i() : o();
                  return a;
                }
                function V(e, n) {
                  return "boolean" == typeof ae.copy ? ae.copy : ae.copy(e, n);
                }
                var $ = arguments.length;
                1 === $ && Array.isArray(e) === !1 && ((n = e), (e = []));
                var G,
                  J,
                  Q,
                  W,
                  Z,
                  ee,
                  ne,
                  te,
                  re,
                  oe,
                  ie,
                  ue,
                  ce = null,
                  ae = n || {};
                void 0 === ae.moves && (ae.moves = l),
                  void 0 === ae.accepts && (ae.accepts = l),
                  void 0 === ae.invalid && (ae.invalid = B),
                  void 0 === ae.containers && (ae.containers = e || []),
                  void 0 === ae.isContainer && (ae.isContainer = f),
                  void 0 === ae.copy && (ae.copy = !1),
                  void 0 === ae.copySortSource && (ae.copySortSource = !1),
                  void 0 === ae.revertOnSpill && (ae.revertOnSpill = !1),
                  void 0 === ae.removeOnSpill && (ae.removeOnSpill = !1),
                  void 0 === ae.direction && (ae.direction = "vertical"),
                  void 0 === ae.ignoreInputTextSelection &&
                    (ae.ignoreInputTextSelection = !0),
                  void 0 === ae.mirrorContainer && (ae.mirrorContainer = x.body);
                var fe = b({
                  containers: ae.containers,
                  start: X,
                  end: P,
                  cancel: A,
                  remove: R,
                  destroy: h,
                  dragging: !1,
                });
                return (
                  ae.removeOnSpill === !0 && fe.on("over", U).on("out", _),
                  r(),
                  fe
                );
              }
              function o(e, n, r, o) {
                var i = {
                    mouseup: "touchend",
                    mousedown: "touchstart",
                    mousemove: "touchmove",
                  },
                  u = {
                    mouseup: "pointerup",
                    mousedown: "pointerdown",
                    mousemove: "pointermove",
                  },
                  c = {
                    mouseup: "MSPointerUp",
                    mousedown: "MSPointerDown",
                    mousemove: "MSPointerMove",
                  };
                t.navigator.pointerEnabled
                  ? w[n](e, u[r], o)
                  : t.navigator.msPointerEnabled
                  ? w[n](e, c[r], o)
                  : (w[n](e, i[r], o), w[n](e, r, o));
              }
              function i(e) {
                if (void 0 !== e.touches) return e.touches.length;
                if (void 0 !== e.which && 0 !== e.which) return e.which;
                if (void 0 !== e.buttons) return e.buttons;
                var n = e.button;
                return void 0 !== n
                  ? 1 & n
                    ? 1
                    : 2 & n
                    ? 3
                    : 4 & n
                    ? 2
                    : 0
                  : void 0;
              }
              function u(e) {
                var n = e.getBoundingClientRect();
                return {
                  left: n.left + c("scrollLeft", "pageXOffset"),
                  top: n.top + c("scrollTop", "pageYOffset"),
                };
              }
              function c(e, n) {
                return "undefined" != typeof t[n]
                  ? t[n]
                  : S.clientHeight
                  ? S[e]
                  : x.body[e];
              }
              function a(e, n, t) {
                var r,
                  o = e || {},
                  i = o.className;
                return (
                  (o.className += " gu-hide"),
                  (r = x.elementFromPoint(n, t)),
                  (o.className = i),
                  r
                );
              }
              function f() {
                return !1;
              }
              function l() {
                return !0;
              }
              function d(e) {
                return e.width || e.right - e.left;
              }
              function s(e) {
                return e.height || e.bottom - e.top;
              }
              function v(e) {
                return e.parentNode === x ? null : e.parentNode;
              }
              function p(e) {
                return (
                  "INPUT" === e.tagName ||
                  "TEXTAREA" === e.tagName ||
                  "SELECT" === e.tagName ||
                  m(e)
                );
              }
              function m(e) {
                return e
                  ? "false" === e.contentEditable
                    ? !1
                    : "true" === e.contentEditable
                    ? !0
                    : m(v(e))
                  : !1;
              }
              function g(e) {
                function n() {
                  var n = e;
                  do n = n.nextSibling;
                  while (n && 1 !== n.nodeType);
                  return n;
                }
                return e.nextElementSibling || n();
              }
              function h(e) {
                return e.targetTouches && e.targetTouches.length
                  ? e.targetTouches[0]
                  : e.changedTouches && e.changedTouches.length
                  ? e.changedTouches[0]
                  : e;
              }
              function y(e, n) {
                var t = h(n),
                  r = { pageX: "clientX", pageY: "clientY" };
                return e in r && !(e in t) && r[e] in t && (e = r[e]), t[e];
              }
              var b = e("contra/emitter"),
                w = e("crossvent"),
                E = e("./classes"),
                x = document,
                S = x.documentElement;
              n.exports = r;
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { "./classes": 1, "contra/emitter": 4, crossvent: 8 },
        ],
        3: [
          function (e, n, t) {
            "use strict";
            var r = e("ticky");
            n.exports = function (e, n, t) {
              e &&
                r(function () {
                  e.apply(t || null, n || []);
                });
            };
          },
          { ticky: 6 },
        ],
        4: [
          function (e, n, t) {
            "use strict";
            var r = e("atoa"),
              o = e("./debounce");
            n.exports = function (e, n) {
              var t = n || {},
                i = {};
              return (
                void 0 === e && (e = {}),
                (e.on = function (n, t) {
                  return i[n] ? i[n].push(t) : (i[n] = [t]), e;
                }),
                (e.once = function (n, t) {
                  return (t._once = !0), e.on(n, t), e;
                }),
                (e.off = function (n, t) {
                  var r = arguments.length;
                  if (1 === r) delete i[n];
                  else if (0 === r) i = {};
                  else {
                    var o = i[n];
                    if (!o) return e;
                    o.splice(o.indexOf(t), 1);
                  }
                  return e;
                }),
                (e.emit = function () {
                  var n = r(arguments);
                  return e.emitterSnapshot(n.shift()).apply(this, n);
                }),
                (e.emitterSnapshot = function (n) {
                  var u = (i[n] || []).slice(0);
                  return function () {
                    var i = r(arguments),
                      c = this || e;
                    if ("error" === n && t["throws"] !== !1 && !u.length)
                      throw 1 === i.length ? i[0] : i;
                    return (
                      u.forEach(function (r) {
                        t.async ? o(r, i, c) : r.apply(c, i),
                          r._once && e.off(n, r);
                      }),
                      e
                    );
                  };
                }),
                e
              );
            };
          },
          { "./debounce": 3, atoa: 5 },
        ],
        5: [
          function (e, n, t) {
            n.exports = function (e, n) {
              return Array.prototype.slice.call(e, n);
            };
          },
          {},
        ],
        6: [
          function (e, n, t) {
            var r,
              o = "function" == typeof setImmediate;
            (r = o
              ? function (e) {
                  setImmediate(e);
                }
              : function (e) {
                  setTimeout(e, 0);
                }),
              (n.exports = r);
          },
          {},
        ],
        7: [
          function (e, n, t) {
            (function (e) {
              function t() {
                try {
                  var e = new r("cat", { detail: { foo: "bar" } });
                  return "cat" === e.type && "bar" === e.detail.foo;
                } catch (n) {}
                return !1;
              }
              var r = e.CustomEvent;
              n.exports = t()
                ? r
                : "function" == typeof document.createEvent
                ? function (e, n) {
                    var t = document.createEvent("CustomEvent");
                    return (
                      n
                        ? t.initCustomEvent(e, n.bubbles, n.cancelable, n.detail)
                        : t.initCustomEvent(e, !1, !1, void 0),
                      t
                    );
                  }
                : function (e, n) {
                    var t = document.createEventObject();
                    return (
                      (t.type = e),
                      n
                        ? ((t.bubbles = Boolean(n.bubbles)),
                          (t.cancelable = Boolean(n.cancelable)),
                          (t.detail = n.detail))
                        : ((t.bubbles = !1),
                          (t.cancelable = !1),
                          (t.detail = void 0)),
                      t
                    );
                  };
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          {},
        ],
        8: [
          function (e, n, t) {
            (function (t) {
              "use strict";
              function r(e, n, t, r) {
                return e.addEventListener(n, t, r);
              }
              function o(e, n, t) {
                return e.attachEvent("on" + n, f(e, n, t));
              }
              function i(e, n, t, r) {
                return e.removeEventListener(n, t, r);
              }
              function u(e, n, t) {
                var r = l(e, n, t);
                return r ? e.detachEvent("on" + n, r) : void 0;
              }
              function c(e, n, t) {
                function r() {
                  var e;
                  return (
                    p.createEvent
                      ? ((e = p.createEvent("Event")), e.initEvent(n, !0, !0))
                      : p.createEventObject && (e = p.createEventObject()),
                    e
                  );
                }
                function o() {
                  return new s(n, { detail: t });
                }
                var i = -1 === v.indexOf(n) ? o() : r();
                e.dispatchEvent ? e.dispatchEvent(i) : e.fireEvent("on" + n, i);
              }
              function a(e, n, r) {
                return function (n) {
                  var o = n || t.event;
                  (o.target = o.target || o.srcElement),
                    (o.preventDefault =
                      o.preventDefault ||
                      function () {
                        o.returnValue = !1;
                      }),
                    (o.stopPropagation =
                      o.stopPropagation ||
                      function () {
                        o.cancelBubble = !0;
                      }),
                    (o.which = o.which || o.keyCode),
                    r.call(e, o);
                };
              }
              function f(e, n, t) {
                var r = l(e, n, t) || a(e, n, t);
                return h.push({ wrapper: r, element: e, type: n, fn: t }), r;
              }
              function l(e, n, t) {
                var r = d(e, n, t);
                if (r) {
                  var o = h[r].wrapper;
                  return h.splice(r, 1), o;
                }
              }
              function d(e, n, t) {
                var r, o;
                for (r = 0; r < h.length; r++)
                  if (((o = h[r]), o.element === e && o.type === n && o.fn === t))
                    return r;
              }
              var s = e("custom-event"),
                v = e("./eventmap"),
                p = t.document,
                m = r,
                g = i,
                h = [];
              t.addEventListener || ((m = o), (g = u)),
                (n.exports = { add: m, remove: g, fabricate: c });
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { "./eventmap": 9, "custom-event": 7 },
        ],
        9: [
          function (e, n, t) {
            (function (e) {
              "use strict";
              var t = [],
                r = "",
                o = /^on/;
              for (r in e) o.test(r) && t.push(r.slice(2));
              n.exports = t;
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          {},
        ],
      },
      {},
      [2]
    )(2);
  }
injectDragula()