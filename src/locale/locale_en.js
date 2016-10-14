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

function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

var locale = {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "ERANAMES": [
      "Anno Hegirae"
    ],
    "ERAS": [
      "AH"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "Muharram",
      "Safar",
      "Rabiʻ I",
      "Rabiʻ II",
      "Jumada I",
      "Jumada II",
      "Rajab",
      "Shaʻban",
      "Ramadan",
      "Shawwal",
      "Dhuʻl-Qiʻdah",
      "Dhuʻl-Hijjah"
    ],
    "SHORTDAY": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "SHORTMONTH": [
      "Muh",
      "Saf",
      "Rab I",
      "Rab II",
      "Jum I",
      "Jum II",
      "Raj",
      "Sha",
      "Ram",
      "Shaw",
      "Dhuʻl-Q",
      "Dhuʻl-H"
    ],
    "STANDALONEMONTH": [
      "Muharram",
      "Safar",
      "Rabiʻ I",
      "Rabiʻ II",
      "Jumada I",
      "Jumada II",
      "Rajab",
      "Shaʻban",
      "Ramadan",
      "Shawwal",
      "Dhuʻl-Qiʻdah",
      "Dhuʻl-Hijjah"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, MMMM d, y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y h:mm:ss a",
    "mediumDate": "MMM d, y",
    "mediumTime": "h:mm:ss a",
    "short": "M/d/yy h:mm a",
    "shortDate": "M/d/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "en",
  "localeID": "en",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
};

LocaleProvider.register('en', locale);

})();
