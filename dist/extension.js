/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist-node/index.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/dist-node/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAX: () => (/* reexport safe */ _max_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   NIL: () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   parse: () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   stringify: () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   v1: () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   v1ToV6: () => (/* reexport safe */ _v1ToV6_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   v3: () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   v4: () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   v5: () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   v6: () => (/* reexport safe */ _v6_js__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   v6ToV1: () => (/* reexport safe */ _v6ToV1_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   v7: () => (/* reexport safe */ _v7_js__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   validate: () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   version: () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_13__["default"])
/* harmony export */ });
/* harmony import */ var _max_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./max.js */ "./node_modules/uuid/dist-node/max.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist-node/nil.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist-node/parse.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist-node/v1.js");
/* harmony import */ var _v1ToV6_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./v1ToV6.js */ "./node_modules/uuid/dist-node/v1ToV6.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist-node/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist-node/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist-node/v5.js");
/* harmony import */ var _v6_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./v6.js */ "./node_modules/uuid/dist-node/v6.js");
/* harmony import */ var _v6ToV1_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./v6ToV1.js */ "./node_modules/uuid/dist-node/v6ToV1.js");
/* harmony import */ var _v7_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./v7.js */ "./node_modules/uuid/dist-node/v7.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist-node/validate.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist-node/version.js");
















/***/ }),

/***/ "./node_modules/uuid/dist-node/max.js":
/*!********************************************!*\
  !*** ./node_modules/uuid/dist-node/max.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('ffffffff-ffff-ffff-ffff-ffffffffffff');


/***/ }),

/***/ "./node_modules/uuid/dist-node/md5.js":
/*!********************************************!*\
  !*** ./node_modules/uuid/dist-node/md5.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ "node:crypto");

function md5(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    }
    else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHash)('md5').update(bytes).digest();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);


/***/ }),

/***/ "./node_modules/uuid/dist-node/native.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist-node/native.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ "node:crypto");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ randomUUID: node_crypto__WEBPACK_IMPORTED_MODULE_0__.randomUUID });


/***/ }),

/***/ "./node_modules/uuid/dist-node/nil.js":
/*!********************************************!*\
  !*** ./node_modules/uuid/dist-node/nil.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');


/***/ }),

/***/ "./node_modules/uuid/dist-node/parse.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/dist-node/parse.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist-node/validate.js");

function parse(uuid) {
    if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    let v;
    return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 0xff, ((v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000) & 0xff, (v / 0x100000000) & 0xff, (v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);


/***/ }),

/***/ "./node_modules/uuid/dist-node/regex.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/dist-node/regex.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i);


/***/ }),

/***/ "./node_modules/uuid/dist-node/rng.js":
/*!********************************************!*\
  !*** ./node_modules/uuid/dist-node/rng.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ "node:crypto");

const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.randomFillSync)(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, (poolPtr += 16));
}


/***/ }),

/***/ "./node_modules/uuid/dist-node/sha1.js":
/*!*********************************************!*\
  !*** ./node_modules/uuid/dist-node/sha1.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ "node:crypto");

function sha1(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    }
    else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHash)('sha1').update(bytes).digest();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);


/***/ }),

/***/ "./node_modules/uuid/dist-node/stringify.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist-node/stringify.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist-node/validate.js");

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);


/***/ }),

/***/ "./node_modules/uuid/dist-node/v1.js":
/*!*******************************************!*\
  !*** ./node_modules/uuid/dist-node/v1.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   updateV1State: () => (/* binding */ updateV1State)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");


