# HijrahDate [![Build Status](https://travis-ci.org/msarhan/hijrah-date.svg?branch=master)](https://travis-ci.org/msarhan/hijrah-date)
Javascript date in the Hijrah calendar system.


## Install

You can install this package either with `npm` or with `bower`.

### npm

```shell
npm install hijrah-date
```

### bower

```shell
bower install hijrah-date
```

Then add a `<script>` to your `index.html`:

```html
<script src="/bower_components/hijrah-date/hijrah-date.js"></script>
```

## Usage
### Creating new instance
```js
new HijrahDate();
new HijrahDate(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
```
```js
var hijrahDate1 = new HijrahDate();
var hijrahDate2 = new HijrahDate(1437, 11, 10);
var hijrahDate3 = new HijrahDate(1437, 11, 10, 14, 40);
```

### Read methods
Most of native `Date`'s read methods are available in HijrahDate
```js
var hijrahDate = new HijrahDate(1437, 11, 14, 15, 50, 21, 456);
hijrahDate.getTime()			// 1473943821456
hijrahDate.getFullYear()		// 1437
hijrahDate.getMonth()			// 11
hijrahDate.getDate()			// 14
hijrahDate.getDay()				// 4
hijrahDate.getHours()			// 15
hijrahDate.getMinutes()			// 50
hijrahDate.getSeconds()			// 21
hijrahDate.getMilliseconds()	// 456

hijrahDate.getMonthLength()		// 30
hijrahDate.getYearLength()		// 354
hijrahDate.getDayOfYear()		// 338
hijrahDate.isLeapYear()			// false
hijrahDate.toEpochDay()			// 17055
```

### Manipulate
```js
HijrahDate::plusYears(yearsToAdd)
HijrahDate::plusMonths(monthsToAdd)
HijrahDate::plusWeeks(weeksToAdd)
HijrahDate::plusDays(daysToAdd)

HijrahDate::minusYears(yearsToSubtract)
HijrahDate::minusMonths(monthsToSubtract)
HijrahDate::minusWeeks(weeksToSubtract)
HijrahDate::minusDays(daysToSubtract)
```
Example
```js
var hijrahDate = new HijrahDate(1437, 11, 10);
var hijrahDate2 = hd.plusYears(1)
	.plusMonths(2)
	.plusDays(5);
```

### Conversion
#### `HijrahDate` To `Date`
Using `HijrahDate::toGregorian` function
```js
var hijrahDate = new HijrahDate(1437, 11, 10, 14, 40, 23, 15);
var date = hd.toGregorian();
```

#### `Date` To `HijrahDate`
```js
var date = new Date(2016, 9, 23);
var hijrahDate = new HijrahDate(date);
```

### Format
`HijrahDate::format(format[, localeId])`

Formats `HijrahDate` to a string based on the requested format. Formats ported from [AngularJS' date filter](https://docs.angularjs.org/api/ng/filter/date).

`localeId` string 'en' or 'ar'

`format` string can be composed of the following elements:
* 'yyyy': 4 digit representation of year (e.g. 1437)
* 'yy': 2 digit representation of year, padded (00-99). (e.g. 1330 => 30, 1437 => 37)
* 'y': 1 digit representation of year, e.g. (1330 => 1330, AD 1438 => 1438)
* 'MMMM': Month in year (Muharram-Dhuʻl-Hijjah)
* 'MMM': Month in year (Muh-Dhuʻl-H)
* 'MM': Month in year, padded (01-12)
* 'M': Month in year (1-12)
* 'LLLL': Stand-alone month in year (Muharram-Dhuʻl-Hijjah)
* 'dd': Day in month, padded (01-30)
* 'd': Day in month (1-30)
* 'EEEE': Day in Week,(Sunday-Saturday)
* 'EEE': Day in Week, (Sun-Sat)
* 'HH': Hour in day, padded (00-23)
* 'H': Hour in day (0-23)
* 'hh': Hour in AM/PM, padded (01-12)
* 'h': Hour in AM/PM, (1-12)
* 'mm': Minute in hour, padded (00-59)
* 'm': Minute in hour (0-59)
* 'ss': Second in minute, padded (00-59)
* 's': Second in minute (0-59)
* 'sss': Millisecond in second, padded (000-999)
* 'a': AM/PM marker
* 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
* 'ww': Week of year, padded (00-53). Week 01 is the week with the first Thursday of the year
* 'w': Week of year (0-53). Week 1 is the week with the first Thursday of the year
* 'G', 'GG', 'GGG': The abbreviated form of the era string (e.g. 'AD')
* 'GGGG': The long form of the era string (e.g. 'Anno Hegirae')

format string can also be one of the following predefined localizable formats:

* 'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Muh 3, 1437 12:05:08 PM)
* 'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/37 12:05 PM)
* 'fullDate': equivalent to 'EEEE, MMMM d, y' for en_US locale (e.g. Friday, Ramadan 24, 1431)
* 'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. Ramadan 3, 1437)
* 'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Ram 3, 1437)
* 'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/37)
* 'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 PM)
* 'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 PM)

format string can contain literal values. These need to be escaped by surrounding with single quotes (e.g. "h 'in the morning'"). In order to output a single quote, escape it - i.e., two single quotes in a sequence (e.g. "h 'o''clock'").
