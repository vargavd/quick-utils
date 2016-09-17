/*global describe, beforeEach, it, QU, expect, spyOn, jasmine, matchers */
"use strict";

/// <reference path="jasmine.js" />
/// <reference path="../JS/String.js" />
/// <reference path="matchers.js" />

describe("QU.String", function () {

    describe("Contains", function () {
        var result1, result2;

        beforeEach(function () {
            this.hay1 = "We are the champions!";
            this.hay2 = "123456789";
            this.needle1 = "champions";
            this.needle2 = "no match";
            this.needle3 = 34;
        });

        it("detects if the first parameters contains the second", function () {
            result1 = QU.String.Contains(this.hay1, this.needle1);
            result2 = QU.String.Contains(this.hay1, this.needle2);

            expect(result1).toBeTruthy();
            expect(result2).toBeFalsy();
        });

        it("works, even if the second parameter is a number", function () {
            result1 = QU.String.Contains(this.hay2, this.needle3);

            expect(result1).toBeTruthy();
        });

        it("throws an exception if parameters type if not appropriate", function () {
            expect(function () { QU.String.Contains(); }).toThrow();
        });


    });

    describe("AddToString", function () {
        beforeEach(function () {
            this.delimiter = "#";
            this.word1 = "one";
            this.word2 = "two";
            this.word3 = "three";
        });

        it("can concatenate the string with the delimiter, even if the result is undefined first", function () {
            var result;

            result = QU.String.AddToString(result, this.word1, this.delimiter);
            result = QU.String.AddToString(result, this.word2, this.delimiter);
            result = QU.String.AddToString(result, this.word3, this.delimiter);

            expect(result).toBe("one#two#three");
        });
    });

    describe("SplitByDelimiters", function () {
        beforeEach(function () {
            this.delimiter = "#";
            this.word1 = "one";
            this.word2 = "two";
            this.word3 = "three";
            this.delimiters = ["#", "|", "-"];
            this.source = "1-2|3-2|0-1#4-5|10-3|6-4#9-0|2-1|6-7";
        });

        it("can split the string with the delimiters, even if the level names are not set (undefined)", function () {
            var source, result, expected;

            expected = {
                source: this.source,
                parts: [
                    {
                        source: "1-2|3-2|0-1",
                        parts: [
                            {
                                source: "1-2",
                                parts: [ "1", "2" ]
                            },
                            {
                                source: "3-2",
                                parts: ["3", "2"]
                            },
                            {
                                source: "0-1",
                                parts: ["0", "1"]
                            }
                        ]
                    },
                    {
                        source: "4-5|10-3|6-4",
                        parts: [
                            {
                                source: "4-5",
                                parts: ["4", "5"]
                            },
                            {
                                source: "10-3",
                                parts: ["10", "3"]
                            },
                            {
                                source: "6-4",
                                parts: ["6", "4"]
                            }
                        ]
                    },
                    {
                        source: "9-0|2-1|6-7",
                        parts: [
                            {
                                source: "9-0",
                                parts: ["9", "0"]
                            },
                            {
                                source: "2-1",
                                parts: ["2", "1"]
                            },
                            {
                                source: "6-7",
                                parts: ["6", "7"]
                            }
                        ]
                    }
                ]
            };

            result = QU.String.SplitByDelimiters(this.source, this.delimiters);

            expect(result).toEqual(expected);
        });

        it("can split the string with the delimiters with level names", function () {
            var source, result, levelNames, expected;

            expected = {
                source: this.source,
                levelName1: [
                    {
                        source: "1-2|3-2|0-1",
                        levelName2: [
                            {
                                source: "1-2",
                                levelName3: ["1", "2"]
                            },
                            {
                                source: "3-2",
                                levelName3: ["3", "2"]
                            },
                            {
                                source: "0-1",
                                levelName3: ["0", "1"]
                            }
                        ]
                    },
                    {
                        source: "4-5|10-3|6-4",
                        levelName2: [
                            {
                                source: "4-5",
                                levelName3: ["4", "5"]
                            },
                            {
                                source: "10-3",
                                levelName3: ["10", "3"]
                            },
                            {
                                source: "6-4",
                                levelName3: ["6", "4"]
                            }
                        ]
                    },
                    {
                        source: "9-0|2-1|6-7",
                        levelName2: [
                            {
                                source: "9-0",
                                levelName3: ["9", "0"]
                            },
                            {
                                source: "2-1",
                                levelName3: ["2", "1"]
                            },
                            {
                                source: "6-7",
                                levelName3: ["6", "7"]
                            }
                        ]
                    }
                ]
            };
            levelNames = ["levelName1", "levelName2", "levelName3"];

            result = QU.String.SplitByDelimiters(this.source, this.delimiters, levelNames);

            expect(result).toEqual(expected);
        });
    });

    describe("MakeStringFromData", function () {
        beforeEach(function () {
            this.delimiters = ["#", "|", "-"];
            this.expected = "1-2|3-2|0-1#4-5|10-3|6-4#9-0|2-1|6-7";

            jasmine.addMatchers(matchers);
        });

        it("can make a string from object, even if the level names are not set (undefined)", function () {
            var data, result;

            data = {
                parts: [
                    {
                        parts: [
                            {
                                parts: ["1", "2"]
                            },
                            {
                                parts: ["3", "2"]
                            },
                            {
                                parts: ["0", "1"]
                            }
                        ]
                    },
                    {
                        parts: [
                            {
                                parts: ["4", "5"]
                            },
                            {
                                parts: ["10", "3"]
                            },
                            {
                                parts: ["6", "4"]
                            }
                        ]
                    },
                    {
                        parts: [
                            {
                                parts: ["9", "0"]
                            },
                            {
                                parts: ["2", "1"]
                            },
                            {
                                parts: ["6", "7"]
                            }
                        ]
                    }
                ]
            };

            result = QU.String.MakeStringFromData(data, this.delimiters);

            expect(result).toEqual(this.expected);
        });

        it("can make a string from object with level names", function () {
            var data, levelNames, result;

            data = {
                levelName1: [
                    {
                        levelName2: [
                            {
                                levelName3: ["1", "2"]
                            },
                            {
                                levelName3: ["3", "2"]
                            },
                            {
                                levelName3: ["0", "1"]
                            }
                        ]
                    },
                    {
                        levelName2: [
                            {
                                levelName3: ["4", "5"]
                            },
                            {
                                levelName3: ["10", "3"]
                            },
                            {
                                levelName3: ["6", "4"]
                            }
                        ]
                    },
                    {
                        levelName2: [
                            {
                                levelName3: ["9", "0"]
                            },
                            {
                                levelName3: ["2", "1"]
                            },
                            {
                                levelName3: ["6", "7"]
                            }
                        ]
                    }
                ]
            };
            levelNames = ["levelName1", "levelName2", "levelName3"];

            result = QU.String.MakeStringFromData(data, this.delimiters, levelNames);

            expect(result).toEqual(this.expected);
        });

        it("calls the AddToString function", function () {
            var delimiters, expected, data, result;

            delimiters = ["|", "-"];
            expected = "1-1";
            data = {
                parts: [
                    {
                        parts: ["1", "2"]
                    },
                    {
                        parts: ["3", "2"]
                    },
                    {
                        parts: ["0", "1"]
                    }
                ]
            };

            spyOn(QU.String, "AddToString").and.returnValue("1-1");
                
            result = QU.String.MakeStringFromData(data, delimiters);

            expect(QU.String.AddToString).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });

        it("calls the fake AddToString method", function () {
            var delimiters, expected, data, result;

            delimiters = ["|", "-"];
            expected = "1--2||3--2||0--1";
            data = {
                parts: [
                    {
                        parts: ["1", "2"]
                    },
                    {
                        parts: ["3", "2"]
                    },
                    {
                        parts: ["0", "1"]
                    }
                ]
            };

            spyOn(QU.String, "AddToString").and.callFake(function (result, what, delimiter) {
                if (typeof result !== "string") {
                    return what;
                }

                return result + delimiter + delimiter + what;
            });

            result = QU.String.MakeStringFromData(data, delimiters);

            expect(result).toEqual(expected);
        });

        it("calls the AddToString function and passes several tests", function () {
            var delimiters, expected, data, result;

            delimiters = ["|", "-"];
            expected = "1-2|3-2|0-1";
            data = {
                parts: [
                    {
                        parts: ["1", "2"]
                    },
                    {
                        parts: ["3", "2"]
                    },
                    {
                        parts: ["0", "1"]
                    }
                ]
            };

            spyOn(QU.String, "AddToString").and.callThrough();

            result = QU.String.MakeStringFromData(data, delimiters);

            expect(QU.String.AddToString).toHaveBeenCalled();

            expect(result).toEqual(expected);

            expect(QU.String.AddToString.calls.any()).toBe(true); // ez tulképp ugyanaz, mint a toHaveBeenCalled 3 sorral feljebb

            expect(QU.String.AddToString.calls.count()).toEqual(9);

            result = QU.String.MakeStringFromData(data, delimiters);

            expect(QU.String.AddToString.calls.count()).toEqual(18); // tehát összeadódnak a hívások

            result = QU.String.MakeStringFromData(data, delimiters);

            expect(QU.String.AddToString.calls.count()).toEqual(jasmine.any(Number)); // itt már nem tudtam számolni, úgyhogy any-re raktam :)
        });

        it("passes the test with a custom matcher", function () {
            var delimiters, expected, data, result;

            delimiters = ["|", "-"];
            expected = "1-2|3-2|0-1";
            data = {
                parts: [
                    {
                        parts: ["1", "2"]
                    },
                    {
                        parts: ["3", "2"]
                    },
                    {
                        parts: ["0", "1"]
                    }
                ]
            };

            result = QU.String.MakeStringFromData(data, delimiters);

            expect(expected).compareStringWithSplit(result);
        });
    });
});