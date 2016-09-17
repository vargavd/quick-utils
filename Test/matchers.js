/*global matrchers, QU*/
"use strict";

var matchers = {
    compareStringWithSplit: function () {
        return {
            compare: function (result, expected) {
                var resultArray, expectedArray, i,
                    getArray, returnObject;

                getArray = function (string) {
                    var delimiters, i, delimiter;

                    delimiters = "";

                    for (i = 0; i < string.length; i++) {
                        delimiter = parseInt(string[i], 10);
                        if (isNaN(delimiter) && delimiters.indexOf(delimiter) === -1) {
                            delimiters = QU.String.AddToString(delimiters, delimiter, "");
                        }
                    }
                    if (delimiters.length !== 0) {
                        return string.split(delimiters[delimiters.length]);
                    }
                };

                returnObject = {
                    pass: false
                };

                resultArray = getArray(result);
                expectedArray = getArray(expected);
                
                if (typeof resultArray === "undefined" || resultArray.constructor !== Array || typeof expectedArray === "undefined" || expectedArray.constructor !== Array || resultArray.length !== expectedArray.length) {
                    return returnObject;
                }

                for (i = 0; i < resultArray.length; i++) {
                    if (resultArray[i] !== expectedArray[i]) {
                        return returnObject;
                    }
                }

                returnObject.pass = true;

                return returnObject;
            }
        };
    }
};