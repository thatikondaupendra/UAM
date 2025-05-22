"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RegisterUserDto = /*#__PURE__*/function () {
  function RegisterUserDto(data) {
    _classCallCheck(this, RegisterUserDto);
    console.log(data);
    this.username = data.user.username;
    this.password = data.password;
  }
  return _createClass(RegisterUserDto, [{
    key: "validate",
    value: function validate() {
      var errors = [];
      if (typeof this.username !== 'string' || this.username.length < 3 || this.username.length > 20) {
        errors.push('Username must be a string between 3 and 20 characters long.');
      }
      if (typeof this.password !== 'string' || this.password.length < 6) {
        errors.push('Password must be a string at least 6 characters long.');
      }
      return errors;
    }
  }]);
}();
var LoginUserDto = /*#__PURE__*/function () {
  function LoginUserDto(data) {
    _classCallCheck(this, LoginUserDto);
    this.username = data.username;
    this.password = data.password;
  }
  return _createClass(LoginUserDto, [{
    key: "validate",
    value: function validate() {
      var errors = [];
      if (typeof this.username !== 'string') {
        errors.push('Username must be a string.');
      }
      if (typeof this.password !== 'string') {
        errors.push('Password must be a string.');
      }
      return errors;
    }
  }]);
}();
module.exports = {
  RegisterUserDto: RegisterUserDto,
  LoginUserDto: LoginUserDto
};