const _state = {};
function v1(options, buf, offset) {
    let bytes;
    const isV6 = options?._v6 ?? false;
    if (options) {
        const optionsKeys = Object.keys(options);
        if (optionsKeys.length === 1 && optionsKeys[0] === '_v6') {
            options = undefined;
        }
    }
    if (options) {
        bytes = v1Bytes(options.random ?? options.rng?.() ?? (0,_rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), options.msecs, options.nsecs, options.clockseq, options.node, buf, offset);
    }
    else {
        const now = Date.now();
        const rnds = (0,_rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
        updateV1State(_state, now, rnds);
        bytes = v1Bytes(rnds, _state.msecs, _state.nsecs, isV6 ? undefined : _state.clockseq, isV6 ? undefined : _state.node, buf, offset);
    }
    return buf ?? (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(bytes);
}
function updateV1State(state, now, rnds) {
    state.msecs ??= -Infinity;
    state.nsecs ??= 0;
    if (now === state.msecs) {
        state.nsecs++;
        if (state.nsecs >= 10000) {
            state.node = undefined;
            state.nsecs = 0;
        }
    }
    else if (now > state.msecs) {
        state.nsecs = 0;
    }
    else if (now < state.msecs) {
        state.node = undefined;
    }
    if (!state.node) {
        state.node = rnds.slice(10, 16);
        state.node[0] |= 0x01;
        state.clockseq = ((rnds[8] << 8) | rnds[9]) & 0x3fff;
    }
    state.msecs = now;
    return state;
}
function v1Bytes(rnds, msecs, nsecs, clockseq, node, buf, offset = 0) {
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    if (!buf) {
        buf = new Uint8Array(16);
        offset = 0;
    }
    else {
        if (offset < 0 || offset + 16 > buf.length) {
            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
        }
    }
    msecs ??= Date.now();
    nsecs ??= 0;
    clockseq ??= ((rnds[8] << 8) | rnds[9]) & 0x3fff;
    node ??= rnds.slice(10, 16);
    msecs += 12219292800000;
    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    buf[offset++] = (tl >>> 24) & 0xff;
    buf[offset++] = (tl >>> 16) & 0xff;
    buf[offset++] = (tl >>> 8) & 0xff;
    buf[offset++] = tl & 0xff;
    const tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;
    buf[offset++] = (tmh >>> 8) & 0xff;
    buf[offset++] = tmh & 0xff;
    buf[offset++] = ((tmh >>> 24) & 0xf) | 0x10;
    buf[offset++] = (tmh >>> 16) & 0xff;
    buf[offset++] = (clockseq >>> 8) | 0x80;
    buf[offset++] = clockseq & 0xff;
    for (let n = 0; n < 6; ++n) {
        buf[offset++] = node[n];
    }
    return buf;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);


/***/ }),

/***/ "./node_modules/uuid/dist-node/v1ToV6.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist-node/v1ToV6.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ v1ToV6)
/* harmony export */ });
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist-node/parse.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");


function v1ToV6(uuid) {
    const v1Bytes = typeof uuid === 'string' ? (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid) : uuid;
    const v6Bytes = _v1ToV6(v1Bytes);
    return typeof uuid === 'string' ? (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(v6Bytes) : v6Bytes;
}
function _v1ToV6(v1Bytes) {
    return Uint8Array.of(((v1Bytes[6] & 0x0f) << 4) | ((v1Bytes[7] >> 4) & 0x0f), ((v1Bytes[7] & 0x0f) << 4) | ((v1Bytes[4] & 0xf0) >> 4), ((v1Bytes[4] & 0x0f) << 4) | ((v1Bytes[5] & 0xf0) >> 4), ((v1Bytes[5] & 0x0f) << 4) | ((v1Bytes[0] & 0xf0) >> 4), ((v1Bytes[0] & 0x0f) << 4) | ((v1Bytes[1] & 0xf0) >> 4), ((v1Bytes[1] & 0x0f) << 4) | ((v1Bytes[2] & 0xf0) >> 4), 0x60 | (v1Bytes[2] & 0x0f), v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);
}


/***/ }),

/***/ "./node_modules/uuid/dist-node/v3.js":
/*!*******************************************!*\
  !*** ./node_modules/uuid/dist-node/v3.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DNS: () => (/* reexport safe */ _v35_js__WEBPACK_IMPORTED_MODULE_1__.DNS),
/* harmony export */   URL: () => (/* reexport safe */ _v35_js__WEBPACK_IMPORTED_MODULE_1__.URL),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist-node/md5.js");
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist-node/v35.js");



function v3(value, namespace, buf, offset) {
    return (0,_v35_js__WEBPACK_IMPORTED_MODULE_1__["default"])(0x30, _md5_js__WEBPACK_IMPORTED_MODULE_0__["default"], value, namespace, buf, offset);
}
v3.DNS = _v35_js__WEBPACK_IMPORTED_MODULE_1__.DNS;
v3.URL = _v35_js__WEBPACK_IMPORTED_MODULE_1__.URL;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);


/***/ }),

/***/ "./node_modules/uuid/dist-node/v35.js":
/*!********************************************!*\
  !*** ./node_modules/uuid/dist-node/v35.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DNS: () => (/* binding */ DNS),
/* harmony export */   URL: () => (/* binding */ URL),
/* harmony export */   "default": () => (/* binding */ v35),
/* harmony export */   stringToBytes: () => (/* binding */ stringToBytes)
/* harmony export */ });
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist-node/parse.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");


