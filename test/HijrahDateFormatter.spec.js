describe('hijrah date formatter', function() {
	function toInt(str){
		return parseInt(str, 10);
	}

	function padNumber(num){
		return (num <= 9 ? '0' + num : num);
	}

	function formatISO(date){
		return [date.getFullYear(), padNumber(date.getMonth()), padNumber(date.getDate())].join('-');
	}

	function filter(hijrahDate, format){
		return hijrahDate.format(format);
	}

	Date = TimeShift.Date;
	TimeShift.setTimezoneOffset(5 * 60);

	var morning    = new Date('2010-09-03T12:05:08.001Z'); //7am
	var noon       = new Date('2010-09-03T17:05:08.012Z'); //12pm
	var midnight   = new Date('2010-09-03T05:05:08.123Z'); //12am
	var earlyDate  = new Date('1885-12-14T05:05:08.000Z');
	var year0Date  = new Date('1882-11-12T05:05:08.000Z');
	var secondWeek = new Date('2013-01-11T12:00:00.000Z'); //Friday Jan 11, 2013
	var date;

	morning = new HijrahDate(morning);
	noon = new HijrahDate(noon);
	midnight = new HijrahDate(midnight);
	earlyDate = new HijrahDate(earlyDate);
	year0Date = new HijrahDate(year0Date);
	secondWeek = new HijrahDate(secondWeek);

    it('should do basic filter', function() {
      expect(filter(noon)).toEqual(filter(noon, 'mediumDate'));
      expect(filter(noon, '')).toEqual(filter(noon, 'mediumDate'));
    });

    it('should format `yy` correctly', function() {
      expect(filter(morning, 'yy')).toEqual('31');
      expect(filter(year0Date, 'yy')).toEqual('00');
      expect(filter(earlyDate, 'yy')).toEqual('03');
	})

    it('should accept various format strings', function() {
      expect(filter(secondWeek, 'yyyy-Ww')).
                      toEqual('1434-W9');

      expect(filter(secondWeek, 'yyyy-Www')).
                      toEqual('1434-W09');

      expect(filter(morning, 'yy-MM-dd HH:mm:ss')).
                      toEqual('31-09-24 07:05:08');

      expect(filter(morning, 'yy-MM-dd HH:mm:ss.sss')).
                      toEqual('31-09-24 07:05:08.001');

      expect(filter(midnight, 'yyyy-M-d h=H:m:saZ')).
                      toEqual('1431-9-24 12=0:5:8AM-0500');

      expect(filter(midnight, 'yyyy-MM-dd hh=HH:mm:ssaZ')).
                      toEqual('1431-09-24 12=00:05:08AM-0500');

      expect(filter(midnight, 'yyyy-MM-dd hh=HH:mm:ss.sssaZ')).
                      toEqual('1431-09-24 12=00:05:08.123AM-0500');

      expect(filter(noon, 'yyyy-MM-dd hh=HH:mm:ssaZ')).
                      toEqual('1431-09-24 12=12:05:08PM-0500');

      expect(filter(noon, 'yyyy-MM-dd hh=HH:mm:ss.sssaZ')).
                      toEqual('1431-09-24 12=12:05:08.012PM-0500');

      expect(filter(noon, 'EEE, MMM d, yyyy')).
                      toEqual('Fri, Ram 24, 1431');

      expect(filter(noon, 'EEEE, MMMM dd, yyyy')).
                      toEqual('Friday, Ramadan 24, 1431');

      expect(filter(earlyDate, 'MMMM dd, y')).
                      toEqual('Rabiʻ I 07, 1303');

      expect(filter(earlyDate, 'MMMM dd, yyyy')).
                      toEqual('Rabiʻ I 07, 1303');

      expect(filter(year0Date, 'dd MMMM y G')).
                      toEqual('01 Muharram 1300 AH');

      expect(filter(noon, 'MMMM dd, y G')).
                      toEqual('Ramadan 24, 1431 AH');

      expect(filter(noon, 'MMMM dd, y GG')).
                      toEqual('Ramadan 24, 1431 AH');

      expect(filter(noon, 'MMMM dd, y GGG')).
                      toEqual('Ramadan 24, 1431 AH');

      expect(filter(noon, 'MMMM dd, y GGGG')).
                      toEqual('Ramadan 24, 1431 Anno Hegirae');
    });

    it('should format timezones correctly (as per ISO_8601)', function() {
      //Note: TzDate's first argument is offset, _not_ timezone.
      var utc       = new HijrahDate(new Date('2010-09-03T12:05:08.000Z'));
      var eastOfUTC = new HijrahDate(new Date('2010-09-03T12:05:08.000Z'));
      var westOfUTC = new HijrahDate(new Date('2010-09-03T12:05:08.000Z'));
      var eastOfUTCPartial = new HijrahDate(new Date('2010-09-03T12:05:08.000Z'));
      var westOfUTCPartial = new HijrahDate(new Date('2010-09-03T12:05:08.000Z'));

	  TimeShift.setTimezoneOffset(0);
      expect(filter(utc, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('1431-09-24T12:05:08+0000');

	  TimeShift.setTimezoneOffset(-5 * 60);
      expect(filter(eastOfUTC, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('1431-09-24T17:05:08+0500');

	  TimeShift.setTimezoneOffset(5 * 60);
      expect(filter(westOfUTC, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('1431-09-24T07:05:08-0500');

	  TimeShift.setTimezoneOffset(-5.5 * 60);
      expect(filter(eastOfUTCPartial, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('1431-09-24T17:35:08+0530');

	  TimeShift.setTimezoneOffset(5.5 * 60);
      expect(filter(westOfUTCPartial, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('1431-09-24T06:35:08-0530');

		TimeShift.setTime(undefined);
    });

    it('should correctly calculate week number', function() {
      expect(filter(new HijrahDate(1417, 0, 1), 'ww (EEE)')).toEqual('01 (Sun)');
      expect(filter(new HijrahDate(1417, 11, 25), 'ww (EEE)')).toEqual('50 (Sat)');
      expect(filter(new HijrahDate(1428, 0, 1), 'ww (EEE)')).toEqual('01 (Sat)');
      expect(filter(new HijrahDate(1428, 11, 26), 'ww (EEE)')).toEqual('51 (Sat)');
      expect(filter(new HijrahDate(1430, 0, 1), 'ww (EEE)')).toEqual('01 (Mon)');
      expect(filter(new HijrahDate(1430, 11, 25), 'ww (EEE)')).toEqual('50 (Sat)');
      expect(filter(new HijrahDate(1435, 0, 1), 'ww (EEE)')).toEqual('01 (Mon)');
      expect(filter(new HijrahDate(1435, 11, 24), 'ww (EEE)')).toEqual('50 (Sat)');
    });

	/*
	TODO: complete tests from AngularJS filters spec
	*/

});
