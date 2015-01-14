function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("PORT", 1337);
define("PORT_L", 1338);
define("PORT_R", 1339);