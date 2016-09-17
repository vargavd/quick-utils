"use strict";
var QU = QU || {};

QU.String = QU.String || {};

QU.String.Contains = function (container, what) {
    if (typeof what === "number") {
        what = what.toString();
    }

    return container.indexOf(what) !== -1;
};

/*
 * A result string-hez hozzáadja a what stringet, a delimiterrel elválasztva.
 * Amennyiben a result undefined, akkor visszaadja a what paramétert.
 * 
 * Használata: amennyiben valamilyen információt el kell menteni az adatbázisba, akkor ez egy leképezése annak 
 * pl : 10-34-116-23 
 * Ekkor 4x hivtuk meg az AddToString fgv-t: result = AddToString(result, 10, "-"); ...   result = AddToString(result, "34", "-"); ... stb
 */
QU.String.AddToString = function (result, what, delimiter) {
    if (typeof result !== "string") {
        return what;
    }

    return result + delimiter + what;
};

/*
 * Egy komplex, több delimitert tartalmazó string-ből képez le egy objektumot:
 * pl. "1-2|3-4|0-1" ebből lesz:
 * { 
 *    parts: [ 
 *      { 
 *          parts: [ "1", "2" ] 
 *      }, 
 *      { 
 *          parts: [ "3", "4" ]
 *      },
 *      {
 *          parts: [ "0", "1" ]
 *      }
 *    ]
 * }
 * 
 * A delimiters paraméter ebben az esetben ez lesz: [ "-", "|" ]
 * Amennyiben a levelNames paramétert is megadjuk, akkor a tömbök nem parts néven lesznek, hanem a levelNames tömbben szereplő nevek.
 * Mivel itt két szint van, ezért két string elemű tömbnek kell lennie a levelNames-nek.
 */
QU.String.SplitByDelimiters = function (source, delimiters, levelNames) {
    var delimiter, levelName, i, stringParts, validLevelNames,
        result;

    delimiter = delimiters.shift();

    stringParts = source.split(delimiter);

    validLevelNames = (typeof levelNames !== "undefined" && levelNames.constructor === Array);

    levelName = validLevelNames ? levelNames.shift() : "parts";

    result = {};
    result.source = source;
    result[levelName] = [];

    if (delimiters.length !== 0) {
        if (validLevelNames) {
            for (i = 0; i < stringParts.length; i++) {
                result[levelName].push(QU.String.SplitByDelimiters(stringParts[i], delimiters.slice(0), levelNames.slice(0)));
            }
        }
        else {
            for (i = 0; i < stringParts.length; i++) {
                result[levelName].push(QU.String.SplitByDelimiters(stringParts[i], delimiters.slice(0)));
            }
        }
    }
    else {
        for (i = 0; i < stringParts.length; i++) {
            result[levelName].push(stringParts[i]);
        }
    }

    return result;
};

/*
 * Ez a fordítottja a fenti függvénynek. Tehát egy objektumból csinál egy komplex stringet.
 * pl : "1-2|3-4|0-1" lesz ebből:
 * { 
 *    parts: [ 
 *      { 
 *          parts: [ "1", "2" ] 
 *      }, 
 *      { 
 *          parts: [ "3", "4" ]
 *      },
 *      {
 *          parts: [ "0", "1" ]
 *      }
 *    ]
 * }
 * 
 * A delimiters és a a levelNames paramétert ugyanúgy kell használni mint a fenti esetben.
 */
QU.String.MakeStringFromData = function (data, delimiters, levelNames) {
    var i, result, delimiter, levelName, isLevelNamesSet;

    delimiter = delimiters.shift();
    isLevelNamesSet = (typeof levelNames !== "undefined" && levelNames.constructor === Array);

    levelName = isLevelNamesSet ? levelNames.shift() : "parts";

    if (isLevelNamesSet) {
        for (i = 0; i < data[levelName].length; i++) {
            if (typeof data[levelName][i] === "string") {
                result = QU.String.AddToString(result, data[levelName][i], delimiter);
            } else {
                result = QU.String.AddToString(result, QU.String.MakeStringFromData(data[levelName][i], delimiters.slice(0), levelNames.slice(0)), delimiter);
            }
        }
    }
    else {
        for (i = 0; i < data[levelName].length; i++) {
            if (typeof data[levelName][i] === "string") {
                result = QU.String.AddToString(result, data[levelName][i], delimiter);
            }
            else {
                result = QU.String.AddToString(result, QU.String.MakeStringFromData(data[levelName][i], delimiters.slice(0)), delimiter);
            }
        }
    }

    return result;
};