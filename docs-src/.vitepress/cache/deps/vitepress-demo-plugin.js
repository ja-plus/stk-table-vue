import {
  Fragment,
  Transition,
  computed,
  createApp,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createStaticVNode,
  createTextVNode,
  createVNode,
  defineComponent,
  inject,
  nextTick,
  normalizeClass,
  normalizeStyle,
  openBlock,
  ref,
  renderList,
  renderSlot,
  toDisplayString,
  unref,
  watch,
  withCtx
} from "./chunk-UCUYBAJE.js";
import {
  __commonJS,
  __toESM
} from "./chunk-5WRI5ZAA.js";

// browser-external:path
var require_path = __commonJS({
  "browser-external:path"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "path" has been externalized for browser compatibility. Cannot access "path.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:fs
var require_fs = __commonJS({
  "browser-external:fs"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "fs" has been externalized for browser compatibility. Cannot access "fs.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/.pnpm/vitepress-demo-plugin@1.1.1_vitepress@1.5.0_vue@3.5.12/node_modules/vitepress-demo-plugin/dist/index.js
var import_path = __toESM(require_path());
var import_fs = __toESM(require_fs());
var me = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, a] of t)
    n[i] = a;
  return n;
};
var Dn = {};
var Bn = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "lucide lucide-code"
};
function Pn(e, t) {
  return openBlock(), createElementBlock("svg", Bn, t[0] || (t[0] = [
    createBaseVNode("polyline", { points: "16 18 22 12 16 6" }, null, -1),
    createBaseVNode("polyline", { points: "8 6 2 12 8 18" }, null, -1)
  ]));
}
var $n = me(Dn, [["render", Pn]]);
var Un = {};
var jn = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "lucide lucide-code-xml"
};
function zn(e, t) {
  return openBlock(), createElementBlock("svg", jn, t[0] || (t[0] = [
    createBaseVNode("path", { d: "m18 16 4-4-4-4" }, null, -1),
    createBaseVNode("path", { d: "m6 8-4 4 4 4" }, null, -1),
    createBaseVNode("path", { d: "m14.5 4-5 16" }, null, -1)
  ]));
}
var Fn = me(Un, [["render", zn]]);
var Wn = {};
var Kn = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "lucide lucide-copy"
};
function Gn(e, t) {
  return openBlock(), createElementBlock("svg", Kn, t[0] || (t[0] = [
    createBaseVNode("rect", {
      width: "14",
      height: "14",
      x: "8",
      y: "8",
      rx: "2",
      ry: "2"
    }, null, -1),
    createBaseVNode("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, null, -1)
  ]));
}
var Hn = me(Wn, [["render", Gn]]);
var qn = {};
var Xn = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "lucide lucide-arrow-up-from-line"
};
function Vn(e, t) {
  return openBlock(), createElementBlock("svg", Xn, t[0] || (t[0] = [
    createBaseVNode("path", { d: "m18 9-6-6-6 6" }, null, -1),
    createBaseVNode("path", { d: "M12 3v14" }, null, -1),
    createBaseVNode("path", { d: "M5 21h14" }, null, -1)
  ]));
}
var Zn = me(qn, [["render", Vn]]);
function Qn(e) {
  return e === "vue" ? "/src/Demo.vue" : e === "react" ? "/src/Demo.tsx" : "index.html";
}
var W = ((e) => (e.VUE = "vue", e.REACT = "react", e.HTML = "html", e))(W || {});
var fe = ((e) => (e.STACKBLITZ = "stackblitz", e.CODESANDBOX = "codesandbox", e))(fe || {});
var zi = "vitepress-demo";
var Fi = "This is a demo from vitepress-demo-plugin";
var nt = {};
var Wi = { exports: {} };
(function(e) {
  var t = function() {
    var n = String.fromCharCode, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", _ = {};
    function u(o, p) {
      if (!_[o]) {
        _[o] = {};
        for (var g = 0; g < o.length; g++)
          _[o][o.charAt(g)] = g;
      }
      return _[o][p];
    }
    var r = {
      compressToBase64: function(o) {
        if (o == null)
          return "";
        var p = r._compress(o, 6, function(g) {
          return i.charAt(g);
        });
        switch (p.length % 4) {
          default:
          case 0:
            return p;
          case 1:
            return p + "===";
          case 2:
            return p + "==";
          case 3:
            return p + "=";
        }
      },
      decompressFromBase64: function(o) {
        return o == null ? "" : o == "" ? null : r._decompress(o.length, 32, function(p) {
          return u(i, o.charAt(p));
        });
      },
      compressToUTF16: function(o) {
        return o == null ? "" : r._compress(o, 15, function(p) {
          return n(p + 32);
        }) + " ";
      },
      decompressFromUTF16: function(o) {
        return o == null ? "" : o == "" ? null : r._decompress(o.length, 16384, function(p) {
          return o.charCodeAt(p) - 32;
        });
      },
      compressToUint8Array: function(o) {
        for (var p = r.compress(o), g = new Uint8Array(p.length * 2), b = 0, d = p.length; b < d; b++) {
          var A = p.charCodeAt(b);
          g[b * 2] = A >>> 8, g[b * 2 + 1] = A % 256;
        }
        return g;
      },
      decompressFromUint8Array: function(o) {
        if (o == null)
          return r.decompress(o);
        for (var p = new Array(o.length / 2), g = 0, b = p.length; g < b; g++)
          p[g] = o[g * 2] * 256 + o[g * 2 + 1];
        var d = [];
        return p.forEach(function(A) {
          d.push(n(A));
        }), r.decompress(d.join(""));
      },
      compressToEncodedURIComponent: function(o) {
        return o == null ? "" : r._compress(o, 6, function(p) {
          return a.charAt(p);
        });
      },
      decompressFromEncodedURIComponent: function(o) {
        return o == null ? "" : o == "" ? null : (o = o.replace(/ /g, "+"), r._decompress(o.length, 32, function(p) {
          return u(a, o.charAt(p));
        }));
      },
      compress: function(o) {
        return r._compress(o, 16, function(p) {
          return n(p);
        });
      },
      _compress: function(o, p, g) {
        if (o == null)
          return "";
        var b, d, A = {}, M = {}, L = "", f = "", l = "", m = 2, R = 3, E = 2, k = [], c = 0, y = 0, h;
        for (h = 0; h < o.length; h += 1)
          if (L = o.charAt(h), Object.prototype.hasOwnProperty.call(A, L) || (A[L] = R++, M[L] = true), f = l + L, Object.prototype.hasOwnProperty.call(A, f))
            l = f;
          else {
            if (Object.prototype.hasOwnProperty.call(M, l)) {
              if (l.charCodeAt(0) < 256) {
                for (b = 0; b < E; b++)
                  c = c << 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++;
                for (d = l.charCodeAt(0), b = 0; b < 8; b++)
                  c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
              } else {
                for (d = 1, b = 0; b < E; b++)
                  c = c << 1 | d, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = 0;
                for (d = l.charCodeAt(0), b = 0; b < 16; b++)
                  c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
              }
              m--, m == 0 && (m = Math.pow(2, E), E++), delete M[l];
            } else
              for (d = A[l], b = 0; b < E; b++)
                c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
            m--, m == 0 && (m = Math.pow(2, E), E++), A[f] = R++, l = String(L);
          }
        if (l !== "") {
          if (Object.prototype.hasOwnProperty.call(M, l)) {
            if (l.charCodeAt(0) < 256) {
              for (b = 0; b < E; b++)
                c = c << 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++;
              for (d = l.charCodeAt(0), b = 0; b < 8; b++)
                c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
            } else {
              for (d = 1, b = 0; b < E; b++)
                c = c << 1 | d, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = 0;
              for (d = l.charCodeAt(0), b = 0; b < 16; b++)
                c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
            }
            m--, m == 0 && (m = Math.pow(2, E), E++), delete M[l];
          } else
            for (d = A[l], b = 0; b < E; b++)
              c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
          m--, m == 0 && (m = Math.pow(2, E), E++);
        }
        for (d = 2, b = 0; b < E; b++)
          c = c << 1 | d & 1, y == p - 1 ? (y = 0, k.push(g(c)), c = 0) : y++, d = d >> 1;
        for (; ; )
          if (c = c << 1, y == p - 1) {
            k.push(g(c));
            break;
          } else
            y++;
        return k.join("");
      },
      decompress: function(o) {
        return o == null ? "" : o == "" ? null : r._decompress(o.length, 32768, function(p) {
          return o.charCodeAt(p);
        });
      },
      _decompress: function(o, p, g) {
        var b = [], d = 4, A = 4, M = 3, L = "", f = [], l, m, R, E, k, c, y, h = { val: g(0), position: p, index: 1 };
        for (l = 0; l < 3; l += 1)
          b[l] = l;
        for (R = 0, k = Math.pow(2, 2), c = 1; c != k; )
          E = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = p, h.val = g(h.index++)), R |= (E > 0 ? 1 : 0) * c, c <<= 1;
        switch (R) {
          case 0:
            for (R = 0, k = Math.pow(2, 8), c = 1; c != k; )
              E = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = p, h.val = g(h.index++)), R |= (E > 0 ? 1 : 0) * c, c <<= 1;
            y = n(R);
            break;
          case 1:
            for (R = 0, k = Math.pow(2, 16), c = 1; c != k; )
              E = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = p, h.val = g(h.index++)), R |= (E > 0 ? 1 : 0) * c, c <<= 1;
            y = n(R);
            break;
          case 2:
            return "";
        }
        for (b[3] = y, m = y, f.push(y); ; ) {
          if (h.index > o)
            return "";
          for (R = 0, k = Math.pow(2, M), c = 1; c != k; )
            E = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = p, h.val = g(h.index++)), R |= (E > 0 ? 1 : 0) * c, c <<= 1;
          switch (y = R) {
            case 0:
              for (R = 0, k = Math.pow(2, 8), c = 1; c != k; )
                E = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = p, h.val = g(h.index++)), R |= (E > 0 ? 1 : 0) * c, c <<= 1;
              b[A++] = n(R), y = A - 1, d--;
              break;
            case 1:
              for (R = 0, k = Math.pow(2, 16), c = 1; c != k; )
                E = h.val & h.position, h.position >>= 1, h.position == 0 && (h.position = p, h.val = g(h.index++)), R |= (E > 0 ? 1 : 0) * c, c <<= 1;
              b[A++] = n(R), y = A - 1, d--;
              break;
            case 2:
              return f.join("");
          }
          if (d == 0 && (d = Math.pow(2, M), M++), b[y])
            L = b[y];
          else if (y === A)
            L = m + m.charAt(0);
          else
            return null;
          f.push(L), b[A++] = m + L.charAt(0), d--, m = L, d == 0 && (d = Math.pow(2, M), M++);
        }
      }
    };
    return r;
  }();
  e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
    return t;
  });
})(Wi);
Object.defineProperty(nt, "__esModule", { value: true });
nt.getParameters = void 0;
var Jn = Wi.exports;
function Yn(e) {
  return Jn.compressToBase64(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function es(e) {
  return Yn(JSON.stringify(e));
}
nt.getParameters = es;
var st = void 0;
var ts = nt;
st = ts.getParameters;
var Ki = { exports: {} };
var Le = {};
var We = { exports: {} };
var dt = {};
var gt = {};
var ei;
function It() {
  if (ei)
    return gt;
  ei = 1;
  function e(i) {
    this.__parent = i, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
  }
  e.prototype.clone_empty = function() {
    var i = new e(this.__parent);
    return i.set_indent(this.__indent_count, this.__alignment_count), i;
  }, e.prototype.item = function(i) {
    return i < 0 ? this.__items[this.__items.length + i] : this.__items[i];
  }, e.prototype.has_match = function(i) {
    for (var a = this.__items.length - 1; a >= 0; a--)
      if (this.__items[a].match(i))
        return true;
    return false;
  }, e.prototype.set_indent = function(i, a) {
    this.is_empty() && (this.__indent_count = i || 0, this.__alignment_count = a || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
  }, e.prototype._set_wrap_point = function() {
    this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
  }, e.prototype._should_wrap = function() {
    return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
  }, e.prototype._allow_wrap = function() {
    if (this._should_wrap()) {
      this.__parent.add_new_line();
      var i = this.__parent.current_line;
      return i.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), i.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), i.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, i.__items[0] === " " && (i.__items.splice(0, 1), i.__character_count -= 1), true;
    }
    return false;
  }, e.prototype.is_empty = function() {
    return this.__items.length === 0;
  }, e.prototype.last = function() {
    return this.is_empty() ? null : this.__items[this.__items.length - 1];
  }, e.prototype.push = function(i) {
    this.__items.push(i);
    var a = i.lastIndexOf(`
`);
    a !== -1 ? this.__character_count = i.length - a : this.__character_count += i.length;
  }, e.prototype.pop = function() {
    var i = null;
    return this.is_empty() || (i = this.__items.pop(), this.__character_count -= i.length), i;
  }, e.prototype._remove_indent = function() {
    this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
  }, e.prototype._remove_wrap_indent = function() {
    this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
  }, e.prototype.trim = function() {
    for (; this.last() === " "; )
      this.__items.pop(), this.__character_count -= 1;
  }, e.prototype.toString = function() {
    var i = "";
    return this.is_empty() ? this.__parent.indent_empty_lines && (i = this.__parent.get_indent_string(this.__indent_count)) : (i = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), i += this.__items.join("")), i;
  };
  function t(i, a) {
    this.__cache = [""], this.__indent_size = i.indent_size, this.__indent_string = i.indent_char, i.indent_with_tabs || (this.__indent_string = new Array(i.indent_size + 1).join(i.indent_char)), a = a || "", i.indent_level > 0 && (a = new Array(i.indent_level + 1).join(this.__indent_string)), this.__base_string = a, this.__base_string_length = a.length;
  }
  t.prototype.get_indent_size = function(i, a) {
    var _ = this.__base_string_length;
    return a = a || 0, i < 0 && (_ = 0), _ += i * this.__indent_size, _ += a, _;
  }, t.prototype.get_indent_string = function(i, a) {
    var _ = this.__base_string;
    return a = a || 0, i < 0 && (i = 0, _ = ""), a += i * this.__indent_size, this.__ensure_cache(a), _ += this.__cache[a], _;
  }, t.prototype.__ensure_cache = function(i) {
    for (; i >= this.__cache.length; )
      this.__add_column();
  }, t.prototype.__add_column = function() {
    var i = this.__cache.length, a = 0, _ = "";
    this.__indent_size && i >= this.__indent_size && (a = Math.floor(i / this.__indent_size), i -= a * this.__indent_size, _ = new Array(a + 1).join(this.__indent_string)), i && (_ += new Array(i + 1).join(" ")), this.__cache.push(_);
  };
  function n(i, a) {
    this.__indent_cache = new t(i, a), this.raw = false, this._end_with_newline = i.end_with_newline, this.indent_size = i.indent_size, this.wrap_line_length = i.wrap_line_length, this.indent_empty_lines = i.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new e(this), this.space_before_token = false, this.non_breaking_space = false, this.previous_token_wrapped = false, this.__add_outputline();
  }
  return n.prototype.__add_outputline = function() {
    this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
  }, n.prototype.get_line_number = function() {
    return this.__lines.length;
  }, n.prototype.get_indent_string = function(i, a) {
    return this.__indent_cache.get_indent_string(i, a);
  }, n.prototype.get_indent_size = function(i, a) {
    return this.__indent_cache.get_indent_size(i, a);
  }, n.prototype.is_empty = function() {
    return !this.previous_line && this.current_line.is_empty();
  }, n.prototype.add_new_line = function(i) {
    return this.is_empty() || !i && this.just_added_newline() ? false : (this.raw || this.__add_outputline(), true);
  }, n.prototype.get_code = function(i) {
    this.trim(true);
    var a = this.current_line.pop();
    a && (a[a.length - 1] === `
` && (a = a.replace(/\n+$/g, "")), this.current_line.push(a)), this._end_with_newline && this.__add_outputline();
    var _ = this.__lines.join(`
`);
    return i !== `
` && (_ = _.replace(/[\n]/g, i)), _;
  }, n.prototype.set_wrap_point = function() {
    this.current_line._set_wrap_point();
  }, n.prototype.set_indent = function(i, a) {
    return i = i || 0, a = a || 0, this.next_line.set_indent(i, a), this.__lines.length > 1 ? (this.current_line.set_indent(i, a), true) : (this.current_line.set_indent(), false);
  }, n.prototype.add_raw_token = function(i) {
    for (var a = 0; a < i.newlines; a++)
      this.__add_outputline();
    this.current_line.set_indent(-1), this.current_line.push(i.whitespace_before), this.current_line.push(i.text), this.space_before_token = false, this.non_breaking_space = false, this.previous_token_wrapped = false;
  }, n.prototype.add_token = function(i) {
    this.__add_space_before_token(), this.current_line.push(i), this.space_before_token = false, this.non_breaking_space = false, this.previous_token_wrapped = this.current_line._allow_wrap();
  }, n.prototype.__add_space_before_token = function() {
    this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
  }, n.prototype.remove_indent = function(i) {
    for (var a = this.__lines.length; i < a; )
      this.__lines[i]._remove_indent(), i++;
    this.current_line._remove_wrap_indent();
  }, n.prototype.trim = function(i) {
    for (i = i === void 0 ? false : i, this.current_line.trim(); i && this.__lines.length > 1 && this.current_line.is_empty(); )
      this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
    this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
  }, n.prototype.just_added_newline = function() {
    return this.current_line.is_empty();
  }, n.prototype.just_added_blankline = function() {
    return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
  }, n.prototype.ensure_empty_line_above = function(i, a) {
    for (var _ = this.__lines.length - 2; _ >= 0; ) {
      var u = this.__lines[_];
      if (u.is_empty())
        break;
      if (u.item(0).indexOf(i) !== 0 && u.item(-1) !== a) {
        this.__lines.splice(_ + 1, 0, new e(this)), this.previous_line = this.__lines[this.__lines.length - 2];
        break;
      }
      _--;
    }
  }, gt.Output = n, gt;
}
var mt = {};
var ti;
function Gi() {
  if (ti)
    return mt;
  ti = 1;
  function e(t, n, i, a) {
    this.type = t, this.text = n, this.comments_before = null, this.newlines = i || 0, this.whitespace_before = a || "", this.parent = null, this.next = null, this.previous = null, this.opened = null, this.closed = null, this.directives = null;
  }
  return mt.Token = e, mt;
}
var bt = {};
var ii;
function Hi() {
  return ii || (ii = 1, function(e) {
    var t = "\\x23\\x24\\x40\\x41-\\x5a\\x5f\\x61-\\x7a", n = "\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a", i = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc", a = "\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f", _ = "\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}", u = "(?:" + _ + "|[" + t + i + "])", r = "(?:" + _ + "|[" + n + i + a + "])*";
    e.identifier = new RegExp(u + r, "g"), e.identifierStart = new RegExp(u), e.identifierMatch = new RegExp("(?:" + _ + "|[" + n + i + a + "])+"), e.newline = /[\n\r\u2028\u2029]/, e.lineBreak = new RegExp(`\r
|` + e.newline.source), e.allLineBreaks = new RegExp(e.lineBreak.source, "g");
  }(bt)), bt;
}
var yt = {};
var Ie = {};
var ni;
function Dt() {
  if (ni)
    return Ie;
  ni = 1;
  function e(i, a) {
    this.raw_options = t(i, a), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", true), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "angular", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
  }
  e.prototype._get_array = function(i, a) {
    var _ = this.raw_options[i], u = a || [];
    return typeof _ == "object" ? _ !== null && typeof _.concat == "function" && (u = _.concat()) : typeof _ == "string" && (u = _.split(/[^a-zA-Z0-9_\/\-]+/)), u;
  }, e.prototype._get_boolean = function(i, a) {
    var _ = this.raw_options[i], u = _ === void 0 ? !!a : !!_;
    return u;
  }, e.prototype._get_characters = function(i, a) {
    var _ = this.raw_options[i], u = a || "";
    return typeof _ == "string" && (u = _.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), u;
  }, e.prototype._get_number = function(i, a) {
    var _ = this.raw_options[i];
    a = parseInt(a, 10), isNaN(a) && (a = 0);
    var u = parseInt(_, 10);
    return isNaN(u) && (u = a), u;
  }, e.prototype._get_selection = function(i, a, _) {
    var u = this._get_selection_list(i, a, _);
    if (u.length !== 1)
      throw new Error(
        "Invalid Option Value: The option '" + i + `' can only be one of the following values:
` + a + `
You passed in: '` + this.raw_options[i] + "'"
      );
    return u[0];
  }, e.prototype._get_selection_list = function(i, a, _) {
    if (!a || a.length === 0)
      throw new Error("Selection list cannot be empty.");
    if (_ = _ || [a[0]], !this._is_valid_selection(_, a))
      throw new Error("Invalid Default Value!");
    var u = this._get_array(i, _);
    if (!this._is_valid_selection(u, a))
      throw new Error(
        "Invalid Option Value: The option '" + i + `' can contain only the following values:
` + a + `
You passed in: '` + this.raw_options[i] + "'"
      );
    return u;
  }, e.prototype._is_valid_selection = function(i, a) {
    return i.length && a.length && !i.some(function(_) {
      return a.indexOf(_) === -1;
    });
  };
  function t(i, a) {
    var _ = {};
    i = n(i);
    var u;
    for (u in i)
      u !== a && (_[u] = i[u]);
    if (a && i[a])
      for (u in i[a])
        _[u] = i[a][u];
    return _;
  }
  function n(i) {
    var a = {}, _;
    for (_ in i) {
      var u = _.replace(/-/g, "_");
      a[u] = i[_];
    }
    return a;
  }
  return Ie.Options = e, Ie.normalizeOpts = n, Ie.mergeOpts = t, Ie;
}
var si;
function qi() {
  if (si)
    return yt;
  si = 1;
  var e = Dt().Options, t = ["before-newline", "after-newline", "preserve-newline"];
  function n(i) {
    e.call(this, i, "js");
    var a = this.raw_options.brace_style || null;
    a === "expand-strict" ? this.raw_options.brace_style = "expand" : a === "collapse-preserve-inline" ? this.raw_options.brace_style = "collapse,preserve-inline" : this.raw_options.braces_on_own_line !== void 0 && (this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse");
    var _ = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
    this.brace_preserve_inline = false, this.brace_style = "collapse";
    for (var u = 0; u < _.length; u++)
      _[u] === "preserve-inline" ? this.brace_preserve_inline = true : this.brace_style = _[u];
    this.unindent_chained_methods = this._get_boolean("unindent_chained_methods"), this.break_chained_methods = this._get_boolean("break_chained_methods"), this.space_in_paren = this._get_boolean("space_in_paren"), this.space_in_empty_paren = this._get_boolean("space_in_empty_paren"), this.jslint_happy = this._get_boolean("jslint_happy"), this.space_after_anon_function = this._get_boolean("space_after_anon_function"), this.space_after_named_function = this._get_boolean("space_after_named_function"), this.keep_array_indentation = this._get_boolean("keep_array_indentation"), this.space_before_conditional = this._get_boolean("space_before_conditional", true), this.unescape_strings = this._get_boolean("unescape_strings"), this.e4x = this._get_boolean("e4x"), this.comma_first = this._get_boolean("comma_first"), this.operator_position = this._get_selection("operator_position", t), this.test_output_raw = this._get_boolean("test_output_raw"), this.jslint_happy && (this.space_after_anon_function = true);
  }
  return n.prototype = new e(), yt.Options = n, yt;
}
var ke = {};
var vt = {};
var ri;
function Bt() {
  if (ri)
    return vt;
  ri = 1;
  var e = RegExp.prototype.hasOwnProperty("sticky");
  function t(n) {
    this.__input = n || "", this.__input_length = this.__input.length, this.__position = 0;
  }
  return t.prototype.restart = function() {
    this.__position = 0;
  }, t.prototype.back = function() {
    this.__position > 0 && (this.__position -= 1);
  }, t.prototype.hasNext = function() {
    return this.__position < this.__input_length;
  }, t.prototype.next = function() {
    var n = null;
    return this.hasNext() && (n = this.__input.charAt(this.__position), this.__position += 1), n;
  }, t.prototype.peek = function(n) {
    var i = null;
    return n = n || 0, n += this.__position, n >= 0 && n < this.__input_length && (i = this.__input.charAt(n)), i;
  }, t.prototype.__match = function(n, i) {
    n.lastIndex = i;
    var a = n.exec(this.__input);
    return a && !(e && n.sticky) && a.index !== i && (a = null), a;
  }, t.prototype.test = function(n, i) {
    return i = i || 0, i += this.__position, i >= 0 && i < this.__input_length ? !!this.__match(n, i) : false;
  }, t.prototype.testChar = function(n, i) {
    var a = this.peek(i);
    return n.lastIndex = 0, a !== null && n.test(a);
  }, t.prototype.match = function(n) {
    var i = this.__match(n, this.__position);
    return i ? this.__position += i[0].length : i = null, i;
  }, t.prototype.read = function(n, i, a) {
    var _ = "", u;
    return n && (u = this.match(n), u && (_ += u[0])), i && (u || !n) && (_ += this.readUntil(i, a)), _;
  }, t.prototype.readUntil = function(n, i) {
    var a = "", _ = this.__position;
    n.lastIndex = this.__position;
    var u = n.exec(this.__input);
    return u ? (_ = u.index, i && (_ += u[0].length)) : _ = this.__input_length, a = this.__input.substring(this.__position, _), this.__position = _, a;
  }, t.prototype.readUntilAfter = function(n) {
    return this.readUntil(n, true);
  }, t.prototype.get_regexp = function(n, i) {
    var a = null, _ = "g";
    return i && e && (_ = "y"), typeof n == "string" && n !== "" ? a = new RegExp(n, _) : n && (a = new RegExp(n.source, _)), a;
  }, t.prototype.get_literal_regexp = function(n) {
    return RegExp(n.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
  }, t.prototype.peekUntilAfter = function(n) {
    var i = this.__position, a = this.readUntilAfter(n);
    return this.__position = i, a;
  }, t.prototype.lookBack = function(n) {
    var i = this.__position - 1;
    return i >= n.length && this.__input.substring(i - n.length, i).toLowerCase() === n;
  }, vt.InputScanner = t, vt;
}
var Ke = {};
var wt = {};
var ai;
function is() {
  if (ai)
    return wt;
  ai = 1;
  function e(t) {
    this.__tokens = [], this.__tokens_length = this.__tokens.length, this.__position = 0, this.__parent_token = t;
  }
  return e.prototype.restart = function() {
    this.__position = 0;
  }, e.prototype.isEmpty = function() {
    return this.__tokens_length === 0;
  }, e.prototype.hasNext = function() {
    return this.__position < this.__tokens_length;
  }, e.prototype.next = function() {
    var t = null;
    return this.hasNext() && (t = this.__tokens[this.__position], this.__position += 1), t;
  }, e.prototype.peek = function(t) {
    var n = null;
    return t = t || 0, t += this.__position, t >= 0 && t < this.__tokens_length && (n = this.__tokens[t]), n;
  }, e.prototype.add = function(t) {
    this.__parent_token && (t.parent = this.__parent_token), this.__tokens.push(t), this.__tokens_length += 1;
  }, wt.TokenStream = e, wt;
}
var Et = {};
var xt = {};
var oi;
function rt() {
  if (oi)
    return xt;
  oi = 1;
  function e(t, n) {
    this._input = t, this._starting_pattern = null, this._match_pattern = null, this._until_pattern = null, this._until_after = false, n && (this._starting_pattern = this._input.get_regexp(n._starting_pattern, true), this._match_pattern = this._input.get_regexp(n._match_pattern, true), this._until_pattern = this._input.get_regexp(n._until_pattern), this._until_after = n._until_after);
  }
  return e.prototype.read = function() {
    var t = this._input.read(this._starting_pattern);
    return (!this._starting_pattern || t) && (t += this._input.read(this._match_pattern, this._until_pattern, this._until_after)), t;
  }, e.prototype.read_match = function() {
    return this._input.match(this._match_pattern);
  }, e.prototype.until_after = function(t) {
    var n = this._create();
    return n._until_after = true, n._until_pattern = this._input.get_regexp(t), n._update(), n;
  }, e.prototype.until = function(t) {
    var n = this._create();
    return n._until_after = false, n._until_pattern = this._input.get_regexp(t), n._update(), n;
  }, e.prototype.starting_with = function(t) {
    var n = this._create();
    return n._starting_pattern = this._input.get_regexp(t, true), n._update(), n;
  }, e.prototype.matching = function(t) {
    var n = this._create();
    return n._match_pattern = this._input.get_regexp(t, true), n._update(), n;
  }, e.prototype._create = function() {
    return new e(this._input, this);
  }, e.prototype._update = function() {
  }, xt.Pattern = e, xt;
}
var li;
function ns() {
  if (li)
    return Et;
  li = 1;
  var e = rt().Pattern;
  function t(n, i) {
    e.call(this, n, i), i ? this._line_regexp = this._input.get_regexp(i._line_regexp) : this.__set_whitespace_patterns("", ""), this.newline_count = 0, this.whitespace_before_token = "";
  }
  return t.prototype = new e(), t.prototype.__set_whitespace_patterns = function(n, i) {
    n += "\\t ", i += "\\n\\r", this._match_pattern = this._input.get_regexp(
      "[" + n + i + "]+",
      true
    ), this._newline_regexp = this._input.get_regexp(
      "\\r\\n|[" + i + "]"
    );
  }, t.prototype.read = function() {
    this.newline_count = 0, this.whitespace_before_token = "";
    var n = this._input.read(this._match_pattern);
    if (n === " ")
      this.whitespace_before_token = " ";
    else if (n) {
      var i = this.__split(this._newline_regexp, n);
      this.newline_count = i.length - 1, this.whitespace_before_token = i[this.newline_count];
    }
    return n;
  }, t.prototype.matching = function(n, i) {
    var a = this._create();
    return a.__set_whitespace_patterns(n, i), a._update(), a;
  }, t.prototype._create = function() {
    return new t(this._input, this);
  }, t.prototype.__split = function(n, i) {
    n.lastIndex = 0;
    for (var a = 0, _ = [], u = n.exec(i); u; )
      _.push(i.substring(a, u.index)), a = u.index + u[0].length, u = n.exec(i);
    return a < i.length ? _.push(i.substring(a, i.length)) : _.push(""), _;
  }, Et.WhitespacePattern = t, Et;
}
var _i;
function et() {
  if (_i)
    return Ke;
  _i = 1;
  var e = Bt().InputScanner, t = Gi().Token, n = is().TokenStream, i = ns().WhitespacePattern, a = {
    START: "TK_START",
    RAW: "TK_RAW",
    EOF: "TK_EOF"
  }, _ = function(u, r) {
    this._input = new e(u), this._options = r || {}, this.__tokens = null, this._patterns = {}, this._patterns.whitespace = new i(this._input);
  };
  return _.prototype.tokenize = function() {
    this._input.restart(), this.__tokens = new n(), this._reset();
    for (var u, r = new t(a.START, ""), o = null, p = [], g = new n(); r.type !== a.EOF; ) {
      for (u = this._get_next_token(r, o); this._is_comment(u); )
        g.add(u), u = this._get_next_token(r, o);
      g.isEmpty() || (u.comments_before = g, g = new n()), u.parent = o, this._is_opening(u) ? (p.push(o), o = u) : o && this._is_closing(u, o) && (u.opened = o, o.closed = u, o = p.pop(), u.parent = o), u.previous = r, r.next = u, this.__tokens.add(u), r = u;
    }
    return this.__tokens;
  }, _.prototype._is_first_token = function() {
    return this.__tokens.isEmpty();
  }, _.prototype._reset = function() {
  }, _.prototype._get_next_token = function(u, r) {
    this._readWhitespace();
    var o = this._input.read(/.+/g);
    return o ? this._create_token(a.RAW, o) : this._create_token(a.EOF, "");
  }, _.prototype._is_comment = function(u) {
    return false;
  }, _.prototype._is_opening = function(u) {
    return false;
  }, _.prototype._is_closing = function(u, r) {
    return false;
  }, _.prototype._create_token = function(u, r) {
    var o = new t(
      u,
      r,
      this._patterns.whitespace.newline_count,
      this._patterns.whitespace.whitespace_before_token
    );
    return o;
  }, _.prototype._readWhitespace = function() {
    return this._patterns.whitespace.read();
  }, Ke.Tokenizer = _, Ke.TOKEN = a, Ke;
}
var Ot = {};
var ui;
function Pt() {
  if (ui)
    return Ot;
  ui = 1;
  function e(t, n) {
    t = typeof t == "string" ? t : t.source, n = typeof n == "string" ? n : n.source, this.__directives_block_pattern = new RegExp(t + / beautify( \w+[:]\w+)+ /.source + n, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(t + /\sbeautify\signore:end\s/.source + n, "g");
  }
  return e.prototype.get_directives = function(t) {
    if (!t.match(this.__directives_block_pattern))
      return null;
    var n = {};
    this.__directive_pattern.lastIndex = 0;
    for (var i = this.__directive_pattern.exec(t); i; )
      n[i[1]] = i[2], i = this.__directive_pattern.exec(t);
    return n;
  }, e.prototype.readIgnored = function(t) {
    return t.readUntilAfter(this.__directives_end_ignore_pattern);
  }, Ot.Directives = e, Ot;
}
var Tt = {};
var ci;
function Xi() {
  if (ci)
    return Tt;
  ci = 1;
  var e = rt().Pattern, t = {
    django: false,
    erb: false,
    handlebars: false,
    php: false,
    smarty: false,
    angular: false
  };
  function n(i, a) {
    e.call(this, i, a), this.__template_pattern = null, this._disabled = Object.assign({}, t), this._excluded = Object.assign({}, t), a && (this.__template_pattern = this._input.get_regexp(a.__template_pattern), this._excluded = Object.assign(this._excluded, a._excluded), this._disabled = Object.assign(this._disabled, a._disabled));
    var _ = new e(i);
    this.__patterns = {
      handlebars_comment: _.starting_with(/{{!--/).until_after(/--}}/),
      handlebars_unescaped: _.starting_with(/{{{/).until_after(/}}}/),
      handlebars: _.starting_with(/{{/).until_after(/}}/),
      php: _.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
      erb: _.starting_with(/<%[^%]/).until_after(/[^%]%>/),
      django: _.starting_with(/{%/).until_after(/%}/),
      django_value: _.starting_with(/{{/).until_after(/}}/),
      django_comment: _.starting_with(/{#/).until_after(/#}/),
      smarty: _.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
      smarty_comment: _.starting_with(/{\*/).until_after(/\*}/),
      smarty_literal: _.starting_with(/{literal}/).until_after(/{\/literal}/)
    };
  }
  return n.prototype = new e(), n.prototype._create = function() {
    return new n(this._input, this);
  }, n.prototype._update = function() {
    this.__set_templated_pattern();
  }, n.prototype.disable = function(i) {
    var a = this._create();
    return a._disabled[i] = true, a._update(), a;
  }, n.prototype.read_options = function(i) {
    var a = this._create();
    for (var _ in t)
      a._disabled[_] = i.templating.indexOf(_) === -1;
    return a._update(), a;
  }, n.prototype.exclude = function(i) {
    var a = this._create();
    return a._excluded[i] = true, a._update(), a;
  }, n.prototype.read = function() {
    var i = "";
    this._match_pattern ? i = this._input.read(this._starting_pattern) : i = this._input.read(this._starting_pattern, this.__template_pattern);
    for (var a = this._read_template(); a; )
      this._match_pattern ? a += this._input.read(this._match_pattern) : a += this._input.readUntil(this.__template_pattern), i += a, a = this._read_template();
    return this._until_after && (i += this._input.readUntilAfter(this._until_pattern)), i;
  }, n.prototype.__set_templated_pattern = function() {
    var i = [];
    this._disabled.php || i.push(this.__patterns.php._starting_pattern.source), this._disabled.handlebars || i.push(this.__patterns.handlebars._starting_pattern.source), this._disabled.erb || i.push(this.__patterns.erb._starting_pattern.source), this._disabled.django || (i.push(this.__patterns.django._starting_pattern.source), i.push(this.__patterns.django_value._starting_pattern.source), i.push(this.__patterns.django_comment._starting_pattern.source)), this._disabled.smarty || i.push(this.__patterns.smarty._starting_pattern.source), this._until_pattern && i.push(this._until_pattern.source), this.__template_pattern = this._input.get_regexp("(?:" + i.join("|") + ")");
  }, n.prototype._read_template = function() {
    var i = "", a = this._input.peek();
    if (a === "<") {
      var _ = this._input.peek(1);
      !this._disabled.php && !this._excluded.php && _ === "?" && (i = i || this.__patterns.php.read()), !this._disabled.erb && !this._excluded.erb && _ === "%" && (i = i || this.__patterns.erb.read());
    } else
      a === "{" && (!this._disabled.handlebars && !this._excluded.handlebars && (i = i || this.__patterns.handlebars_comment.read(), i = i || this.__patterns.handlebars_unescaped.read(), i = i || this.__patterns.handlebars.read()), this._disabled.django || (!this._excluded.django && !this._excluded.handlebars && (i = i || this.__patterns.django_value.read()), this._excluded.django || (i = i || this.__patterns.django_comment.read(), i = i || this.__patterns.django.read())), this._disabled.smarty || this._disabled.django && this._disabled.handlebars && (i = i || this.__patterns.smarty_comment.read(), i = i || this.__patterns.smarty_literal.read(), i = i || this.__patterns.smarty.read()));
    return i;
  }, Tt.TemplatablePattern = n, Tt;
}
var pi;
function Ge() {
  if (pi)
    return ke;
  pi = 1;
  var e = Bt().InputScanner, t = et().Tokenizer, n = et().TOKEN, i = Pt().Directives, a = Hi(), _ = rt().Pattern, u = Xi().TemplatablePattern;
  function r(c, y) {
    return y.indexOf(c) !== -1;
  }
  var o = {
    START_EXPR: "TK_START_EXPR",
    END_EXPR: "TK_END_EXPR",
    START_BLOCK: "TK_START_BLOCK",
    END_BLOCK: "TK_END_BLOCK",
    WORD: "TK_WORD",
    RESERVED: "TK_RESERVED",
    SEMICOLON: "TK_SEMICOLON",
    STRING: "TK_STRING",
    EQUALS: "TK_EQUALS",
    OPERATOR: "TK_OPERATOR",
    COMMA: "TK_COMMA",
    BLOCK_COMMENT: "TK_BLOCK_COMMENT",
    COMMENT: "TK_COMMENT",
    DOT: "TK_DOT",
    UNKNOWN: "TK_UNKNOWN",
    START: n.START,
    RAW: n.RAW,
    EOF: n.EOF
  }, p = new i(/\/\*/, /\*\//), g = /0[xX][0123456789abcdefABCDEF_]*n?|0[oO][01234567_]*n?|0[bB][01_]*n?|\d[\d_]*n|(?:\.\d[\d_]*|\d[\d_]*\.?[\d_]*)(?:[eE][+-]?[\d_]+)?/, b = /[0-9]/, d = /[^\d\.]/, A = ">>> === !== &&= ??= ||= << && >= ** != == <= >> || ?? |> < / - + > : & % ? ^ | *".split(" "), M = ">>>= ... >>= <<= === >>> !== **= &&= ??= ||= => ^= :: /= << <= == && -= >= >> != -- += ** || ?? ++ %= &= *= |= |> = ! ? > < : / ^ - + * & % ~ |";
  M = M.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&"), M = "\\?\\.(?!\\d) " + M, M = M.replace(/ /g, "|");
  var L = new RegExp(M), f = "continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export".split(","), l = f.concat(["do", "in", "of", "else", "get", "set", "new", "catch", "finally", "typeof", "yield", "async", "await", "from", "as", "class", "extends"]), m = new RegExp("^(?:" + l.join("|") + ")$"), R, E = function(c, y) {
    t.call(this, c, y), this._patterns.whitespace = this._patterns.whitespace.matching(
      /\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff/.source,
      /\u2028\u2029/.source
    );
    var h = new _(this._input), T = new u(this._input).read_options(this._options);
    this.__patterns = {
      template: T,
      identifier: T.starting_with(a.identifier).matching(a.identifierMatch),
      number: h.matching(g),
      punct: h.matching(L),
      comment: h.starting_with(/\/\//).until(/[\n\r\u2028\u2029]/),
      block_comment: h.starting_with(/\/\*/).until_after(/\*\//),
      html_comment_start: h.matching(/<!--/),
      html_comment_end: h.matching(/-->/),
      include: h.starting_with(/#include/).until_after(a.lineBreak),
      shebang: h.starting_with(/#!/).until_after(a.lineBreak),
      xml: h.matching(/[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[^}]+?}|!\[CDATA\[[^\]]*?\]\]|)(\s*{[^}]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{([^{}]|{[^}]+?})+?}))*\s*(\/?)\s*>/),
      single_quote: T.until(/['\\\n\r\u2028\u2029]/),
      double_quote: T.until(/["\\\n\r\u2028\u2029]/),
      template_text: T.until(/[`\\$]/),
      template_expression: T.until(/[`}\\]/)
    };
  };
  E.prototype = new t(), E.prototype._is_comment = function(c) {
    return c.type === o.COMMENT || c.type === o.BLOCK_COMMENT || c.type === o.UNKNOWN;
  }, E.prototype._is_opening = function(c) {
    return c.type === o.START_BLOCK || c.type === o.START_EXPR;
  }, E.prototype._is_closing = function(c, y) {
    return (c.type === o.END_BLOCK || c.type === o.END_EXPR) && y && (c.text === "]" && y.text === "[" || c.text === ")" && y.text === "(" || c.text === "}" && y.text === "{");
  }, E.prototype._reset = function() {
    R = false;
  }, E.prototype._get_next_token = function(c, y) {
    var h = null;
    this._readWhitespace();
    var T = this._input.peek();
    return T === null ? this._create_token(o.EOF, "") : (h = h || this._read_non_javascript(T), h = h || this._read_string(T), h = h || this._read_pair(T, this._input.peek(1)), h = h || this._read_word(c), h = h || this._read_singles(T), h = h || this._read_comment(T), h = h || this._read_regexp(T, c), h = h || this._read_xml(T, c), h = h || this._read_punctuation(), h = h || this._create_token(o.UNKNOWN, this._input.next()), h);
  }, E.prototype._read_word = function(c) {
    var y;
    if (y = this.__patterns.identifier.read(), y !== "")
      return y = y.replace(a.allLineBreaks, `
`), !(c.type === o.DOT || c.type === o.RESERVED && (c.text === "set" || c.text === "get")) && m.test(y) ? (y === "in" || y === "of") && (c.type === o.WORD || c.type === o.STRING) ? this._create_token(o.OPERATOR, y) : this._create_token(o.RESERVED, y) : this._create_token(o.WORD, y);
    if (y = this.__patterns.number.read(), y !== "")
      return this._create_token(o.WORD, y);
  }, E.prototype._read_singles = function(c) {
    var y = null;
    return c === "(" || c === "[" ? y = this._create_token(o.START_EXPR, c) : c === ")" || c === "]" ? y = this._create_token(o.END_EXPR, c) : c === "{" ? y = this._create_token(o.START_BLOCK, c) : c === "}" ? y = this._create_token(o.END_BLOCK, c) : c === ";" ? y = this._create_token(o.SEMICOLON, c) : c === "." && d.test(this._input.peek(1)) ? y = this._create_token(o.DOT, c) : c === "," && (y = this._create_token(o.COMMA, c)), y && this._input.next(), y;
  }, E.prototype._read_pair = function(c, y) {
    var h = null;
    return c === "#" && y === "{" && (h = this._create_token(o.START_BLOCK, c + y)), h && (this._input.next(), this._input.next()), h;
  }, E.prototype._read_punctuation = function() {
    var c = this.__patterns.punct.read();
    if (c !== "")
      return c === "=" ? this._create_token(o.EQUALS, c) : c === "?." ? this._create_token(o.DOT, c) : this._create_token(o.OPERATOR, c);
  }, E.prototype._read_non_javascript = function(c) {
    var y = "";
    if (c === "#") {
      if (this._is_first_token() && (y = this.__patterns.shebang.read(), y))
        return this._create_token(o.UNKNOWN, y.trim() + `
`);
      if (y = this.__patterns.include.read(), y)
        return this._create_token(o.UNKNOWN, y.trim() + `
`);
      c = this._input.next();
      var h = "#";
      if (this._input.hasNext() && this._input.testChar(b)) {
        do
          c = this._input.next(), h += c;
        while (this._input.hasNext() && c !== "#" && c !== "=");
        return c === "#" || (this._input.peek() === "[" && this._input.peek(1) === "]" ? (h += "[]", this._input.next(), this._input.next()) : this._input.peek() === "{" && this._input.peek(1) === "}" && (h += "{}", this._input.next(), this._input.next())), this._create_token(o.WORD, h);
      }
      this._input.back();
    } else if (c === "<" && this._is_first_token()) {
      if (y = this.__patterns.html_comment_start.read(), y) {
        for (; this._input.hasNext() && !this._input.testChar(a.newline); )
          y += this._input.next();
        return R = true, this._create_token(o.COMMENT, y);
      }
    } else if (R && c === "-" && (y = this.__patterns.html_comment_end.read(), y))
      return R = false, this._create_token(o.COMMENT, y);
    return null;
  }, E.prototype._read_comment = function(c) {
    var y = null;
    if (c === "/") {
      var h = "";
      if (this._input.peek(1) === "*") {
        h = this.__patterns.block_comment.read();
        var T = p.get_directives(h);
        T && T.ignore === "start" && (h += p.readIgnored(this._input)), h = h.replace(a.allLineBreaks, `
`), y = this._create_token(o.BLOCK_COMMENT, h), y.directives = T;
      } else
        this._input.peek(1) === "/" && (h = this.__patterns.comment.read(), y = this._create_token(o.COMMENT, h));
    }
    return y;
  }, E.prototype._read_string = function(c) {
    if (c === "`" || c === "'" || c === '"') {
      var y = this._input.next();
      return this.has_char_escapes = false, c === "`" ? y += this._read_string_recursive("`", true, "${") : y += this._read_string_recursive(c), this.has_char_escapes && this._options.unescape_strings && (y = k(y)), this._input.peek() === c && (y += this._input.next()), y = y.replace(a.allLineBreaks, `
`), this._create_token(o.STRING, y);
    }
    return null;
  }, E.prototype._allow_regexp_or_xml = function(c) {
    return c.type === o.RESERVED && r(c.text, ["return", "case", "throw", "else", "do", "typeof", "yield"]) || c.type === o.END_EXPR && c.text === ")" && c.opened.previous.type === o.RESERVED && r(c.opened.previous.text, ["if", "while", "for"]) || r(c.type, [
      o.COMMENT,
      o.START_EXPR,
      o.START_BLOCK,
      o.START,
      o.END_BLOCK,
      o.OPERATOR,
      o.EQUALS,
      o.EOF,
      o.SEMICOLON,
      o.COMMA
    ]);
  }, E.prototype._read_regexp = function(c, y) {
    if (c === "/" && this._allow_regexp_or_xml(y)) {
      for (var h = this._input.next(), T = false, s = false; this._input.hasNext() && (T || s || this._input.peek() !== c) && !this._input.testChar(a.newline); )
        h += this._input.peek(), T ? T = false : (T = this._input.peek() === "\\", this._input.peek() === "[" ? s = true : this._input.peek() === "]" && (s = false)), this._input.next();
      return this._input.peek() === c && (h += this._input.next(), h += this._input.read(a.identifier)), this._create_token(o.STRING, h);
    }
    return null;
  }, E.prototype._read_xml = function(c, y) {
    if (this._options.e4x && c === "<" && this._allow_regexp_or_xml(y)) {
      var h = "", T = this.__patterns.xml.read_match();
      if (T) {
        for (var s = T[2].replace(/^{\s+/, "{").replace(/\s+}$/, "}"), w = s.indexOf("{") === 0, v = 0; T; ) {
          var x = !!T[1], C = T[2], B = !!T[T.length - 1] || C.slice(0, 8) === "![CDATA[";
          if (!B && (C === s || w && C.replace(/^{\s+/, "{").replace(/\s+}$/, "}")) && (x ? --v : ++v), h += T[0], v <= 0)
            break;
          T = this.__patterns.xml.read_match();
        }
        return T || (h += this._input.match(/[\s\S]*/g)[0]), h = h.replace(a.allLineBreaks, `
`), this._create_token(o.STRING, h);
      }
    }
    return null;
  };
  function k(c) {
    for (var y = "", h = 0, T = new e(c), s = null; T.hasNext(); )
      if (s = T.match(/([\s]|[^\\]|\\\\)+/g), s && (y += s[0]), T.peek() === "\\") {
        if (T.next(), T.peek() === "x")
          s = T.match(/x([0-9A-Fa-f]{2})/g);
        else if (T.peek() === "u")
          s = T.match(/u([0-9A-Fa-f]{4})/g), s || (s = T.match(/u\{([0-9A-Fa-f]+)\}/g));
        else {
          y += "\\", T.hasNext() && (y += T.next());
          continue;
        }
        if (!s || (h = parseInt(s[1], 16), h > 126 && h <= 255 && s[0].indexOf("x") === 0))
          return c;
        h >= 0 && h < 32 || h > 1114111 ? y += "\\" + s[0] : h === 34 || h === 39 || h === 92 ? y += "\\" + String.fromCharCode(h) : y += String.fromCharCode(h);
      }
    return y;
  }
  return E.prototype._read_string_recursive = function(c, y, h) {
    var T, s;
    c === "'" ? s = this.__patterns.single_quote : c === '"' ? s = this.__patterns.double_quote : c === "`" ? s = this.__patterns.template_text : c === "}" && (s = this.__patterns.template_expression);
    for (var w = s.read(), v = ""; this._input.hasNext(); ) {
      if (v = this._input.next(), v === c || !y && a.newline.test(v)) {
        this._input.back();
        break;
      } else
        v === "\\" && this._input.hasNext() ? (T = this._input.peek(), T === "x" || T === "u" ? this.has_char_escapes = true : T === "\r" && this._input.peek(1) === `
` && this._input.next(), v += this._input.next()) : h && (h === "${" && v === "$" && this._input.peek() === "{" && (v += this._input.next()), h === v && (c === "`" ? v += this._read_string_recursive("}", y, "`") : v += this._read_string_recursive("`", y, "${"), this._input.hasNext() && (v += this._input.next())));
      v += s.read(), w += v;
    }
    return w;
  }, ke.Tokenizer = E, ke.TOKEN = o, ke.positionable_operators = A.slice(), ke.line_starters = f.slice(), ke;
}
var hi;
function ss() {
  if (hi)
    return dt;
  hi = 1;
  var e = It().Output, t = Gi().Token, n = Hi(), i = qi().Options, a = Ge().Tokenizer, _ = Ge().line_starters, u = Ge().positionable_operators, r = Ge().TOKEN;
  function o(s, w) {
    return w.indexOf(s) !== -1;
  }
  function p(s) {
    return s.replace(/^\s+/g, "");
  }
  function g(s) {
    for (var w = {}, v = 0; v < s.length; v++)
      w[s[v].replace(/-/g, "_")] = s[v];
    return w;
  }
  function b(s, w) {
    return s && s.type === r.RESERVED && s.text === w;
  }
  function d(s, w) {
    return s && s.type === r.RESERVED && o(s.text, w);
  }
  var A = ["case", "return", "do", "if", "throw", "else", "await", "break", "continue", "async"], M = ["before-newline", "after-newline", "preserve-newline"], L = g(M), f = [L.before_newline, L.preserve_newline], l = {
    BlockStatement: "BlockStatement",
    Statement: "Statement",
    ObjectLiteral: "ObjectLiteral",
    ArrayLiteral: "ArrayLiteral",
    ForInitializer: "ForInitializer",
    Conditional: "Conditional",
    Expression: "Expression"
  };
  function m(s, w) {
    w.multiline_frame || w.mode === l.ForInitializer || w.mode === l.Conditional || s.remove_indent(w.start_line_index);
  }
  function R(s) {
    s = s.replace(n.allLineBreaks, `
`);
    for (var w = [], v = s.indexOf(`
`); v !== -1; )
      w.push(s.substring(0, v)), s = s.substring(v + 1), v = s.indexOf(`
`);
    return s.length && w.push(s), w;
  }
  function E(s) {
    return s === l.ArrayLiteral;
  }
  function k(s) {
    return o(s, [l.Expression, l.ForInitializer, l.Conditional]);
  }
  function c(s, w) {
    for (var v = 0; v < s.length; v++) {
      var x = s[v].trim();
      if (x.charAt(0) !== w)
        return false;
    }
    return true;
  }
  function y(s, w) {
    for (var v = 0, x = s.length, C; v < x; v++)
      if (C = s[v], C && C.indexOf(w) !== 0)
        return false;
    return true;
  }
  function h(s, w) {
    w = w || {}, this._source_text = s || "", this._output = null, this._tokens = null, this._last_last_text = null, this._flags = null, this._previous_flags = null, this._flag_store = null, this._options = new i(w);
  }
  h.prototype.create_flags = function(s, w) {
    var v = 0;
    s && (v = s.indentation_level, !this._output.just_added_newline() && s.line_indent_level > v && (v = s.line_indent_level));
    var x = {
      mode: w,
      parent: s,
      last_token: s ? s.last_token : new t(r.START_BLOCK, ""),
      last_word: s ? s.last_word : "",
      declaration_statement: false,
      declaration_assignment: false,
      multiline_frame: false,
      inline_frame: false,
      if_block: false,
      else_block: false,
      class_start_block: false,
      do_block: false,
      do_while: false,
      import_block: false,
      in_case_statement: false,
      in_case: false,
      case_body: false,
      case_block: false,
      indentation_level: v,
      alignment: 0,
      line_indent_level: s ? s.line_indent_level : v,
      start_line_index: this._output.get_line_number(),
      ternary_depth: 0
    };
    return x;
  }, h.prototype._reset = function(s) {
    var w = s.match(/^[\t ]*/)[0];
    this._last_last_text = "", this._output = new e(this._options, w), this._output.raw = this._options.test_output_raw, this._flag_store = [], this.set_mode(l.BlockStatement);
    var v = new a(s, this._options);
    return this._tokens = v.tokenize(), s;
  }, h.prototype.beautify = function() {
    if (this._options.disabled)
      return this._source_text;
    var s, w = this._reset(this._source_text), v = this._options.eol;
    this._options.eol === "auto" && (v = `
`, w && n.lineBreak.test(w || "") && (v = w.match(n.lineBreak)[0]));
    for (var x = this._tokens.next(); x; )
      this.handle_token(x), this._last_last_text = this._flags.last_token.text, this._flags.last_token = x, x = this._tokens.next();
    return s = this._output.get_code(v), s;
  }, h.prototype.handle_token = function(s, w) {
    s.type === r.START_EXPR ? this.handle_start_expr(s) : s.type === r.END_EXPR ? this.handle_end_expr(s) : s.type === r.START_BLOCK ? this.handle_start_block(s) : s.type === r.END_BLOCK ? this.handle_end_block(s) : s.type === r.WORD ? this.handle_word(s) : s.type === r.RESERVED ? this.handle_word(s) : s.type === r.SEMICOLON ? this.handle_semicolon(s) : s.type === r.STRING ? this.handle_string(s) : s.type === r.EQUALS ? this.handle_equals(s) : s.type === r.OPERATOR ? this.handle_operator(s) : s.type === r.COMMA ? this.handle_comma(s) : s.type === r.BLOCK_COMMENT ? this.handle_block_comment(s, w) : s.type === r.COMMENT ? this.handle_comment(s, w) : s.type === r.DOT ? this.handle_dot(s) : s.type === r.EOF ? this.handle_eof(s) : s.type === r.UNKNOWN ? this.handle_unknown(s, w) : this.handle_unknown(s, w);
  }, h.prototype.handle_whitespace_and_comments = function(s, w) {
    var v = s.newlines, x = this._options.keep_array_indentation && E(this._flags.mode);
    if (s.comments_before)
      for (var C = s.comments_before.next(); C; )
        this.handle_whitespace_and_comments(C, w), this.handle_token(C, w), C = s.comments_before.next();
    if (x)
      for (var B = 0; B < v; B += 1)
        this.print_newline(B > 0, w);
    else if (this._options.max_preserve_newlines && v > this._options.max_preserve_newlines && (v = this._options.max_preserve_newlines), this._options.preserve_newlines && v > 1) {
      this.print_newline(false, w);
      for (var z = 1; z < v; z += 1)
        this.print_newline(true, w);
    }
  };
  var T = ["async", "break", "continue", "return", "throw", "yield"];
  return h.prototype.allow_wrap_or_preserved_newline = function(s, w) {
    if (w = w === void 0 ? false : w, !this._output.just_added_newline()) {
      var v = this._options.preserve_newlines && s.newlines || w, x = o(this._flags.last_token.text, u) || o(s.text, u);
      if (x) {
        var C = o(this._flags.last_token.text, u) && o(this._options.operator_position, f) || o(s.text, u);
        v = v && C;
      }
      if (v)
        this.print_newline(false, true);
      else if (this._options.wrap_line_length) {
        if (d(this._flags.last_token, T))
          return;
        this._output.set_wrap_point();
      }
    }
  }, h.prototype.print_newline = function(s, w) {
    if (!w && this._flags.last_token.text !== ";" && this._flags.last_token.text !== "," && this._flags.last_token.text !== "=" && (this._flags.last_token.type !== r.OPERATOR || this._flags.last_token.text === "--" || this._flags.last_token.text === "++"))
      for (var v = this._tokens.peek(); this._flags.mode === l.Statement && !(this._flags.if_block && b(v, "else")) && !this._flags.do_block; )
        this.restore_mode();
    this._output.add_new_line(s) && (this._flags.multiline_frame = true);
  }, h.prototype.print_token_line_indentation = function(s) {
    this._output.just_added_newline() && (this._options.keep_array_indentation && s.newlines && (s.text === "[" || E(this._flags.mode)) ? (this._output.current_line.set_indent(-1), this._output.current_line.push(s.whitespace_before), this._output.space_before_token = false) : this._output.set_indent(this._flags.indentation_level, this._flags.alignment) && (this._flags.line_indent_level = this._flags.indentation_level));
  }, h.prototype.print_token = function(s) {
    if (this._output.raw) {
      this._output.add_raw_token(s);
      return;
    }
    if (this._options.comma_first && s.previous && s.previous.type === r.COMMA && this._output.just_added_newline() && this._output.previous_line.last() === ",") {
      var w = this._output.previous_line.pop();
      this._output.previous_line.is_empty() && (this._output.previous_line.push(w), this._output.trim(true), this._output.current_line.pop(), this._output.trim()), this.print_token_line_indentation(s), this._output.add_token(","), this._output.space_before_token = true;
    }
    this.print_token_line_indentation(s), this._output.non_breaking_space = true, this._output.add_token(s.text), this._output.previous_token_wrapped && (this._flags.multiline_frame = true);
  }, h.prototype.indent = function() {
    this._flags.indentation_level += 1, this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
  }, h.prototype.deindent = function() {
    this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level) && (this._flags.indentation_level -= 1, this._output.set_indent(this._flags.indentation_level, this._flags.alignment));
  }, h.prototype.set_mode = function(s) {
    this._flags ? (this._flag_store.push(this._flags), this._previous_flags = this._flags) : this._previous_flags = this.create_flags(null, s), this._flags = this.create_flags(this._previous_flags, s), this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
  }, h.prototype.restore_mode = function() {
    this._flag_store.length > 0 && (this._previous_flags = this._flags, this._flags = this._flag_store.pop(), this._previous_flags.mode === l.Statement && m(this._output, this._previous_flags), this._output.set_indent(this._flags.indentation_level, this._flags.alignment));
  }, h.prototype.start_of_object_property = function() {
    return this._flags.parent.mode === l.ObjectLiteral && this._flags.mode === l.Statement && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || d(this._flags.last_token, ["get", "set"]));
  }, h.prototype.start_of_statement = function(s) {
    var w = false;
    return w = w || d(this._flags.last_token, ["var", "let", "const"]) && s.type === r.WORD, w = w || b(this._flags.last_token, "do"), w = w || !(this._flags.parent.mode === l.ObjectLiteral && this._flags.mode === l.Statement) && d(this._flags.last_token, T) && !s.newlines, w = w || b(this._flags.last_token, "else") && !(b(s, "if") && !s.comments_before), w = w || this._flags.last_token.type === r.END_EXPR && (this._previous_flags.mode === l.ForInitializer || this._previous_flags.mode === l.Conditional), w = w || this._flags.last_token.type === r.WORD && this._flags.mode === l.BlockStatement && !this._flags.in_case && !(s.text === "--" || s.text === "++") && this._last_last_text !== "function" && s.type !== r.WORD && s.type !== r.RESERVED, w = w || this._flags.mode === l.ObjectLiteral && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || d(this._flags.last_token, ["get", "set"])), w ? (this.set_mode(l.Statement), this.indent(), this.handle_whitespace_and_comments(s, true), this.start_of_object_property() || this.allow_wrap_or_preserved_newline(
      s,
      d(s, ["do", "for", "if", "while"])
    ), true) : false;
  }, h.prototype.handle_start_expr = function(s) {
    this.start_of_statement(s) || this.handle_whitespace_and_comments(s);
    var w = l.Expression;
    if (s.text === "[") {
      if (this._flags.last_token.type === r.WORD || this._flags.last_token.text === ")") {
        d(this._flags.last_token, _) && (this._output.space_before_token = true), this.print_token(s), this.set_mode(w), this.indent(), this._options.space_in_paren && (this._output.space_before_token = true);
        return;
      }
      w = l.ArrayLiteral, E(this._flags.mode) && (this._flags.last_token.text === "[" || this._flags.last_token.text === "," && (this._last_last_text === "]" || this._last_last_text === "}")) && (this._options.keep_array_indentation || this.print_newline()), o(this._flags.last_token.type, [r.START_EXPR, r.END_EXPR, r.WORD, r.OPERATOR, r.DOT]) || (this._output.space_before_token = true);
    } else {
      if (this._flags.last_token.type === r.RESERVED)
        this._flags.last_token.text === "for" ? (this._output.space_before_token = this._options.space_before_conditional, w = l.ForInitializer) : o(this._flags.last_token.text, ["if", "while", "switch"]) ? (this._output.space_before_token = this._options.space_before_conditional, w = l.Conditional) : o(this._flags.last_word, ["await", "async"]) ? this._output.space_before_token = true : this._flags.last_token.text === "import" && s.whitespace_before === "" ? this._output.space_before_token = false : (o(this._flags.last_token.text, _) || this._flags.last_token.text === "catch") && (this._output.space_before_token = true);
      else if (this._flags.last_token.type === r.EQUALS || this._flags.last_token.type === r.OPERATOR)
        this.start_of_object_property() || this.allow_wrap_or_preserved_newline(s);
      else if (this._flags.last_token.type === r.WORD) {
        this._output.space_before_token = false;
        var v = this._tokens.peek(-3);
        if (this._options.space_after_named_function && v) {
          var x = this._tokens.peek(-4);
          d(v, ["async", "function"]) || v.text === "*" && d(x, ["async", "function"]) ? this._output.space_before_token = true : this._flags.mode === l.ObjectLiteral ? (v.text === "{" || v.text === "," || v.text === "*" && (x.text === "{" || x.text === ",")) && (this._output.space_before_token = true) : this._flags.parent && this._flags.parent.class_start_block && (this._output.space_before_token = true);
        }
      } else
        this.allow_wrap_or_preserved_newline(s);
      (this._flags.last_token.type === r.RESERVED && (this._flags.last_word === "function" || this._flags.last_word === "typeof") || this._flags.last_token.text === "*" && (o(this._last_last_text, ["function", "yield"]) || this._flags.mode === l.ObjectLiteral && o(this._last_last_text, ["{", ","]))) && (this._output.space_before_token = this._options.space_after_anon_function);
    }
    this._flags.last_token.text === ";" || this._flags.last_token.type === r.START_BLOCK ? this.print_newline() : (this._flags.last_token.type === r.END_EXPR || this._flags.last_token.type === r.START_EXPR || this._flags.last_token.type === r.END_BLOCK || this._flags.last_token.text === "." || this._flags.last_token.type === r.COMMA) && this.allow_wrap_or_preserved_newline(s, s.newlines), this.print_token(s), this.set_mode(w), this._options.space_in_paren && (this._output.space_before_token = true), this.indent();
  }, h.prototype.handle_end_expr = function(s) {
    for (; this._flags.mode === l.Statement; )
      this.restore_mode();
    this.handle_whitespace_and_comments(s), this._flags.multiline_frame && this.allow_wrap_or_preserved_newline(
      s,
      s.text === "]" && E(this._flags.mode) && !this._options.keep_array_indentation
    ), this._options.space_in_paren && (this._flags.last_token.type === r.START_EXPR && !this._options.space_in_empty_paren ? (this._output.trim(), this._output.space_before_token = false) : this._output.space_before_token = true), this.deindent(), this.print_token(s), this.restore_mode(), m(this._output, this._previous_flags), this._flags.do_while && this._previous_flags.mode === l.Conditional && (this._previous_flags.mode = l.Expression, this._flags.do_block = false, this._flags.do_while = false);
  }, h.prototype.handle_start_block = function(s) {
    this.handle_whitespace_and_comments(s);
    var w = this._tokens.peek(), v = this._tokens.peek(1);
    this._flags.last_word === "switch" && this._flags.last_token.type === r.END_EXPR ? (this.set_mode(l.BlockStatement), this._flags.in_case_statement = true) : this._flags.case_body ? this.set_mode(l.BlockStatement) : v && (o(v.text, [":", ","]) && o(w.type, [r.STRING, r.WORD, r.RESERVED]) || o(w.text, ["get", "set", "..."]) && o(v.type, [r.WORD, r.RESERVED])) ? o(this._last_last_text, ["class", "interface"]) && !o(v.text, [":", ","]) ? this.set_mode(l.BlockStatement) : this.set_mode(l.ObjectLiteral) : this._flags.last_token.type === r.OPERATOR && this._flags.last_token.text === "=>" ? this.set_mode(l.BlockStatement) : o(this._flags.last_token.type, [r.EQUALS, r.START_EXPR, r.COMMA, r.OPERATOR]) || d(this._flags.last_token, ["return", "throw", "import", "default"]) ? this.set_mode(l.ObjectLiteral) : this.set_mode(l.BlockStatement), this._flags.last_token && d(this._flags.last_token.previous, ["class", "extends"]) && (this._flags.class_start_block = true);
    var x = !w.comments_before && w.text === "}", C = x && this._flags.last_word === "function" && this._flags.last_token.type === r.END_EXPR;
    if (this._options.brace_preserve_inline) {
      var B = 0, z = null;
      this._flags.inline_frame = true;
      do
        if (B += 1, z = this._tokens.peek(B - 1), z.newlines) {
          this._flags.inline_frame = false;
          break;
        }
      while (z.type !== r.EOF && !(z.type === r.END_BLOCK && z.opened === s));
    }
    (this._options.brace_style === "expand" || this._options.brace_style === "none" && s.newlines) && !this._flags.inline_frame ? this._flags.last_token.type !== r.OPERATOR && (C || this._flags.last_token.type === r.EQUALS || d(this._flags.last_token, A) && this._flags.last_token.text !== "else") ? this._output.space_before_token = true : this.print_newline(false, true) : (E(this._previous_flags.mode) && (this._flags.last_token.type === r.START_EXPR || this._flags.last_token.type === r.COMMA) && ((this._flags.last_token.type === r.COMMA || this._options.space_in_paren) && (this._output.space_before_token = true), (this._flags.last_token.type === r.COMMA || this._flags.last_token.type === r.START_EXPR && this._flags.inline_frame) && (this.allow_wrap_or_preserved_newline(s), this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame, this._flags.multiline_frame = false)), this._flags.last_token.type !== r.OPERATOR && this._flags.last_token.type !== r.START_EXPR && (o(this._flags.last_token.type, [r.START_BLOCK, r.SEMICOLON]) && !this._flags.inline_frame ? this.print_newline() : this._output.space_before_token = true)), this.print_token(s), this.indent(), !x && !(this._options.brace_preserve_inline && this._flags.inline_frame) && this.print_newline();
  }, h.prototype.handle_end_block = function(s) {
    for (this.handle_whitespace_and_comments(s); this._flags.mode === l.Statement; )
      this.restore_mode();
    var w = this._flags.last_token.type === r.START_BLOCK;
    this._flags.inline_frame && !w ? this._output.space_before_token = true : this._options.brace_style === "expand" ? w || this.print_newline() : w || (E(this._flags.mode) && this._options.keep_array_indentation ? (this._options.keep_array_indentation = false, this.print_newline(), this._options.keep_array_indentation = true) : this.print_newline()), this.restore_mode(), this.print_token(s);
  }, h.prototype.handle_word = function(s) {
    if (s.type === r.RESERVED) {
      if (o(s.text, ["set", "get"]) && this._flags.mode !== l.ObjectLiteral)
        s.type = r.WORD;
      else if (s.text === "import" && o(this._tokens.peek().text, ["(", "."]))
        s.type = r.WORD;
      else if (o(s.text, ["as", "from"]) && !this._flags.import_block)
        s.type = r.WORD;
      else if (this._flags.mode === l.ObjectLiteral) {
        var w = this._tokens.peek();
        w.text === ":" && (s.type = r.WORD);
      }
    }
    if (this.start_of_statement(s) ? d(this._flags.last_token, ["var", "let", "const"]) && s.type === r.WORD && (this._flags.declaration_statement = true) : s.newlines && !k(this._flags.mode) && (this._flags.last_token.type !== r.OPERATOR || this._flags.last_token.text === "--" || this._flags.last_token.text === "++") && this._flags.last_token.type !== r.EQUALS && (this._options.preserve_newlines || !d(this._flags.last_token, ["var", "let", "const", "set", "get"])) ? (this.handle_whitespace_and_comments(s), this.print_newline()) : this.handle_whitespace_and_comments(s), this._flags.do_block && !this._flags.do_while)
      if (b(s, "while")) {
        this._output.space_before_token = true, this.print_token(s), this._output.space_before_token = true, this._flags.do_while = true;
        return;
      } else
        this.print_newline(), this._flags.do_block = false;
    if (this._flags.if_block)
      if (!this._flags.else_block && b(s, "else"))
        this._flags.else_block = true;
      else {
        for (; this._flags.mode === l.Statement; )
          this.restore_mode();
        this._flags.if_block = false, this._flags.else_block = false;
      }
    if (this._flags.in_case_statement && d(s, ["case", "default"])) {
      this.print_newline(), !this._flags.case_block && (this._flags.case_body || this._options.jslint_happy) && this.deindent(), this._flags.case_body = false, this.print_token(s), this._flags.in_case = true;
      return;
    }
    if ((this._flags.last_token.type === r.COMMA || this._flags.last_token.type === r.START_EXPR || this._flags.last_token.type === r.EQUALS || this._flags.last_token.type === r.OPERATOR) && !this.start_of_object_property() && !(o(this._flags.last_token.text, ["+", "-"]) && this._last_last_text === ":" && this._flags.parent.mode === l.ObjectLiteral) && this.allow_wrap_or_preserved_newline(s), b(s, "function")) {
      (o(this._flags.last_token.text, ["}", ";"]) || this._output.just_added_newline() && !(o(this._flags.last_token.text, ["(", "[", "{", ":", "=", ","]) || this._flags.last_token.type === r.OPERATOR)) && !this._output.just_added_blankline() && !s.comments_before && (this.print_newline(), this.print_newline(true)), this._flags.last_token.type === r.RESERVED || this._flags.last_token.type === r.WORD ? d(this._flags.last_token, ["get", "set", "new", "export"]) || d(this._flags.last_token, T) ? this._output.space_before_token = true : b(this._flags.last_token, "default") && this._last_last_text === "export" ? this._output.space_before_token = true : this._flags.last_token.text === "declare" ? this._output.space_before_token = true : this.print_newline() : this._flags.last_token.type === r.OPERATOR || this._flags.last_token.text === "=" ? this._output.space_before_token = true : !this._flags.multiline_frame && (k(this._flags.mode) || E(this._flags.mode)) || this.print_newline(), this.print_token(s), this._flags.last_word = s.text;
      return;
    }
    var v = "NONE";
    if (this._flags.last_token.type === r.END_BLOCK ? this._previous_flags.inline_frame ? v = "SPACE" : d(s, ["else", "catch", "finally", "from"]) ? this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && s.newlines ? v = "NEWLINE" : (v = "SPACE", this._output.space_before_token = true) : v = "NEWLINE" : this._flags.last_token.type === r.SEMICOLON && this._flags.mode === l.BlockStatement ? v = "NEWLINE" : this._flags.last_token.type === r.SEMICOLON && k(this._flags.mode) ? v = "SPACE" : this._flags.last_token.type === r.STRING ? v = "NEWLINE" : this._flags.last_token.type === r.RESERVED || this._flags.last_token.type === r.WORD || this._flags.last_token.text === "*" && (o(this._last_last_text, ["function", "yield"]) || this._flags.mode === l.ObjectLiteral && o(this._last_last_text, ["{", ","])) ? v = "SPACE" : this._flags.last_token.type === r.START_BLOCK ? this._flags.inline_frame ? v = "SPACE" : v = "NEWLINE" : this._flags.last_token.type === r.END_EXPR && (this._output.space_before_token = true, v = "NEWLINE"), d(s, _) && this._flags.last_token.text !== ")" && (this._flags.inline_frame || this._flags.last_token.text === "else" || this._flags.last_token.text === "export" ? v = "SPACE" : v = "NEWLINE"), d(s, ["else", "catch", "finally"]))
      if ((!(this._flags.last_token.type === r.END_BLOCK && this._previous_flags.mode === l.BlockStatement) || this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && s.newlines) && !this._flags.inline_frame)
        this.print_newline();
      else {
        this._output.trim(true);
        var x = this._output.current_line;
        x.last() !== "}" && this.print_newline(), this._output.space_before_token = true;
      }
    else
      v === "NEWLINE" ? d(this._flags.last_token, A) ? this._output.space_before_token = true : this._flags.last_token.text === "declare" && d(s, ["var", "let", "const"]) ? this._output.space_before_token = true : this._flags.last_token.type !== r.END_EXPR ? (this._flags.last_token.type !== r.START_EXPR || !d(s, ["var", "let", "const"])) && this._flags.last_token.text !== ":" && (b(s, "if") && b(s.previous, "else") ? this._output.space_before_token = true : this.print_newline()) : d(s, _) && this._flags.last_token.text !== ")" && this.print_newline() : this._flags.multiline_frame && E(this._flags.mode) && this._flags.last_token.text === "," && this._last_last_text === "}" ? this.print_newline() : v === "SPACE" && (this._output.space_before_token = true);
    s.previous && (s.previous.type === r.WORD || s.previous.type === r.RESERVED) && (this._output.space_before_token = true), this.print_token(s), this._flags.last_word = s.text, s.type === r.RESERVED && (s.text === "do" ? this._flags.do_block = true : s.text === "if" ? this._flags.if_block = true : s.text === "import" ? this._flags.import_block = true : this._flags.import_block && b(s, "from") && (this._flags.import_block = false));
  }, h.prototype.handle_semicolon = function(s) {
    this.start_of_statement(s) ? this._output.space_before_token = false : this.handle_whitespace_and_comments(s);
    for (var w = this._tokens.peek(); this._flags.mode === l.Statement && !(this._flags.if_block && b(w, "else")) && !this._flags.do_block; )
      this.restore_mode();
    this._flags.import_block && (this._flags.import_block = false), this.print_token(s);
  }, h.prototype.handle_string = function(s) {
    s.text.startsWith("`") && s.newlines === 0 && s.whitespace_before === "" && (s.previous.text === ")" || this._flags.last_token.type === r.WORD) || (this.start_of_statement(s) ? this._output.space_before_token = true : (this.handle_whitespace_and_comments(s), this._flags.last_token.type === r.RESERVED || this._flags.last_token.type === r.WORD || this._flags.inline_frame ? this._output.space_before_token = true : this._flags.last_token.type === r.COMMA || this._flags.last_token.type === r.START_EXPR || this._flags.last_token.type === r.EQUALS || this._flags.last_token.type === r.OPERATOR ? this.start_of_object_property() || this.allow_wrap_or_preserved_newline(s) : s.text.startsWith("`") && this._flags.last_token.type === r.END_EXPR && (s.previous.text === "]" || s.previous.text === ")") && s.newlines === 0 ? this._output.space_before_token = true : this.print_newline())), this.print_token(s);
  }, h.prototype.handle_equals = function(s) {
    this.start_of_statement(s) || this.handle_whitespace_and_comments(s), this._flags.declaration_statement && (this._flags.declaration_assignment = true), this._output.space_before_token = true, this.print_token(s), this._output.space_before_token = true;
  }, h.prototype.handle_comma = function(s) {
    this.handle_whitespace_and_comments(s, true), this.print_token(s), this._output.space_before_token = true, this._flags.declaration_statement ? (k(this._flags.parent.mode) && (this._flags.declaration_assignment = false), this._flags.declaration_assignment ? (this._flags.declaration_assignment = false, this.print_newline(false, true)) : this._options.comma_first && this.allow_wrap_or_preserved_newline(s)) : this._flags.mode === l.ObjectLiteral || this._flags.mode === l.Statement && this._flags.parent.mode === l.ObjectLiteral ? (this._flags.mode === l.Statement && this.restore_mode(), this._flags.inline_frame || this.print_newline()) : this._options.comma_first && this.allow_wrap_or_preserved_newline(s);
  }, h.prototype.handle_operator = function(s) {
    var w = s.text === "*" && (d(this._flags.last_token, ["function", "yield"]) || o(this._flags.last_token.type, [r.START_BLOCK, r.COMMA, r.END_BLOCK, r.SEMICOLON])), v = o(s.text, ["-", "+"]) && (o(this._flags.last_token.type, [r.START_BLOCK, r.START_EXPR, r.EQUALS, r.OPERATOR]) || o(this._flags.last_token.text, _) || this._flags.last_token.text === ",");
    if (!this.start_of_statement(s)) {
      var x = !w;
      this.handle_whitespace_and_comments(s, x);
    }
    if (s.text === "*" && this._flags.last_token.type === r.DOT) {
      this.print_token(s);
      return;
    }
    if (s.text === "::") {
      this.print_token(s);
      return;
    }
    if (o(s.text, ["-", "+"]) && this.start_of_object_property()) {
      this.print_token(s);
      return;
    }
    if (this._flags.last_token.type === r.OPERATOR && o(this._options.operator_position, f) && this.allow_wrap_or_preserved_newline(s), s.text === ":" && this._flags.in_case) {
      this.print_token(s), this._flags.in_case = false, this._flags.case_body = true, this._tokens.peek().type !== r.START_BLOCK ? (this.indent(), this.print_newline(), this._flags.case_block = false) : (this._flags.case_block = true, this._output.space_before_token = true);
      return;
    }
    var C = true, B = true, z = false;
    if (s.text === ":" ? this._flags.ternary_depth === 0 ? C = false : (this._flags.ternary_depth -= 1, z = true) : s.text === "?" && (this._flags.ternary_depth += 1), !v && !w && this._options.preserve_newlines && o(s.text, u)) {
      var O = s.text === ":", S = O && z, I = O && !z;
      switch (this._options.operator_position) {
        case L.before_newline:
          this._output.space_before_token = !I, this.print_token(s), (!O || S) && this.allow_wrap_or_preserved_newline(s), this._output.space_before_token = true;
          return;
        case L.after_newline:
          this._output.space_before_token = true, !O || S ? this._tokens.peek().newlines ? this.print_newline(false, true) : this.allow_wrap_or_preserved_newline(s) : this._output.space_before_token = false, this.print_token(s), this._output.space_before_token = true;
          return;
        case L.preserve_newline:
          I || this.allow_wrap_or_preserved_newline(s), C = !(this._output.just_added_newline() || I), this._output.space_before_token = C, this.print_token(s), this._output.space_before_token = true;
          return;
      }
    }
    if (w) {
      this.allow_wrap_or_preserved_newline(s), C = false;
      var P = this._tokens.peek();
      B = P && o(P.type, [r.WORD, r.RESERVED]);
    } else if (s.text === "...")
      this.allow_wrap_or_preserved_newline(s), C = this._flags.last_token.type === r.START_BLOCK, B = false;
    else if (o(s.text, ["--", "++", "!", "~"]) || v) {
      if ((this._flags.last_token.type === r.COMMA || this._flags.last_token.type === r.START_EXPR) && this.allow_wrap_or_preserved_newline(s), C = false, B = false, s.newlines && (s.text === "--" || s.text === "++" || s.text === "~")) {
        var j = d(this._flags.last_token, A) && s.newlines;
        j && (this._previous_flags.if_block || this._previous_flags.else_block) && this.restore_mode(), this.print_newline(j, true);
      }
      this._flags.last_token.text === ";" && k(this._flags.mode) && (C = true), this._flags.last_token.type === r.RESERVED ? C = true : this._flags.last_token.type === r.END_EXPR ? C = !(this._flags.last_token.text === "]" && (s.text === "--" || s.text === "++")) : this._flags.last_token.type === r.OPERATOR && (C = o(s.text, ["--", "-", "++", "+"]) && o(this._flags.last_token.text, ["--", "-", "++", "+"]), o(s.text, ["+", "-"]) && o(this._flags.last_token.text, ["--", "++"]) && (B = true)), (this._flags.mode === l.BlockStatement && !this._flags.inline_frame || this._flags.mode === l.Statement) && (this._flags.last_token.text === "{" || this._flags.last_token.text === ";") && this.print_newline();
    }
    this._output.space_before_token = this._output.space_before_token || C, this.print_token(s), this._output.space_before_token = B;
  }, h.prototype.handle_block_comment = function(s, w) {
    if (this._output.raw) {
      this._output.add_raw_token(s), s.directives && s.directives.preserve === "end" && (this._output.raw = this._options.test_output_raw);
      return;
    }
    if (s.directives) {
      this.print_newline(false, w), this.print_token(s), s.directives.preserve === "start" && (this._output.raw = true), this.print_newline(false, true);
      return;
    }
    if (!n.newline.test(s.text) && !s.newlines) {
      this._output.space_before_token = true, this.print_token(s), this._output.space_before_token = true;
      return;
    } else
      this.print_block_commment(s, w);
  }, h.prototype.print_block_commment = function(s, w) {
    var v = R(s.text), x, C = false, B = false, z = s.whitespace_before, O = z.length;
    if (this.print_newline(false, w), this.print_token_line_indentation(s), this._output.add_token(v[0]), this.print_newline(false, w), v.length > 1) {
      for (v = v.slice(1), C = c(v, "*"), B = y(v, z), C && (this._flags.alignment = 1), x = 0; x < v.length; x++)
        C ? (this.print_token_line_indentation(s), this._output.add_token(p(v[x]))) : B && v[x] ? (this.print_token_line_indentation(s), this._output.add_token(v[x].substring(O))) : (this._output.current_line.set_indent(-1), this._output.add_token(v[x])), this.print_newline(false, w);
      this._flags.alignment = 0;
    }
  }, h.prototype.handle_comment = function(s, w) {
    s.newlines ? this.print_newline(false, w) : this._output.trim(true), this._output.space_before_token = true, this.print_token(s), this.print_newline(false, w);
  }, h.prototype.handle_dot = function(s) {
    this.start_of_statement(s) || this.handle_whitespace_and_comments(s, true), this._flags.last_token.text.match("^[0-9]+$") && (this._output.space_before_token = true), d(this._flags.last_token, A) ? this._output.space_before_token = false : this.allow_wrap_or_preserved_newline(
      s,
      this._flags.last_token.text === ")" && this._options.break_chained_methods
    ), this._options.unindent_chained_methods && this._output.just_added_newline() && this.deindent(), this.print_token(s);
  }, h.prototype.handle_unknown = function(s, w) {
    this.print_token(s), s.text[s.text.length - 1] === `
` && this.print_newline(false, w);
  }, h.prototype.handle_eof = function(s) {
    for (; this._flags.mode === l.Statement; )
      this.restore_mode();
    this.handle_whitespace_and_comments(s);
  }, dt.Beautifier = h, dt;
}
var fi;
function rs() {
  if (fi)
    return We.exports;
  fi = 1;
  var e = ss().Beautifier, t = qi().Options;
  function n(i, a) {
    var _ = new e(i, a);
    return _.beautify();
  }
  return We.exports = n, We.exports.defaultOptions = function() {
    return new t();
  }, We.exports;
}
var He = { exports: {} };
var kt = {};
var St = {};
var di;
function Vi() {
  if (di)
    return St;
  di = 1;
  var e = Dt().Options;
  function t(n) {
    e.call(this, n, "css"), this.selector_separator_newline = this._get_boolean("selector_separator_newline", true), this.newline_between_rules = this._get_boolean("newline_between_rules", true);
    var i = this._get_boolean("space_around_selector_separator");
    this.space_around_combinator = this._get_boolean("space_around_combinator") || i;
    var a = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
    this.brace_style = "collapse";
    for (var _ = 0; _ < a.length; _++)
      a[_] !== "expand" ? this.brace_style = "collapse" : this.brace_style = a[_];
  }
  return t.prototype = new e(), St.Options = t, St;
}
var gi;
function as() {
  if (gi)
    return kt;
  gi = 1;
  var e = Vi().Options, t = It().Output, n = Bt().InputScanner, i = Pt().Directives, a = new i(/\/\*/, /\*\//), _ = /\r\n|[\r\n]/, u = /\r\n|[\r\n]/g, r = /\s/, o = /(?:\s|\n)+/g, p = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g, g = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
  function b(d, A) {
    this._source_text = d || "", this._options = new e(A), this._ch = null, this._input = null, this.NESTED_AT_RULE = {
      page: true,
      "font-face": true,
      keyframes: true,
      media: true,
      supports: true,
      document: true
    }, this.CONDITIONAL_GROUP_RULE = {
      media: true,
      supports: true,
      document: true
    }, this.NON_SEMICOLON_NEWLINE_PROPERTY = [
      "grid-template-areas",
      "grid-template"
    ];
  }
  return b.prototype.eatString = function(d) {
    var A = "";
    for (this._ch = this._input.next(); this._ch; ) {
      if (A += this._ch, this._ch === "\\")
        A += this._input.next();
      else if (d.indexOf(this._ch) !== -1 || this._ch === `
`)
        break;
      this._ch = this._input.next();
    }
    return A;
  }, b.prototype.eatWhitespace = function(d) {
    for (var A = r.test(this._input.peek()), M = 0; r.test(this._input.peek()); )
      this._ch = this._input.next(), d && this._ch === `
` && (M === 0 || M < this._options.max_preserve_newlines) && (M++, this._output.add_new_line(true));
    return A;
  }, b.prototype.foundNestedPseudoClass = function() {
    for (var d = 0, A = 1, M = this._input.peek(A); M; ) {
      if (M === "{")
        return true;
      if (M === "(")
        d += 1;
      else if (M === ")") {
        if (d === 0)
          return false;
        d -= 1;
      } else if (M === ";" || M === "}")
        return false;
      A++, M = this._input.peek(A);
    }
    return false;
  }, b.prototype.print_string = function(d) {
    this._output.set_indent(this._indentLevel), this._output.non_breaking_space = true, this._output.add_token(d);
  }, b.prototype.preserveSingleSpace = function(d) {
    d && (this._output.space_before_token = true);
  }, b.prototype.indent = function() {
    this._indentLevel++;
  }, b.prototype.outdent = function() {
    this._indentLevel > 0 && this._indentLevel--;
  }, b.prototype.beautify = function() {
    if (this._options.disabled)
      return this._source_text;
    var d = this._source_text, A = this._options.eol;
    A === "auto" && (A = `
`, d && _.test(d || "") && (A = d.match(_)[0])), d = d.replace(u, `
`);
    var M = d.match(/^[\t ]*/)[0];
    this._output = new t(this._options, M), this._input = new n(d), this._indentLevel = 0, this._nestedLevel = 0, this._ch = null;
    for (var L = 0, f = false, l = false, m = false, R = false, E = false, k = this._ch, c = false, y, h, T; y = this._input.read(o), h = y !== "", T = k, this._ch = this._input.next(), this._ch === "\\" && this._input.hasNext() && (this._ch += this._input.next()), k = this._ch, this._ch; )
      if (this._ch === "/" && this._input.peek() === "*") {
        this._output.add_new_line(), this._input.back();
        var s = this._input.read(p), w = a.get_directives(s);
        w && w.ignore === "start" && (s += a.readIgnored(this._input)), this.print_string(s), this.eatWhitespace(true), this._output.add_new_line();
      } else if (this._ch === "/" && this._input.peek() === "/")
        this._output.space_before_token = true, this._input.back(), this.print_string(this._input.read(g)), this.eatWhitespace(true);
      else if (this._ch === "$") {
        this.preserveSingleSpace(h), this.print_string(this._ch);
        var v = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
        v.match(/[ :]$/) && (v = this.eatString(": ").replace(/\s+$/, ""), this.print_string(v), this._output.space_before_token = true), L === 0 && v.indexOf(":") !== -1 && (l = true, this.indent());
      } else if (this._ch === "@")
        if (this.preserveSingleSpace(h), this._input.peek() === "{")
          this.print_string(this._ch + this.eatString("}"));
        else {
          this.print_string(this._ch);
          var x = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
          x.match(/[ :]$/) && (x = this.eatString(": ").replace(/\s+$/, ""), this.print_string(x), this._output.space_before_token = true), L === 0 && x.indexOf(":") !== -1 ? (l = true, this.indent()) : x in this.NESTED_AT_RULE ? (this._nestedLevel += 1, x in this.CONDITIONAL_GROUP_RULE && (m = true)) : L === 0 && !l && (R = true);
        }
      else if (this._ch === "#" && this._input.peek() === "{")
        this.preserveSingleSpace(h), this.print_string(this._ch + this.eatString("}"));
      else if (this._ch === "{")
        l && (l = false, this.outdent()), R = false, m ? (m = false, f = this._indentLevel >= this._nestedLevel) : f = this._indentLevel >= this._nestedLevel - 1, this._options.newline_between_rules && f && this._output.previous_line && this._output.previous_line.item(-1) !== "{" && this._output.ensure_empty_line_above("/", ","), this._output.space_before_token = true, this._options.brace_style === "expand" ? (this._output.add_new_line(), this.print_string(this._ch), this.indent(), this._output.set_indent(this._indentLevel)) : (T === "(" ? this._output.space_before_token = false : T !== "," && this.indent(), this.print_string(this._ch)), this.eatWhitespace(true), this._output.add_new_line();
      else if (this._ch === "}")
        this.outdent(), this._output.add_new_line(), T === "{" && this._output.trim(true), l && (this.outdent(), l = false), this.print_string(this._ch), f = false, this._nestedLevel && this._nestedLevel--, this.eatWhitespace(true), this._output.add_new_line(), this._options.newline_between_rules && !this._output.just_added_blankline() && this._input.peek() !== "}" && this._output.add_new_line(true), this._input.peek() === ")" && (this._output.trim(true), this._options.brace_style === "expand" && this._output.add_new_line(true));
      else if (this._ch === ":") {
        for (var C = 0; C < this.NON_SEMICOLON_NEWLINE_PROPERTY.length; C++)
          if (this._input.lookBack(this.NON_SEMICOLON_NEWLINE_PROPERTY[C])) {
            c = true;
            break;
          }
        (f || m) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !R && L === 0 ? (this.print_string(":"), l || (l = true, this._output.space_before_token = true, this.eatWhitespace(true), this.indent())) : (this._input.lookBack(" ") && (this._output.space_before_token = true), this._input.peek() === ":" ? (this._ch = this._input.next(), this.print_string("::")) : this.print_string(":"));
      } else if (this._ch === '"' || this._ch === "'") {
        var B = T === '"' || T === "'";
        this.preserveSingleSpace(B || h), this.print_string(this._ch + this.eatString(this._ch)), this.eatWhitespace(true);
      } else if (this._ch === ";")
        c = false, L === 0 ? (l && (this.outdent(), l = false), R = false, this.print_string(this._ch), this.eatWhitespace(true), this._input.peek() !== "/" && this._output.add_new_line()) : (this.print_string(this._ch), this.eatWhitespace(true), this._output.space_before_token = true);
      else if (this._ch === "(")
        if (this._input.lookBack("url"))
          this.print_string(this._ch), this.eatWhitespace(), L++, this.indent(), this._ch = this._input.next(), this._ch === ")" || this._ch === '"' || this._ch === "'" ? this._input.back() : this._ch && (this.print_string(this._ch + this.eatString(")")), L && (L--, this.outdent()));
        else {
          var z = false;
          this._input.lookBack("with") && (z = true), this.preserveSingleSpace(h || z), this.print_string(this._ch), l && T === "$" && this._options.selector_separator_newline ? (this._output.add_new_line(), E = true) : (this.eatWhitespace(), L++, this.indent());
        }
      else if (this._ch === ")")
        L && (L--, this.outdent()), E && this._input.peek() === ";" && this._options.selector_separator_newline && (E = false, this.outdent(), this._output.add_new_line()), this.print_string(this._ch);
      else if (this._ch === ",")
        this.print_string(this._ch), this.eatWhitespace(true), this._options.selector_separator_newline && (!l || E) && L === 0 && !R ? this._output.add_new_line() : this._output.space_before_token = true;
      else if ((this._ch === ">" || this._ch === "+" || this._ch === "~") && !l && L === 0)
        this._options.space_around_combinator ? (this._output.space_before_token = true, this.print_string(this._ch), this._output.space_before_token = true) : (this.print_string(this._ch), this.eatWhitespace(), this._ch && r.test(this._ch) && (this._ch = ""));
      else if (this._ch === "]")
        this.print_string(this._ch);
      else if (this._ch === "[")
        this.preserveSingleSpace(h), this.print_string(this._ch);
      else if (this._ch === "=")
        this.eatWhitespace(), this.print_string("="), r.test(this._ch) && (this._ch = "");
      else if (this._ch === "!" && !this._input.lookBack("\\"))
        this._output.space_before_token = true, this.print_string(this._ch);
      else {
        var O = T === '"' || T === "'";
        this.preserveSingleSpace(O || h), this.print_string(this._ch), !this._output.just_added_newline() && this._input.peek() === `
` && c && this._output.add_new_line();
      }
    var S = this._output.get_code(A);
    return S;
  }, kt.Beautifier = b, kt;
}
var mi;
function os() {
  if (mi)
    return He.exports;
  mi = 1;
  var e = as().Beautifier, t = Vi().Options;
  function n(i, a) {
    var _ = new e(i, a);
    return _.beautify();
  }
  return He.exports = n, He.exports.defaultOptions = function() {
    return new t();
  }, He.exports;
}
var qe = { exports: {} };
var Rt = {};
var At = {};
var bi;
function Zi() {
  if (bi)
    return At;
  bi = 1;
  var e = Dt().Options;
  function t(n) {
    e.call(this, n, "html"), this.templating.length === 1 && this.templating[0] === "auto" && (this.templating = ["django", "erb", "handlebars", "php"]), this.indent_inner_html = this._get_boolean("indent_inner_html"), this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", true), this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", true), this.indent_handlebars = this._get_boolean("indent_handlebars", true), this.wrap_attributes = this._get_selection(
      "wrap_attributes",
      ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]
    ), this.wrap_attributes_min_attrs = this._get_number("wrap_attributes_min_attrs", 2), this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size), this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]), this.inline = this._get_array("inline", [
      "a",
      "abbr",
      "area",
      "audio",
      "b",
      "bdi",
      "bdo",
      "br",
      "button",
      "canvas",
      "cite",
      "code",
      "data",
      "datalist",
      "del",
      "dfn",
      "em",
      "embed",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "keygen",
      "label",
      "map",
      "mark",
      "math",
      "meter",
      "noscript",
      "object",
      "output",
      "progress",
      "q",
      "ruby",
      "s",
      "samp",
      "select",
      "small",
      "span",
      "strong",
      "sub",
      "sup",
      "svg",
      "template",
      "textarea",
      "time",
      "u",
      "var",
      "video",
      "wbr",
      "text",
      "acronym",
      "big",
      "strike",
      "tt"
    ]), this.inline_custom_elements = this._get_boolean("inline_custom_elements", true), this.void_elements = this._get_array("void_elements", [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "menuitem",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
      "!doctype",
      "?xml",
      "basefont",
      "isindex"
    ]), this.unformatted = this._get_array("unformatted", []), this.content_unformatted = this._get_array("content_unformatted", [
      "pre",
      "textarea"
    ]), this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter"), this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
  }
  return t.prototype = new e(), At.Options = t, At;
}
var Xe = {};
var yi;
function vi() {
  if (yi)
    return Xe;
  yi = 1;
  var e = et().Tokenizer, t = et().TOKEN, n = Pt().Directives, i = Xi().TemplatablePattern, a = rt().Pattern, _ = {
    TAG_OPEN: "TK_TAG_OPEN",
    TAG_CLOSE: "TK_TAG_CLOSE",
    CONTROL_FLOW_OPEN: "TK_CONTROL_FLOW_OPEN",
    CONTROL_FLOW_CLOSE: "TK_CONTROL_FLOW_CLOSE",
    ATTRIBUTE: "TK_ATTRIBUTE",
    EQUALS: "TK_EQUALS",
    VALUE: "TK_VALUE",
    COMMENT: "TK_COMMENT",
    TEXT: "TK_TEXT",
    UNKNOWN: "TK_UNKNOWN",
    START: t.START,
    RAW: t.RAW,
    EOF: t.EOF
  }, u = new n(/<\!--/, /-->/), r = function(o, p) {
    e.call(this, o, p), this._current_tag_name = "";
    var g = new i(this._input).read_options(this._options), b = new a(this._input);
    if (this.__patterns = {
      word: g.until(/[\n\r\t <]/),
      word_control_flow_close_excluded: g.until(/[\n\r\t <}]/),
      single_quote: g.until_after(/'/),
      double_quote: g.until_after(/"/),
      attribute: g.until(/[\n\r\t =>]|\/>/),
      element_name: g.until(/[\n\r\t >\/]/),
      angular_control_flow_start: b.matching(/\@[a-zA-Z]+[^({]*[({]/),
      handlebars_comment: b.starting_with(/{{!--/).until_after(/--}}/),
      handlebars: b.starting_with(/{{/).until_after(/}}/),
      handlebars_open: b.until(/[\n\r\t }]/),
      handlebars_raw_close: b.until(/}}/),
      comment: b.starting_with(/<!--/).until_after(/-->/),
      cdata: b.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
      conditional_comment: b.starting_with(/<!\[/).until_after(/]>/),
      processing: b.starting_with(/<\?/).until_after(/\?>/)
    }, this._options.indent_handlebars && (this.__patterns.word = this.__patterns.word.exclude("handlebars"), this.__patterns.word_control_flow_close_excluded = this.__patterns.word_control_flow_close_excluded.exclude("handlebars")), this._unformatted_content_delimiter = null, this._options.unformatted_content_delimiter) {
      var d = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
      this.__patterns.unformatted_content_delimiter = b.matching(d).until_after(d);
    }
  };
  return r.prototype = new e(), r.prototype._is_comment = function(o) {
    return false;
  }, r.prototype._is_opening = function(o) {
    return o.type === _.TAG_OPEN || o.type === _.CONTROL_FLOW_OPEN;
  }, r.prototype._is_closing = function(o, p) {
    return o.type === _.TAG_CLOSE && p && ((o.text === ">" || o.text === "/>") && p.text[0] === "<" || o.text === "}}" && p.text[0] === "{" && p.text[1] === "{") || o.type === _.CONTROL_FLOW_CLOSE && o.text === "}" && p.text.endsWith("{");
  }, r.prototype._reset = function() {
    this._current_tag_name = "";
  }, r.prototype._get_next_token = function(o, p) {
    var g = null;
    this._readWhitespace();
    var b = this._input.peek();
    return b === null ? this._create_token(_.EOF, "") : (g = g || this._read_open_handlebars(b, p), g = g || this._read_attribute(b, o, p), g = g || this._read_close(b, p), g = g || this._read_control_flows(b, p), g = g || this._read_raw_content(b, o, p), g = g || this._read_content_word(b, p), g = g || this._read_comment_or_cdata(b), g = g || this._read_processing(b), g = g || this._read_open(b, p), g = g || this._create_token(_.UNKNOWN, this._input.next()), g);
  }, r.prototype._read_comment_or_cdata = function(o) {
    var p = null, g = null, b = null;
    if (o === "<") {
      var d = this._input.peek(1);
      d === "!" && (g = this.__patterns.comment.read(), g ? (b = u.get_directives(g), b && b.ignore === "start" && (g += u.readIgnored(this._input))) : g = this.__patterns.cdata.read()), g && (p = this._create_token(_.COMMENT, g), p.directives = b);
    }
    return p;
  }, r.prototype._read_processing = function(o) {
    var p = null, g = null, b = null;
    if (o === "<") {
      var d = this._input.peek(1);
      (d === "!" || d === "?") && (g = this.__patterns.conditional_comment.read(), g = g || this.__patterns.processing.read()), g && (p = this._create_token(_.COMMENT, g), p.directives = b);
    }
    return p;
  }, r.prototype._read_open = function(o, p) {
    var g = null, b = null;
    return (!p || p.type === _.CONTROL_FLOW_OPEN) && o === "<" && (g = this._input.next(), this._input.peek() === "/" && (g += this._input.next()), g += this.__patterns.element_name.read(), b = this._create_token(_.TAG_OPEN, g)), b;
  }, r.prototype._read_open_handlebars = function(o, p) {
    var g = null, b = null;
    return (!p || p.type === _.CONTROL_FLOW_OPEN) && this._options.indent_handlebars && o === "{" && this._input.peek(1) === "{" && (this._input.peek(2) === "!" ? (g = this.__patterns.handlebars_comment.read(), g = g || this.__patterns.handlebars.read(), b = this._create_token(_.COMMENT, g)) : (g = this.__patterns.handlebars_open.read(), b = this._create_token(_.TAG_OPEN, g))), b;
  }, r.prototype._read_control_flows = function(o, p) {
    var g = "", b = null;
    if (!this._options.templating.includes("angular") || !this._options.indent_handlebars)
      return b;
    if (o === "@") {
      if (g = this.__patterns.angular_control_flow_start.read(), g === "")
        return b;
      for (var d = g.endsWith("(") ? 1 : 0, A = 0; !(g.endsWith("{") && d === A); ) {
        var M = this._input.next();
        if (M === null)
          break;
        M === "(" ? d++ : M === ")" && A++, g += M;
      }
      b = this._create_token(_.CONTROL_FLOW_OPEN, g);
    } else
      o === "}" && p && p.type === _.CONTROL_FLOW_OPEN && (g = this._input.next(), b = this._create_token(_.CONTROL_FLOW_CLOSE, g));
    return b;
  }, r.prototype._read_close = function(o, p) {
    var g = null, b = null;
    return p && p.type === _.TAG_OPEN && (p.text[0] === "<" && (o === ">" || o === "/" && this._input.peek(1) === ">") ? (g = this._input.next(), o === "/" && (g += this._input.next()), b = this._create_token(_.TAG_CLOSE, g)) : p.text[0] === "{" && o === "}" && this._input.peek(1) === "}" && (this._input.next(), this._input.next(), b = this._create_token(_.TAG_CLOSE, "}}"))), b;
  }, r.prototype._read_attribute = function(o, p, g) {
    var b = null, d = "";
    if (g && g.text[0] === "<")
      if (o === "=")
        b = this._create_token(_.EQUALS, this._input.next());
      else if (o === '"' || o === "'") {
        var A = this._input.next();
        o === '"' ? A += this.__patterns.double_quote.read() : A += this.__patterns.single_quote.read(), b = this._create_token(_.VALUE, A);
      } else
        d = this.__patterns.attribute.read(), d && (p.type === _.EQUALS ? b = this._create_token(_.VALUE, d) : b = this._create_token(_.ATTRIBUTE, d));
    return b;
  }, r.prototype._is_content_unformatted = function(o) {
    return this._options.void_elements.indexOf(o) === -1 && (this._options.content_unformatted.indexOf(o) !== -1 || this._options.unformatted.indexOf(o) !== -1);
  }, r.prototype._read_raw_content = function(o, p, g) {
    var b = "";
    if (g && g.text[0] === "{")
      b = this.__patterns.handlebars_raw_close.read();
    else if (p.type === _.TAG_CLOSE && p.opened.text[0] === "<" && p.text[0] !== "/") {
      var d = p.opened.text.substr(1).toLowerCase();
      if (d === "script" || d === "style") {
        var A = this._read_comment_or_cdata(o);
        if (A)
          return A.type = _.TEXT, A;
        b = this._input.readUntil(new RegExp("</" + d + "[\\n\\r\\t ]*?>", "ig"));
      } else
        this._is_content_unformatted(d) && (b = this._input.readUntil(new RegExp("</" + d + "[\\n\\r\\t ]*?>", "ig")));
    }
    return b ? this._create_token(_.TEXT, b) : null;
  }, r.prototype._read_content_word = function(o, p) {
    var g = "";
    if (this._options.unformatted_content_delimiter && o === this._options.unformatted_content_delimiter[0] && (g = this.__patterns.unformatted_content_delimiter.read()), g || (g = p && p.type === _.CONTROL_FLOW_OPEN ? this.__patterns.word_control_flow_close_excluded.read() : this.__patterns.word.read()), g)
      return this._create_token(_.TEXT, g);
  }, Xe.Tokenizer = r, Xe.TOKEN = _, Xe;
}
var wi;
function ls() {
  if (wi)
    return Rt;
  wi = 1;
  var e = Zi().Options, t = It().Output, n = vi().Tokenizer, i = vi().TOKEN, a = /\r\n|[\r\n]/, _ = /\r\n|[\r\n]/g, u = function(f, l) {
    this.indent_level = 0, this.alignment_size = 0, this.max_preserve_newlines = f.max_preserve_newlines, this.preserve_newlines = f.preserve_newlines, this._output = new t(f, l);
  };
  u.prototype.current_line_has_match = function(f) {
    return this._output.current_line.has_match(f);
  }, u.prototype.set_space_before_token = function(f, l) {
    this._output.space_before_token = f, this._output.non_breaking_space = l;
  }, u.prototype.set_wrap_point = function() {
    this._output.set_indent(this.indent_level, this.alignment_size), this._output.set_wrap_point();
  }, u.prototype.add_raw_token = function(f) {
    this._output.add_raw_token(f);
  }, u.prototype.print_preserved_newlines = function(f) {
    var l = 0;
    f.type !== i.TEXT && f.previous.type !== i.TEXT && (l = f.newlines ? 1 : 0), this.preserve_newlines && (l = f.newlines < this.max_preserve_newlines + 1 ? f.newlines : this.max_preserve_newlines + 1);
    for (var m = 0; m < l; m++)
      this.print_newline(m > 0);
    return l !== 0;
  }, u.prototype.traverse_whitespace = function(f) {
    return f.whitespace_before || f.newlines ? (this.print_preserved_newlines(f) || (this._output.space_before_token = true), true) : false;
  }, u.prototype.previous_token_wrapped = function() {
    return this._output.previous_token_wrapped;
  }, u.prototype.print_newline = function(f) {
    this._output.add_new_line(f);
  }, u.prototype.print_token = function(f) {
    f.text && (this._output.set_indent(this.indent_level, this.alignment_size), this._output.add_token(f.text));
  }, u.prototype.indent = function() {
    this.indent_level++;
  }, u.prototype.deindent = function() {
    this.indent_level > 0 && (this.indent_level--, this._output.set_indent(this.indent_level, this.alignment_size));
  }, u.prototype.get_full_indent = function(f) {
    return f = this.indent_level + (f || 0), f < 1 ? "" : this._output.get_indent_string(f);
  };
  var r = function(f) {
    for (var l = null, m = f.next; m.type !== i.EOF && f.closed !== m; ) {
      if (m.type === i.ATTRIBUTE && m.text === "type") {
        m.next && m.next.type === i.EQUALS && m.next.next && m.next.next.type === i.VALUE && (l = m.next.next.text);
        break;
      }
      m = m.next;
    }
    return l;
  }, o = function(f, l) {
    var m = null, R = null;
    return l.closed ? (f === "script" ? m = "text/javascript" : f === "style" && (m = "text/css"), m = r(l) || m, m.search("text/css") > -1 ? R = "css" : m.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1 ? R = "javascript" : m.search(/(text|application|dojo)\/(x-)?(html)/) > -1 ? R = "html" : m.search(/test\/null/) > -1 && (R = "null"), R) : null;
  };
  function p(f, l) {
    return l.indexOf(f) !== -1;
  }
  function g(f, l, m) {
    this.parent = f || null, this.tag = l ? l.tag_name : "", this.indent_level = m || 0, this.parser_token = l || null;
  }
  function b(f) {
    this._printer = f, this._current_frame = null;
  }
  b.prototype.get_parser_token = function() {
    return this._current_frame ? this._current_frame.parser_token : null;
  }, b.prototype.record_tag = function(f) {
    var l = new g(this._current_frame, f, this._printer.indent_level);
    this._current_frame = l;
  }, b.prototype._try_pop_frame = function(f) {
    var l = null;
    return f && (l = f.parser_token, this._printer.indent_level = f.indent_level, this._current_frame = f.parent), l;
  }, b.prototype._get_frame = function(f, l) {
    for (var m = this._current_frame; m && f.indexOf(m.tag) === -1; ) {
      if (l && l.indexOf(m.tag) !== -1) {
        m = null;
        break;
      }
      m = m.parent;
    }
    return m;
  }, b.prototype.try_pop = function(f, l) {
    var m = this._get_frame([f], l);
    return this._try_pop_frame(m);
  }, b.prototype.indent_to_tag = function(f) {
    var l = this._get_frame(f);
    l && (this._printer.indent_level = l.indent_level);
  };
  function d(f, l, m, R) {
    this._source_text = f || "", l = l || {}, this._js_beautify = m, this._css_beautify = R, this._tag_stack = null;
    var E = new e(l, "html");
    this._options = E, this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 5) === "force", this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline", this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned", this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple", this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, 8) === "preserve", this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
  }
  d.prototype.beautify = function() {
    if (this._options.disabled)
      return this._source_text;
    var f = this._source_text, l = this._options.eol;
    this._options.eol === "auto" && (l = `
`, f && a.test(f) && (l = f.match(a)[0])), f = f.replace(_, `
`);
    var m = f.match(/^[\t ]*/)[0], R = {
      text: "",
      type: ""
    }, E = new A(), k = new u(this._options, m), c = new n(f, this._options).tokenize();
    this._tag_stack = new b(k);
    for (var y = null, h = c.next(); h.type !== i.EOF; )
      h.type === i.TAG_OPEN || h.type === i.COMMENT ? (y = this._handle_tag_open(k, h, E, R, c), E = y) : h.type === i.ATTRIBUTE || h.type === i.EQUALS || h.type === i.VALUE || h.type === i.TEXT && !E.tag_complete ? y = this._handle_inside_tag(k, h, E, R) : h.type === i.TAG_CLOSE ? y = this._handle_tag_close(k, h, E) : h.type === i.TEXT ? y = this._handle_text(k, h, E) : h.type === i.CONTROL_FLOW_OPEN ? y = this._handle_control_flow_open(k, h) : h.type === i.CONTROL_FLOW_CLOSE ? y = this._handle_control_flow_close(k, h) : k.add_raw_token(h), R = y, h = c.next();
    var T = k._output.get_code(l);
    return T;
  }, d.prototype._handle_control_flow_open = function(f, l) {
    var m = {
      text: l.text,
      type: l.type
    };
    return f.set_space_before_token(l.newlines || l.whitespace_before !== "", true), l.newlines ? f.print_preserved_newlines(l) : f.set_space_before_token(l.newlines || l.whitespace_before !== "", true), f.print_token(l), f.indent(), m;
  }, d.prototype._handle_control_flow_close = function(f, l) {
    var m = {
      text: l.text,
      type: l.type
    };
    return f.deindent(), l.newlines ? f.print_preserved_newlines(l) : f.set_space_before_token(l.newlines || l.whitespace_before !== "", true), f.print_token(l), m;
  }, d.prototype._handle_tag_close = function(f, l, m) {
    var R = {
      text: l.text,
      type: l.type
    };
    return f.alignment_size = 0, m.tag_complete = true, f.set_space_before_token(l.newlines || l.whitespace_before !== "", true), m.is_unformatted ? f.add_raw_token(l) : (m.tag_start_char === "<" && (f.set_space_before_token(l.text[0] === "/", true), this._is_wrap_attributes_force_expand_multiline && m.has_wrapped_attrs && f.print_newline(false)), f.print_token(l)), m.indent_content && !(m.is_unformatted || m.is_content_unformatted) && (f.indent(), m.indent_content = false), !m.is_inline_element && !(m.is_unformatted || m.is_content_unformatted) && f.set_wrap_point(), R;
  }, d.prototype._handle_inside_tag = function(f, l, m, R) {
    var E = m.has_wrapped_attrs, k = {
      text: l.text,
      type: l.type
    };
    return f.set_space_before_token(l.newlines || l.whitespace_before !== "", true), m.is_unformatted ? f.add_raw_token(l) : m.tag_start_char === "{" && l.type === i.TEXT ? f.print_preserved_newlines(l) ? (l.newlines = 0, f.add_raw_token(l)) : f.print_token(l) : (l.type === i.ATTRIBUTE ? f.set_space_before_token(true) : (l.type === i.EQUALS || l.type === i.VALUE && l.previous.type === i.EQUALS) && f.set_space_before_token(false), l.type === i.ATTRIBUTE && m.tag_start_char === "<" && ((this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) && (f.traverse_whitespace(l), E = E || l.newlines !== 0), this._is_wrap_attributes_force && m.attr_count >= this._options.wrap_attributes_min_attrs && (R.type !== i.TAG_OPEN || this._is_wrap_attributes_force_expand_multiline) && (f.print_newline(false), E = true)), f.print_token(l), E = E || f.previous_token_wrapped(), m.has_wrapped_attrs = E), k;
  }, d.prototype._handle_text = function(f, l, m) {
    var R = {
      text: l.text,
      type: "TK_CONTENT"
    };
    return m.custom_beautifier_name ? this._print_custom_beatifier_text(f, l, m) : m.is_unformatted || m.is_content_unformatted ? f.add_raw_token(l) : (f.traverse_whitespace(l), f.print_token(l)), R;
  }, d.prototype._print_custom_beatifier_text = function(f, l, m) {
    var R = this;
    if (l.text !== "") {
      var E = l.text, k, c = 1, y = "", h = "";
      m.custom_beautifier_name === "javascript" && typeof this._js_beautify == "function" ? k = this._js_beautify : m.custom_beautifier_name === "css" && typeof this._css_beautify == "function" ? k = this._css_beautify : m.custom_beautifier_name === "html" && (k = function(C, B) {
        var z = new d(C, B, R._js_beautify, R._css_beautify);
        return z.beautify();
      }), this._options.indent_scripts === "keep" ? c = 0 : this._options.indent_scripts === "separate" && (c = -f.indent_level);
      var T = f.get_full_indent(c);
      if (E = E.replace(/\n[ \t]*$/, ""), m.custom_beautifier_name !== "html" && E[0] === "<" && E.match(/^(<!--|<!\[CDATA\[)/)) {
        var s = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(E);
        if (!s) {
          f.add_raw_token(l);
          return;
        }
        y = T + s[1] + `
`, E = s[4], s[5] && (h = T + s[5]), E = E.replace(/\n[ \t]*$/, ""), (s[2] || s[3].indexOf(`
`) !== -1) && (s = s[3].match(/[ \t]+$/), s && (l.whitespace_before = s[0]));
      }
      if (E)
        if (k) {
          var w = function() {
            this.eol = `
`;
          };
          w.prototype = this._options.raw_options;
          var v = new w();
          E = k(T + E, v);
        } else {
          var x = l.whitespace_before;
          x && (E = E.replace(new RegExp(`
(` + x + ")?", "g"), `
`)), E = T + E.replace(/\n/g, `
` + T);
        }
      y && (E ? E = y + E + `
` + h : E = y + h), f.print_newline(false), E && (l.text = E, l.whitespace_before = "", l.newlines = 0, f.add_raw_token(l), f.print_newline(true));
    }
  }, d.prototype._handle_tag_open = function(f, l, m, R, E) {
    var k = this._get_tag_open_token(l);
    if ((m.is_unformatted || m.is_content_unformatted) && !m.is_empty_element && l.type === i.TAG_OPEN && !k.is_start_tag ? (f.add_raw_token(l), k.start_tag_token = this._tag_stack.try_pop(k.tag_name)) : (f.traverse_whitespace(l), this._set_tag_position(f, l, k, m, R), k.is_inline_element || f.set_wrap_point(), f.print_token(l)), k.is_start_tag && this._is_wrap_attributes_force) {
      var c = 0, y;
      do
        y = E.peek(c), y.type === i.ATTRIBUTE && (k.attr_count += 1), c += 1;
      while (y.type !== i.EOF && y.type !== i.TAG_CLOSE);
    }
    return (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) && (k.alignment_size = l.text.length + 1), !k.tag_complete && !k.is_unformatted && (f.alignment_size = k.alignment_size), k;
  };
  var A = function(f, l) {
    if (this.parent = f || null, this.text = "", this.type = "TK_TAG_OPEN", this.tag_name = "", this.is_inline_element = false, this.is_unformatted = false, this.is_content_unformatted = false, this.is_empty_element = false, this.is_start_tag = false, this.is_end_tag = false, this.indent_content = false, this.multiline_content = false, this.custom_beautifier_name = null, this.start_tag_token = null, this.attr_count = 0, this.has_wrapped_attrs = false, this.alignment_size = 0, this.tag_complete = false, this.tag_start_char = "", this.tag_check = "", !l)
      this.tag_complete = true;
    else {
      var m;
      this.tag_start_char = l.text[0], this.text = l.text, this.tag_start_char === "<" ? (m = l.text.match(/^<([^\s>]*)/), this.tag_check = m ? m[1] : "") : (m = l.text.match(/^{{~?(?:[\^]|#\*?)?([^\s}]+)/), this.tag_check = m ? m[1] : "", (l.text.startsWith("{{#>") || l.text.startsWith("{{~#>")) && this.tag_check[0] === ">" && (this.tag_check === ">" && l.next !== null ? this.tag_check = l.next.text.split(" ")[0] : this.tag_check = l.text.split(">")[1])), this.tag_check = this.tag_check.toLowerCase(), l.type === i.COMMENT && (this.tag_complete = true), this.is_start_tag = this.tag_check.charAt(0) !== "/", this.tag_name = this.is_start_tag ? this.tag_check : this.tag_check.substr(1), this.is_end_tag = !this.is_start_tag || l.closed && l.closed.text === "/>";
      var R = 2;
      this.tag_start_char === "{" && this.text.length >= 3 && this.text.charAt(2) === "~" && (R = 3), this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(R)));
    }
  };
  d.prototype._get_tag_open_token = function(f) {
    var l = new A(this._tag_stack.get_parser_token(), f);
    return l.alignment_size = this._options.wrap_attributes_indent_size, l.is_end_tag = l.is_end_tag || p(l.tag_check, this._options.void_elements), l.is_empty_element = l.tag_complete || l.is_start_tag && l.is_end_tag, l.is_unformatted = !l.tag_complete && p(l.tag_check, this._options.unformatted), l.is_content_unformatted = !l.is_empty_element && p(l.tag_check, this._options.content_unformatted), l.is_inline_element = p(l.tag_name, this._options.inline) || this._options.inline_custom_elements && l.tag_name.includes("-") || l.tag_start_char === "{", l;
  }, d.prototype._set_tag_position = function(f, l, m, R, E) {
    if (m.is_empty_element || (m.is_end_tag ? m.start_tag_token = this._tag_stack.try_pop(m.tag_name) : (this._do_optional_end_element(m) && (m.is_inline_element || f.print_newline(false)), this._tag_stack.record_tag(m), (m.tag_name === "script" || m.tag_name === "style") && !(m.is_unformatted || m.is_content_unformatted) && (m.custom_beautifier_name = o(m.tag_check, l)))), p(m.tag_check, this._options.extra_liners) && (f.print_newline(false), f._output.just_added_blankline() || f.print_newline(true)), m.is_empty_element) {
      if (m.tag_start_char === "{" && m.tag_check === "else") {
        this._tag_stack.indent_to_tag(["if", "unless", "each"]), m.indent_content = true;
        var k = f.current_line_has_match(/{{#if/);
        k || f.print_newline(false);
      }
      m.tag_name === "!--" && E.type === i.TAG_CLOSE && R.is_end_tag && m.text.indexOf(`
`) === -1 || (m.is_inline_element || m.is_unformatted || f.print_newline(false), this._calcluate_parent_multiline(f, m));
    } else if (m.is_end_tag) {
      var c = false;
      c = m.start_tag_token && m.start_tag_token.multiline_content, c = c || !m.is_inline_element && !(R.is_inline_element || R.is_unformatted) && !(E.type === i.TAG_CLOSE && m.start_tag_token === R) && E.type !== "TK_CONTENT", (m.is_content_unformatted || m.is_unformatted) && (c = false), c && f.print_newline(false);
    } else
      m.indent_content = !m.custom_beautifier_name, m.tag_start_char === "<" && (m.tag_name === "html" ? m.indent_content = this._options.indent_inner_html : m.tag_name === "head" ? m.indent_content = this._options.indent_head_inner_html : m.tag_name === "body" && (m.indent_content = this._options.indent_body_inner_html)), !(m.is_inline_element || m.is_unformatted) && (E.type !== "TK_CONTENT" || m.is_content_unformatted) && f.print_newline(false), this._calcluate_parent_multiline(f, m);
  }, d.prototype._calcluate_parent_multiline = function(f, l) {
    l.parent && f._output.just_added_newline() && !((l.is_inline_element || l.is_unformatted) && l.parent.is_inline_element) && (l.parent.multiline_content = true);
  };
  var M = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "menu", "nav", "ol", "p", "pre", "section", "table", "ul"], L = ["a", "audio", "del", "ins", "map", "noscript", "video"];
  return d.prototype._do_optional_end_element = function(f) {
    var l = null;
    if (!(f.is_empty_element || !f.is_start_tag || !f.parent)) {
      if (f.tag_name === "body")
        l = l || this._tag_stack.try_pop("head");
      else if (f.tag_name === "li")
        l = l || this._tag_stack.try_pop("li", ["ol", "ul", "menu"]);
      else if (f.tag_name === "dd" || f.tag_name === "dt")
        l = l || this._tag_stack.try_pop("dt", ["dl"]), l = l || this._tag_stack.try_pop("dd", ["dl"]);
      else if (f.parent.tag_name === "p" && M.indexOf(f.tag_name) !== -1) {
        var m = f.parent.parent;
        (!m || L.indexOf(m.tag_name) === -1) && (l = l || this._tag_stack.try_pop("p"));
      } else
        f.tag_name === "rp" || f.tag_name === "rt" ? (l = l || this._tag_stack.try_pop("rt", ["ruby", "rtc"]), l = l || this._tag_stack.try_pop("rp", ["ruby", "rtc"])) : f.tag_name === "optgroup" ? l = l || this._tag_stack.try_pop("optgroup", ["select"]) : f.tag_name === "option" ? l = l || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]) : f.tag_name === "colgroup" ? l = l || this._tag_stack.try_pop("caption", ["table"]) : f.tag_name === "thead" ? (l = l || this._tag_stack.try_pop("caption", ["table"]), l = l || this._tag_stack.try_pop("colgroup", ["table"])) : f.tag_name === "tbody" || f.tag_name === "tfoot" ? (l = l || this._tag_stack.try_pop("caption", ["table"]), l = l || this._tag_stack.try_pop("colgroup", ["table"]), l = l || this._tag_stack.try_pop("thead", ["table"]), l = l || this._tag_stack.try_pop("tbody", ["table"])) : f.tag_name === "tr" ? (l = l || this._tag_stack.try_pop("caption", ["table"]), l = l || this._tag_stack.try_pop("colgroup", ["table"]), l = l || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"])) : (f.tag_name === "th" || f.tag_name === "td") && (l = l || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]), l = l || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]));
      return f.parent = this._tag_stack.get_parser_token(), l;
    }
  }, Rt.Beautifier = d, Rt;
}
var Ei;
function _s() {
  if (Ei)
    return qe.exports;
  Ei = 1;
  var e = ls().Beautifier, t = Zi().Options;
  function n(i, a, _, u) {
    var r = new e(i, a, _, u);
    return r.beautify();
  }
  return qe.exports = n, qe.exports.defaultOptions = function() {
    return new t();
  }, qe.exports;
}
var xi;
function us() {
  if (xi)
    return Le;
  xi = 1;
  var e = rs(), t = os(), n = _s();
  function i(a, _, u, r) {
    return u = u || e, r = r || t, n(a, _, u, r);
  }
  return i.defaultOptions = n.defaultOptions, Le.js = e, Le.css = t, Le.html = i, Le;
}
(function(e) {
  function t(n, i, a) {
    var _ = function(u, r) {
      return n.js_beautify(u, r);
    };
    return _.js = n.js_beautify, _.css = i.css_beautify, _.html = a.html_beautify, _.js_beautify = n.js_beautify, _.css_beautify = i.css_beautify, _.html_beautify = a.html_beautify, _;
  }
  (function(n) {
    var i = us();
    i.js_beautify = i.js, i.css_beautify = i.css, i.html_beautify = i.html, n.exports = t(i, i, i);
  })(e);
})(Ki);
var Oi;
var cs = function(t) {
  return typeof t == "string" && ps().test(t);
};
function ps() {
  return Oi || (Oi = new RegExp(`^[\\s	
\v\f\r   ᠎             　\u2028\u2029\uFEFF"]+$`));
}
var hs = function(t) {
  return typeof t < "u" && t !== null && (typeof t == "object" || typeof t == "function");
};
var Ti = hs;
var Qi = function(t) {
  Ti(t) || (t = {});
  for (var n = arguments.length, i = 1; i < n; i++) {
    var a = arguments[i];
    Ti(a) && fs(t, a);
  }
  return t;
};
function fs(e, t) {
  for (var n in t)
    ds(t, n) && (e[n] = t[n]);
}
function ds(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var gs = function(e) {
  return e != null && (Ji(e) || ms(e) || !!e._isBuffer);
};
function Ji(e) {
  return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
}
function ms(e) {
  return typeof e.readFloatLE == "function" && typeof e.slice == "function" && Ji(e.slice(0, 0));
}
var bs = gs;
var ys = Object.prototype.toString;
var vs = function(t) {
  if (typeof t > "u")
    return "undefined";
  if (t === null)
    return "null";
  if (t === true || t === false || t instanceof Boolean)
    return "boolean";
  if (typeof t == "string" || t instanceof String)
    return "string";
  if (typeof t == "number" || t instanceof Number)
    return "number";
  if (typeof t == "function" || t instanceof Function)
    return "function";
  if (typeof Array.isArray < "u" && Array.isArray(t))
    return "array";
  if (t instanceof RegExp)
    return "regexp";
  if (t instanceof Date)
    return "date";
  var n = ys.call(t);
  return n === "[object RegExp]" ? "regexp" : n === "[object Date]" ? "date" : n === "[object Arguments]" ? "arguments" : n === "[object Error]" ? "error" : bs(t) ? "buffer" : n === "[object Set]" ? "set" : n === "[object WeakSet]" ? "weakset" : n === "[object Map]" ? "map" : n === "[object WeakMap]" ? "weakmap" : n === "[object Symbol]" ? "symbol" : n === "[object Int8Array]" ? "int8array" : n === "[object Uint8Array]" ? "uint8array" : n === "[object Uint8ClampedArray]" ? "uint8clampedarray" : n === "[object Int16Array]" ? "int16array" : n === "[object Uint16Array]" ? "uint16array" : n === "[object Int32Array]" ? "int32array" : n === "[object Uint32Array]" ? "uint32array" : n === "[object Float32Array]" ? "float32array" : n === "[object Float64Array]" ? "float64array" : "object";
};
var ws = cs;
var Es = Qi;
var xs = vs;
var Os = function(e, t) {
  var n = Es({}, t), i = n.sep || `

`, a = n.min, _;
  return typeof a == "number" && a !== 2 && (_ = new RegExp("(\\r\\n|\\n|\\u2424) {" + a + ",}")), typeof _ > "u" && (_ = n.regex || /(\r\n|\n|\u2424){2,}/g), n.keepWhitespace !== true && (e = e.split(`
`).map(function(u) {
    return ws(u) ? u.trim() : u;
  }).join(`
`)), e = Ts(e, n), e.replace(_, i);
};
function Ts(e, t) {
  var n = t.trailingNewline;
  if (n === false)
    return e;
  switch (xs(n)) {
    case "string":
      e = e.replace(/\s+$/, t.trailingNewline);
      break;
    case "function":
      e = t.trailingNewline(e);
      break;
    case "undefined":
    case "boolean":
    default: {
      e = e.replace(/\s+$/, `
`);
      break;
    }
  }
  return e;
}
var ks = Ki.exports;
var Ss = Os;
var Rs = Qi;
var As = {
  unformatted: ["code", "pre", "em", "strong", "span"],
  indent_inner_html: true,
  indent_char: " ",
  indent_size: 2,
  sep: `
`
};
var Ns = function(t, n) {
  var i = Rs({}, As, n);
  return t = ks.html(t, i), i.ocd === true ? (i.newlines && (i.sep = i.newlines), Cs(t, i)) : t;
};
function Cs(e, t) {
  return Ss(e, t).replace(/^\s+/g, "").replace(/\s+$/g, `
`).replace(/(\s*<!--)/g, `
$1`).replace(/>(\s*)(?=<!--\s*\/)/g, "> ");
}
function Ae(e) {
  let { code: t, src: n } = e || {};
  t || (t = '<div id="app"></div>'), n && (t += `
<script type="module" src="${n}"><\/script>`);
  const a = new DOMParser().parseFromString(t, "text/html");
  return Ns(`<!DOCTYPE html>
${a.documentElement.outerHTML}`, {
    ocd: true
  });
}
function at(e) {
  const t = {};
  return e === W.REACT && (t.jsx = "react"), JSON.stringify(
    {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowImportingTsExtensions: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        ...t
      },
      include: ["src"]
    },
    null,
    2
  );
}
var Yi = () => JSON.stringify(
  {
    installDependencies: false,
    startCommand: "npm install && npm run dev"
  },
  null,
  2
);
var Ms = `import { createApp } from "vue";
import Demo from "./Demo.vue";

const app = createApp(Demo);
app.mount("#app");
`;
var Ls = `import React from "react";
import { createRoot } from "react-dom/client";
import Demo from "./Demo.tsx";

const root = createRoot(document.querySelector("#app"));
root.render(<Demo />);
`;
function ot(e) {
  return e === W.VUE ? Ms : e === W.REACT ? Ls : "";
}
var Is = `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
export default defineConfig({
  plugins: [vue(), vueJsx()],
});
`;
var Ds = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
});
`;
function en(e) {
  return e === W.VUE ? Is : e === W.REACT ? Ds : "";
}
var Bs = () => ({
  copyContent: ref(""),
  clickCopy: async (n) => {
    await navigator.clipboard.writeText(n);
  }
});
var Ps = () => {
  const e = ref(true);
  return {
    isCodeFold: e,
    setCodeFold: (n) => {
      e.value = n;
    }
  };
};
function $s(e) {
  return [
    ...e.match(/from '([^']+)'(;)?(\r)?\n/g) || [],
    ...e.match(/from "([^"]+)"(;)?(\r)?\n/g) || []
  ].map((t) => {
    let n = "";
    return t.includes("'") ? n = t.split("'")[1] : t.includes('"') && (n = t.split('"')[1]), n.includes("/") && (n.startsWith("@") ? n = n.split("/")[0] + "/" + n.split("/")[1] : n = n.split("/")[0]), n;
  }).filter((t) => t !== "").reduce((t, n) => (t[n] = "latest", t), {});
}
function tn(e) {
  return e instanceof Map ? e.clear = e.delete = e.set = function() {
    throw new Error("map is read-only");
  } : e instanceof Set && (e.add = e.clear = e.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(e), Object.getOwnPropertyNames(e).forEach((t) => {
    const n = e[t], i = typeof n;
    (i === "object" || i === "function") && !Object.isFrozen(n) && tn(n);
  }), e;
}
var ki = class {
  constructor(t) {
    t.data === void 0 && (t.data = {}), this.data = t.data, this.isMatchIgnored = false;
  }
  ignoreMatch() {
    this.isMatchIgnored = true;
  }
};
function nn(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function ge(e, ...t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const i in e)
    n[i] = e[i];
  return t.forEach(function(i) {
    for (const a in i)
      n[a] = i[a];
  }), n;
}
var Us = "</span>";
var Si = (e) => !!e.scope;
var js = (e, { prefix: t }) => {
  if (e.startsWith("language:"))
    return e.replace("language:", "language-");
  if (e.includes(".")) {
    const n = e.split(".");
    return [
      `${t}${n.shift()}`,
      ...n.map((i, a) => `${i}${"_".repeat(a + 1)}`)
    ].join(" ");
  }
  return `${t}${e}`;
};
var zs = class {
  constructor(t, n) {
    this.buffer = "", this.classPrefix = n.classPrefix, t.walk(this);
  }
  addText(t) {
    this.buffer += nn(t);
  }
  openNode(t) {
    if (!Si(t))
      return;
    const n = js(
      t.scope,
      { prefix: this.classPrefix }
    );
    this.span(n);
  }
  closeNode(t) {
    !Si(t) || (this.buffer += Us);
  }
  value() {
    return this.buffer;
  }
  span(t) {
    this.buffer += `<span class="${t}">`;
  }
};
var Ri = (e = {}) => {
  const t = { children: [] };
  return Object.assign(t, e), t;
};
var $t = class _$t {
  constructor() {
    this.rootNode = Ri(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(t) {
    this.top.children.push(t);
  }
  openNode(t) {
    const n = Ri({ scope: t });
    this.add(n), this.stack.push(n);
  }
  closeNode() {
    if (this.stack.length > 1)
      return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); )
      ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(t) {
    return this.constructor._walk(t, this.rootNode);
  }
  static _walk(t, n) {
    return typeof n == "string" ? t.addText(n) : n.children && (t.openNode(n), n.children.forEach((i) => this._walk(t, i)), t.closeNode(n)), t;
  }
  static _collapse(t) {
    typeof t != "string" && (!t.children || (t.children.every((n) => typeof n == "string") ? t.children = [t.children.join("")] : t.children.forEach((n) => {
      _$t._collapse(n);
    })));
  }
};
var Fs = class extends $t {
  constructor(t) {
    super(), this.options = t;
  }
  addText(t) {
    t !== "" && this.add(t);
  }
  startScope(t) {
    this.openNode(t);
  }
  endScope() {
    this.closeNode();
  }
  __addSublanguage(t, n) {
    const i = t.root;
    n && (i.scope = `language:${n}`), this.add(i);
  }
  toHTML() {
    return new zs(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), true;
  }
};
function Be(e) {
  return e ? typeof e == "string" ? e : e.source : null;
}
function sn(e) {
  return Oe("(?=", e, ")");
}
function Ws(e) {
  return Oe("(?:", e, ")*");
}
function Ks(e) {
  return Oe("(?:", e, ")?");
}
function Oe(...e) {
  return e.map((n) => Be(n)).join("");
}
function Gs(e) {
  const t = e[e.length - 1];
  return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
}
function Ut(...e) {
  return "(" + (Gs(e).capture ? "" : "?:") + e.map((i) => Be(i)).join("|") + ")";
}
function rn(e) {
  return new RegExp(e.toString() + "|").exec("").length - 1;
}
function Hs(e, t) {
  const n = e && e.exec(t);
  return n && n.index === 0;
}
var qs = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function jt(e, { joinWith: t }) {
  let n = 0;
  return e.map((i) => {
    n += 1;
    const a = n;
    let _ = Be(i), u = "";
    for (; _.length > 0; ) {
      const r = qs.exec(_);
      if (!r) {
        u += _;
        break;
      }
      u += _.substring(0, r.index), _ = _.substring(r.index + r[0].length), r[0][0] === "\\" && r[1] ? u += "\\" + String(Number(r[1]) + a) : (u += r[0], r[0] === "(" && n++);
    }
    return u;
  }).map((i) => `(${i})`).join(t);
}
var Xs = /\b\B/;
var an = "[a-zA-Z]\\w*";
var zt = "[a-zA-Z_]\\w*";
var on = "\\b\\d+(\\.\\d+)?";
var ln = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
var _n = "\\b(0b[01]+)";
var Vs = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
var Zs = (e = {}) => {
  const t = /^#![ ]*\//;
  return e.binary && (e.begin = Oe(
    t,
    /.*\b/,
    e.binary,
    /\b.*/
  )), ge({
    scope: "meta",
    begin: t,
    end: /$/,
    relevance: 0,
    "on:begin": (n, i) => {
      n.index !== 0 && i.ignoreMatch();
    }
  }, e);
};
var Pe = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
};
var Qs = {
  scope: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [Pe]
};
var Js = {
  scope: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [Pe]
};
var Ys = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
var lt = function(e, t, n = {}) {
  const i = ge(
    {
      scope: "comment",
      begin: e,
      end: t,
      contains: []
    },
    n
  );
  i.contains.push({
    scope: "doctag",
    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: true,
    relevance: 0
  });
  const a = Ut(
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
    /[A-Za-z]+[-][a-z]+/,
    /[A-Za-z][a-z]{2,}/
  );
  return i.contains.push(
    {
      begin: Oe(
        /[ ]+/,
        "(",
        a,
        /[.]?[:]?([.][ ]|[ ])/,
        "){3}"
      )
    }
  ), i;
};
var er = lt("//", "$");
var tr = lt("/\\*", "\\*/");
var ir = lt("#", "$");
var nr = {
  scope: "number",
  begin: on,
  relevance: 0
};
var sr = {
  scope: "number",
  begin: ln,
  relevance: 0
};
var rr = {
  scope: "number",
  begin: _n,
  relevance: 0
};
var ar = {
  scope: "regexp",
  begin: /\/(?=[^/\n]*\/)/,
  end: /\/[gimuy]*/,
  contains: [
    Pe,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [Pe]
    }
  ]
};
var or = {
  scope: "title",
  begin: an,
  relevance: 0
};
var lr = {
  scope: "title",
  begin: zt,
  relevance: 0
};
var _r = {
  begin: "\\.\\s*" + zt,
  relevance: 0
};
var ur = function(e) {
  return Object.assign(
    e,
    {
      "on:begin": (t, n) => {
        n.data._beginMatch = t[1];
      },
      "on:end": (t, n) => {
        n.data._beginMatch !== t[1] && n.ignoreMatch();
      }
    }
  );
};
var Ve = Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: Qs,
  BACKSLASH_ESCAPE: Pe,
  BINARY_NUMBER_MODE: rr,
  BINARY_NUMBER_RE: _n,
  COMMENT: lt,
  C_BLOCK_COMMENT_MODE: tr,
  C_LINE_COMMENT_MODE: er,
  C_NUMBER_MODE: sr,
  C_NUMBER_RE: ln,
  END_SAME_AS_BEGIN: ur,
  HASH_COMMENT_MODE: ir,
  IDENT_RE: an,
  MATCH_NOTHING_RE: Xs,
  METHOD_GUARD: _r,
  NUMBER_MODE: nr,
  NUMBER_RE: on,
  PHRASAL_WORDS_MODE: Ys,
  QUOTE_STRING_MODE: Js,
  REGEXP_MODE: ar,
  RE_STARTERS_RE: Vs,
  SHEBANG: Zs,
  TITLE_MODE: or,
  UNDERSCORE_IDENT_RE: zt,
  UNDERSCORE_TITLE_MODE: lr
});
function cr(e, t) {
  e.input[e.index - 1] === "." && t.ignoreMatch();
}
function pr(e, t) {
  e.className !== void 0 && (e.scope = e.className, delete e.className);
}
function hr(e, t) {
  !t || !e.beginKeywords || (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e.__beforeBegin = cr, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords, e.relevance === void 0 && (e.relevance = 0));
}
function fr(e, t) {
  !Array.isArray(e.illegal) || (e.illegal = Ut(...e.illegal));
}
function dr(e, t) {
  if (!!e.match) {
    if (e.begin || e.end)
      throw new Error("begin & end are not supported with match");
    e.begin = e.match, delete e.match;
  }
}
function gr(e, t) {
  e.relevance === void 0 && (e.relevance = 1);
}
var mr = (e, t) => {
  if (!e.beforeMatch)
    return;
  if (e.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const n = Object.assign({}, e);
  Object.keys(e).forEach((i) => {
    delete e[i];
  }), e.keywords = n.keywords, e.begin = Oe(n.beforeMatch, sn(n.begin)), e.starts = {
    relevance: 0,
    contains: [
      Object.assign(n, { endsParent: true })
    ]
  }, e.relevance = 0, delete n.beforeMatch;
};
var br = [
  "of",
  "and",
  "for",
  "in",
  "not",
  "or",
  "if",
  "then",
  "parent",
  "list",
  "value"
];
var yr = "keyword";
function un(e, t, n = yr) {
  const i = /* @__PURE__ */ Object.create(null);
  return typeof e == "string" ? a(n, e.split(" ")) : Array.isArray(e) ? a(n, e) : Object.keys(e).forEach(function(_) {
    Object.assign(
      i,
      un(e[_], t, _)
    );
  }), i;
  function a(_, u) {
    t && (u = u.map((r) => r.toLowerCase())), u.forEach(function(r) {
      const o = r.split("|");
      i[o[0]] = [_, vr(o[0], o[1])];
    });
  }
}
function vr(e, t) {
  return t ? Number(t) : wr(e) ? 0 : 1;
}
function wr(e) {
  return br.includes(e.toLowerCase());
}
var Ai = {};
var xe = (e) => {
  console.error(e);
};
var Ni = (e, ...t) => {
  console.log(`WARN: ${e}`, ...t);
};
var Se = (e, t) => {
  Ai[`${e}/${t}`] || (console.log(`Deprecated as of ${e}. ${t}`), Ai[`${e}/${t}`] = true);
};
var tt = new Error();
function cn(e, t, { key: n }) {
  let i = 0;
  const a = e[n], _ = {}, u = {};
  for (let r = 1; r <= t.length; r++)
    u[r + i] = a[r], _[r + i] = true, i += rn(t[r - 1]);
  e[n] = u, e[n]._emit = _, e[n]._multi = true;
}
function Er(e) {
  if (!!Array.isArray(e.begin)) {
    if (e.skip || e.excludeBegin || e.returnBegin)
      throw xe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), tt;
    if (typeof e.beginScope != "object" || e.beginScope === null)
      throw xe("beginScope must be object"), tt;
    cn(e, e.begin, { key: "beginScope" }), e.begin = jt(e.begin, { joinWith: "" });
  }
}
function xr(e) {
  if (!!Array.isArray(e.end)) {
    if (e.skip || e.excludeEnd || e.returnEnd)
      throw xe("skip, excludeEnd, returnEnd not compatible with endScope: {}"), tt;
    if (typeof e.endScope != "object" || e.endScope === null)
      throw xe("endScope must be object"), tt;
    cn(e, e.end, { key: "endScope" }), e.end = jt(e.end, { joinWith: "" });
  }
}
function Or(e) {
  e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope, delete e.scope);
}
function Tr(e) {
  Or(e), typeof e.beginScope == "string" && (e.beginScope = { _wrap: e.beginScope }), typeof e.endScope == "string" && (e.endScope = { _wrap: e.endScope }), Er(e), xr(e);
}
function kr(e) {
  function t(u, r) {
    return new RegExp(
      Be(u),
      "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (r ? "g" : "")
    );
  }
  class n {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(r, o) {
      o.position = this.position++, this.matchIndexes[this.matchAt] = o, this.regexes.push([o, r]), this.matchAt += rn(r) + 1;
    }
    compile() {
      this.regexes.length === 0 && (this.exec = () => null);
      const r = this.regexes.map((o) => o[1]);
      this.matcherRe = t(jt(r, { joinWith: "|" }), true), this.lastIndex = 0;
    }
    exec(r) {
      this.matcherRe.lastIndex = this.lastIndex;
      const o = this.matcherRe.exec(r);
      if (!o)
        return null;
      const p = o.findIndex((b, d) => d > 0 && b !== void 0), g = this.matchIndexes[p];
      return o.splice(0, p), Object.assign(o, g);
    }
  }
  class i {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(r) {
      if (this.multiRegexes[r])
        return this.multiRegexes[r];
      const o = new n();
      return this.rules.slice(r).forEach(([p, g]) => o.addRule(p, g)), o.compile(), this.multiRegexes[r] = o, o;
    }
    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(r, o) {
      this.rules.push([r, o]), o.type === "begin" && this.count++;
    }
    exec(r) {
      const o = this.getMatcher(this.regexIndex);
      o.lastIndex = this.lastIndex;
      let p = o.exec(r);
      if (this.resumingScanAtSamePosition() && !(p && p.index === this.lastIndex)) {
        const g = this.getMatcher(0);
        g.lastIndex = this.lastIndex + 1, p = g.exec(r);
      }
      return p && (this.regexIndex += p.position + 1, this.regexIndex === this.count && this.considerAll()), p;
    }
  }
  function a(u) {
    const r = new i();
    return u.contains.forEach((o) => r.addRule(o.begin, { rule: o, type: "begin" })), u.terminatorEnd && r.addRule(u.terminatorEnd, { type: "end" }), u.illegal && r.addRule(u.illegal, { type: "illegal" }), r;
  }
  function _(u, r) {
    const o = u;
    if (u.isCompiled)
      return o;
    [
      pr,
      dr,
      Tr,
      mr
    ].forEach((g) => g(u, r)), e.compilerExtensions.forEach((g) => g(u, r)), u.__beforeBegin = null, [
      hr,
      fr,
      gr
    ].forEach((g) => g(u, r)), u.isCompiled = true;
    let p = null;
    return typeof u.keywords == "object" && u.keywords.$pattern && (u.keywords = Object.assign({}, u.keywords), p = u.keywords.$pattern, delete u.keywords.$pattern), p = p || /\w+/, u.keywords && (u.keywords = un(u.keywords, e.case_insensitive)), o.keywordPatternRe = t(p, true), r && (u.begin || (u.begin = /\B|\b/), o.beginRe = t(o.begin), !u.end && !u.endsWithParent && (u.end = /\B|\b/), u.end && (o.endRe = t(o.end)), o.terminatorEnd = Be(o.end) || "", u.endsWithParent && r.terminatorEnd && (o.terminatorEnd += (u.end ? "|" : "") + r.terminatorEnd)), u.illegal && (o.illegalRe = t(u.illegal)), u.contains || (u.contains = []), u.contains = [].concat(...u.contains.map(function(g) {
      return Sr(g === "self" ? u : g);
    })), u.contains.forEach(function(g) {
      _(g, o);
    }), u.starts && _(u.starts, r), o.matcher = a(o), o;
  }
  if (e.compilerExtensions || (e.compilerExtensions = []), e.contains && e.contains.includes("self"))
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return e.classNameAliases = ge(e.classNameAliases || {}), _(e);
}
function pn(e) {
  return e ? e.endsWithParent || pn(e.starts) : false;
}
function Sr(e) {
  return e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map(function(t) {
    return ge(e, { variants: null }, t);
  })), e.cachedVariants ? e.cachedVariants : pn(e) ? ge(e, { starts: e.starts ? ge(e.starts) : null }) : Object.isFrozen(e) ? ge(e) : e;
}
var Rr = "11.10.0";
var Ar = class extends Error {
  constructor(t, n) {
    super(t), this.name = "HTMLInjectionError", this.html = n;
  }
};
var Nt = nn;
var Ci = ge;
var Mi = Symbol("nomatch");
var Nr = 7;
var hn = function(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null), i = [];
  let a = true;
  const _ = "Could not find the language '{}', did you forget to load/include a language module?", u = { disableAutodetect: true, name: "Plain text", contains: [] };
  let r = {
    ignoreUnescapedHTML: false,
    throwUnescapedHTML: false,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: "hljs-",
    cssSelector: "pre code",
    languages: null,
    __emitter: Fs
  };
  function o(O) {
    return r.noHighlightRe.test(O);
  }
  function p(O) {
    let S = O.className + " ";
    S += O.parentNode ? O.parentNode.className : "";
    const I = r.languageDetectRe.exec(S);
    if (I) {
      const P = T(I[1]);
      return P || (Ni(_.replace("{}", I[1])), Ni("Falling back to no-highlight mode for this block.", O)), P ? I[1] : "no-highlight";
    }
    return S.split(/\s+/).find((P) => o(P) || T(P));
  }
  function g(O, S, I) {
    let P = "", j = "";
    typeof S == "object" ? (P = O, I = S.ignoreIllegals, j = S.language) : (Se("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Se("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), j = O, P = S), I === void 0 && (I = true);
    const H = {
      code: P,
      language: j
    };
    B("before:highlight", H);
    const Q = H.result ? H.result : b(H.language, H.code, I);
    return Q.code = H.code, B("after:highlight", Q), Q;
  }
  function b(O, S, I, P) {
    const j = /* @__PURE__ */ Object.create(null);
    function H(N, D) {
      return N.keywords[D];
    }
    function Q() {
      if (!$.keywords) {
        J.addText(q);
        return;
      }
      let N = 0;
      $.keywordPatternRe.lastIndex = 0;
      let D = $.keywordPatternRe.exec(q), U = "";
      for (; D; ) {
        U += q.substring(N, D.index);
        const G = se.case_insensitive ? D[0].toLowerCase() : D[0], Y = H($, G);
        if (Y) {
          const [ce, An] = Y;
          if (J.addText(U), U = "", j[G] = (j[G] || 0) + 1, j[G] <= Nr && (ze += An), ce.startsWith("_"))
            U += D[0];
          else {
            const Nn = se.classNameAliases[ce] || ce;
            te(D[0], Nn);
          }
        } else
          U += D[0];
        N = $.keywordPatternRe.lastIndex, D = $.keywordPatternRe.exec(q);
      }
      U += q.substring(N), J.addText(U);
    }
    function be() {
      if (q === "")
        return;
      let N = null;
      if (typeof $.subLanguage == "string") {
        if (!t[$.subLanguage]) {
          J.addText(q);
          return;
        }
        N = b($.subLanguage, q, true, Vt[$.subLanguage]), Vt[$.subLanguage] = N._top;
      } else
        N = A(q, $.subLanguage.length ? $.subLanguage : null);
      $.relevance > 0 && (ze += N.relevance), J.__addSublanguage(N._emitter, N.language);
    }
    function Z() {
      $.subLanguage != null ? be() : Q(), q = "";
    }
    function te(N, D) {
      N !== "" && (J.startScope(D), J.addText(N), J.endScope());
    }
    function Ne(N, D) {
      let U = 1;
      const G = D.length - 1;
      for (; U <= G; ) {
        if (!N._emit[U]) {
          U++;
          continue;
        }
        const Y = se.classNameAliases[N[U]] || N[U], ce = D[U];
        Y ? te(ce, Y) : (q = ce, Q(), q = ""), U++;
      }
    }
    function ct(N, D) {
      return N.scope && typeof N.scope == "string" && J.openNode(se.classNameAliases[N.scope] || N.scope), N.beginScope && (N.beginScope._wrap ? (te(q, se.classNameAliases[N.beginScope._wrap] || N.beginScope._wrap), q = "") : N.beginScope._multi && (Ne(N.beginScope, D), q = "")), $ = Object.create(N, { parent: { value: $ } }), $;
    }
    function Ce(N, D, U) {
      let G = Hs(N.endRe, U);
      if (G) {
        if (N["on:end"]) {
          const Y = new ki(N);
          N["on:end"](D, Y), Y.isMatchIgnored && (G = false);
        }
        if (G) {
          for (; N.endsParent && N.parent; )
            N = N.parent;
          return N;
        }
      }
      if (N.endsWithParent)
        return Ce(N.parent, D, U);
    }
    function ne(N) {
      return $.matcher.regexIndex === 0 ? (q += N[0], 1) : (ft = true, 0);
    }
    function je(N) {
      const D = N[0], U = N.rule, G = new ki(U), Y = [U.__beforeBegin, U["on:begin"]];
      for (const ce of Y)
        if (!!ce && (ce(N, G), G.isMatchIgnored))
          return ne(D);
      return U.skip ? q += D : (U.excludeBegin && (q += D), Z(), !U.returnBegin && !U.excludeBegin && (q = D)), ct(U, N), U.returnBegin ? 0 : D.length;
    }
    function Te(N) {
      const D = N[0], U = S.substring(N.index), G = Ce($, N, U);
      if (!G)
        return Mi;
      const Y = $;
      $.endScope && $.endScope._wrap ? (Z(), te(D, $.endScope._wrap)) : $.endScope && $.endScope._multi ? (Z(), Ne($.endScope, N)) : Y.skip ? q += D : (Y.returnEnd || Y.excludeEnd || (q += D), Z(), Y.excludeEnd && (q = D));
      do
        $.scope && J.closeNode(), !$.skip && !$.subLanguage && (ze += $.relevance), $ = $.parent;
      while ($ !== G.parent);
      return G.starts && ct(G.starts, N), Y.returnEnd ? 0 : D.length;
    }
    function _e() {
      const N = [];
      for (let D = $; D !== se; D = D.parent)
        D.scope && N.unshift(D.scope);
      N.forEach((D) => J.openNode(D));
    }
    let ue = {};
    function Me(N, D) {
      const U = D && D[0];
      if (q += N, U == null)
        return Z(), 0;
      if (ue.type === "begin" && D.type === "end" && ue.index === D.index && U === "") {
        if (q += S.slice(D.index, D.index + 1), !a) {
          const G = new Error(`0 width match regex (${O})`);
          throw G.languageName = O, G.badRule = ue.rule, G;
        }
        return 1;
      }
      if (ue = D, D.type === "begin")
        return je(D);
      if (D.type === "illegal" && !I) {
        const G = new Error('Illegal lexeme "' + U + '" for mode "' + ($.scope || "<unnamed>") + '"');
        throw G.mode = $, G;
      } else if (D.type === "end") {
        const G = Te(D);
        if (G !== Mi)
          return G;
      }
      if (D.type === "illegal" && U === "")
        return 1;
      if (ht > 1e5 && ht > D.index * 3)
        throw new Error("potential infinite loop, way more iterations than matches");
      return q += U, U.length;
    }
    const se = T(O);
    if (!se)
      throw xe(_.replace("{}", O)), new Error('Unknown language: "' + O + '"');
    const Rn = kr(se);
    let pt = "", $ = P || Rn;
    const Vt = {}, J = new r.__emitter(r);
    _e();
    let q = "", ze = 0, ye = 0, ht = 0, ft = false;
    try {
      if (se.__emitTokens)
        se.__emitTokens(S, J);
      else {
        for ($.matcher.considerAll(); ; ) {
          ht++, ft ? ft = false : $.matcher.considerAll(), $.matcher.lastIndex = ye;
          const N = $.matcher.exec(S);
          if (!N)
            break;
          const D = S.substring(ye, N.index), U = Me(D, N);
          ye = N.index + U;
        }
        Me(S.substring(ye));
      }
      return J.finalize(), pt = J.toHTML(), {
        language: O,
        value: pt,
        relevance: ze,
        illegal: false,
        _emitter: J,
        _top: $
      };
    } catch (N) {
      if (N.message && N.message.includes("Illegal"))
        return {
          language: O,
          value: Nt(S),
          illegal: true,
          relevance: 0,
          _illegalBy: {
            message: N.message,
            index: ye,
            context: S.slice(ye - 100, ye + 100),
            mode: N.mode,
            resultSoFar: pt
          },
          _emitter: J
        };
      if (a)
        return {
          language: O,
          value: Nt(S),
          illegal: false,
          relevance: 0,
          errorRaised: N,
          _emitter: J,
          _top: $
        };
      throw N;
    }
  }
  function d(O) {
    const S = {
      value: Nt(O),
      illegal: false,
      relevance: 0,
      _top: u,
      _emitter: new r.__emitter(r)
    };
    return S._emitter.addText(O), S;
  }
  function A(O, S) {
    S = S || r.languages || Object.keys(t);
    const I = d(O), P = S.filter(T).filter(w).map(
      (Z) => b(Z, O, false)
    );
    P.unshift(I);
    const j = P.sort((Z, te) => {
      if (Z.relevance !== te.relevance)
        return te.relevance - Z.relevance;
      if (Z.language && te.language) {
        if (T(Z.language).supersetOf === te.language)
          return 1;
        if (T(te.language).supersetOf === Z.language)
          return -1;
      }
      return 0;
    }), [H, Q] = j, be = H;
    return be.secondBest = Q, be;
  }
  function M(O, S, I) {
    const P = S && n[S] || I;
    O.classList.add("hljs"), O.classList.add(`language-${P}`);
  }
  function L(O) {
    let S = null;
    const I = p(O);
    if (o(I))
      return;
    if (B(
      "before:highlightElement",
      { el: O, language: I }
    ), O.dataset.highlighted) {
      console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", O);
      return;
    }
    if (O.children.length > 0 && (r.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(O)), r.throwUnescapedHTML))
      throw new Ar(
        "One of your code blocks includes unescaped HTML.",
        O.innerHTML
      );
    S = O;
    const P = S.textContent, j = I ? g(P, { language: I, ignoreIllegals: true }) : A(P);
    O.innerHTML = j.value, O.dataset.highlighted = "yes", M(O, I, j.language), O.result = {
      language: j.language,
      re: j.relevance,
      relevance: j.relevance
    }, j.secondBest && (O.secondBest = {
      language: j.secondBest.language,
      relevance: j.secondBest.relevance
    }), B("after:highlightElement", { el: O, result: j, text: P });
  }
  function f(O) {
    r = Ci(r, O);
  }
  const l = () => {
    E(), Se("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };
  function m() {
    E(), Se("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }
  let R = false;
  function E() {
    if (document.readyState === "loading") {
      R = true;
      return;
    }
    document.querySelectorAll(r.cssSelector).forEach(L);
  }
  function k() {
    R && E();
  }
  typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", k, false);
  function c(O, S) {
    let I = null;
    try {
      I = S(e);
    } catch (P) {
      if (xe("Language definition for '{}' could not be registered.".replace("{}", O)), a)
        xe(P);
      else
        throw P;
      I = u;
    }
    I.name || (I.name = O), t[O] = I, I.rawDefinition = S.bind(null, e), I.aliases && s(I.aliases, { languageName: O });
  }
  function y(O) {
    delete t[O];
    for (const S of Object.keys(n))
      n[S] === O && delete n[S];
  }
  function h() {
    return Object.keys(t);
  }
  function T(O) {
    return O = (O || "").toLowerCase(), t[O] || t[n[O]];
  }
  function s(O, { languageName: S }) {
    typeof O == "string" && (O = [O]), O.forEach((I) => {
      n[I.toLowerCase()] = S;
    });
  }
  function w(O) {
    const S = T(O);
    return S && !S.disableAutodetect;
  }
  function v(O) {
    O["before:highlightBlock"] && !O["before:highlightElement"] && (O["before:highlightElement"] = (S) => {
      O["before:highlightBlock"](
        Object.assign({ block: S.el }, S)
      );
    }), O["after:highlightBlock"] && !O["after:highlightElement"] && (O["after:highlightElement"] = (S) => {
      O["after:highlightBlock"](
        Object.assign({ block: S.el }, S)
      );
    });
  }
  function x(O) {
    v(O), i.push(O);
  }
  function C(O) {
    const S = i.indexOf(O);
    S !== -1 && i.splice(S, 1);
  }
  function B(O, S) {
    const I = O;
    i.forEach(function(P) {
      P[I] && P[I](S);
    });
  }
  function z(O) {
    return Se("10.7.0", "highlightBlock will be removed entirely in v12.0"), Se("10.7.0", "Please use highlightElement now."), L(O);
  }
  Object.assign(e, {
    highlight: g,
    highlightAuto: A,
    highlightAll: E,
    highlightElement: L,
    highlightBlock: z,
    configure: f,
    initHighlighting: l,
    initHighlightingOnLoad: m,
    registerLanguage: c,
    unregisterLanguage: y,
    listLanguages: h,
    getLanguage: T,
    registerAliases: s,
    autoDetection: w,
    inherit: Ci,
    addPlugin: x,
    removePlugin: C
  }), e.debugMode = function() {
    a = false;
  }, e.safeMode = function() {
    a = true;
  }, e.versionString = Rr, e.regex = {
    concat: Oe,
    lookahead: sn,
    either: Ut,
    optional: Ks,
    anyNumberOfTimes: Ws
  };
  for (const O in Ve)
    typeof Ve[O] == "object" && tn(Ve[O]);
  return Object.assign(e, Ve), e;
};
var Re = hn({});
Re.newInstance = () => hn({});
var Cr = Re;
Re.HighlightJS = Re;
Re.default = Re;
var Ue = Cr;
var it = "[A-Za-z$_][0-9A-Za-z$_]*";
var fn = [
  "as",
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
var dn = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var gn = [
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  "Math",
  "Date",
  "Number",
  "BigInt",
  "String",
  "RegExp",
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  "Reflect",
  "Proxy",
  "Intl",
  "WebAssembly"
];
var mn = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var bn = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var yn = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
];
var vn = [].concat(
  bn,
  gn,
  mn
);
function Mr(e) {
  const t = e.regex, n = (S, { after: I }) => {
    const P = "</" + S[0].slice(1);
    return S.input.indexOf(P, I) !== -1;
  }, i = it, a = {
    begin: "<>",
    end: "</>"
  }, _ = /<[A-Za-z0-9\\._:-]+\s*\/>/, u = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    isTrulyOpeningTag: (S, I) => {
      const P = S[0].length + S.index, j = S.input[P];
      if (j === "<" || j === ",") {
        I.ignoreMatch();
        return;
      }
      j === ">" && (n(S, { after: P }) || I.ignoreMatch());
      let H;
      const Q = S.input.substring(P);
      if (H = Q.match(/^\s*=/)) {
        I.ignoreMatch();
        return;
      }
      if ((H = Q.match(/^\s+extends\s+/)) && H.index === 0) {
        I.ignoreMatch();
        return;
      }
    }
  }, r = {
    $pattern: it,
    keyword: fn,
    literal: dn,
    built_in: vn,
    "variable.language": yn
  }, o = "[0-9](_?[0-9])*", p = `\\.(${o})`, g = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", b = {
    className: "number",
    variants: [
      { begin: `(\\b(${g})((${p})|\\.)?|(${p}))[eE][+-]?(${o})\\b` },
      { begin: `\\b(${g})\\b((${p})\\b|\\.)?|(${p})\\b` },
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, d = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: r,
    contains: []
  }, A = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        e.BACKSLASH_ESCAPE,
        d
      ],
      subLanguage: "xml"
    }
  }, M = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        e.BACKSLASH_ESCAPE,
        d
      ],
      subLanguage: "css"
    }
  }, L = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        e.BACKSLASH_ESCAPE,
        d
      ],
      subLanguage: "graphql"
    }
  }, f = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      d
    ]
  }, m = {
    className: "comment",
    variants: [
      e.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: true,
                  excludeBegin: true,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: i + "(?=\\s*(-)|$)",
                  endsParent: true,
                  relevance: 0
                },
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      e.C_BLOCK_COMMENT_MODE,
      e.C_LINE_COMMENT_MODE
    ]
  }, R = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    A,
    M,
    L,
    f,
    { match: /\$\d+/ },
    b
  ];
  d.contains = R.concat({
    begin: /\{/,
    end: /\}/,
    keywords: r,
    contains: [
      "self"
    ].concat(R)
  });
  const E = [].concat(m, d.contains), k = E.concat([
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: r,
      contains: ["self"].concat(E)
    }
  ]), c = {
    className: "params",
    begin: /(\s*)\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: r,
    contains: k
  }, y = {
    variants: [
      {
        match: [
          /class/,
          /\s+/,
          i,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(i, "(", t.concat(/\./, i), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      {
        match: [
          /class/,
          /\s+/,
          i
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, h = {
    relevance: 0,
    match: t.either(
      /\bJSON/,
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
    ),
    className: "title.class",
    keywords: {
      _: [
        ...gn,
        ...mn
      ]
    }
  }, T = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, s = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          i,
          /(?=\s*\()/
        ]
      },
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [c],
    illegal: /%/
  }, w = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function v(S) {
    return t.concat("(?!", S.join("|"), ")");
  }
  const x = {
    match: t.concat(
      /\b/,
      v([
        ...bn,
        "super",
        "import"
      ].map((S) => `${S}\\s*\\(`)),
      i,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, C = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(i, /(?![0-9A-Za-z$_(])/)
    )),
    end: i,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, B = {
    match: [
      /get|set/,
      /\s+/,
      i,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        begin: /\(\)/
      },
      c
    ]
  }, z = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", O = {
    match: [
      /const|var|let/,
      /\s+/,
      i,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      t.lookahead(z)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      c
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: r,
    exports: { PARAMS_CONTAINS: k, CLASS_REFERENCE: h },
    illegal: /#(?![$_A-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      T,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      A,
      M,
      L,
      f,
      m,
      { match: /\$\d+/ },
      b,
      h,
      {
        className: "attr",
        begin: i + t.lookahead(":"),
        relevance: 0
      },
      O,
      {
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          m,
          e.REGEXP_MODE,
          {
            className: "function",
            begin: z,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: e.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: r,
                    contains: k
                  }
                ]
              }
            ]
          },
          {
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            variants: [
              { begin: a.begin, end: a.end },
              { match: _ },
              {
                begin: u.begin,
                "on:begin": u.isTrulyOpeningTag,
                end: u.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: u.begin,
                end: u.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      s,
      {
        beginKeywords: "while if switch catch for"
      },
      {
        begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        returnBegin: true,
        label: "func.def",
        contains: [
          c,
          e.inherit(e.TITLE_MODE, { begin: i, className: "title.function" })
        ]
      },
      {
        match: /\.\.\./,
        relevance: 0
      },
      C,
      {
        match: "\\$" + i,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [c]
      },
      x,
      w,
      y,
      B,
      {
        match: /\$[(.]/
      }
    ]
  };
}
function Lr(e) {
  const t = Mr(e), n = it, i = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ], a = {
    begin: [
      /namespace/,
      /\s+/,
      e.IDENT_RE
    ],
    beginScope: {
      1: "keyword",
      3: "title.class"
    }
  }, _ = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: true,
    keywords: {
      keyword: "interface extends",
      built_in: i
    },
    contains: [t.exports.CLASS_REFERENCE]
  }, u = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  }, r = [
    "type",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override",
    "satisfies"
  ], o = {
    $pattern: it,
    keyword: fn.concat(r),
    literal: dn,
    built_in: vn.concat(i),
    "variable.language": yn
  }, p = {
    className: "meta",
    begin: "@" + n
  }, g = (A, M, L) => {
    const f = A.contains.findIndex((l) => l.label === M);
    if (f === -1)
      throw new Error("can not find mode to replace");
    A.contains.splice(f, 1, L);
  };
  Object.assign(t.keywords, o), t.exports.PARAMS_CONTAINS.push(p);
  const b = t.contains.find((A) => A.className === "attr");
  t.exports.PARAMS_CONTAINS.push([
    t.exports.CLASS_REFERENCE,
    b
  ]), t.contains = t.contains.concat([
    p,
    a,
    _
  ]), g(t, "shebang", e.SHEBANG()), g(t, "use_strict", u);
  const d = t.contains.find((A) => A.label === "func.def");
  return d.relevance = 0, Object.assign(t, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  }), t;
}
var Li = "[A-Za-z$_][0-9A-Za-z$_]*";
var Ir = [
  "as",
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
var Dr = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var wn = [
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  "Math",
  "Date",
  "Number",
  "BigInt",
  "String",
  "RegExp",
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  "Reflect",
  "Proxy",
  "Intl",
  "WebAssembly"
];
var En = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var xn = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var Br = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
];
var Pr = [].concat(
  xn,
  wn,
  En
);
function $r(e) {
  const t = e.regex, n = (S, { after: I }) => {
    const P = "</" + S[0].slice(1);
    return S.input.indexOf(P, I) !== -1;
  }, i = Li, a = {
    begin: "<>",
    end: "</>"
  }, _ = /<[A-Za-z0-9\\._:-]+\s*\/>/, u = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    isTrulyOpeningTag: (S, I) => {
      const P = S[0].length + S.index, j = S.input[P];
      if (j === "<" || j === ",") {
        I.ignoreMatch();
        return;
      }
      j === ">" && (n(S, { after: P }) || I.ignoreMatch());
      let H;
      const Q = S.input.substring(P);
      if (H = Q.match(/^\s*=/)) {
        I.ignoreMatch();
        return;
      }
      if ((H = Q.match(/^\s+extends\s+/)) && H.index === 0) {
        I.ignoreMatch();
        return;
      }
    }
  }, r = {
    $pattern: Li,
    keyword: Ir,
    literal: Dr,
    built_in: Pr,
    "variable.language": Br
  }, o = "[0-9](_?[0-9])*", p = `\\.(${o})`, g = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", b = {
    className: "number",
    variants: [
      { begin: `(\\b(${g})((${p})|\\.)?|(${p}))[eE][+-]?(${o})\\b` },
      { begin: `\\b(${g})\\b((${p})\\b|\\.)?|(${p})\\b` },
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, d = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: r,
    contains: []
  }, A = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        e.BACKSLASH_ESCAPE,
        d
      ],
      subLanguage: "xml"
    }
  }, M = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        e.BACKSLASH_ESCAPE,
        d
      ],
      subLanguage: "css"
    }
  }, L = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        e.BACKSLASH_ESCAPE,
        d
      ],
      subLanguage: "graphql"
    }
  }, f = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      d
    ]
  }, m = {
    className: "comment",
    variants: [
      e.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: true,
                  excludeBegin: true,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: i + "(?=\\s*(-)|$)",
                  endsParent: true,
                  relevance: 0
                },
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      e.C_BLOCK_COMMENT_MODE,
      e.C_LINE_COMMENT_MODE
    ]
  }, R = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    A,
    M,
    L,
    f,
    { match: /\$\d+/ },
    b
  ];
  d.contains = R.concat({
    begin: /\{/,
    end: /\}/,
    keywords: r,
    contains: [
      "self"
    ].concat(R)
  });
  const E = [].concat(m, d.contains), k = E.concat([
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: r,
      contains: ["self"].concat(E)
    }
  ]), c = {
    className: "params",
    begin: /(\s*)\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: r,
    contains: k
  }, y = {
    variants: [
      {
        match: [
          /class/,
          /\s+/,
          i,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(i, "(", t.concat(/\./, i), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      {
        match: [
          /class/,
          /\s+/,
          i
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, h = {
    relevance: 0,
    match: t.either(
      /\bJSON/,
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
    ),
    className: "title.class",
    keywords: {
      _: [
        ...wn,
        ...En
      ]
    }
  }, T = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, s = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          i,
          /(?=\s*\()/
        ]
      },
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [c],
    illegal: /%/
  }, w = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function v(S) {
    return t.concat("(?!", S.join("|"), ")");
  }
  const x = {
    match: t.concat(
      /\b/,
      v([
        ...xn,
        "super",
        "import"
      ].map((S) => `${S}\\s*\\(`)),
      i,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, C = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(i, /(?![0-9A-Za-z$_(])/)
    )),
    end: i,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, B = {
    match: [
      /get|set/,
      /\s+/,
      i,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        begin: /\(\)/
      },
      c
    ]
  }, z = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", O = {
    match: [
      /const|var|let/,
      /\s+/,
      i,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      t.lookahead(z)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      c
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: r,
    exports: { PARAMS_CONTAINS: k, CLASS_REFERENCE: h },
    illegal: /#(?![$_A-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      T,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      A,
      M,
      L,
      f,
      m,
      { match: /\$\d+/ },
      b,
      h,
      {
        className: "attr",
        begin: i + t.lookahead(":"),
        relevance: 0
      },
      O,
      {
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          m,
          e.REGEXP_MODE,
          {
            className: "function",
            begin: z,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: e.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: r,
                    contains: k
                  }
                ]
              }
            ]
          },
          {
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            variants: [
              { begin: a.begin, end: a.end },
              { match: _ },
              {
                begin: u.begin,
                "on:begin": u.isTrulyOpeningTag,
                end: u.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: u.begin,
                end: u.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      s,
      {
        beginKeywords: "while if switch catch for"
      },
      {
        begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        returnBegin: true,
        label: "func.def",
        contains: [
          c,
          e.inherit(e.TITLE_MODE, { begin: i, className: "title.function" })
        ]
      },
      {
        match: /\.\.\./,
        relevance: 0
      },
      C,
      {
        match: "\\$" + i,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [c]
      },
      x,
      w,
      y,
      B,
      {
        match: /\$[(.]/
      }
    ]
  };
}
var Ur = (e) => ({
  IMPORTANT: {
    scope: "meta",
    begin: "!important"
  },
  BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
  HEXCOLOR: {
    scope: "number",
    begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
  },
  FUNCTION_DISPATCH: {
    className: "built_in",
    begin: /[\w-]+(?=\()/
  },
  ATTRIBUTE_SELECTOR_MODE: {
    scope: "selector-attr",
    begin: /\[/,
    end: /\]/,
    illegal: "$",
    contains: [
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE
    ]
  },
  CSS_NUMBER_MODE: {
    scope: "number",
    begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
    relevance: 0
  },
  CSS_VARIABLE: {
    className: "attr",
    begin: /--[A-Za-z_][A-Za-z0-9_-]*/
  }
});
var jr = [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "menu",
  "nav",
  "object",
  "ol",
  "optgroup",
  "option",
  "p",
  "picture",
  "q",
  "quote",
  "samp",
  "section",
  "select",
  "source",
  "span",
  "strong",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
  "video"
];
var zr = [
  "defs",
  "g",
  "marker",
  "mask",
  "pattern",
  "svg",
  "switch",
  "symbol",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feFlood",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMorphology",
  "feOffset",
  "feSpecularLighting",
  "feTile",
  "feTurbulence",
  "linearGradient",
  "radialGradient",
  "stop",
  "circle",
  "ellipse",
  "image",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "text",
  "use",
  "textPath",
  "tspan",
  "foreignObject",
  "clipPath"
];
var Fr = [
  ...jr,
  ...zr
];
var Wr = [
  "any-hover",
  "any-pointer",
  "aspect-ratio",
  "color",
  "color-gamut",
  "color-index",
  "device-aspect-ratio",
  "device-height",
  "device-width",
  "display-mode",
  "forced-colors",
  "grid",
  "height",
  "hover",
  "inverted-colors",
  "monochrome",
  "orientation",
  "overflow-block",
  "overflow-inline",
  "pointer",
  "prefers-color-scheme",
  "prefers-contrast",
  "prefers-reduced-motion",
  "prefers-reduced-transparency",
  "resolution",
  "scan",
  "scripting",
  "update",
  "width",
  "min-width",
  "max-width",
  "min-height",
  "max-height"
].sort().reverse();
var Kr = [
  "active",
  "any-link",
  "blank",
  "checked",
  "current",
  "default",
  "defined",
  "dir",
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first",
  "first-child",
  "first-of-type",
  "fullscreen",
  "future",
  "focus",
  "focus-visible",
  "focus-within",
  "has",
  "host",
  "host-context",
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "is",
  "lang",
  "last-child",
  "last-of-type",
  "left",
  "link",
  "local-link",
  "not",
  "nth-child",
  "nth-col",
  "nth-last-child",
  "nth-last-col",
  "nth-last-of-type",
  "nth-of-type",
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "target",
  "target-within",
  "user-invalid",
  "valid",
  "visited",
  "where"
].sort().reverse();
var Gr = [
  "after",
  "backdrop",
  "before",
  "cue",
  "cue-region",
  "first-letter",
  "first-line",
  "grammar-error",
  "marker",
  "part",
  "placeholder",
  "selection",
  "slotted",
  "spelling-error"
].sort().reverse();
var Hr = [
  "accent-color",
  "align-content",
  "align-items",
  "align-self",
  "alignment-baseline",
  "all",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "appearance",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-repeat",
  "background-size",
  "baseline-shift",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "cx",
  "cy",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "color-scheme",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "direction",
  "display",
  "dominant-baseline",
  "empty-cells",
  "enable-background",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flow",
  "flood-color",
  "flood-opacity",
  "font",
  "font-display",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-size",
  "font-size-adjust",
  "font-smoothing",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-variant",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "gap",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "ime-mode",
  "inline-size",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "kerning",
  "justify-content",
  "justify-items",
  "justify-self",
  "left",
  "letter-spacing",
  "lighting-color",
  "line-break",
  "line-height",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "marker",
  "marker-end",
  "marker-mid",
  "marker-start",
  "mask",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "marks",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "none",
  "normal",
  "object-fit",
  "object-position",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "pointer-events",
  "position",
  "quotes",
  "r",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "right",
  "rotate",
  "row-gap",
  "scale",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "shape-rendering",
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "speak",
  "speak-as",
  "src",
  "tab-size",
  "table-layout",
  "text-anchor",
  "text-align",
  "text-align-all",
  "text-align-last",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "top",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "vector-effect",
  "vertical-align",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "x",
  "y",
  "z-index"
].sort().reverse();
function qr(e) {
  const t = e.regex, n = Ur(e), i = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, a = "and or not only", _ = /@-?\w[\w]*(-\w+)*/, u = "[a-zA-Z-][a-zA-Z0-9_-]*", r = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE
  ];
  return {
    name: "CSS",
    case_insensitive: true,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: {
      keyframePosition: "selector-tag"
    },
    contains: [
      n.BLOCK_COMMENT,
      i,
      n.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + u,
        relevance: 0
      },
      n.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + Kr.join("|") + ")" },
          { begin: ":(:)?(" + Gr.join("|") + ")" }
        ]
      },
      n.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + Hr.join("|") + ")\\b"
      },
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          n.BLOCK_COMMENT,
          n.HEXCOLOR,
          n.IMPORTANT,
          n.CSS_NUMBER_MODE,
          ...r,
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            keywords: { built_in: "url data-uri" },
            contains: [
              ...r,
              {
                className: "string",
                begin: /[^)]/,
                endsWithParent: true,
                excludeEnd: true
              }
            ]
          },
          n.FUNCTION_DISPATCH
        ]
      },
      {
        begin: t.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        contains: [
          {
            className: "keyword",
            begin: _
          },
          {
            begin: /\s/,
            endsWithParent: true,
            excludeEnd: true,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: a,
              attribute: Wr.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...r,
              n.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: "selector-tag",
        begin: "\\b(" + Fr.join("|") + ")\\b"
      }
    ]
  };
}
function Xr(e) {
  const t = e.regex, n = t.concat(/[\p{L}_]/u, t.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), i = /[\p{L}0-9._:-]+/u, a = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  }, _ = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  }, u = e.inherit(_, {
    begin: /\(/,
    end: /\)/
  }), r = e.inherit(e.APOS_STRING_MODE, { className: "string" }), o = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }), p = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: i,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [a]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [a]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: true,
    unicodeRegex: true,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          _,
          o,
          r,
          u,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  _,
                  u,
                  o,
                  r
                ]
              }
            ]
          }
        ]
      },
      e.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      a,
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              o
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [p],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [p],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      {
        className: "tag",
        begin: t.concat(
          /</,
          t.lookahead(t.concat(
            n,
            t.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: n,
            relevance: 0,
            starts: p
          }
        ]
      },
      {
        className: "tag",
        begin: t.concat(
          /<\//,
          t.lookahead(t.concat(
            n,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: n,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: true
          }
        ]
      }
    ]
  };
}
Ue.registerLanguage("typescript", Lr);
Ue.registerLanguage("javascript", $r);
Ue.registerLanguage("xml", Xr);
Ue.registerLanguage("css", qr);
var Ii = (e) => Ue.highlightAuto(e).value;
var Ze = "vitepress-demo-plugin";
var Qe = (e, t, n, i) => {
  let a = t === "" ? `${e}` : `${e}-${t}`;
  return n && (a += `__${n}`), i && (a += `--${i}`), a;
};
var Ft = (e = "") => ({
  b: () => Qe(Ze, e),
  e: (_ = "") => Qe(Ze, e, _),
  m: (_ = "") => Qe(Ze, e, "", _),
  bem: (_, u, r) => Qe(Ze, _, u, r)
});
var Vr = ({
  code: e,
  styles: t,
  links: n
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    ${t}
    ${n}
    <style>
      body {
        min-height: 0;
      }
    </style>
  </head>
  <body>
    ${e}
  </body>
</html>
  `;
var Zr = (e, t) => {
  const n = {
    dependencies: {},
    devDependencies: {
      typescript: "latest"
    }
  };
  return e === W.VUE ? (n.dependencies.vue = "latest", t === fe.STACKBLITZ ? (n.devDependencies.vite = "latest", n.devDependencies["@vitejs/plugin-vue"] = "latest", n.devDependencies["@vitejs/plugin-vue-jsx"] = "latest") : t === fe.CODESANDBOX && (n.devDependencies["@vue/cli-plugin-babel"] = "latest")) : e === W.REACT && (n.dependencies.react = "latest", n.dependencies["react-dom"] = "latest", n.dependencies["@emotion/react"] = "latest", n.dependencies["@emotion/styled"] = "latest", n.devDependencies["@types/react"] = "latest", n.devDependencies["@types/react-dom"] = "latest", t === fe.STACKBLITZ && (n.devDependencies.vite = "latest", n.devDependencies["@vitejs/plugin-react"] = "latest")), n;
};
function _t(e) {
  const { type: t, platform: n, code: i, title: a, description: _ } = e, u = n === fe.STACKBLITZ ? {
    scripts: {
      dev: "vite",
      build: "vite build",
      serve: "vite preview"
    }
  } : {}, { dependencies: r, devDependencies: o } = Zr(t, n), p = {
    name: a,
    description: _,
    version: "0.0.0",
    private: true,
    ...u,
    dependencies: {
      ...$s(i),
      ...r
    },
    devDependencies: {
      ...o
    }
  };
  return JSON.stringify(p, null, 2);
}
function Qr(e) {
  const { code: t } = e;
  return st({
    files: {
      "package.json": {
        content: _t({
          type: W.VUE,
          platform: fe.CODESANDBOX,
          code: t
        })
      },
      "tsconfig.json": {
        content: at(W.VUE)
      },
      "index.html": {
        content: Ae()
      },
      "src/main.ts": {
        content: ot(W.VUE)
      },
      "src/Demo.vue": {
        content: t
      },
      ...e.customFiles
    }
  });
}
function Jr(e) {
  const { code: t } = e;
  return st({
    files: {
      "package.json": {
        content: _t({
          type: W.REACT,
          platform: fe.CODESANDBOX,
          code: t
        })
      },
      "tsconfig.json": {
        content: at(W.REACT)
      },
      "index.html": {
        content: Ae()
      },
      "src/main.tsx": {
        content: ot(W.REACT)
      },
      "src/Demo.tsx": {
        content: t
      },
      ...e.customFiles
    }
  });
}
function Yr(e) {
  const { code: t } = e;
  return st({
    files: {
      "index.html": {
        content: Ae({ code: t })
      },
      ...e.customFiles
    },
    template: "static"
  });
}
function ea(e) {
  var a, _, u;
  const t = (a = (e.templates || []).find(
    (r) => r.scope === "global"
  )) == null ? void 0 : a.files, n = (_ = (e.templates || []).find(
    (r) => r.scope === e.type
  )) == null ? void 0 : _.files, i = (u = (e.templates || []).find(
    (r) => r.scope === e.scope
  )) == null ? void 0 : u.files;
  e.customFiles = {
    ...t,
    ...n,
    ...i
  };
  for (let r in e.customFiles)
    e.customFiles[r] = {
      content: e.customFiles[r] || ""
    };
  if (e.type === W.VUE)
    return Qr(e);
  if (e.type === W.REACT)
    return Jr(e);
  if (e.type === W.HTML)
    return Yr(e);
}
var ta = {
  action: "https://codesandbox.io/api/v1/sandboxes/define",
  method: "post",
  target: "_blank",
  style: { display: "flex" }
};
var ia = ["value"];
var na = ["value"];
var sa = defineComponent({
  __name: "codesandbox",
  props: {
    code: {},
    type: {},
    title: {},
    description: {},
    scope: {},
    templates: {}
  },
  setup(e) {
    const t = e, n = computed(
      () => ea({
        code: t.code,
        type: t.type,
        title: t.title || zi,
        description: t.description || Fi,
        scope: t.scope,
        templates: t.templates
      })
    ), i = computed(() => Qn(t.type));
    return (a, _) => (openBlock(), createElementBlock("form", ta, [
      createBaseVNode("input", {
        style: { display: "none" },
        name: "parameters",
        value: n.value
      }, null, 8, ia),
      _[0] || (_[0] = createBaseVNode("input", {
        style: { display: "none" },
        name: "embed",
        value: 1
      }, null, -1)),
      createBaseVNode("input", {
        style: { display: "none" },
        name: "query",
        value: `module=${i.value}`
      }, null, 8, na),
      _[1] || (_[1] = createStaticVNode('<button type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-codesandbox"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg></button>', 1))
    ]));
  }
});
var ra = 500;
var aa = 20;
var oa = 300;
var la = "https://stackblitz.com";
var Di = [
  "angular-cli",
  "create-react-app",
  "html",
  "javascript",
  "node",
  "polymer",
  "typescript",
  "vue"
];
var _a = ["project", "search", "ports", "settings"];
var ua = ["light", "dark"];
var ca = ["editor", "preview"];
var Bi = {
  clickToLoad: (e) => ve("ctl", e),
  devToolsHeight: (e) => Pi("devtoolsheight", e),
  forceEmbedLayout: (e) => ve("embed", e),
  hideDevTools: (e) => ve("hidedevtools", e),
  hideExplorer: (e) => ve("hideExplorer", e),
  hideNavigation: (e) => ve("hideNavigation", e),
  openFile: (e) => Je("file", e),
  showSidebar: (e) => pa("showSidebar", e),
  sidebarView: (e) => Ct("sidebarView", e, _a),
  startScript: (e) => Je("startScript", e),
  terminalHeight: (e) => Pi("terminalHeight", e),
  theme: (e) => Ct("theme", e, ua),
  view: (e) => Ct("view", e, ca),
  zenMode: (e) => ve("zenMode", e),
  organization: (e) => `${Je("orgName", e == null ? void 0 : e.name)}&${Je("orgProvider", e == null ? void 0 : e.provider)}`,
  crossOriginIsolated: (e) => ve("corp", e)
};
function On(e = {}) {
  const t = Object.entries(e).map(([n, i]) => i != null && Bi.hasOwnProperty(n) ? Bi[n](i) : "").filter(Boolean);
  return t.length ? `?${t.join("&")}` : "";
}
function ve(e, t) {
  return t === true ? `${e}=1` : "";
}
function pa(e, t) {
  return typeof t == "boolean" ? `${e}=${t ? "1" : "0"}` : "";
}
function Pi(e, t) {
  if (typeof t == "number" && !Number.isNaN(t)) {
    const n = Math.min(100, Math.max(0, t));
    return `${e}=${encodeURIComponent(Math.round(n))}`;
  }
  return "";
}
function Ct(e, t = "", n = []) {
  return n.includes(t) ? `${e}=${encodeURIComponent(t)}` : "";
}
function Je(e, t) {
  return (Array.isArray(t) ? t : [t]).filter((i) => typeof i == "string" && i.trim() !== "").map((i) => `${e}=${encodeURIComponent(i)}`).join("&");
}
function Tn() {
  return Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
}
function Wt(e, t) {
  return `${kn(t)}${e}${On(t)}`;
}
function Kt(e, t) {
  const n = {
    forceEmbedLayout: true
  };
  return t && typeof t == "object" && Object.assign(n, t), `${kn(n)}${e}${On(n)}`;
}
function kn(e = {}) {
  return (typeof e.origin == "string" ? e.origin : la).replace(/\/$/, "");
}
function Gt(e, t, n) {
  if (!t || !e || !e.parentNode)
    throw new Error("Invalid Element");
  e.id && (t.id = e.id), e.className && (t.className = e.className), ha(t, n), fa(e, t, n), e.replaceWith(t);
}
function Ht(e) {
  if (typeof e == "string") {
    const t = document.getElementById(e);
    if (!t)
      throw new Error(`Could not find element with id '${e}'`);
    return t;
  } else if (e instanceof HTMLElement)
    return e;
  throw new Error(`Invalid element: ${e}`);
}
function qt(e) {
  return e && e.newWindow === false ? "_self" : "_blank";
}
function ha(e, t = {}) {
  const n = Object.hasOwnProperty.call(t, "height") ? `${t.height}` : `${oa}`, i = Object.hasOwnProperty.call(t, "width") ? `${t.width}` : void 0;
  e.setAttribute("height", n), i ? e.setAttribute("width", i) : e.setAttribute("style", "width:100%;");
}
function fa(e, t, n = {}) {
  var a, _, u;
  const i = (u = (_ = (a = e.allow) == null ? void 0 : a.split(";")) == null ? void 0 : _.map((r) => r.trim())) != null ? u : [];
  n.crossOriginIsolated && !i.includes("cross-origin-isolated") && i.push("cross-origin-isolated"), i.length > 0 && (t.allow = i.join("; "));
}
var da = class {
  constructor(t) {
    this.pending = {}, this.port = t, this.port.onmessage = this.messageListener.bind(this);
  }
  request({ type: t, payload: n }) {
    return new Promise((i, a) => {
      const _ = Tn();
      this.pending[_] = { resolve: i, reject: a }, this.port.postMessage({
        type: t,
        payload: {
          ...n,
          __reqid: _
        }
      });
    });
  }
  messageListener(t) {
    var r;
    if (typeof ((r = t.data.payload) == null ? void 0 : r.__reqid) != "string")
      return;
    const { type: n, payload: i } = t.data, { __reqid: a, __success: _, __error: u } = i;
    this.pending[a] && (_ ? this.pending[a].resolve(this.cleanResult(i)) : this.pending[a].reject(u ? `${n}: ${u}` : n), delete this.pending[a]);
  }
  cleanResult(t) {
    const n = { ...t };
    return delete n.__reqid, delete n.__success, delete n.__error, Object.keys(n).length ? n : null;
  }
};
var ga = class {
  constructor(t, n) {
    this.editor = {
      openFile: (i) => this._rdc.request({
        type: "SDK_OPEN_FILE",
        payload: { path: i }
      }),
      setCurrentFile: (i) => this._rdc.request({
        type: "SDK_SET_CURRENT_FILE",
        payload: { path: i }
      }),
      setTheme: (i) => this._rdc.request({
        type: "SDK_SET_UI_THEME",
        payload: { theme: i }
      }),
      setView: (i) => this._rdc.request({
        type: "SDK_SET_UI_VIEW",
        payload: { view: i }
      }),
      showSidebar: (i = true) => this._rdc.request({
        type: "SDK_TOGGLE_SIDEBAR",
        payload: { visible: i }
      })
    }, this.preview = {
      origin: "",
      getUrl: () => this._rdc.request({
        type: "SDK_GET_PREVIEW_URL",
        payload: {}
      }).then((i) => {
        var a;
        return (a = i == null ? void 0 : i.url) != null ? a : null;
      }),
      setUrl: (i = "/") => {
        if (typeof i != "string" || !i.startsWith("/"))
          throw new Error(`Invalid argument: expected a path starting with '/', got '${i}'`);
        return this._rdc.request({
          type: "SDK_SET_PREVIEW_URL",
          payload: { path: i }
        });
      }
    }, this._rdc = new da(t), Object.defineProperty(this.preview, "origin", {
      value: typeof n.previewOrigin == "string" ? n.previewOrigin : null,
      writable: false
    });
  }
  applyFsDiff(t) {
    const n = (i) => i !== null && typeof i == "object";
    if (!n(t) || !n(t.create))
      throw new Error("Invalid diff object: expected diff.create to be an object.");
    if (!Array.isArray(t.destroy))
      throw new Error("Invalid diff object: expected diff.destroy to be an array.");
    return this._rdc.request({
      type: "SDK_APPLY_FS_DIFF",
      payload: t
    });
  }
  getDependencies() {
    return this._rdc.request({
      type: "SDK_GET_DEPS_SNAPSHOT",
      payload: {}
    });
  }
  getFsSnapshot() {
    return this._rdc.request({
      type: "SDK_GET_FS_SNAPSHOT",
      payload: {}
    });
  }
};
var Ye = [];
var ma = class {
  constructor(t) {
    this.id = Tn(), this.element = t, this.pending = new Promise((n, i) => {
      const a = ({ data: p, ports: g }) => {
        (p == null ? void 0 : p.action) === "SDK_INIT_SUCCESS" && p.id === this.id && (this.vm = new ga(g[0], p.payload), n(this.vm), u());
      }, _ = () => {
        var p;
        (p = this.element.contentWindow) == null || p.postMessage(
          {
            action: "SDK_INIT",
            id: this.id
          },
          "*"
        );
      };
      function u() {
        window.clearInterval(o), window.removeEventListener("message", a);
      }
      window.addEventListener("message", a), _();
      let r = 0;
      const o = window.setInterval(() => {
        if (this.vm) {
          u();
          return;
        }
        if (r >= aa) {
          u(), i("Timeout: Unable to establish a connection with the StackBlitz VM"), Ye.forEach((p, g) => {
            p.id === this.id && Ye.splice(g, 1);
          });
          return;
        }
        r++, _();
      }, ra);
    }), Ye.push(this);
  }
};
var ba = (e) => {
  var n;
  const t = e instanceof Element ? "element" : "id";
  return (n = Ye.find((i) => i[t] === e)) != null ? n : null;
};
function ya(e, t) {
  const n = document.createElement("input");
  return n.type = "hidden", n.name = e, n.value = t, n;
}
function va(e) {
  return e.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
}
function Sn({
  template: e,
  title: t,
  description: n,
  dependencies: i,
  files: a,
  settings: _
}) {
  if (!Di.includes(e)) {
    const p = Di.map((g) => `'${g}'`).join(", ");
    console.warn(`Unsupported project.template: must be one of ${p}`);
  }
  const u = [], r = (p, g, b = "") => {
    u.push(ya(p, typeof g == "string" ? g : b));
  };
  r("project[title]", t), typeof n == "string" && n.length > 0 && r("project[description]", n), r("project[template]", e, "javascript"), i && (e === "node" ? console.warn(
    "Invalid project.dependencies: dependencies must be provided as a 'package.json' file when using the 'node' template."
  ) : r("project[dependencies]", JSON.stringify(i))), _ && r("project[settings]", JSON.stringify(_)), Object.entries(a).forEach(([p, g]) => {
    r(`project[files][${va(p)}]`, g);
  });
  const o = document.createElement("form");
  return o.method = "POST", o.setAttribute("style", "display:none!important;"), o.append(...u), o;
}
function wa(e, t) {
  const n = Sn(e);
  return n.action = Kt("/run", t), n.id = "sb_run", `<!doctype html>
<html>
<head><title></title></head>
<body>
  ${n.outerHTML}
  <script>document.getElementById('${n.id}').submit();<\/script>
</body>
</html>`;
}
function Ea(e, t) {
  const n = Sn(e);
  n.action = Wt("/run", t), n.target = qt(t), document.body.appendChild(n), n.submit(), document.body.removeChild(n);
}
function ut(e) {
  var n;
  return e != null && e.contentWindow ? ((n = ba(e)) != null ? n : new ma(e)).pending : Promise.reject("Provided element is not an iframe.");
}
function xa(e, t) {
  Ea(e, t);
}
function Oa(e, t) {
  const n = Wt(`/edit/${e}`, t), i = qt(t);
  window.open(n, i);
}
function Ta(e, t) {
  const n = Wt(`/github/${e}`, t), i = qt(t);
  window.open(n, i);
}
function ka(e, t, n) {
  var u;
  const i = Ht(e), a = wa(t, n), _ = document.createElement("iframe");
  return Gt(i, _, n), (u = _.contentDocument) == null || u.write(a), ut(_);
}
function Sa(e, t, n) {
  const i = Ht(e), a = document.createElement("iframe");
  return a.src = Kt(`/edit/${t}`, n), Gt(i, a, n), ut(a);
}
function Ra(e, t, n) {
  const i = Ht(e), a = document.createElement("iframe");
  return a.src = Kt(`/github/${t}`, n), Gt(i, a, n), ut(a);
}
var Xt = {
  connect: ut,
  embedGithubProject: Ra,
  embedProject: ka,
  embedProjectId: Sa,
  openGithubProject: Ta,
  openProject: xa,
  openProjectId: Oa
};
var Aa = (e) => {
  const { code: t, title: n, description: i } = e;
  Xt.openProject(
    {
      title: n,
      description: i,
      template: "html",
      files: {
        "index.html": Ae({ code: t }),
        ...e.customFiles
      }
    },
    {
      openFile: "index.html"
    }
  );
};
var Na = (e) => {
  const { code: t, title: n, description: i } = e;
  Xt.openProject(
    {
      title: n,
      description: i,
      template: "node",
      files: {
        "src/Demo.tsx": t,
        "src/main.tsx": ot(W.REACT),
        "index.html": Ae({ src: "/src/main.tsx" }),
        "package.json": _t({
          type: W.REACT,
          platform: fe.STACKBLITZ,
          code: t
        }),
        "vite.config.js": en(W.REACT),
        ".stackblitzrc": Yi(),
        "tsconfig.json": at(W.REACT),
        ...e.customFiles
      }
    },
    {
      openFile: "src/Demo.tsx"
    }
  );
};
var Ca = (e) => {
  const { code: t, title: n, description: i } = e;
  Xt.openProject(
    {
      title: n,
      description: i,
      template: "node",
      files: {
        "src/Demo.vue": t,
        "src/main.ts": ot(W.VUE),
        "index.html": Ae({ src: "/src/main.ts" }),
        "package.json": _t({
          type: W.VUE,
          platform: fe.STACKBLITZ,
          code: t
        }),
        "vite.config.js": en(W.VUE),
        ".stackblitzrc": Yi(),
        "tsconfig.json": at(W.VUE),
        ...e.customFiles
      }
    },
    {
      openFile: "src/Demo.vue"
    }
  );
};
function Ma(e) {
  var a, _, u;
  const t = (a = (e.templates || []).find(
    (r) => r.scope === "global"
  )) == null ? void 0 : a.files, n = (_ = (e.templates || []).find(
    (r) => r.scope === e.type
  )) == null ? void 0 : _.files, i = (u = (e.templates || []).find(
    (r) => r.scope === e.scope
  )) == null ? void 0 : u.files;
  if (e.customFiles = {
    ...t,
    ...n,
    ...i
  }, e.type === W.VUE)
    return Ca(e);
  if (e.type === W.REACT)
    return Na(e);
  if (e.type === W.HTML)
    return Aa(e);
}
var La = defineComponent({
  __name: "stackblitz",
  props: {
    code: {},
    type: {},
    title: {},
    description: {},
    templates: {},
    scope: {}
  },
  setup(e) {
    const t = e;
    function n() {
      Ma({
        code: t.code,
        type: t.type,
        title: t.title || zi,
        description: t.description || Fi,
        templates: t.templates || [],
        scope: t.scope
      });
    }
    return (i, a) => (openBlock(), createElementBlock("svg", {
      onClick: n,
      viewBox: "64 64 896 896",
      focusable: "false",
      "data-icon": "thunderbolt",
      width: "20px",
      height: "20px",
      fill: "currentColor",
      "aria-hidden": "true"
    }, a[0] || (a[0] = [
      createBaseVNode("path", { d: "M848 359.3H627.7L825.8 109c4.1-5.3.4-13-6.3-13H436c-2.8 0-5.5 1.5-6.9 4L170 547.5c-3.1 5.3.7 12 6.9 12h174.4l-89.4 357.6c-1.9 7.8 7.5 13.3 13.3 7.7L853.5 373c5.2-4.9 1.7-13.7-5.5-13.7zM378.2 732.5l60.3-241H281.1l189.6-327.4h224.6L487 427.4h211L378.2 732.5z" }, null, -1)
    ])));
  }
});
var Ia = {};
var Da = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "lucide lucide-github"
};
function Ba(e, t) {
  return openBlock(), createElementBlock("svg", Da, t[0] || (t[0] = [
    createBaseVNode("path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }, null, -1),
    createBaseVNode("path", { d: "M9 18c-4.51 2-5-2-7-2" }, null, -1)
  ]));
}
var Pa = me(Ia, [["render", Ba]]);
var $a = {};
var Ua = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "lucide lucide-gitlab"
};
function ja(e, t) {
  return openBlock(), createElementBlock("svg", Ua, t[0] || (t[0] = [
    createBaseVNode("path", { d: "m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" }, null, -1)
  ]));
}
var za = me($a, [["render", ja]]);
var Fa = {};
var Wa = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  fill: "none",
  version: "1.1",
  width: "18",
  height: "18",
  viewBox: "0 0 24 24"
};
function Ka(e, t) {
  return openBlock(), createElementBlock("svg", Wa, t[0] || (t[0] = [
    createBaseVNode("defs", null, [
      createBaseVNode("clipPath", { id: "master_svg0_27_0291" }, [
        createBaseVNode("rect", {
          x: "0",
          y: "0",
          width: "24",
          height: "24",
          rx: "0"
        })
      ])
    ], -1),
    createBaseVNode("g", { "clip-path": "url(#master_svg0_27_0291)" }, [
      createBaseVNode("g", null, [
        createBaseVNode("path", {
          d: "M4.707482,11.29327L4.707107,11.29289Q4.566455,11.152239999999999,4.382683,11.07612Q4.198912,11,4,11Q3.801088,11,3.617317,11.07612Q3.433545,11.152239999999999,3.292893,11.29289Q3.152241,11.43355,3.07612,11.61732Q3,11.80109,3,12Q3,12.02403,3.001154,12.04804Q3.010111,12.23427,3.085581,12.40477Q3.161051,12.57527,3.292893,12.70711L3.293268,12.70748L8.29289,17.7071Q8.36254,17.776699999999998,8.44443,17.8315Q8.52632,17.886200000000002,8.61732,17.9239Q8.70831,17.9616,8.80491,17.980800000000002Q8.90151,18,9,18Q9.09849,18,9.19509,17.980800000000002Q9.29169,17.9616,9.38268,17.9239Q9.47368,17.886200000000002,9.55557,17.8315Q9.63746,17.776699999999998,9.70711,17.7071L20.7071,6.707107Q20.8478,6.566454,20.9239,6.382683Q21,6.198912,21,6Q21,5.801088,20.9239,5.617317Q20.8478,5.433546,20.7071,5.292894Q20.5665,5.152241,20.3827,5.076121Q20.1989,5,20,5Q19.9741,5,19.9483,5.001339Q19.762999999999998,5.010937,19.5935,5.086334Q19.4241,5.16173,19.2929,5.292893L19.2925,5.293268L9,15.58579L4.707482,11.29327Z",
          "fill-rule": "evenodd",
          fill: "currentColor",
          "fill-opacity": "0.8500000238418579"
        })
      ])
    ], -1)
  ]));
}
var Ga = me(Fa, [["render", Ka]]);
var Ha = { style: { color: "var(--vp-c-text-1)" } };
var qa = 3e3;
var Xa = defineComponent({
  __name: "message",
  props: {
    content: { default: "复制成功！" },
    close: {}
  },
  setup(e, { expose: t }) {
    const n = Ft(), i = e, a = ref(false), _ = (p) => {
      a.value = p;
    }, u = ref(-9999), r = (p) => {
      u.value = p;
    };
    watch(a, (p) => {
      p === true && setTimeout(() => {
        a.value = false;
      }, qa);
    });
    const o = () => {
      i.close();
    };
    return t({
      setVisible: _,
      setTopHeight: r
    }), (p, g) => (openBlock(), createBlock(Transition, {
      name: "slide-fade",
      onAfterLeave: o
    }, {
      default: withCtx(() => [
        a.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass([unref(n).bem("message-notice", "container")]),
          style: normalizeStyle({ top: u.value + "px" })
        }, [
          createVNode(Ga),
          createBaseVNode("span", Ha, toDisplayString(p.content), 1)
        ], 6)) : createCommentVNode("", true)
      ]),
      _: 1
    }));
  }
});
var Mt = [];
var Va = {
  open: () => {
    const e = document.createElement("div"), t = createApp(Xa, {
      content: "已将代码复制至剪切板！",
      close: () => {
        document.body.removeChild(e), Mt.pop(), t.unmount();
      }
    }), n = t.mount(e);
    document.body.appendChild(e);
    const i = Mt.length, a = i === 0 ? 10 : (i + 1) * 10 + i * 42;
    n.setTopHeight(a), n.setVisible(true), Mt.push(n);
  }
};
var Za = defineComponent({
  __name: "index",
  props: {
    content: {}
  },
  setup(e) {
    const t = Ft(), n = e;
    return (i, a) => (openBlock(), createElementBlock("div", {
      class: normalizeClass([unref(t).bem("tooltip", "wrapper")])
    }, [
      createBaseVNode("div", {
        class: normalizeClass([unref(t).bem("tooltip", "content")])
      }, [
        renderSlot(i.$slots, "content", {}, () => [
          createTextVNode(toDisplayString(n.content), 1)
        ], true)
      ], 2),
      renderSlot(i.$slots, "default", {}, void 0, true)
    ], 2));
  }
});
var we = me(Za, [["__scopeId", "data-v-6bd5801c"]]);
var Qa = { style: { "flex-shrink": "0" } };
var Ja = ["innerHTML"];
var Ya = ["onClick"];
var eo = ["onClick"];
var to = { class: "language-html" };
var io = ["innerHTML"];
var So = defineComponent({
  __name: "index",
  props: {
    title: { default: "默认标题" },
    description: { default: "描述内容" },
    reactComponent: {},
    vueCode: {},
    reactCode: {},
    htmlCode: {},
    order: { default: "vue,react,html" },
    visible: { type: Boolean, default: true },
    select: { default: W.VUE },
    github: { default: "" },
    gitlab: { default: "" },
    reactCreateElement: {},
    reactCreateRoot: {},
    stackblitz: {},
    codesandbox: {},
    codeplayer: {},
    scope: {},
    files: {}
  },
  setup(e) {
    const t = e, n = computed(() => JSON.parse(decodeURIComponent(t.stackblitz || "{}"))), i = computed(() => JSON.parse(decodeURIComponent(t.codesandbox || "{}")));
    computed(() => JSON.parse(decodeURIComponent(t.codeplayer || "{}")));
    const a = ref(""), _ = computed(() => {
      var B;
      const C = JSON.parse(decodeURIComponent(t.files || "{}"))[p.value];
      return C && !C[a.value] && (a.value = ((B = Object.keys(C)) == null ? void 0 : B[0]) || ""), C;
    }), u = computed(() => t.order.split(",").map((x) => x.trim())), r = inject("coot-code-type", {}), o = inject(
      "set-coot-code-type",
      (x) => {
      }
    ), p = ref(W.VUE);
    function g(x) {
      p.value = x, typeof o == "function" && o(x);
    }
    const b = Ft(), { isCodeFold: d, setCodeFold: A } = Ps(), { clickCopy: M } = Bs(), L = computed(() => t[`${p.value}Code`]), f = computed(() => _.value && _.value[a.value] ? Ii(_.value[a.value]) : Ii(L.value)), l = computed(() => [W.VUE, W.REACT, W.HTML].filter((x) => t[`${x}Code`]).sort((x, C) => u.value.indexOf(x) - u.value.indexOf(C)));
    watch(
      () => r == null ? void 0 : r.value,
      (x) => {
        x && t[`${x}Code`] && (p.value = x);
      },
      { immediate: true }
    );
    const m = () => {
      window.open(t.github, "_blank");
    }, R = () => {
      window.open(t.gitlab, "_blank");
    };
    watch(
      () => p.value,
      (x) => {
        !x || (x === "html" ? y() : x === "react" && s());
      },
      {
        immediate: true
      }
    );
    const E = () => {
      M(L.value || ""), Va.open();
    }, k = ref();
    let c;
    function y() {
      nextTick(() => {
        if (!k.value)
          return;
        const x = k.value.querySelector("iframe"), C = x.contentDocument || x.contentWindow.document;
        C.open();
        const B = document.head.querySelectorAll("style"), z = document.head.querySelectorAll('link[as="style"]'), O = document.head.querySelectorAll('link[as="font"]'), S = Array.from(B).map((H) => `<style replace="true">${H.innerText}</style>`).join(`
`), I = Array.from(z).map((H) => H.outerHTML).join(`
`), P = Array.from(O).map((H) => H.outerHTML).join(`
`);
        C.write(
          Vr({
            code: t.htmlCode || "",
            styles: S,
            links: I + `
` + P
          })
        ), C.close();
        const j = c = function() {
          requestAnimationFrame(() => {
            x.style.height = C.body.scrollHeight + "px", C.documentElement && (C.documentElement.className = document.documentElement.className), j === c && c();
          });
        };
        c();
      });
    }
    watch(
      () => t.htmlCode,
      (x) => {
        x && y();
      },
      { immediate: true }
    );
    const h = ref();
    let T = null;
    function s() {
      nextTick(() => {
        t.reactComponent && p.value === "react" && t.reactCode && (T || (T = t.reactCreateRoot(h.value)), T.render(t.reactCreateElement(t.reactComponent, {}, null)));
      });
    }
    watch(
      () => [h.value, t.reactComponent],
      (x) => {
        h.value ? s() : T && (T.unmount(), T = null);
      },
      { immediate: true, deep: true }
    ), watch(
      () => t.reactCode,
      (x) => {
        x && T && T.render(t.reactCreateElement(t.reactComponent, {}, null));
      },
      { immediate: true, deep: true }
    ), watch(
      () => t.select,
      (x) => {
        x && t[`${x}Code`] && (p.value = x);
      },
      {
        immediate: true
      }
    ), watch(
      () => l.value,
      () => {
        t[`${p.value}Code`] || (p.value = l.value[0]);
      },
      { immediate: true, deep: true }
    );
    function w(x) {
      a.value = x, v.value && (v.value.style.height = "auto"), nextTick(() => {
        v.value.style.height = v.value.scrollHeight + "px";
      });
    }
    const v = ref();
    return watch(
      () => d.value,
      (x) => {
        nextTick(() => {
          v.value && (x ? v.value.style.height = 0 : v.value.style.height = v.value.scrollHeight + "px");
        });
      }
    ), (x, C) => (openBlock(), createElementBlock("div", {
      class: normalizeClass([unref(b).e("container")])
    }, [
      createBaseVNode("section", {
        class: normalizeClass([unref(b).bem("preview")])
      }, [
        p.value === "vue" ? renderSlot(x.$slots, "vue", { key: 0 }) : p.value === "html" ? (openBlock(), createElementBlock("div", {
          key: 1,
          ref_key: "htmlContainerRef",
          ref: k
        }, C[3] || (C[3] = [
          createBaseVNode("iframe", { style: { width: "100%", height: "auto", border: "none" } }, null, -1)
        ]), 512)) : p.value === "react" ? (openBlock(), createElementBlock("div", {
          key: 2,
          ref_key: "reactContainerRef",
          ref: h
        }, null, 512)) : createCommentVNode("", true)
      ], 2),
      createBaseVNode("section", {
        class: normalizeClass([unref(b).bem("description")])
      }, [
        x.title ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass([unref(b).bem("description", "title")])
        }, [
          createBaseVNode("div", Qa, toDisplayString(x.title), 1)
        ], 2)) : createCommentVNode("", true),
        x.description ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass([unref(b).bem("description", "content")]),
          innerHTML: x.description
        }, null, 10, Ja)) : createCommentVNode("", true),
        t.description || !t.title && !t.description ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass([unref(b).bem("description", "split-line")])
        }, null, 2)) : createCommentVNode("", true),
        l.value.length > 1 && x.visible ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: normalizeClass([unref(b).bem("lang-tabs")])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(l.value, (B) => (openBlock(), createElementBlock("div", {
            key: B,
            class: normalizeClass([unref(b).bem("tab"), p.value === B && unref(b).bem("active-tab")]),
            onClick: (z) => g == null ? void 0 : g(B)
          }, toDisplayString(B), 11, Ya))), 128))
        ], 2)) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass([unref(b).bem("description", "handle-btn")])
        }, [
          n.value.show ? (openBlock(), createBlock(we, {
            key: 0,
            content: "在 stackblitz 中打开"
          }, {
            default: withCtx(() => [
              createVNode(La, {
                code: L.value,
                type: p.value,
                scope: x.scope || "",
                templates: n.value.templates || []
              }, null, 8, ["code", "type", "scope", "templates"])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          i.value.show ? (openBlock(), createBlock(we, {
            key: 1,
            content: "在 codesandbox 中打开"
          }, {
            default: withCtx(() => [
              createVNode(sa, {
                code: L.value,
                type: p.value,
                scope: x.scope || "",
                templates: i.value.templates || []
              }, null, 8, ["code", "type", "scope", "templates"])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          x.github ? (openBlock(), createBlock(we, {
            key: 2,
            content: "在 github 中打开"
          }, {
            default: withCtx(() => [
              createVNode(Pa, { onClick: m })
            ]),
            _: 1
          })) : createCommentVNode("", true),
          x.gitlab ? (openBlock(), createBlock(we, {
            key: 3,
            content: "在 gitlab 中打开"
          }, {
            default: withCtx(() => [
              createVNode(za, { onClick: R })
            ]),
            _: 1
          })) : createCommentVNode("", true),
          unref(d) ? (openBlock(), createBlock(we, {
            key: 5,
            content: "展开代码"
          }, {
            default: withCtx(() => [
              createVNode($n, {
                onClick: C[1] || (C[1] = (B) => unref(A)(false))
              })
            ]),
            _: 1
          })) : (openBlock(), createBlock(we, {
            key: 4,
            content: "收起代码"
          }, {
            default: withCtx(() => [
              createVNode(Fn, {
                onClick: C[0] || (C[0] = (B) => unref(A)(true))
              })
            ]),
            _: 1
          })),
          createVNode(we, { content: "复制代码" }, {
            default: withCtx(() => [
              createVNode(Hn, { onClick: E })
            ]),
            _: 1
          })
        ], 2)
      ], 2),
      createBaseVNode("section", {
        class: normalizeClass([unref(b).bem("source")]),
        ref_key: "sourceRef",
        ref: v
      }, [
        Object.keys(_.value).length ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass([unref(b).bem("file-tabs")])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(_.value), (B) => (openBlock(), createElementBlock("div", {
            key: B,
            class: normalizeClass([unref(b).bem("tab"), a.value === B && unref(b).bem("active-tab")]),
            onClick: (z) => w(B)
          }, toDisplayString(B), 11, eo))), 128))
        ], 2)) : createCommentVNode("", true),
        createBaseVNode("pre", to, [
          createBaseVNode("code", { innerHTML: f.value }, null, 8, io)
        ])
      ], 2),
      unref(d) ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(unref(b).bem("fold")),
        onClick: C[2] || (C[2] = (B) => unref(A)(true))
      }, [
        createVNode(Zn),
        C[4] || (C[4] = createTextVNode("收起代码 "))
      ], 2))
    ], 2));
  }
});
var $i = [
  /<demo(\s|\n)((.|\n)*)><\/demo>/,
  /<demo(\s|\n)((.|\n)*)\/>/
];
var no = /<\s*script[^>]*\blang=['"]ts['"][^>]*/;
var so = /<\s*script[^>]*\bsetup\b[^>]*/;
var ro = /<\s*script\s+(setup|lang='ts'|lang="ts")?\s*(setup|lang='ts'|lang="ts")?\s*>/;
var ae = (e, t, n, i) => {
  const a = e.sfcBlocks.scripts, _ = a.findIndex((o) => !!(so.test(o.tagOpen) || no.test(o.tagOpen))), u = n || "";
  let r = "";
  if (i ? r = n ? `
      const ${u} = ref();
      onMounted(async () => {
        ${u}.value = (await import('${t}')).default;
      });
      `.trim() : `
      onMounted(async () => {
        await import('${t}');
      });
      `.trim() : r = n ? `import ${u} from '${t}'` : `import '${t}'`, _ === -1) {
    const o = {
      type: "script",
      tagClose: "<\/script>",
      tagOpen: "<script setup lang='ts'>",
      content: `<script setup lang='ts'>
        ${r}
        <\/script>`,
      contentStripped: r
    };
    a.push(o);
  } else {
    const o = a[0];
    if (o.content.includes(t) && (!n || o.content.includes(u)))
      a[0].content = o.content;
    else {
      const p = `<script lang="ts" setup>
`;
      a[0].content = a[0].content.replace(
        ro,
        p
      ), a[0].content = a[0].content.replace(
        p,
        `<script setup>

      ${r}
`
      );
    }
  }
};
var ao = (e) => {
  let t = true;
  const n = [];
  for (; t; ) {
    const i = e.lastIndexOf("/");
    if (i === -1)
      t = false;
    else {
      const a = e.substring(i + 1);
      n.unshift(a), e = e.substring(0, i);
    }
  }
  return "Temp" + btoa(encodeURIComponent(n.join("-").split(".")[0])).replace(/=/g, "Equal");
};
var oo = /title="(.*?)"/;
var lo = /vue="(.*?)"/;
var _o = /html="(.*?)"/;
var uo = /react="(.*?)"/;
var co = /description="(.*?)"/;
var po = /order="(.*?)"/;
var ho = /select="(.*?)"/;
var fo = /github="(.*?)"/;
var go = /gitlab="(.*?)"/;
var mo = /stackblitz="(.*?)"/;
var bo = /codesandbox="(.*?)"/;
var yo = /codeplayer="(.*?)"/;
var vo = /scope="(.*?)"/;
var wo = /vueFiles=("\{((.|\n)*?)\}"|"\[((.|\n)*?)\]")/;
var Eo = /reactFiles=("\{((.|\n)*?)\}"|"\[((.|\n)*?)\]")/;
var xo = /htmlFiles=("\{((.|\n)*?)\}"|"\[((.|\n)*?)\]")/;
var Ui = (e, t, n, i) => {
  var Ce;
  const {
    demoDir: a,
    tab: _ = {},
    stackblitz: u = { show: false },
    codesandbox: r = { show: false },
    codeplayer: o = { show: false }
  } = i || {};
  let {
    order: p = "vue,react,html",
    visible: g = true,
    select: b = (_.order || "vue,react,html").split(",")[0] || "vue"
  } = _;
  const d = {
    vue: "",
    title: "",
    description: "",
    html: "",
    react: ""
  }, A = t.content.match(oo), M = t.content.match(lo), L = t.content.match(_o), f = t.content.match(uo), l = t.content.match(co), m = t.content.match(po), R = t.content.match(ho), E = t.content.match(fo), k = t.content.match(go), c = t.content.match(mo), y = t.content.match(bo), h = t.content.match(yo), T = ((Ce = t.content.match(vo)) == null ? void 0 : Ce[1]) || "", s = t.content.match(wo), w = t.content.match(Eo), v = t.content.match(xo), x = a || import_path.default.dirname(n.path);
  m != null && m[1] && (p = m[1]), R != null && R[1] && (b = R[1]);
  let C = "", B = "";
  E != null && E[1] && (C = E[1]), k != null && k[1] && (B = k[1]), c != null && c[1] && (u.show = c[1] === "true"), y != null && y[1] && (r.show = y[1] === "true"), h != null && h[1] && (o.show = h[1] === "true"), M != null && M[1] && (d.vue = import_path.default.join(x, M[1]).replace(/\\/g, "/")), L != null && L[1] && (d.html = import_path.default.join(x, L[1]).replace(/\\/g, "/")), f != null && f[1] && (d.react = import_path.default.join(x, f[1]).replace(/\\/g, "/")), d.title = A ? A[1] : "", d.description = l ? l[1] : "";
  const z = d.vue ? import_path.default.resolve(
    a || import_path.default.dirname(n.path),
    (M == null ? void 0 : M[1]) || "."
  ).replace(/\\/g, "/") : "", O = d.html ? import_path.default.resolve(
    a || import_path.default.dirname(n.path),
    (L == null ? void 0 : L[1]) || "."
  ).replace(/\\/g, "/") : "", S = d.react ? import_path.default.resolve(
    a || import_path.default.dirname(n.path),
    (f == null ? void 0 : f[1]) || "."
  ).replace(/\\/g, "/") : "", I = import_path.default.resolve(
    x,
    d.vue || d.react || d.html || "."
  ).replace(/\\/g, "/"), P = ao(I), j = `react${P}`;
  ae(
    n,
    "vitepress-demo-plugin",
    "{ VitepressDemoBox }"
  ), ae(n, "vitepress-demo-plugin/dist/style.css"), ae(n, "vue", "{ ref, onMounted }"), d.vue && ae(n, z, P), d.react && (ae(
    n,
    "react",
    "{ createElement as reactCreateElement }"
  ), ae(
    n,
    "react-dom/client",
    "{ createRoot as reactCreateRoot }"
  ), ae(
    n,
    S,
    j,
    true
  ));
  const H = d.html ? `TempCodeHtml${P}` : "''", Q = d.react ? `TempCodeReact${P}` : "''", be = d.vue ? `TempCodeVue${P}` : "''";
  d.html && ae(n, `${O}?raw`, H), d.react && ae(n, `${S}?raw`, Q), d.vue && ae(n, `${z}?raw`, be);
  const Z = {
    vue: {},
    react: {},
    html: {}
  };
  function te(ne) {
    return ne.replace(/'/g, '"').replace(/\\n/g, "").trim().replace(/^"/, "").replace(/"$/, "").replace(/,(\s|\n)*\}$/, "}").replace(/,(\s|\n)*\]$/, "]");
  }
  const Ne = {
    vue: te((s == null ? void 0 : s[1]) || ""),
    react: te((w == null ? void 0 : w[1]) || ""),
    html: te((v == null ? void 0 : v[1]) || "")
  };
  for (const ne in Ne) {
    let je = Ne[ne];
    if (je)
      try {
        const Te = JSON.parse(je);
        Array.isArray(Te) ? Te.forEach((_e) => {
          const ue = import_path.default.basename(_e);
          Z[ne][ue] = _e;
        }) : Z[ne] = Te;
        for (const _e in Z[ne]) {
          const ue = Z[ne][_e];
          if (ue) {
            const Me = import_path.default.resolve(a || import_path.default.dirname(n.path), ue || ".").replace(/\\/g, "/");
            if (import_fs.default.existsSync(Me)) {
              const se = import_fs.default.readFileSync(Me, "utf-8");
              Z[ne][_e] = se;
            } else
              delete Z[ne][_e];
          } else
            delete Z[ne][_e];
        }
      } catch {
      }
  }
  return `
  <ClientOnly>
    <vitepress-demo-box 
      title="${d.title}"
      description="${d.description}"
      select="${b}"
      order="${p}"
      github="${C}"
      gitlab="${B}"
      stackblitz="${encodeURIComponent(JSON.stringify(u))}"
      codesandbox="${encodeURIComponent(JSON.stringify(r))}"
      codeplayer="${encodeURIComponent(JSON.stringify(o))}"
      files="${encodeURIComponent(JSON.stringify(Z))}"
      scope="${T || ""}"
      :visible="!!${g}"
      ${d.html ? `
            :htmlCode="${H}"
            ` : ""}
      ${d.vue ? `
            :vueCode="${be}"
            ` : ""}
      ${d.react ? `
            :reactCode="${Q}"
            :reactComponent="${j}"
            :reactCreateRoot="reactCreateRoot"
            :reactCreateElement="reactCreateElement"
            ` : ""}
      >
      ${d.vue ? `
            <template #vue>
              <${P}></${P}>
            </template>
            ` : ""}
    </vitepress-demo-box>
  </ClientOnly>`;
};
var Ro = (e, t) => {
  const n = e.renderer.rules.html_inline, i = e.renderer.rules.html_block;
  e.renderer.rules.html_inline = (a, _, u, r, o) => {
    const p = a[_];
    return p.content = p.content.replace(/<!--[\s\S]*?-->/g, ""), $i.some((g) => g.test(p.content)) ? Ui(e, p, r, t) : n(a, _, u, r, o);
  }, e.renderer.rules.html_block = (a, _, u, r, o) => {
    const p = a[_];
    return p.content = p.content.replace(/<!--[\s\S]*?-->/g, ""), $i.some((g) => g.test(p.content)) ? Ui(e, p, r, t) : i(a, _, u, r, o);
  };
};
export {
  So as VitepressDemoBox,
  Ro as vitepressDemoPlugin
};
/*! Bundled license information:

vitepress-demo-plugin/dist/index.js:
  (*!
   * is-whitespace <https://github.com/jonschlinkert/is-whitespace>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
  (*!
   * condense-newlines <https://github.com/jonschlinkert/condense-newlines>
   *
   * Copyright (c) 2014 Jon Schlinkert, contributors.
   * Licensed under the MIT License
   *)
  (*!
   * pretty <https://github.com/jonschlinkert/pretty>
   *
   * Copyright (c) 2013-2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
//# sourceMappingURL=vitepress-demo-plugin.js.map