function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; ++i) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}
const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35(version, hash, value, namespace, buf, offset) {
    const valueBytes = typeof value === 'string' ? stringToBytes(value) : value;
    const namespaceBytes = typeof namespace === 'string' ? (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace) : namespace;
    if (typeof namespace === 'string') {
        namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace);
    }
    if (namespace?.length !== 16) {
        throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    }
    let bytes = new Uint8Array(16 + valueBytes.length);
    bytes.set(namespaceBytes);
    bytes.set(valueBytes, namespaceBytes.length);
    bytes = hash(bytes);
    bytes[6] = (bytes[6] & 0x0f) | version;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
            buf[offset + i] = bytes[i];
        }
        return buf;
    }
    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(bytes);
}


/***/ }),

/***/ "./node_modules/uuid/dist-node/v4.js":
/*!*******************************************!*\
  !*** ./node_modules/uuid/dist-node/v4.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ "./node_modules/uuid/dist-node/native.js");
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");



function _v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? (0,_rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])();
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (buf) {
        offset = offset || 0;
        if (offset < 0 || offset + 16 > buf.length) {
            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
        }
        for (let i = 0; i < 16; ++i) {
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}
function v4(options, buf, offset) {
    if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
        return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
    }
    return _v4(options, buf, offset);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);


/***/ }),

/***/ "./node_modules/uuid/dist-node/v5.js":
/*!*******************************************!*\
  !*** ./node_modules/uuid/dist-node/v5.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DNS: () => (/* reexport safe */ _v35_js__WEBPACK_IMPORTED_MODULE_1__.DNS),
/* harmony export */   URL: () => (/* reexport safe */ _v35_js__WEBPACK_IMPORTED_MODULE_1__.URL),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist-node/sha1.js");
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist-node/v35.js");



function v5(value, namespace, buf, offset) {
    return (0,_v35_js__WEBPACK_IMPORTED_MODULE_1__["default"])(0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_0__["default"], value, namespace, buf, offset);
}
v5.DNS = _v35_js__WEBPACK_IMPORTED_MODULE_1__.DNS;
v5.URL = _v35_js__WEBPACK_IMPORTED_MODULE_1__.URL;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);


/***/ }),

/***/ "./node_modules/uuid/dist-node/v6.js":
/*!*******************************************!*\
  !*** ./node_modules/uuid/dist-node/v6.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist-node/v1.js");
/* harmony import */ var _v1ToV6_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v1ToV6.js */ "./node_modules/uuid/dist-node/v1ToV6.js");



function v6(options, buf, offset) {
    options ??= {};
    offset ??= 0;
    let bytes = (0,_v1_js__WEBPACK_IMPORTED_MODULE_1__["default"])({ ...options, _v6: true }, new Uint8Array(16));
    bytes = (0,_v1ToV6_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bytes);
    if (buf) {
        for (let i = 0; i < 16; i++) {
            buf[offset + i] = bytes[i];
        }
        return buf;
    }
    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_0__.unsafeStringify)(bytes);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v6);


/***/ }),

/***/ "./node_modules/uuid/dist-node/v6ToV1.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist-node/v6ToV1.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ v6ToV1)
/* harmony export */ });
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist-node/parse.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");


function v6ToV1(uuid) {
    const v6Bytes = typeof uuid === 'string' ? (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid) : uuid;
    const v1Bytes = _v6ToV1(v6Bytes);
    return typeof uuid === 'string' ? (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(v1Bytes) : v1Bytes;
}
function _v6ToV1(v6Bytes) {
    return Uint8Array.of(((v6Bytes[3] & 0x0f) << 4) | ((v6Bytes[4] >> 4) & 0x0f), ((v6Bytes[4] & 0x0f) << 4) | ((v6Bytes[5] & 0xf0) >> 4), ((v6Bytes[5] & 0x0f) << 4) | (v6Bytes[6] & 0x0f), v6Bytes[7], ((v6Bytes[1] & 0x0f) << 4) | ((v6Bytes[2] & 0xf0) >> 4), ((v6Bytes[2] & 0x0f) << 4) | ((v6Bytes[3] & 0xf0) >> 4), 0x10 | ((v6Bytes[0] & 0xf0) >> 4), ((v6Bytes[0] & 0x0f) << 4) | ((v6Bytes[1] & 0xf0) >> 4), v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);
}


/***/ }),

/***/ "./node_modules/uuid/dist-node/v7.js":
/*!*******************************************!*\
  !*** ./node_modules/uuid/dist-node/v7.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   updateV7State: () => (/* binding */ updateV7State)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist-node/stringify.js");


