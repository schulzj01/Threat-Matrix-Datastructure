/**
 * Parse out a ISO8601 date object with a duration like the NWS API uses. 
 * @constructor
 * @param {String} - An iso8601Date with a duration ("2021-05-27T19:00:00+00:00/PT1H")
 */
class ISO8601DurationParser {
	constructor(iso8601Date){
		this._iso8601Date = iso8601Date;
	}
	get startDate () {
		let startDate = Date.parse(this._iso8601Date.split('/')[0]);
		return new Date(startDate);
	}
	get endDate() {
		let durationStr = this._iso8601Date.split('/')[1]
		let myRegex = new RegExp(/P((?<year>\d+)Y)?((?<mon>\d+)M)?((?<day>\d+)D)?T?((?<hour>\d*)H)?((?<min>\d+)M)?((?<sec>\d+)S)?/);
		let durationParts = durationStr.match(myRegex).groups;

		let endDate = new Date(this.startDate.getTime());
		if (durationParts.year) { endDate.setYear(endDate.getYear() + parseInt(durationParts.year)); }
		if (durationParts.mon) { endDate.setMonth(endDate.getMonth() + parseInt(durationParts.mon)); }
		if (durationParts.day) { endDate.setDate(endDate.getDate() + parseInt(durationParts.day)); }
		if (durationParts.hour) { endDate.setHours(endDate.getHours() + parseInt(durationParts.hour));}
		if (durationParts.min) { endDate.setMinutes(endDate.getMinutes() + parseInt(durationParts.min)); }
		if (durationParts.sec) { endDate.setSeconds(endDate.getSeconds() + parseInt(durationParts.sec)); }
		return new Date(endDate);
	}
	get duration() {
		return this.endDate - this.startDate;
	}
}

/**
 * Will convert a normal date object to an 8601 date with an added duration to match the NWS API format
 * 
 * The isoToString method returns an ISO8601 date in this format: 2021-07-08T01:00:00.000Z/PT24H
 * The NWS API will give ISO8601 dates in this format:            2021-07-08T01:00:00+00:00/PT24H
 * 
 * @constructor
 * @param {Date} - A javascript date object
 * @param {Object} - An object that specifys duration parts to add to the end of the returned iso8601 date string
 *  @param {Boolean} - Whether or not to get the returned date string in the NWS API format or in the toISOString format that JS natually produces* 
 */

class ISO8601DurationCreator {
	constructor(date,durationParts,nwsApiFormat = true){
		this._date = date;
		this._durationParts = Object.assign({
			year: null,
			mon: null,
			day: null,
			hour: null,
			min: null,
			sec: null,
		},durationParts);
		this._nwsApiFormat = nwsApiFormat;
	}
	/**
	 *  Return the duration as an ISO string
	 * @return {String} - An ISO formatted string with a duration
	 */

	get iso8601DateString() {
		let isoDateStr = this._date.toISOString(); ;
		let durationStr = '';
		if (this._nwsApiFormat) { 
			let regex = new RegExp(/\.\d*Z/)
			isoDateStr = isoDateStr.split(regex)[0] + '+00:00'; 
		}
		if (this._durationParts.year) { durationStr += `${this._durationParts.year}Y` } 
		if (this._durationParts.mon)  { durationStr += `${this._durationParts.mon}M` } 
		if (this._durationParts.day)  { durationStr += `${this._durationParts.day}D` } 
		if (this._durationParts.hour || this._durationParts.min || this._durationParts.sec) { durationStr += 'T'}
		if (this._durationParts.hour) { durationStr += `${this._durationParts.hour}H` } 
		if (this._durationParts.min)  { durationStr += `${this._durationParts.min}M` } 
		if (this._durationParts.sec)  { durationStr += `${this._durationParts.sec}S` } 
		if (durationStr.length > 0) { return `${isoDateStr}/P${durationStr};` }
		else { return isoDateStr; }
	}
}