/// <reference lib="webworker" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var DB_NAME = 'manifest-db';
var STORE_NAME = 'manifest-store';
var cachedManifest = null;
// IndexedDB 초기화
function openDB() {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = function () {
            var db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = function () { return resolve(request.result); };
        request.onerror = function () { return reject(request.error); };
    });
}
function loadCachedManifest() {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var tx = db.transaction(STORE_NAME, 'readonly');
                            var store = tx.objectStore(STORE_NAME);
                            var getRequest = store.get('manifest');
                            getRequest.onsuccess = function () { var _a; return resolve((_a = getRequest.result) !== null && _a !== void 0 ? _a : null); };
                            getRequest.onerror = function () { return reject(getRequest.error); };
                        })];
            }
        });
    });
}
function saveManifest(manifest) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var tx = db.transaction(STORE_NAME, 'readwrite');
                            var store = tx.objectStore(STORE_NAME);
                            var putRequest = store.put(manifest, 'manifest');
                            putRequest.onsuccess = function () { return resolve(); };
                            putRequest.onerror = function () { return reject(putRequest.error); };
                        })];
            }
        });
    });
}
self.addEventListener('install', function (event) {
    self.skipWaiting(); // 즉시 활성화
});
self.addEventListener('activate', function (event) {
    event.waitUntil((function () { return __awaiter(_this, void 0, void 0, function () {
        var response, latestManifest, _a, _b, _c, _i, route, clientsList, _d, clientsList_1, client, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, loadCachedManifest()];
                case 1:
                    cachedManifest = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 11, , 12]);
                    return [4 /*yield*/, fetch('/manifest.json', { cache: 'no-cache' })];
                case 3:
                    response = _e.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    latestManifest = _e.sent();
                    if (!cachedManifest) return [3 /*break*/, 8];
                    _a = latestManifest;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _e.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 7];
                    route = _c;
                    if (!(cachedManifest[route] && cachedManifest[route] !== latestManifest[route])) return [3 /*break*/, 7];
                    return [4 /*yield*/, self.clients.matchAll({ includeUncontrolled: true })];
                case 6:
                    clientsList = _e.sent();
                    for (_d = 0, clientsList_1 = clientsList; _d < clientsList_1.length; _d++) {
                        client = clientsList_1[_d];
                        client.postMessage({ type: 'ROUTE_UPDATED', route: route });
                    }
                    _e.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: 
                // 최신 manifest 저장
                return [4 /*yield*/, saveManifest(latestManifest)];
                case 9:
                    // 최신 manifest 저장
                    _e.sent();
                    cachedManifest = latestManifest;
                    return [4 /*yield*/, self.clients.claim()];
                case 10:
                    _e.sent();
                    return [3 /*break*/, 12];
                case 11:
                    error_1 = _e.sent();
                    console.error('Error fetching manifest.json:', error_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); })());
});