const _state = {};
function v7(options, buf, offset) {
    let bytes;
    if (options) {
        bytes = v7Bytes(options.random ?? options.rng?.() ?? (0,_rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), options.msecs, options.seq, buf, offset);
    }
    else {
        const now = Date.now();
        const rnds = (0,_rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
        updateV7State(_state, now, rnds);
        bytes = v7Bytes(rnds, _state.msecs, _state.seq, buf, offset);
    }
    return buf ?? (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(bytes);
}
function updateV7State(state, now, rnds) {
    state.msecs ??= -Infinity;
    state.seq ??= 0;
    if (now > state.msecs) {
        state.seq = (rnds[6] << 23) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
        state.msecs = now;
    }
    else {
        state.seq = (state.seq + 1) | 0;
        if (state.seq === 0) {
            state.msecs++;
        }
    }
    return state;
}
function v7Bytes(rnds, msecs, seq, buf, offset = 0) {
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    if (!buf) {
        buf = new Uint8Array(16);
        offset = 0;
    }
    else {
        if (offset < 0 || offset + 16 > buf.length) {
            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
        }
    }
    msecs ??= Date.now();
    seq ??= ((rnds[6] * 0x7f) << 24) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
    buf[offset++] = (msecs / 0x10000000000) & 0xff;
    buf[offset++] = (msecs / 0x100000000) & 0xff;
    buf[offset++] = (msecs / 0x1000000) & 0xff;
    buf[offset++] = (msecs / 0x10000) & 0xff;
    buf[offset++] = (msecs / 0x100) & 0xff;
    buf[offset++] = msecs & 0xff;
    buf[offset++] = 0x70 | ((seq >>> 28) & 0x0f);
    buf[offset++] = (seq >>> 20) & 0xff;
    buf[offset++] = 0x80 | ((seq >>> 14) & 0x3f);
    buf[offset++] = (seq >>> 6) & 0xff;
    buf[offset++] = ((seq << 2) & 0xff) | (rnds[10] & 0x03);
    buf[offset++] = rnds[11];
    buf[offset++] = rnds[12];
    buf[offset++] = rnds[13];
    buf[offset++] = rnds[14];
    buf[offset++] = rnds[15];
    return buf;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v7);


/***/ }),

/***/ "./node_modules/uuid/dist-node/validate.js":
/*!*************************************************!*\
  !*** ./node_modules/uuid/dist-node/validate.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist-node/regex.js");

function validate(uuid) {
    return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);


/***/ }),

/***/ "./node_modules/uuid/dist-node/version.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist-node/version.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist-node/validate.js");

function version(uuid) {
    if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    return parseInt(uuid.slice(14, 15), 16);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);


/***/ }),

/***/ "./src/FileTracker.ts":
/*!****************************!*\
  !*** ./src/FileTracker.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileTracker = void 0;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist-node/index.js");
class FileTracker {
    constructor() {
        this.currentLayout = { nodes: [], groups: [], edges: [] };
        this.initialize();
    }
    initialize() {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const vscodeDir = path.join(rootPath, '.vscode');
            if (!fs.existsSync(vscodeDir)) {
                fs.mkdirSync(vscodeDir);
            }
            this.layoutFilePath = path.join(vscodeDir, 'metro-layout.json');
            this.loadLayout();
        }
    }
    createNote(position) {
        if (!vscode.workspace.workspaceFolders)
            return;
        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const noteDir = path.join(rootPath, '.Note');
        if (!fs.existsSync(noteDir)) {
            fs.mkdirSync(noteDir);
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `Note_${timestamp}.md`;
        const filePath = path.join(noteDir, fileName);
        fs.writeFileSync(filePath, '# New Note\n');
        const newNode = {
            id: (0, uuid_1.v4)(),
            type: 'note',
            filePath: filePath,
            position: position,
            label: fileName,
            status: 'active'
        };
        this.currentLayout.nodes.push(newNode);
        this.saveLayout(this.currentLayout);
        return newNode;
    }
    loadLayout() {
        if (this.layoutFilePath && fs.existsSync(this.layoutFilePath)) {
            try {
                const content = fs.readFileSync(this.layoutFilePath, 'utf-8');
                this.currentLayout = JSON.parse(content);
                this.checkFiles(); // Check for missing files on load
            }
            catch (e) {
                console.error('Failed to load metro layout:', e);
            }
        }
        return this.currentLayout;
    }
    saveLayout(layout) {
        this.currentLayout = layout;
        if (this.layoutFilePath) {
            fs.writeFileSync(this.layoutFilePath, JSON.stringify(layout, null, 2));
        }
    }
    getLayout() {
        return this.currentLayout;
    }
    checkFiles() {
        let changed = false;
        this.currentLayout.nodes.forEach(node => {
            if (node.type === 'file') {
                const exists = fs.existsSync(node.filePath);
                const newStatus = exists ? 'active' : 'missing';
                if (node.status !== newStatus) {
                    node.status = newStatus;
                    changed = true;
                }
            }
        });
        if (changed) {
            this.saveLayout(this.currentLayout);
        }
    }
    handleFileRename(oldPath, newPath) {
        let changed = false;
        this.currentLayout.nodes.forEach(node => {
            if (node.filePath === oldPath) {
                node.filePath = newPath;
                node.label = path.basename(newPath);
                node.status = 'active';
                changed = true;
            }
        });
        if (changed) {
            this.saveLayout(this.currentLayout);
        }
        return changed;
    }
    handleFileDelete(filePath) {
        let changed = false;
        this.currentLayout.nodes.forEach(node => {
            if (node.filePath === filePath) {
                node.status = 'missing';
                changed = true;
            }
        });
        if (changed) {
            this.saveLayout(this.currentLayout);
        }
        return changed;
    }
}
exports.FileTracker = FileTracker;


/***/ }),

