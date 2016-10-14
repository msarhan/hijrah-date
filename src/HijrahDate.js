'use strict';
var HijrahDate = (function(){

HijrahDate.isValid = isValid;
HijrahDate.isHijrahDate = isHijrahDate;

HijrahDate.prototype.getTime = getTime;
HijrahDate.prototype.setFullYear = setFullYear;
HijrahDate.prototype.getFullYear = getFullYear;
HijrahDate.prototype.setMonth = setMonth;
HijrahDate.prototype.getMonth = getMonth;
HijrahDate.prototype.setDate = setDate;
HijrahDate.prototype.getDate = getDate;
HijrahDate.prototype.setHours = setHours;
HijrahDate.prototype.getHours = getHours;
HijrahDate.prototype.setMinutes = setMinutes;
HijrahDate.prototype.getMinutes = getMinutes;
HijrahDate.prototype.setSeconds = setSeconds;
HijrahDate.prototype.getSeconds = getSeconds;
HijrahDate.prototype.getMilliseconds = getMilliseconds;
HijrahDate.prototype.getDayOfYear = getDayOfYear;
HijrahDate.prototype.getWeekOfYear = getWeekOfYear;
HijrahDate.prototype.getDay = getDay;
HijrahDate.prototype.getTimezoneOffset = getTimezoneOffset;
HijrahDate.prototype.getMonthLength = getMonthLength;
HijrahDate.prototype.getYearLength = getYearLength;
HijrahDate.prototype.isLeapYear = isLeapYear;
HijrahDate.prototype.toEpochDay = toEpochDay;

HijrahDate.prototype.setUTCFullYear = setUTCFullYear;
HijrahDate.prototype.getUTCFullYear = getUTCFullYear;
HijrahDate.prototype.setUTCHours = setUTCHours;
HijrahDate.prototype.getUTCHours = getUTCHours;

HijrahDate.prototype.plusYears = plusYears;
HijrahDate.prototype.plusMonths = plusMonths;
HijrahDate.prototype.plusWeeks = plusWeeks;
HijrahDate.prototype.plusDays = plusDays;
HijrahDate.prototype.minusYears = minusYears;
HijrahDate.prototype.minusMonths = minusMonths;
HijrahDate.prototype.minusWeeks = minusWeeks;
HijrahDate.prototype.minusDays = minusDays;

HijrahDate.prototype.toGregorian = toGregorian;
HijrahDate.prototype.toString = toString;
HijrahDate.prototype.format = format;

var DAYS_PER_CYCLE = 146097;
var DAYS_0000_TO_1970 = (DAYS_PER_CYCLE * 5) - (30 * 365 + 7);
var hijrahEpochMonthStartDays,
	minEpochDay,
	maxEpochDay,
	hijrahStartEpochMonth,
	minMonthLength,
	maxMonthLength,
	minYearLength,
	maxYearLength;

init();

function HijrahDate(year, monthOfYear, dayOfMonth, hours, minutes, seconds, milliseconds){
	this._year = Number.NaN;
	this._monthOfYear = Number.NaN;
	this._dayOfMonth = Number.NaN;

	var y, m, d, g;

	if(arguments.length === 0){
		g = new Date();
		var dateInfo = getHijrahDateInfo(epochDayFromGregorain(g));
		y = dateInfo[0];
		m = dateInfo[1];
		d = dateInfo[2];
	} else if(arguments.length === 1){
		if(HijrahDate.isHijrahDate(arguments[0])){
			var hd = arguments[0];
			g = hd.toGregorian();
			y = hd._year;
			m = hd._monthOfYear;
			d = hd._dayOfMonth;
		} else {
			g = new Date(arguments[0]);
			var dateInfo = getHijrahDateInfo(epochDayFromGregorain(g));
			y = dateInfo[0];
			m = dateInfo[1];
			d = dateInfo[2];
		}
	} else {
		// Computing the Gregorian day and checks the valid ranges
		g = gregorianFromEpochDay(getEpochDay(year, monthOfYear + 1, dayOfMonth || 1));
		g.setHours(hours || 0, minutes || 0, seconds || 0, milliseconds || 0);
		var dateInfo = getHijrahDateInfo(epochDayFromGregorain(g));
		y = dateInfo[0];
		m = dateInfo[1];
		d = dateInfo[2];
	}

	this._year = y;
	this._monthOfYear = m;
	this._dayOfMonth = d;
	this._gregorianDate = g;
}

function setFromHijrahDate(dest, src){
	dest._year = src._year;
	dest._monthOfYear = src._monthOfYear;
	dest._dayOfMonth = src._dayOfMonth;
	dest._gregorianDate.setFullYear(src._gregorianDate.getFullYear(), src._gregorianDate.getMonth(), src._gregorianDate.getDate());
}

function ofEpochDay(epochDay){
	var dateInfo = getHijrahDateInfo(toInt(epochDay));
	return new HijrahDate(dateInfo[0], dateInfo[1] - 1, dateInfo[2]);
}

function isValid(year, monthOfYear, dayOfMonth){
	/* this will throws an exception if values not valid */
	getEpochDay(year, monthOfYear + 1, dayOfMonth);
	return true;
}

function isHijrahDate(value) {
  return ((Object.prototype.toString.call(value) === '[object Object]') && (value instanceof HijrahDate));
}

function getTime(){
	return this._gregorianDate.getTime();
}

function setFullYear(year, month, day){
	var m = isNumber(month) ? (month + 1) : this._monthOfYear;
	var d = day || this._dayOfMonth;
	var hijrahDate = resolvePreviousValid(year, m, d);
	setFromHijrahDate(this, hijrahDate);
}
function getFullYear(){
	return this._year;
}
function setUTCFullYear(year, month, day){
	return this.setFullYear(year, month, day);
}
function getUTCFullYear(){
	return this.getFullYear();
}

function setMonth(month, day){
	var hijrahDate = resolvePreviousValid(this.getFullYear(), month + 1, day || this._dayOfMonth);
	setFromHijrahDate(this, hijrahDate);
}
function getMonth(){
	return this._monthOfYear - 1;
}

function setDate(dayOfMonth){
	if(dayOfMonth === this.getDate()){
		return;
	}

	if(dayOfMonth === 0){
		return this.minusDays(this.getDate());
	} else if(dayOfMonth < 0){
		return this.minusDays(this.getDate() + Math.abs(dayOfMonth));
	} else {
		return this.plusDays(dayOfMonth - this.getMonthLength());
	}
}
function getDate(){
	return this._dayOfMonth;
}

function setHours(hours, minutes, seconds, milliseconds){
	var res = this._gregorianDate.setHours(hours, minutes, seconds, milliseconds);
	var hijrahDate = new HijrahDate(res);
	setFromHijrahDate(this, hijrahDate);
	return res;
}
function getHours(){
	return this._gregorianDate.getHours();
}
function setUTCHours(hours, minutes, seconds, milliseconds){
	return this._gregorianDate.setUTCHours(hours, minutes, seconds, milliseconds);
}
function getUTCHours(){
	return this._gregorianDate.getUTCHours();
}

function setMinutes(minutes, seconds, milliseconds){
	return this._gregorianDate.setMinutes(minutes, seconds, milliseconds);
}
function getMinutes(){
	return this._gregorianDate.getMinutes();
}

function setSeconds(seconds, milliseconds){
	return this._gregorianDate.setSeconds(seconds, milliseconds);
}
function getSeconds(){
	return this._gregorianDate.getSeconds();
}

function getMilliseconds(){
	return this._gregorianDate.getMilliseconds();
}

function getMonthLength() {
	return _getMonthLength(this._year, this._monthOfYear);
}

function getYearLength() {
	return _getYearLength(this._year);
}

function toEpochDay() {
	return getEpochDay(this._year, this._monthOfYear, this._dayOfMonth);
}

function getDayOfYear() {
	return _getDayOfYear(this._year, this._monthOfYear) + this._dayOfMonth;
}

function getWeekOfYear() {
	return toInt(((this.getDayOfYear() - 1) / 7)) + 1;
}

function getDay() {
	return this._gregorianDate.getDay();
}

function getTimezoneOffset() {
	return this._gregorianDate.getTimezoneOffset();
}

function isLeapYear() {
	var year = this._year;
	var epochMonth = yearToEpochMonth(toInt(year));
	if (epochMonth < 0 || epochMonth > maxEpochDay) {
		throw "Hijrah date out of range";
	}
	var len = _getYearLength(toInt(year));
	return (len > 354);
}

function plusYears(years) {
	if (years == 0) {
		return this;
	}
	var newYear = this._year + years;
	var hijrahDate = resolvePreviousValid(newYear, this._monthOfYear, this._dayOfMonth);
	setFromHijrahDate(this, hijrahDate);
	return this;
}

function plusMonths(monthsToAdd) {
	if (monthsToAdd === 0) {
		return this;
	}
	var monthCount = this._year * 12 + (this._monthOfYear - 1);
	var calcMonths = monthCount + monthsToAdd;  // safe overflow
	var newYear = checkValidYear(floorDiv(calcMonths, 12));
	var newMonth = toInt(floorMod(calcMonths, 12) + 1);
	var hijrahDate = resolvePreviousValid(newYear, newMonth, this._dayOfMonth);
	setFromHijrahDate(this, hijrahDate);
	return this;
}

function plusWeeks(weeksToAdd) {
	return this.plusDays(weeksToAdd * 7);
}

function plusDays(days) {
	var hijrahDate = ofEpochDay(this.toEpochDay() + days);
	setFromHijrahDate(this, hijrahDate);
	return this;
}

function minusYears(yearsToSubtract) {
	return this.plusYears(-yearsToSubtract);
}

function minusMonths(monthsToSubtract) {
	return this.plusMonths(-monthsToSubtract);
}

function minusWeeks(weeksToSubtract) {
	return this.plusWeeks(-weeksToSubtract);
}

function minusDays(daysToSubtract) {
	return this.plusDays(-daysToSubtract);
}

function toGregorian(){
	return new Date(this._gregorianDate);
}

function format(format, localeId){
	if(arguments.length === 0){
		return HijrahDateFormatter.formatter('en')(this);
	}
	if(arguments.length === 1){
		return HijrahDateFormatter.formatter('en')(this, format);
	}
	return HijrahDateFormatter.formatter(localeId)(this, format);
}

function toString(){
	if(isNaN(this.getTime())){
		return 'Invalid Hijrah Date';
	}

	return this.format('medium');
}

function resolvePreviousValid(year, month, day) {
	var monthDays = _getMonthLength(year, month);
	if (day > monthDays) {
		day = monthDays;
	}
	return new HijrahDate(year, month-1, day);
}

function checkValidYear(hijrahYear) {
	if (hijrahYear < getMinimumYear() || hijrahYear > getMaximumYear()) {
		throw "Invalid Hijrah year: " + hijrahYear;
	}
	return toInt(hijrahYear);
}

function checkValidDayOfYear(dayOfYear) {
	if (dayOfYear < 1 || dayOfYear > getMaximumDayOfYear()) {
		throw "Invalid Hijrah day of year: " + dayOfYear;
	}
}

function checkValidMonth(month) {
	if (month < 1 || month > 12) {
		throw "Invalid Hijrah month: " + month;
	}
}

function getHijrahDateInfo(epochDay) {
	if (epochDay < minEpochDay || epochDay >= maxEpochDay) {
		throw "Hijrah date out of range";
	}

	var epochMonth = epochDayToEpochMonth(epochDay);
	var year = epochMonthToYear(epochMonth);
	var month = epochMonthToMonth(epochMonth);
	var day1 = epochMonthToEpochDay(epochMonth);
	var date = epochDay - day1; // epochDay - dayOfEpoch(year, month);

	var dateInfo = new Array(3);
	dateInfo[0] = year;
	dateInfo[1] = month + 1; // change to 1-based.
	dateInfo[2] = date + 1; // change to 1-based.
	return dateInfo;
}

function getEpochDay(hijrahYear, monthOfYear, dayOfMonth) {
	checkValidMonth(monthOfYear);
	var epochMonth = yearToEpochMonth(hijrahYear) + (monthOfYear - 1);
	if (epochMonth < 0 || epochMonth >= hijrahEpochMonthStartDays.length) {
		throw "Invalid Hijrah date, year: " +
				hijrahYear +  ", month: " + monthOfYear;
	}
	if (dayOfMonth < 1 || dayOfMonth > _getMonthLength(hijrahYear, monthOfYear)) {
		throw "Invalid Hijrah day of month: " + dayOfMonth;
	}
	return epochMonthToEpochDay(epochMonth) + (dayOfMonth - 1);
}

function _getDayOfYear(hijrahYear, month) {
	return yearMonthToDayOfYear(hijrahYear, (month - 1));
}

function _getMonthLength(hijrahYear, monthOfYear) {
	var epochMonth = yearToEpochMonth(hijrahYear) + (monthOfYear - 1);
	if (epochMonth < 0 || epochMonth >= hijrahEpochMonthStartDays.length) {
		throw "Invalid Hijrah date, year: " +
				hijrahYear +  ", month: " + monthOfYear;
	}
	return epochMonthLength(epochMonth);
}

function _getYearLength(hijrahYear) {
	return yearMonthToDayOfYear(hijrahYear, 12);
}

function getMinimumYear() {
	return epochMonthToYear(0);
}

function getMaximumYear() {
	return epochMonthToYear(hijrahEpochMonthStartDays.length - 1) - 1;
}

function getMaximumMonthLength() {
	return maxMonthLength;
}

function getMinimumMonthLength() {
	return minMonthLength;
}

function getMaximumDayOfYear() {
	return maxYearLength;
}

function getSmallestMaximumDayOfYear() {
	return minYearLength;
}

function epochDayToEpochMonth(epochDay) {
	var ndx = arrayBinarySearch(hijrahEpochMonthStartDays, epochDay);
	if (ndx < 0) {
		ndx = -ndx - 2;
	}
	return ndx;
}

function epochMonthToYear(epochMonth) {
	return toInt((epochMonth + hijrahStartEpochMonth) / 12);
}

function yearToEpochMonth(year) {
	return (year * 12) - hijrahStartEpochMonth;
}

function epochMonthToMonth(epochMonth) {
	return (epochMonth + hijrahStartEpochMonth) % 12;
}

function epochMonthToEpochDay(epochMonth) {
	return hijrahEpochMonthStartDays[epochMonth];
}

function yearMonthToDayOfYear(hijrahYear, month) {
	var epochMonthFirst = yearToEpochMonth(hijrahYear);
	return epochMonthToEpochDay(epochMonthFirst + month)
			- epochMonthToEpochDay(epochMonthFirst);
}

function epochMonthLength(epochMonth) {
	return hijrahEpochMonthStartDays[epochMonth + 1]
			- hijrahEpochMonthStartDays[epochMonth];
}

function createEpochMonths(epochDay, minYear, maxYear, years) {
    var numMonths = (maxYear - minYear + 1) * 12 + 1;
    var epochMonth = 0;
    var epochMonths = new Array(numMonths);
    minMonthLength = Number.MIN_VALUE;
    maxMonthLength = Number.MAX_VALUE;

    for (var year = minYear; year <= maxYear; year++) {
        var months = years[year];// must not be gaps
        for (var month = 0; month < 12; month++) {
            var length = months[month];
            epochMonths[epochMonth++] = epochDay;
            if (length < 29 || length > 32) {
                throw "Invalid month length in year: " + minYear;
            }
            epochDay += length;
            minMonthLength = Math.min(minMonthLength, length);
            maxMonthLength = Math.max(maxMonthLength, length);
        }
    }

    epochMonths[epochMonth++] = epochDay;

    if (epochMonth != epochMonths.length) {
        throw "Did not fill epochMonths exactly: ndx = " + epochMonth + " should be " + epochMonths.length;
    }

    return epochMonths;
}

function isGregorianLeapYear(year) {
	return ((year & 3) == 0) && ((year % 100) != 0 || (year % 400) == 0);
}

function epochDayFromGregorain(date) {
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var total = 0;
	total += 365 * y;
	if (y >= 0) {
		total += toInt((y + 3) / 4) - toInt((y + 99) / 100) + toInt((y + 399) / 400);
	} else {
		total -= toInt(y / -4 - y / -100 + y / -400);
	}
	total += toInt(((367 * m - 362) / 12));
	total += date.getDate() - 1;
	if (m > 2) {
		total--;
		if (isGregorianLeapYear(date.getFullYear()) == false) {
			total--;
		}
	}

	return total - DAYS_0000_TO_1970;
}

function gregorianFromEpochDay(epochDay) {
	var zeroDay = epochDay + DAYS_0000_TO_1970;
	// find the march-based year
	zeroDay -= 60;  // adjust to 0000-03-01 so leap day is at end of four year cycle
	var adjust = 0;
	if (zeroDay < 0) {
		// adjust negative years to positive for calculation
		var adjustCycles = toInt((zeroDay + 1) / DAYS_PER_CYCLE - 1);
		adjust = adjustCycles * 400;
		zeroDay += -adjustCycles * DAYS_PER_CYCLE;
	}
	var yearEst = toInt((400 * zeroDay + 591) / DAYS_PER_CYCLE);
	var doyEst = zeroDay - (365 * yearEst + toInt(yearEst / 4) - toInt(yearEst / 100) + toInt(yearEst / 400));
	if (doyEst < 0) {
		// fix estimate
		yearEst--;
		doyEst = zeroDay - toInt((365 * yearEst + yearEst / 4 - yearEst / 100 + yearEst / 400));
	}
	yearEst += adjust;  // reset any negative year
	var marchDoy0 = toInt(doyEst);

	// convert march-based values back to january-based
	var marchMonth0 = toInt((marchDoy0 * 5 + 2) / 153);
	var month = (marchMonth0 + 2) % 12 + 1;
	var dom = marchDoy0 - toInt((marchMonth0 * 306 + 5) / 10) + 1;
	yearEst += toInt(marchMonth0 / 10);

	return new Date(yearEst, month - 1, dom);
}

function init(){
	var years = [];
	years['1300']=[30,29,30,29,30,29,30,29,30,29,30,29];
	years['1301']=[30,30,29,30,29,30,29,30,29,30,29,29];
	years['1302']=[30,30,30,29,30,30,29,29,30,29,29,30];
	years['1303']=[29,30,30,29,30,30,29,30,29,30,29,29];
	years['1304']=[29,30,30,29,30,30,30,29,30,29,30,29];
	years['1305']=[29,29,30,30,29,30,30,29,30,30,29,29];
	years['1306']=[30,29,30,29,30,29,30,29,30,30,29,30];
	years['1307']=[29,30,29,30,29,30,29,30,29,30,29,30];
	years['1308']=[29,30,30,29,30,29,30,29,30,29,29,30];
	years['1309']=[29,30,30,30,30,29,29,30,29,29,30,29];
	years['1310']=[30,29,30,30,30,29,30,29,30,29,29,30];
	years['1311']=[29,30,29,30,30,30,29,30,29,30,29,29];
	years['1312']=[30,29,30,29,30,30,29,30,30,29,30,29];
	years['1313']=[29,30,29,30,29,30,29,30,30,30,29,29];
	years['1314']=[30,30,29,30,29,29,30,29,30,30,29,30];
	years['1315']=[29,30,30,29,30,29,29,30,29,30,29,30];
	years['1316']=[29,30,30,30,29,30,29,29,30,29,30,29];
	years['1317']=[30,29,30,30,29,30,29,30,29,30,29,29];
	years['1318']=[30,29,30,30,29,30,30,29,30,29,30,29];
	years['1319']=[29,30,29,30,30,29,30,29,30,30,29,30];
	years['1320']=[29,30,29,29,30,29,30,29,30,30,30,29];
	years['1321']=[30,29,30,29,29,30,29,29,30,30,30,30];
	years['1322']=[29,30,29,30,29,29,29,30,29,30,30,30];
	years['1323']=[29,30,30,29,30,29,29,29,30,29,30,30];
	years['1324']=[29,30,30,29,30,29,30,29,29,30,29,30];
	years['1325']=[30,29,30,29,30,30,29,30,29,30,29,30];
	years['1326']=[29,29,30,29,30,30,29,30,29,30,30,29];
	years['1327']=[30,29,29,30,29,30,29,30,30,29,30,30];
	years['1328']=[29,30,29,29,30,29,29,30,30,30,29,30];
	years['1329']=[30,29,30,29,29,30,29,29,30,30,29,30];
	years['1330']=[30,30,29,30,29,29,30,29,29,30,30,29];
	years['1331']=[30,30,29,30,30,29,29,30,29,30,29,30];
	years['1332']=[29,30,29,30,30,29,30,29,30,30,29,29];
	years['1333']=[30,29,29,30,30,29,30,30,29,30,30,29];
	years['1334']=[29,29,30,29,30,29,30,30,30,29,30,29];
	years['1335']=[30,29,30,29,29,30,29,30,30,29,30,30];
	years['1336']=[29,30,29,30,29,29,30,29,30,29,30,30];
	years['1337']=[30,29,30,29,30,29,29,30,29,30,29,30];
	years['1338']=[29,30,30,29,30,30,29,29,30,29,30,29];
	years['1339']=[30,29,30,29,30,30,30,29,30,29,29,30];
	years['1340']=[29,29,30,29,30,30,30,30,29,30,29,29];
	years['1341']=[30,29,29,30,29,30,30,30,29,30,30,29];
	years['1342']=[29,29,30,29,30,29,30,30,29,30,30,29];
	years['1343']=[30,29,29,30,29,30,29,30,29,30,30,29];
	years['1344']=[30,29,30,29,30,30,29,29,30,29,30,29];
	years['1345']=[30,29,30,30,30,29,30,29,29,30,29,29];
	years['1346']=[30,29,30,30,30,30,29,30,29,29,30,29];
	years['1347']=[29,30,29,30,30,30,29,30,30,29,29,30];
	years['1348']=[29,29,30,29,30,30,29,30,30,30,29,29];
	years['1349']=[30,29,29,30,29,30,30,29,30,30,29,30];
	years['1350']=[29,30,29,30,29,30,29,29,30,30,29,30];
	years['1351']=[30,29,30,29,30,29,30,29,29,30,29,30];
	years['1352']=[30,29,30,30,29,30,29,30,29,29,30,29];
	years['1353']=[30,29,30,30,30,29,30,29,29,30,29,30];
	years['1354']=[29,30,29,30,30,29,30,30,29,30,29,29];
	years['1355']=[30,29,29,30,30,29,30,30,29,30,30,29];
	years['1356']=[29,30,29,30,29,30,29,30,29,30,30,30];
	years['1357']=[29,29,30,29,30,29,29,30,29,30,30,30];
	years['1358']=[29,30,29,30,29,30,29,29,30,29,30,30];
	years['1359']=[29,30,30,29,30,29,30,29,29,29,30,30];
	years['1360']=[29,30,30,30,29,30,29,30,29,29,30,29];
	years['1361']=[30,29,30,30,29,30,30,29,29,30,29,30];
	years['1362']=[29,30,29,30,29,30,30,29,30,29,30,29];
	years['1363']=[30,29,30,29,30,29,30,29,30,29,30,30];
	years['1364']=[29,30,29,30,29,29,30,29,30,29,30,30];
	years['1365']=[30,30,29,29,30,29,29,30,29,30,29,30];
	years['1366']=[30,30,29,30,29,30,29,29,30,29,30,29];
	years['1367']=[30,30,29,30,30,29,30,29,29,30,29,30];
	years['1368']=[29,30,29,30,30,30,29,29,30,29,30,29];
	years['1369']=[30,29,30,29,30,30,29,30,29,30,30,29];
	years['1370']=[30,29,29,30,29,30,29,30,29,30,30,30];
	years['1371']=[29,30,29,29,30,29,30,29,30,29,30,30];
	years['1372']=[30,29,29,30,29,30,29,29,30,29,30,30];
	years['1373']=[30,29,30,29,30,29,30,29,29,30,29,30];
	years['1374']=[30,29,30,30,29,30,29,30,29,29,30,29];
	years['1375']=[30,29,30,30,29,30,30,29,30,29,30,29];
	years['1376']=[29,30,29,30,29,30,30,30,29,30,29,30];
	years['1377']=[29,29,30,29,29,30,30,30,29,30,30,29];
	years['1378']=[30,29,29,29,30,29,30,30,29,30,30,30];
	years['1379']=[29,30,29,29,29,30,29,30,30,29,30,30];
	years['1380']=[29,30,29,30,29,30,29,30,29,30,29,30];
	years['1381']=[29,30,29,30,30,29,30,29,30,29,29,30];
	years['1382']=[29,30,29,30,30,29,30,30,29,30,29,29];
	years['1383']=[30,29,29,30,30,30,29,30,30,29,30,29];
	years['1384']=[29,30,29,29,30,30,29,30,30,30,29,30];
	years['1385']=[29,29,30,29,29,30,30,29,30,30,30,29];
	years['1386']=[30,29,29,30,29,29,30,30,29,30,30,29];
	years['1387']=[30,29,30,29,30,29,30,29,30,29,30,29];
	years['1388']=[30,30,29,30,29,30,29,30,29,30,29,29];
	years['1389']=[30,30,29,30,30,29,30,30,29,29,30,29];
	years['1390']=[29,30,29,30,30,30,29,30,29,30,29,30];
	years['1391']=[29,29,30,29,30,30,29,30,30,29,30,29];
	years['1392']=[30,29,29,30,29,30,29,30,30,29,30,30];
	years['1393']=[29,30,29,29,30,29,30,29,30,29,30,30];
	years['1394']=[30,29,30,29,29,30,29,30,29,30,29,30];
	years['1395']=[30,29,30,30,29,30,29,29,30,29,29,30];
	years['1396']=[30,29,30,30,29,30,30,29,29,30,29,29];
	years['1397']=[30,29,30,30,29,30,30,30,29,29,29,30];
	years['1398']=[29,30,29,30,30,29,30,30,29,30,29,29];
	years['1399']=[30,29,30,29,30,29,30,30,29,30,29,30];
	years['1400']=[30,29,30,29,29,30,29,30,29,30,29,30];
	years['1401']=[30,30,29,30,29,29,30,29,29,30,29,30];
	years['1402']=[30,30,30,29,30,29,29,30,29,29,30,29];
	years['1403']=[30,30,30,29,30,30,29,29,30,29,29,30];
	years['1404']=[29,30,30,29,30,30,29,30,29,30,29,29];
	years['1405']=[30,29,30,29,30,30,30,29,30,29,29,30];
	years['1406']=[30,29,29,30,29,30,30,29,30,29,30,30];
	years['1407']=[29,30,29,29,30,29,30,29,30,29,30,30];
	years['1408']=[30,29,30,29,30,29,29,30,29,29,30,30];
	years['1409']=[30,30,29,30,29,30,29,29,30,29,29,30];
	years['1410']=[30,30,29,30,30,29,30,29,29,30,29,29];
	years['1411']=[30,30,29,30,30,29,30,30,29,29,30,29];
	years['1412']=[30,29,30,29,30,29,30,30,30,29,29,30];
	years['1413']=[29,30,29,29,30,29,30,30,30,29,30,29];
	years['1414']=[30,29,30,29,29,30,29,30,30,29,30,30];
	years['1415']=[29,30,29,30,29,29,30,29,30,29,30,30];
	years['1416']=[30,29,30,29,30,29,29,30,29,30,29,30];
	years['1417']=[30,29,30,30,29,29,30,29,30,29,30,29];
	years['1418']=[30,29,30,30,29,30,29,30,29,30,29,30];
	years['1419']=[29,30,29,30,29,30,29,30,30,30,29,29];
	years['1420']=[29,30,29,29,30,29,30,30,30,30,29,30];
	years['1421']=[29,29,30,29,29,29,30,30,30,30,29,30];
	years['1422']=[30,29,29,30,29,29,29,30,30,30,29,30];
	years['1423']=[30,29,30,29,30,29,29,30,29,30,29,30];
	years['1424']=[30,29,30,30,29,30,29,29,30,29,30,29];
	years['1425']=[30,29,30,30,29,30,29,30,30,29,30,29];
	years['1426']=[29,30,29,30,29,30,30,29,30,30,29,30];
	years['1427']=[29,29,30,29,30,29,30,30,29,30,30,29];
	years['1428']=[30,29,29,30,29,29,30,30,30,29,30,30];
	years['1429']=[29,30,29,29,30,29,29,30,30,29,30,30];
	years['1430']=[29,30,30,29,29,30,29,30,29,30,29,30];
	years['1431']=[29,30,30,29,30,29,30,29,30,29,29,30];
	years['1432']=[29,30,30,30,29,30,29,30,29,30,29,29];
	years['1433']=[30,29,30,30,29,30,30,29,30,29,30,29];
	years['1434']=[29,30,29,30,29,30,30,29,30,30,29,29];
	years['1435']=[30,29,30,29,30,29,30,29,30,30,29,30];
	years['1436']=[29,30,29,30,29,30,29,30,29,30,29,30];
	years['1437']=[30,29,30,30,29,29,30,29,30,29,29,30];
	years['1438']=[30,29,30,30,30,29,29,30,29,29,30,29];
	years['1439']=[30,29,30,30,30,29,30,29,30,29,29,30];
	years['1440']=[29,30,29,30,30,30,29,30,29,30,29,29];
	years['1441']=[30,29,30,29,30,30,29,30,30,29,30,29];
	years['1442']=[29,30,29,30,29,30,29,30,30,29,30,29];
	years['1443']=[30,29,30,29,30,29,30,29,30,29,30,30];
	years['1444']=[29,30,29,30,30,29,29,30,29,30,29,30];
	years['1445']=[29,30,30,30,29,30,29,29,30,29,29,30];
	years['1446']=[29,30,30,30,29,30,30,29,29,30,29,29];
	years['1447']=[30,29,30,30,30,29,30,29,30,29,30,29];
	years['1448']=[29,30,29,30,30,29,30,30,29,30,29,30];
	years['1449']=[29,29,30,29,30,29,30,30,29,30,30,29];
	years['1450']=[30,29,30,29,29,30,29,30,29,30,30,29];
	years['1451']=[30,30,30,29,29,30,29,29,30,30,29,30];
	years['1452']=[30,29,30,30,29,29,30,29,29,30,29,30];
	years['1453']=[30,29,30,30,29,30,29,30,29,29,30,29];
	years['1454']=[30,29,30,30,29,30,30,29,30,29,30,29];
	years['1455']=[29,30,29,30,30,29,30,29,30,30,29,30];
	years['1456']=[29,29,30,29,30,29,30,29,30,30,30,29];
	years['1457']=[30,29,29,30,29,29,30,29,30,30,30,30];
	years['1458']=[29,30,29,29,30,29,29,30,29,30,30,30];
	years['1459']=[29,30,30,29,29,30,29,29,30,29,30,30];
	years['1460']=[29,30,30,29,30,29,30,29,29,30,29,30];
	years['1461']=[29,30,30,29,30,29,30,29,30,30,29,29];
	years['1462']=[30,29,30,29,30,30,29,30,29,30,30,29];
	years['1463']=[29,30,29,30,29,30,29,30,30,30,29,30];
	years['1464']=[29,30,29,29,30,29,29,30,30,30,29,30];
	years['1465']=[30,29,30,29,29,30,29,29,30,30,29,30];
	years['1466']=[30,30,29,30,29,29,29,30,29,30,30,29];
	years['1467']=[30,30,29,30,30,29,29,30,29,30,29,30];
	years['1468']=[29,30,29,30,30,29,30,29,30,29,30,29];
	years['1469']=[29,30,29,30,30,29,30,30,29,30,29,30];
	years['1470']=[29,29,30,29,30,30,29,30,30,29,30,29];
	years['1471']=[30,29,29,30,29,30,29,30,30,29,30,30];
	years['1472']=[29,30,29,29,30,29,30,29,30,30,29,30];
	years['1473']=[29,30,29,30,30,29,29,30,29,30,29,30];
	years['1474']=[29,30,30,29,30,30,29,29,30,29,30,29];
	years['1475']=[29,30,30,29,30,30,30,29,29,30,29,29];
	years['1476']=[30,29,30,29,30,30,30,29,30,29,30,29];
	years['1477']=[29,30,29,29,30,30,30,30,29,30,29,30];
	years['1478']=[29,29,30,29,30,29,30,30,29,30,30,29];
	years['1479']=[30,29,29,30,29,30,29,30,29,30,30,29];
	years['1480']=[30,29,30,29,30,29,30,29,30,29,30,29];
	years['1481']=[30,29,30,30,29,30,29,30,29,30,29,29];
	years['1482']=[30,29,30,30,30,30,29,30,29,29,30,29];
	years['1483']=[29,30,29,30,30,30,29,30,30,29,29,30];
	years['1484']=[29,29,30,29,30,30,30,29,30,29,30,29];
	years['1485']=[30,29,29,30,29,30,30,29,30,30,29,30];
	years['1486']=[29,30,29,29,30,29,30,29,30,30,29,30];
	years['1487']=[30,29,30,29,30,29,29,30,29,30,29,30];
	years['1488']=[30,29,30,30,29,30,29,29,30,29,30,29];
	years['1489']=[30,29,30,30,30,29,30,29,29,30,29,30];
	years['1490']=[29,30,29,30,30,29,30,30,29,29,30,29];
	years['1491']=[30,29,29,30,30,29,30,30,29,30,29,30];
	years['1492']=[29,30,29,29,30,30,29,30,29,30,30,29];
	years['1493']=[30,29,30,29,30,29,29,30,29,30,30,30];
	years['1494']=[29,30,29,30,29,30,29,29,29,30,30,30];
	years['1495']=[29,30,30,29,30,29,29,30,29,29,30,30];
	years['1496']=[29,30,30,30,29,30,29,29,30,29,29,30];
	years['1497']=[30,29,30,30,29,30,29,30,29,30,29,30];
	years['1498']=[29,30,29,30,29,30,30,29,30,29,30,29];
	years['1499']=[30,29,30,29,29,30,30,29,30,29,30,30];
	years['1500']=[29,30,29,30,29,29,30,29,30,29,30,30];
	years['1501']=[30,29,30,29,30,29,29,29,30,29,30,30];
	years['1502']=[30,30,29,30,29,30,29,29,29,30,30,29];
	years['1503']=[30,30,29,30,30,29,30,29,29,29,30,30];
	years['1504']=[29,30,29,30,30,30,29,29,30,29,30,29];
	years['1505']=[30,29,30,29,30,30,29,30,29,30,30,29];
	years['1506']=[29,30,29,29,30,30,29,30,30,29,30,30];
	years['1507']=[29,29,30,29,29,30,30,29,30,29,30,30];
	years['1508']=[30,29,29,30,29,30,29,29,30,29,30,30];
	years['1509']=[30,29,30,29,30,29,30,29,29,30,29,30];
	years['1510']=[30,29,30,30,29,30,29,30,29,29,30,29];
	years['1511']=[30,29,30,30,29,30,30,29,30,29,29,30];
	years['1512']=[29,30,29,30,29,30,30,30,29,30,29,30];
	years['1513']=[29,29,29,30,29,30,30,30,29,30,30,29];
	years['1514']=[30,29,29,29,30,29,30,30,29,30,30,30];
	years['1515']=[29,29,30,29,29,30,29,30,30,29,30,30];
	years['1516']=[29,30,29,30,29,29,30,29,30,29,30,30];
	years['1517']=[29,30,29,30,29,30,30,29,29,30,29,30];
	years['1518']=[29,30,29,30,30,29,30,30,29,30,29,29];
	years['1519']=[30,29,29,30,30,30,29,30,30,29,30,29];
	years['1520']=[29,30,29,29,30,30,30,29,30,30,29,30];
	years['1521']=[29,29,29,30,29,30,30,29,30,30,29,30];
	years['1522']=[30,29,29,29,30,29,30,30,29,30,30,29];
	years['1523']=[30,29,30,29,30,29,30,29,29,30,30,29];
	years['1524']=[30,30,29,30,29,30,29,30,29,29,30,29];
	years['1525']=[30,30,29,30,30,29,30,29,30,29,29,30];
	years['1526']=[29,30,29,30,30,30,29,30,29,30,29,29];
	years['1527']=[30,29,30,29,30,30,29,30,30,29,30,29];
	years['1528']=[30,29,29,30,29,30,29,30,30,29,30,30];
	years['1529']=[29,30,29,29,30,29,30,29,30,29,30,30];
	years['1530']=[29,30,30,29,29,30,29,30,29,29,30,30];
	years['1531']=[29,30,30,30,29,29,30,29,30,29,29,30];
	years['1532']=[29,30,30,30,29,30,30,29,29,29,30,29];
	years['1533']=[30,29,30,30,30,29,30,29,30,29,29,30];
	years['1534']=[29,30,29,30,30,29,30,30,29,29,30,29];
	years['1535']=[30,29,30,29,30,29,30,30,29,30,29,30];
	years['1536']=[29,30,29,30,29,30,29,30,29,30,29,30];
	years['1537']=[30,29,30,30,29,29,30,29,29,30,29,30];
	years['1538']=[30,30,29,30,30,29,29,30,29,29,30,29];
	years['1539']=[30,30,30,29,30,30,29,29,30,29,29,30];
	years['1540']=[29,30,30,29,30,30,29,30,29,29,30,29];
	years['1541']=[30,29,30,29,30,30,30,29,30,29,29,30];
	years['1542']=[29,30,29,30,29,30,30,29,30,29,30,30];
	years['1543']=[29,30,29,29,30,29,30,29,30,29,30,30];
	years['1544']=[30,29,30,29,29,30,29,30,29,30,29,30];
	years['1545']=[30,30,29,30,29,29,30,29,30,29,29,30];
	years['1546']=[30,30,29,30,29,30,29,30,29,30,29,29];
	years['1547']=[30,30,29,30,30,29,30,29,30,29,30,29];
	years['1548']=[30,29,29,30,30,29,30,30,29,30,29,30];
	years['1549']=[29,30,29,29,30,29,30,30,30,29,30,29];
	years['1550']=[30,29,30,29,29,29,30,30,30,29,30,30];
	years['1551']=[29,30,29,29,30,29,29,30,30,29,30,30];
	years['1552']=[30,29,30,29,29,30,29,29,30,30,29,30];
	years['1553']=[30,29,30,29,30,29,30,29,30,29,30,29];
	years['1554']=[30,29,30,29,30,30,29,30,29,30,29,30];
	years['1555']=[29,29,30,29,30,30,29,30,30,29,30,29];
	years['1556']=[30,29,29,30,29,30,29,30,30,30,29,30];
	years['1557']=[29,30,29,29,29,30,29,30,30,30,30,29];
	years['1558']=[30,29,30,29,29,29,30,29,30,30,30,29];
	years['1559']=[30,30,29,29,30,29,29,30,30,29,30,29];
	years['1560']=[30,30,29,30,29,30,29,30,29,30,29,30];
	years['1561']=[29,30,30,29,30,29,30,30,29,29,30,29];
	years['1562']=[29,30,30,29,30,29,30,30,30,29,29,30];
	years['1563']=[29,30,29,29,30,29,30,30,30,29,30,29];
	years['1564']=[30,29,30,29,29,30,29,30,30,30,29,30];
	years['1565']=[29,30,29,30,29,29,30,29,30,30,29,30];
	years['1566']=[30,29,30,29,30,29,29,30,29,30,29,30];
	years['1567']=[30,29,30,30,29,30,29,30,29,29,30,29];
	years['1568']=[30,29,30,30,30,29,30,29,30,29,29,29];
	years['1569']=[30,29,30,30,30,29,30,30,29,30,29,29];
	years['1570']=[29,30,29,30,30,29,30,30,30,29,29,30];
	years['1571']=[29,29,30,29,30,30,29,30,30,29,30,29];
	years['1572']=[30,29,29,30,29,30,29,30,30,29,30,29];
	years['1573']=[30,29,30,30,29,30,29,29,30,29,30,29];
	years['1574']=[30,30,29,30,30,29,30,29,29,30,29,29];
	years['1575']=[30,30,30,29,30,30,29,30,29,29,29,30];
	years['1576']=[29,30,30,29,30,30,30,29,30,29,29,29];
	years['1577']=[30,29,30,30,29,30,30,29,30,29,30,29];
	years['1578']=[29,30,29,30,29,30,30,29,30,30,29,30];
	years['1579']=[29,30,29,30,29,29,30,30,29,30,29,30];
	years['1580']=[29,30,30,29,30,29,29,30,29,30,29,30];
	years['1581']=[30,30,29,30,29,30,29,29,30,29,30,29];
	years['1582']=[30,30,29,30,30,29,30,29,30,29,29,29];
	years['1583']=[30,30,29,30,30,30,29,30,29,30,29,29];
	years['1584']=[29,30,30,29,30,30,29,30,30,29,30,29];
	years['1585']=[29,30,29,30,29,30,29,30,30,29,30,30];
	years['1586']=[29,29,30,29,30,29,29,30,30,30,29,30];
	years['1587']=[29,30,30,29,29,29,30,29,30,29,30,30];
	years['1588']=[30,29,30,30,29,29,29,30,29,30,29,30];
	years['1589']=[30,29,30,30,29,30,29,29,30,29,30,29];
	years['1590']=[30,29,30,30,30,29,29,30,29,30,29,30];
	years['1591']=[29,30,29,30,30,29,30,29,30,29,30,29];
	years['1592']=[30,29,30,29,30,29,30,29,30,30,30,29];
	years['1593']=[30,29,29,30,29,29,30,29,30,30,30,29];
	years['1594']=[30,30,29,29,30,29,29,29,30,30,30,30];
	years['1595']=[29,30,29,30,29,29,30,29,29,30,30,30];
	years['1596']=[29,30,30,29,30,29,29,30,29,30,29,30];
	years['1597']=[29,30,30,29,30,29,30,29,30,29,30,29];
	years['1598']=[30,29,30,29,30,30,29,30,29,30,30,29];
	years['1599']=[29,30,29,30,29,30,29,30,30,30,29,30];
	years['1600']=[29,29,30,29,30,29,29,30,30,30,29,30];

	var minYear = 1300;
	var maxYear = 1600;
	var isoStart = epochDayFromGregorain(new Date(1882, 11-1, 12));
	hijrahStartEpochMonth = minYear * 12;
	minEpochDay = isoStart;
	hijrahEpochMonthStartDays = createEpochMonths(minEpochDay, minYear, maxYear, years);
	maxEpochDay = hijrahEpochMonthStartDays[hijrahEpochMonthStartDays.length - 1];

	minYearLength = 0, maxYearLength = 0;
	for (var year = minYear; year < maxYear; year++) {
		var length = _getYearLength(year);
		minYearLength = Math.min(minYearLength, length);
		maxYearLength = Math.max(maxYearLength, length);
	}
}

return HijrahDate;

})();
