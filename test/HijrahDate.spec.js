"use strict";

describe('HijrahDate', function(){

	describe('constructor', function(){
		it("year '1700' should not be valid", function(){
			expect(function(){new HijrahDate(1700, 10);}).toThrow();
		});
		it("'12' for 0-based month should not be valid", function(){
			expect(function(){new HijrahDate(1437, 12);}).toThrow();
		});
		it("should ignore invalid dates", function(){
			var hd = new HijrahDate('abc');
			expect(hd.getTime()).toEqual(Number.NaN);
		});

		describe("with no arguments", function(){
			it("should have an active date equal to the current date", function(){
				Date = TimeShift.Date;
				TimeShift.setTime(1451624400000); // 2016-01-01
				var gd = new Date();
				var hd = new HijrahDate();
				expect(hd.getTime()).toEqual(gd.getTime());
				TimeShift.setTime(undefined);
			});
		});

		it("should accept HijrahDate as parameter", function(){
			var baseDate = new HijrahDate();
			var hd = new HijrahDate(baseDate);
			expect(hd.getTime()).toEqual(baseDate.getTime());
		});

		it("should accept JS native Date", function(){
			var gd = new Date(2016, 0, 1);
			var hd = new HijrahDate(gd);
			expect(hd.getTime()).toEqual(gd.getTime());
		});

		it("should accept milliseconds", function(){
			var hd = new HijrahDate(86400000);
			expect(hd.getTime()).toEqual(new Date(86400000).getTime());
		});

		it("should accept year and month arguments", function(){
			var hd = new HijrahDate(1437, 11);
			expect([1437, 11, 1]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate()]);
		});

		it("should accept year and month arguments", function(){
			var hd = new HijrahDate(1437, 11);
			expect([1437, 11, 1]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate()]);
		});

		it("should accept year, month and day arguments", function(){
			var hd = new HijrahDate(1437, 11, 14);
			expect([1437, 11, 14]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate()]);
			hd = new HijrahDate(1442, 10, 19);
			expect([1442, 10, 19]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate()]);
		});

		it("should reject invalid day argument", function(){
			expect(function(){new HijrahDate(1437, 11, 31)}).toThrow('Invalid Hijrah day of month: 31');
		});

		it("with time arguments sho work correctly", function(){
			var hd = new HijrahDate(1437, 11, 14, 20);
			expect([1437, 11, 14, 20]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate(), hd.getHours()]);
			hd = new HijrahDate(1437, 11, 14, 20, 35);
			expect([1437, 11, 14, 20, 35]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate(), hd.getHours(), hd.getMinutes()]);
			hd = new HijrahDate(1437, 11, 14, 20, 35, 17);
			expect([1437, 11, 14, 20, 35, 17]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate(), hd.getHours(), hd.getMinutes(), hd.getSeconds()]);
			hd = new HijrahDate(1437, 11, 14, 20, 35, 17, 456);
			expect([1437, 11, 14, 20, 35, 17, 456]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate(), hd.getHours(), hd.getMinutes(), hd.getSeconds(), hd.getMilliseconds()]);
			hd = new HijrahDate(1437, 11, 14, -2);
			expect([1437, 11, 13, 22]).toEqual([hd.getFullYear(), hd.getMonth(), hd.getDate(), hd.getHours()]);
		});
	});

	it("local getters should work correctly", function(){
		var hd = new HijrahDate(1437, 11, 14, 15, 50, 21, 456);
		expect(hd.getFullYear()).toEqual(1437);
		expect(hd.getMonth()).toEqual(11);
		expect(hd.getDate()).toEqual(14);
		expect(hd.getDay()).toEqual(4);
		expect(hd.getHours()).toEqual(15);
		expect(hd.getMinutes()).toEqual(50);
		expect(hd.getSeconds()).toEqual(21);
		expect(hd.getMilliseconds()).toEqual(456);
	});

	describe('toEpochDay', function(){
		it("for '1436-09-01' should be '16604'", function(){
			expect(new HijrahDate(1436, 8, 1).toEpochDay()).toEqual(16604);
		});
		it("Epoch day for '1437-10-1' should be '16988'", function(){
			expect(new HijrahDate(1437, 9, 1).toEpochDay()).toEqual(16988);
		});
		it("Epoch day for '1437-11-1' should be '17017'", function(){
			expect(new HijrahDate(1437, 10, 1).toEpochDay()).toEqual(17017);
		});
	});

	describe('getDayOfYear', function(){
		it("for '1437-12-14' should equals 338", function(){
			expect(new HijrahDate(1437, 11, 14).getDayOfYear()).toEqual(338);
		});
		it("day of year for '1435-08-07' should equals 214", function(){
			expect(new HijrahDate(1435, 7, 7).getDayOfYear()).toEqual(214);
		});
	});

	describe('getDay', function(){
		it("should work correctly", function(){
			expect(new HijrahDate(1437, 11, 1).getDay()).toEqual(5);
			expect(new HijrahDate(1437, 11, 2).getDay()).toEqual(6);
			expect(new HijrahDate(1437, 11, 3).getDay()).toEqual(0);
			expect(new HijrahDate(1437, 11, 4).getDay()).toEqual(1);
			expect(new HijrahDate(1437, 11, 5).getDay()).toEqual(2);
			expect(new HijrahDate(1437, 11, 14).getDay()).toEqual(4);
		});
	});

	describe('isLeapYear: ', function(){
		it(' for `1435` should be a leap year', function(){
			expect(new HijrahDate(1435, 1, 1).isLeapYear()).toBe(true);
		});
		it('for `1437` should not be a leap year', function(){
			expect(new HijrahDate(1437, 1, 1).isLeapYear()).toBe(false);
		});
	});

	describe('getYearLength', function(){
		it("for `1435` should equals `355`", function(){
			expect(new HijrahDate(1435, 9, 1).getYearLength()).toEqual(355);
		});
		it("for `1437` should equals `354`", function(){
			expect(new HijrahDate(1437, 9, 1).getYearLength()).toEqual(354);
		});
	});

	describe('getMonthLength', function(){
		it("for 1437/9 should equals '30'", function(){
			expect(new HijrahDate(1437, 8, 1).getMonthLength()).toEqual(30);
		});
		it("for 1437/10 should equals '29'", function(){
			expect(new HijrahDate(1437, 9, 1).getMonthLength()).toEqual(29);
		});
		it("for 1437/11 should equals '29'", function(){
			expect(new HijrahDate(1437, 10, 1).getMonthLength()).toEqual(29);
		});
		it("for 1437/12 should equals '30'", function(){
			expect(new HijrahDate(1437, 11, 1).getMonthLength()).toEqual(30);
		});
	});

	describe('plusYears', function(){
		it("5 to '1437-11-19' should equals '1442-11-19'", function(){
			var hd = new HijrahDate(1437, 10, 19).plusYears(5);
			expect([hd.getFullYear(),hd.getMonth(),hd.getDate()]).toEqual([1442,10,19]);
		});
	});
	describe('minusYears', function(){
		it("5 from '1437-09-30' should equals '1442-09-29'", function(){
			var hd = new HijrahDate(1437, 8, 30).minusYears(5);
			expect([hd.getFullYear(),hd.getMonth(),hd.getDate()]).toEqual([1432,8,29]);
		});
	});

	describe('plusMonths', function(){
		it("5 to '1437-09-30' should equals '1438-02-29'", function(){
			var hd = new HijrahDate(1437, 8, 30).plusMonths(5);
			expect([hd.getFullYear(), hd.getMonth(), hd.getDate()]).toEqual([1438, 1, 29]);
		});
	});
	describe('minusMonths', function(){
		it("4 from '1437-09-30' should equals '1437-05-29'", function(){
			var hd = new HijrahDate(1437, 8, 30).minusMonths(4);
			expect([hd.getFullYear(), hd.getMonth(), hd.getDate()]).toEqual([1437, 4, 29]);
		});
	});

	describe('plusWeeks', function(){
		it("5 to '1437-11-19' should equals '1437-12-25'", function(){
			var hd = new HijrahDate(1437, 10, 19).plusWeeks(5);
			expect([hd.getFullYear(), hd.getMonth(), hd.getDate()]).toEqual([1437, 11, 25]);
		});
	});
	describe('minusWeeks', function(){
		it("4 from '1437-09-30' should equals '1437-09-02'", function(){
			var hd = new HijrahDate(1437, 8, 30).minusWeeks(4);
			expect([hd.getFullYear(), hd.getMonth(), hd.getDate()]).toEqual([1437, 8, 2]);
		});
	});

	describe('plusDays', function(){
		it("5 days to '1437-11-28' should equals '1437-12-04'", function(){
			var hd = new HijrahDate(1437, 10, 28).plusDays(5);
			expect([hd.getFullYear(), hd.getMonth(), hd.getDate()]).toEqual([1437, 11, 4]);
		});
	});
	describe('minusDays', function(){
		it("75 from '1437-11-28' should equals '1437-09-12'", function(){
			var hd = new HijrahDate(1437, 10, 28).minusDays(75);
			expect([hd.getFullYear(), hd.getMonth(), hd.getDate()]).toEqual([1437, 8, 12]);
		});
	});

	describe('toGregorian', function(){
		it("should convert to gregorian", function(){
			var date = new HijrahDate(1391, 2, 8).toGregorian();
			expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([1971, 4, 3]);
		});
	});

	describe('toString', function(){
		it("should return 'Invalid Hijrah Date' for invalid Hijrah date", function(){
			var hd = new HijrahDate('abc');
			expect(hd.toString()).toEqual('Invalid Hijrah Date');
		});

		it("should return 'medium date' formated value", function(){
			var hd = new HijrahDate(1437, 11, 10, 13, 45, 0);
			expect(hd.toString()).toEqual('Dhuʻl-H 10, 1437 1:45:00 PM');
		});
	});
});