/***/ "./src/MetroViewPanel.ts":
/*!*******************************!*\
  !*** ./src/MetroViewPanel.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MetroViewPanel = void 0;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
class MetroViewPanel {
    static createOrShow(extensionUri, fileTracker) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (MetroViewPanel.currentPanel) {
            MetroViewPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(MetroViewPanel.viewType, 'Metro View', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, 'dist')
            ]
        });
        MetroViewPanel.currentPanel = new MetroViewPanel(panel, extensionUri, fileTracker);
    }
    constructor(panel, extensionUri, fileTracker) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._fileTracker = fileTracker;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'saveLayout':
                    this._fileTracker.saveLayout(message.layout);
                    return;
                case 'openFile':
                    this.openFile(message.filePath);
                    return;
                case 'createNote':
                    const newNode = this._fileTracker.createNote(message.position);
                    if (newNode) {
                        this.updateLayout(this._fileTracker.getLayout());
                    }
                    return;
            }
        }, null, this._disposables);
    }
    updateLayout(layout) {
        this._panel.webview.postMessage({ command: 'updateLayout', layout });
    }
    openFile(filePath) {
        const openPath = vscode.Uri.file(filePath);
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    }
    dispose() {
        MetroViewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        // Send initial layout
        const layout = this._fileTracker.getLayout();
        webview.postMessage({ command: 'updateLayout', layout });
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'));
        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Metro View</title>
                <style>
                    body { padding: 0; margin: 0; width: 100%; height: 100vh; overflow: hidden; }
                </style>
            </head>
            <body>
                <div id="root" style="width: 100%; height: 100%;"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
exports.MetroViewPanel = MetroViewPanel;
MetroViewPanel.viewType = 'metroView';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const FileTracker_1 = __webpack_require__(/*! ./FileTracker */ "./src/FileTracker.ts");
const MetroViewPanel_1 = __webpack_require__(/*! ./MetroViewPanel */ "./src/MetroViewPanel.ts");
function activate(context) {
    console.log('Metro View is now active!');
    const fileTracker = new FileTracker_1.FileTracker();
    context.subscriptions.push(vscode.commands.registerCommand('metro.open', () => {
        MetroViewPanel_1.MetroViewPanel.createOrShow(context.extensionUri, fileTracker);
    }));
    context.subscriptions.push(vscode.workspace.onDidRenameFiles(e => {
        e.files.forEach(file => {
            const changed = fileTracker.handleFileRename(file.oldUri.fsPath, file.newUri.fsPath);
            if (changed && MetroViewPanel_1.MetroViewPanel.currentPanel) {
                MetroViewPanel_1.MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
            }
        });
    }));
    context.subscriptions.push(vscode.workspace.onDidDeleteFiles(e => {
        e.files.forEach(file => {
            const changed = fileTracker.handleFileDelete(file.fsPath);
            if (changed && MetroViewPanel_1.MetroViewPanel.currentPanel) {
                MetroViewPanel_1.MetroViewPanel.currentPanel.updateLayout(fileTracker.getLayout());
            }
        });
    }));
}
function deactivate() { }


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("vscode");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/extension.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map