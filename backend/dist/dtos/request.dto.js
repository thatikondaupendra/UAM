"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CreateRequestDto = /*#__PURE__*/function () {
  function CreateRequestDto(data) {
    _classCallCheck(this, CreateRequestDto);
    // Assign properties from the input data
    this.softwareId = data.softwareId;
    this.accessType = data.accessType;
    this.reason = data.reason;
  }

  /**
   * Validates the properties of the DTO manually.
   * @returns {string[]} An array of error messages, or an empty array if valid.
   */
  return _createClass(CreateRequestDto, [{
    key: "validate",
    value: function validate() {
      var errors = [];

      // --- Validate 'softwareId' ---
      // Check if it's a number and an integer
      if (typeof this.softwareId !== 'number' || !Number.isInteger(this.softwareId)) {
        errors.push('Software ID must be an integer.');
      }

      // --- Validate 'accessType' ---
      var allowedAccessTypes = ['Read', 'Write', 'Admin'];
      if (typeof this.accessType !== 'string') {
        errors.push('Access type must be a string.');
      } else if (!allowedAccessTypes.includes(this.accessType)) {
        errors.push("Invalid access type. Must be one of: ".concat(allowedAccessTypes.join(', '), "."));
      }

      // --- Validate 'reason' ---
      if (typeof this.reason !== 'string') {
        errors.push('Reason must be a string.');
      } else if (this.reason.length < 10) {
        errors.push('Reason must be at least 10 characters long.');
      }
      return errors;
    }
  }]);
}();
var UpdateRequestStatusDto = /*#__PURE__*/function () {
  function UpdateRequestStatusDto(data) {
    _classCallCheck(this, UpdateRequestStatusDto);
    // Assign properties from the input data
    this.status = data.status;
  }

  /**
   * Validates the properties of the DTO manually.
   * @returns {string[]} An array of error messages, or an empty array if valid.
   */
  return _createClass(UpdateRequestStatusDto, [{
    key: "validate",
    value: function validate() {
      var errors = [];

      // --- Validate 'status' ---
      var allowedStatuses = ['Approved', 'Rejected'];
      if (typeof this.status !== 'string') {
        errors.push('Status must be a string.');
      } else if (!allowedStatuses.includes(this.status)) {
        errors.push("Invalid status. Must be one of: ".concat(allowedStatuses.join(', '), "."));
      }
      return errors;
    }
  }]);
}();
module.exports = {
  CreateRequestDto: CreateRequestDto,
  UpdateRequestStatusDto: UpdateRequestStatusDto
};