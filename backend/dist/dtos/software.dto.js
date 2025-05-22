"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CreateSoftwareDto = /*#__PURE__*/function () {
  function CreateSoftwareDto(data) {
    _classCallCheck(this, CreateSoftwareDto);
    // Assign properties from the input data
    this.name = data.name;
    this.description = data.description;
    this.accessLevels = data.accessLevels;
  }

  /**
   * Validates the properties of the DTO manually.
   * @returns {string[]} An array of error messages, or an empty array if valid.
   */
  return _createClass(CreateSoftwareDto, [{
    key: "validate",
    value: function validate() {
      var errors = [];

      // --- Validate 'name' ---
      if (typeof this.name !== 'string') {
        errors.push('Software name must be a string.');
      } else if (this.name.length < 3) {
        errors.push('Software name must be at least 3 characters long.');
      }

      // --- Validate 'description' ---
      if (typeof this.description !== 'string') {
        errors.push('Description must be a string.');
      } else if (this.description.length < 10) {
        errors.push('Description must be at least 10 characters long.');
      }

      // --- Validate 'accessLevels' ---
      if (!Array.isArray(this.accessLevels)) {
        errors.push('Access levels must be an array.');
      } else if (this.accessLevels.length === 0) {
        errors.push('At least one access level must be selected.');
      } else {
        var allowedAccessLevels = ['Read', 'Write', 'Admin'];
        this.accessLevels.forEach(function (level, index) {
          if (typeof level !== 'string' || !allowedAccessLevels.includes(level)) {
            errors.push("Invalid access level provided at index ".concat(index, ": \"").concat(level, "\". Must be one of: ").concat(allowedAccessLevels.join(', '), "."));
          }
        });
      }
      return errors;
    }
  }]);
}();
module.exports = {
  CreateSoftwareDto: CreateSoftwareDto
};