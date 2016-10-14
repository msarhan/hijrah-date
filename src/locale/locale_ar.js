/*
Original work Copyright (c) 2010-2016 Google, Inc. http://angularjs.org
Modified work Copyright (c) 2016 Mouaffak A. Sarhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict';
(function(){
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
var locale = {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0635",
      "\u0645"
    ],
    "DAY": [
      "\u0627\u0644\u0623\u062d\u062f",
      "\u0627\u0644\u0627\u062b\u0646\u064a\u0646",
      "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
      "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      "\u0627\u0644\u062e\u0645\u064a\u0633",
      "\u0627\u0644\u062c\u0645\u0639\u0629",
      "\u0627\u0644\u0633\u0628\u062a"
    ],
    "ERANAMES": [
      "\u0647\u062C\u0631\u064A"
    ],
    "ERAS": [
      "\u0647\u0640"
    ],
    "FIRSTDAYOFWEEK": 5,
    "MONTH": [
      "\u0645\u062D\u0631\u0645",
      "\u0635\u0641\u0631",
      "\u0631\u0628\u064A\u0639 \u0627\u0644\u0623\u0648\u0644",
      "\u0631\u0628\u064A\u0639 \u0627\u0644\u062B\u0627\u0646\u064A",
      "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0623\u0648\u0644\u0649",
      "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0622\u062E\u0631\u0629",
      "\u0631\u062C\u0628",
      "\u0634\u0639\u0628\u0627\u0646",
      "\u0631\u0645\u0636\u0627\u0646",
      "\u0634\u0648\u0627\u0644",
      "\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629",
      "\u0630\u0648 \u0627\u0644\u062D\u062C\u0629"
     ],
    "SHORTDAY": [
      "\u0627\u0644\u0623\u062d\u062f",
      "\u0627\u0644\u0627\u062b\u0646\u064a\u0646",
      "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
      "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      "\u0627\u0644\u062e\u0645\u064a\u0633",
      "\u0627\u0644\u062c\u0645\u0639\u0629",
      "\u0627\u0644\u0633\u0628\u062a"
    ],
    "SHORTMONTH": [
		"\u0645\u062D\u0631\u0645",
		"\u0635\u0641\u0631",
		"\u0631\u0628\u064A\u0639 1",
		"\u0631\u0628\u064A\u0639 2",
		"\u062C\u0645\u0627\u062F\u0649 1",
		"\u062C\u0645\u0627\u062F\u0649 2",
		"\u0631\u062C\u0628",
		"\u0634\u0639\u0628\u0627\u0646",
		"\u0631\u0645\u0636\u0627\u0646",
		"\u0634\u0648\u0627\u0644",
		"\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629",
		"\u0630\u0648 \u0627\u0644\u062D\u062C\u0629"
	],
    "STANDALONEMONTH": [
      "\u0645\u062D\u0631\u0645",
      "\u0635\u0641\u0631",
      "\u0631\u0628\u064A\u0639 \u0627\u0644\u0623\u0648\u0644",
      "\u0631\u0628\u064A\u0639 \u0627\u0644\u062B\u0627\u0646\u064A",
      "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0623\u0648\u0644\u0649",
      "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0622\u062E\u0631\u0629",
      "\u0631\u062C\u0628",
      "\u0634\u0639\u0628\u0627\u0646",
      "\u0631\u0645\u0636\u0627\u0646",
      "\u0634\u0648\u0627\u0644",
      "\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629",
      "\u0630\u0648 \u0627\u0644\u062D\u062C\u0629"
    ],
    "WEEKENDRANGE": [
      4,
      5
    ],
    "fullDate": "EEEE\u060c d MMMM\u060c y",
    "longDate": "d MMMM\u060c y",
    "medium": "dd\u200f/MM\u200f/y h:mm:ss a",
    "mediumDate": "dd\u200f/MM\u200f/y",
    "mediumTime": "h:mm:ss a",
    "short": "d\u200f/M\u200f/y h:mm a",
    "shortDate": "d\u200f/M\u200f/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a3",
    "DECIMAL_SEP": "\u066b",
    "GROUP_SEP": "\u066c",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "ar",
  "localeID": "ar",
  "pluralCat": function(n, opt_precision) {  if (n == 0) {    return PLURAL_CATEGORY.ZERO;  }  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  if (n == 2) {    return PLURAL_CATEGORY.TWO;  }  if (n % 100 >= 3 && n % 100 <= 10) {    return PLURAL_CATEGORY.FEW;  }  if (n % 100 >= 11 && n % 100 <= 99) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
};

LocaleProvider.register('ar', locale);

})();
