
/**
 * Abstract class to allow combination of both API and AWIPS endpoints and manage the threat matrix data structure
 * This class shouldn't be instantiated directly.
 * @abstract
 * @property {Object} this._threatMatrixDataset - The threat matrix dataset.  Other datsets can be populated by extending this class to fit into this format
 * @property {Object} this._weatherElementConfig - The config file that controls weather elements. Currently hosted in wxElementConfig.js. This file needs to be included in the html before this one.
 * @property {Object} this._unitConversions - Default unit conversions that should be used when loading a threat matrix
 * @property {String[]} this._validCombinationTypes - An array of different possible weather element data combination types available. ['min','max','range','concat','add']
 *
 */
class ThreatMatrixForecast {
	constructor() {

		this._threatMatrixDataset = {
			updateTime: null,
			validTimes: null,
			location: {
				geometry: null,
				name: null,
				timeZone: null,
				cwa: null,
				elevation: {
					unitCode: null,
					low: null,
					high: null,
					average: null
				}
			},
			weatherElements : null,
		}
		this._weatherElementConfig = wxElementConfig

		//Set the default conversion types if desired
		this._unitConversions = {
			//degC : 'degF',
			//ms : 'mph',9o
			//m : 'mi',
		}
		this._validCombinationTypes = ['min','max','range','concat','add']

	}
	/**
	 * Shortcut to get our weather elements easier.
	 * @returns {Array} - An array of weather element keys.  Keys can be used as a wxelements filter in getForecastData()
	 */
	get weatherElements(){
		return this._threatMatrixDataset.weatherElements;
	}
	/**
	 * Shortcut to get the earliest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.
	 * @returns {String} - ISO String of the starting time of the dataset.
	 */
	getValidStartTimeISOString(){
		return new ISO8601DurationParser(this._threatMatrixDataset.validTimes).startDate.toISOString();
	}
	/**
	 * Shortcut to get the latest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.
	 * @returns {String} - ISO String of the starting time of the dataset.
	 */
	getValidEndTimeISOString(){
		return new ISO8601DurationParser(this._threatMatrixDataset.validTimes).endDate.toISOString();
	}
	/**
	 * Generates the weather element forecast data based on a set of filters.
	 * @method
	 * @param {Date} filters.start - The time to begin the forecast data.  Defaults to current time if not set
	 * @param {Date} filters.end - Time to end the forecast data.   Defaults to 8 days in the future if not set
	 * @param {Integer} filters.periodicity - Number of hours between each valid time returned.  Defaults to 24 hours if not set
	 * @param {Array} filters.wxelements - Weather element keys to include in the filtered list.   Defaults to all weather elements if not set
	 * @returns {Object} - Threat matrix data structure formatted weather
	 */
	getForecastData(filters){
		console.log("Filtering Threat Matrix Data with the following filters: ")
		console.log(filters)
		let fcstStartDate = (filters.start) ? filters.start : this.getValidStartTime();
		let fcstEndDate = (filters.end) ? filters.end : this.getValidEndTime();
		let fcstPeriodicity = (filters.periodicity) ? parseInt(filters.periodicity) : 24;
		let fcstWeatherElements = (filters.wxelements) ? filters.wxelements : this.getValidWeatherElements();

		//Create an array of valid time periods using the periodicity and start/end dates.
		let validTimePeriods = [];
		let validTimeStartDate = new Date(+fcstStartDate);
		while (validTimeStartDate < fcstEndDate) {
			//Create our end date by adding the period length onto the start date
			let validTimeEndDate = new Date(+validTimeStartDate);
			validTimeEndDate.setHours(validTimeEndDate.getHours() + fcstPeriodicity);
			validTimePeriods.push({
				startDate : validTimeStartDate,
				endDate : validTimeEndDate
			});
			//Set our start time to the end date so we can start the next period;
			validTimeStartDate = new Date(+validTimeEndDate);
		}
		console.log(`${validTimePeriods.length} valid time periods found`);


		//Initialize our final return value.
		const filteredForecastData = {}

		//Loop through each one of our requested weather elements.
		fcstWeatherElements.forEach( weatherElementKey => {
			//Initialize final return value keys with the same properties our data structure has, but empty out the values so we can populate them below.
			filteredForecastData[weatherElementKey] = Object.assign({},this.weatherElements[weatherElementKey])
			filteredForecastData[weatherElementKey].values = [];

			let weatherElementData = this.weatherElements[weatherElementKey];

			let validTimePeriodWeatherElementData = {}

			//Now loop through each one of our known valid time periods between our requested start and end dates
			//and associate and combine the data.
			validTimePeriods.forEach( timePeriod => {
				//Look at each timestamp of a weather element value, and see if at any time it falls inside a valid time.
				let validTimeFilteredWeatherElementData = weatherElementData.values.filter( weatherElementTimeStep => {
					let parsedWeatherElementDates = new ISO8601DurationParser(weatherElementTimeStep.validTime);
					if (
						(parsedWeatherElementDates.startDate >= timePeriod.startDate && parsedWeatherElementDates.startDate < timePeriod.endDate) //If the data starts beteween our time period start and end
						|| (parsedWeatherElementDates.endDate > timePeriod.startDate && parsedWeatherElementDates.endDate <= timePeriod.endDate ) //If the data ends between our time period start and end
						|| (parsedWeatherElementDates.startDate >= timePeriod.startDate && parsedWeatherElementDates.endDate <= timePeriod.endDate ) //If the data starts and ends between our time period start and end
						|| (parsedWeatherElementDates.startDate <= timePeriod.startDate && parsedWeatherElementDates.endDate >= timePeriod.endDate ) //If the time period starts and ends between our data start and end
					){ return true; }
				});
				let validTimeISO8601Duration = new ISO8601DurationCreator(timePeriod.startDate,{ hour:fcstPeriodicity }).iso8601DateString;

				//Go through our data that was filtered according to valid time period.  If we don't have any make our final value null
				//Otherwise combine data together using the appropriate combination step.
				let combinedWeatherElementDataValue = null
				if (validTimeFilteredWeatherElementData.length > 0) {
					switch (weatherElementData.combination) {
						case 'min':
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getMinValue);
							break;
						case 'max':
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getMaxValue);
							break;
						case 'range':
							let rangeEmptyValue = {
								max: null, min: null, average: null, count: null, total: null
							}
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getRangeValue,rangeEmptyValue);
							break;
						case 'add':
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getAccumValue);
							break;
						case 'hazardconcat':
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getHazardValue,'');
							break;
						case 'weatherconcat':
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getWeatherValue,[]);
							break;
						case 'concat':
							combinedWeatherElementDataValue = validTimeFilteredWeatherElementData.map(v => {return v.value}).flat().reduce(this.getConcatValue,{});
							break;
					}
				}
				//console.log(combinedWeatherElementDataValue)
				if (combinedWeatherElementDataValue !== null) {
					//If we have weather or hazard data, we need to parse this as well.

					//Look at the units of this weather element and determine whether it needs to be converted.  If so, run the appropriate conversion
					//routine set in the _unitConversions property of this class
					let uom = weatherElementData.uom;
					if (this._unitConversions.hasOwnProperty(uom)) {
						let fromUnit = uom;
						let toUnit = this._unitConversions[uom];
						//If data is an array, map the entire dataset and convert units on each value.
						if (Array.isArray(combinedWeatherElementDataValue)) {
							combinedWeatherElementDataValue = combinedWeatherElementDataValue.map(v => {
								if (v == null) { return v; }
								else { return UnitConversions[fromUnit][toUnit](v); }
							});
						}
						//If our data is an object like, range, convert units on each value.
						else if (combinedWeatherElementDataValue.constructor == Object) {
							for (const prop in combinedWeatherElementDataValue){
								combinedWeatherElementDataValue[prop] = UnitConversions[fromUnit][toUnit](combinedWeatherElementDataValue[prop])
							};
						}
						//If it's a single value and not null, just convert the single value.
						else { combinedWeatherElementDataValue = UnitConversions[fromUnit][toUnit](combinedWeatherElementDataValue); }
						filteredForecastData[weatherElementKey]['uom'] = toUnit;
					}

					//If our data has a precision value, round the data so that it matches that precision
					let precision = weatherElementData.precision;
					if (Number.isInteger(precision)){
						//If data is an array, map the entire dataset.
						if (Array.isArray(combinedWeatherElementDataValue)) {
							combinedWeatherElementDataValue = combinedWeatherElementDataValue.map(v => {
								if (isNaN(v)) { return v; }
								else { return Number(v.toFixed(precision)) }
							});
						}
						//If our data is an object like, range, precision each value.
						else if (combinedWeatherElementDataValue.constructor == Object) {
							for (const prop in combinedWeatherElementDataValue){
								if (!isNaN(combinedWeatherElementDataValue[prop])) {
									combinedWeatherElementDataValue[prop] = Number(combinedWeatherElementDataValue[prop].toFixed(precision));
								}
							}
						}
						//If it's a single value and not null, just precision the single value.
						else if (!isNaN(combinedWeatherElementDataValue)) { combinedWeatherElementDataValue = Number(combinedWeatherElementDataValue.toFixed(precision)) }
					}
				}
				filteredForecastData[weatherElementKey].values.push({
					//startDate : timePeriod.startDate,
					//endDate : timePeriod.endDate,
					validTime : validTimeISO8601Duration,
					value : combinedWeatherElementDataValue
				});
			});
			//throw Error();
		});
		return filteredForecastData;
	}


	/**
	 * Shortcut to quickly query the entire data structure.  Mainly used for debugging purposes.
	 * @returns {Object} - Entire threat matrix data structure
	 */
	getFullDataset(){ return this._threatMatrixDataset;	}

	/**
	 * A list of all valid weather element keys The key is deemed "valid" if data values are available in the data structure)
	 * @returns {Array} - Valid weather element data keys
	 */
	getValidWeatherElements(){
		let availableWeatherElements = Object.keys(this.weatherElements).filter(key => {
			if (this.weatherElements[key].hasOwnProperty('values')) { return true; }
		});
		return availableWeatherElements;
	}

	/**
	 * Changes the combination property for a weather element.  This will allow the data structure output to customize how to combine values over long time periods
	 * For example, in the winter, combining temperature by using a minimum would be more preferable than in the summer when you would combine it by maximum.
	 * @todo - Add this to demo
	 * @param {*} wxElement - Weather element type to change. Possible values can be found via getValidWeatherElements()
	 * @param {*} combinationType - Type of combination to set.  Possible values are in _validCombinationTypes
	 */
	changeCombination(wxElement, combinationType) {
		if (this.getValidWeatherElements().includes(wxElement) && this._validCombinationTypes.includes(combinationType)) {
			this._threatMatrixDataset[wxElement].combination = combinationType;
		}
	}

	/**
	 * This is a list of shortcut functions to quickly change a threat matrix data to different units.
	 * wmoUnits can be found here: https://codes.wmo.int/common/unit However, available imperial units can be used if they follow the same style.
	 * @private
	 * @param {String[]} - all possible wmo unit types available to convert to
	 * @param {String} - wmo unit type to convert to
	 */
	_changeUnitConversion(allowableUnits,toUnit){
		if (allowableUnits.includes(toUnit)) {
			allowableUnits.forEach(allowableUnit => this._unitConversions[allowableUnit] = toUnit );
		}
		else { console.error(`Unit of measure: "${toUnit}" not available.  Possible values are ${allowableUnits}`); 	}
	}
	/**
	 * Convert temperature values in data to the specified wmo unit.
	 * @param {String} toUnit - wmo unit type to convert to. Possible values : 'degF','degC','K'
	 */
	convertTemp(toUnit = 'degF') {
		let allowableUnits = ['degF','degC','K'];
		this._changeUnitConversion(allowableUnits,toUnit);
	}
	/**
	 * Convert wind values in data to the specified wmo unit.
	 * @param {String} toUnit - wmo unit type to convert to. Possible values : 'km_h-1','kt','mi_h-1','m_s-1'
	 */
	convertWind(toUnit = 'mi_h-1') {
		let allowableUnits = ['km_h-1','kt','mi_h-1','m_s-1'];
		this._changeUnitConversion(allowableUnits,toUnit);
	}
	/**
	 * Convert precipitation values in data to the specified wmo unit.
	 * @method
	 * @param {String} toUnit - wmo unit type to convert to. Possible values : 'mm','in']
	 */
	convertPrecip(toUnit = 'in') {
		let allowableUnits = ['mm','in'];
		this._changeUnitConversion(allowableUnits,toUnit);
	}
	/**
	 * Convert distance values in data to the specified wmo unit.
	 * @method
	 * @param {String} toUnit - wmo unit type to convert to. Possible values : 'm','mi','km','ft'
	 */
	convertDistance(toUnit = 'ft') {
		let allowableUnits = ['m','mi','km','ft'];
		this._changeUnitConversion(allowableUnits,toUnit);
	}
	/**
	 * Convert direction values in data to the specified wmo unit.
	 * @method
	 * @param {String} toUnit - wmo unit type to convert to. Possible values : 'degree_(angle)','cardinal'
	 */
	convertDirection(toUnit = 'cardinal') {
		let allowableUnits = ['degree_(angle)','cardinal'];
		this._changeUnitConversion(allowableUnits,toUnit);
	}
	/**
	 * A shortcut to get the threat matrix data structure location information direction.
	 * @method
	 * @returns {Object} - Location portion of threat matrix data strucutre
	 */
	getLocation(){ return this._threatMatrixDataset.location; }

	//Reduction function to get a max value
	getMaxValue(a,b){ return Math.max(Number(a), Number(b)); }

	//Reduction function to get min value
	getMinValue(a,b){ return Math.min(Number(a), Number(b)); }

	//Reduction function to concatenate values into an array.  This has a custom implementation for both the API and AWIPS threat matrices, so these
	//method needs to be overwritten;  This is just here as a stub.
	getHazardValue(a,b){};
	getWeatherValue(a,b){};

	//Reduction function to concatenate values into an array
	getConcatValue(a,b){
		if (Array.isArray(a)) {
			return Array.from(new Set([...a,{...b}]));
		}
		else {
			return Array.from(new Set([{...a},{...b}]));

		}
	}

	//Reduction function to accumulate values
	getAccumValue(a,b){ return Number(a) + Number(b); }

	//Reduction function to handle a range of values
	getRangeValue(a,b,i,arr){
		let v = {}
		v['total'] = Number(a.total) + Number(b);
		v['count'] = Number(a.count) + 1;
		if (i == 0) {
			v['min'] = b;
			v['max'] = b;
		}
		else {
			v['min'] = Math.min(Number(a.min), Number(b));
			v['max'] = Math.max(Number(a.max), Number(b));
		}
		v['average'] = v.total / v.count;
		//We don't need properties total and count in our final object, so just delete them if this is our last iteration through the array.
		if (arr.length-1 == i) {
			delete v.total;
			delete v.count;
		}
		return  v
	}


	/**
	 * Utility function for deep extending objects in javascript. https://github.com/angus-c/just#just-extend
	 * @private
	 * @param {Boolean} deep - Whether or not to deep merge objects
	 * @param {Object} - Objects to merge
	 * @returns {Object} - Object combined of
	 *
	*/
	_extend = function(/* [deep], obj1, obj2, [objn] */) {
		function isCloneable(obj) {
			return Array.isArray(obj) || {}.toString.call(obj) == '[object Object]';
		}

		function isUnextendable(val) {
			return !val || (typeof val != 'object' && typeof val != 'function');
		}
		var args = [].slice.call(arguments);
		var deep = false;
		if (typeof args[0] == 'boolean') {
			deep = args.shift();
		}
		var result = args[0];
		if (isUnextendable(result)) {
			throw new Error('extendee must be an object');
		}
		var extenders = args.slice(1);
		var len = extenders.length;
		for (var i = 0; i < len; i++) {
			var extender = extenders[i];
			for (var key in extender) {
				if (Object.prototype.hasOwnProperty.call(extender, key)) {
					var value = extender[key];
					if (deep && isCloneable(value)) {
						var base = Array.isArray(value) ? [] : {};
						result[key] = this._extend(
							true,
							Object.prototype.hasOwnProperty.call(result, key) && !isUnextendable(result[key])
								? result[key]
								: base,
							value
						);
					} else {
						result[key] = value;
					}
				}
			}
		}
		return result;
	}
}

/**
 * API version of a ThreatMatrixForecast.  Give it a lat/lon via the constructor, and call the init method to instantiate.
 * @extends ThreatMatrixForecast
 * @param {Float} lat - Latitude to query from API
 * @param {Float} lon - Longitude to query from API
 * @property {String} this._baseUrl - Base URL of the weather.gov API
 * @property {String} this._pointMetadataUrl - Metadata URL endpoint for the weather.gov API
 * @property {String} this._rawForecastUrl - Raw forecast URL endpoint for the weather.gov API
 * @property {Integer} this._requestRetryLimit - Number of times to retry a query to the API before failing.  This helps us overcome the known issues with the API's 500 errors.
 * @property {Integer} this._requestRetryTimeout - The delay between retry queries to the API in ms.
 * @property {Object} this._pointMetadata - The results from the metadata query
 * @property {Object} this._rawForecast - The results from the raw forecast query
 */
class APIForecast extends ThreatMatrixForecast {

	constructor(lat,lon) {
		super();
		this._lat = lat;
		this._lon = lon;

		//Config options
		this._baseUrl = 'https://api.weather.gov/';
		this._pointMetadataUrl = 'points/';
		this._rawForecastUrl = 'gridpoints/';
		this._requestRetryLimit = 4;
		this._requestRetryTimeout = 3000;

		//Data
		this._pointMetadata = null;
		this._rawForecast = null;

	}

	/**
	 * Populate data structure by combining data from both API endpoints into the threat matrix data structure.
	 * This function must be called after instantiating the object.
	 * @async
	 * @param {function} callback - function to call after query has completed and initialization completed
	 * @param  {...any} args - arguments to pass to the callback function.
	 */
	async init(callback,...args) {
		if (!this._pointMetadata){ await this.queryPointMetadata(); }
		if (!this._rawForecast){ await this.queryRawForecast();	}

		//Create some shortcuts to clean up the assignments below
		let geomRF = this._rawForecast.geometry;
		let propsRF = this._rawForecast.properties;
		let propsPM = this._pointMetadata.properties;
		let propsPMLoc = propsPM.relativeLocation.properties;

		//Initialize our empty threat matrix dataset with merged properties from both APIs
		this._threatMatrixDataset = this._extend(true,this._threatMatrixDataset,{
			updateTime: propsRF.updateTime,
			validTimes: propsRF.validTimes,
			location: {
				geometry: geomRF,
				name: this.buildLocationNameFromPointMetadata(propsPMLoc.distance.value,propsPMLoc.bearing.value,propsPMLoc.city,propsPMLoc.state),
				timeZone: propsPM.timeZone,
				cwa: propsPM.cwa,
				elevation: {
					unitCode : propsRF.elevation.unitCode,
					average: propsRF.elevation.value
				}
			},
		});
		//Loop through our weather element configuration and see if there's associated data in the rawForecast API
		//If so, populate the weatherElements property in our dataset.
		let combinedWxElementProps = {};
		for (const wxElementKey in this._weatherElementConfig) {
			if (propsRF.hasOwnProperty(wxElementKey)) {
				combinedWxElementProps[wxElementKey] = {
					...this._weatherElementConfig[wxElementKey],
					...propsRF[wxElementKey]
				}
				//The API returns the units in the format wmoUnit:XXX where XXX is the unit.  Since GFE doesn't use this standard, it makes it easier to strip out the wmoUnit: text here.
				if (combinedWxElementProps[wxElementKey].hasOwnProperty('uom')) { combinedWxElementProps[wxElementKey].uom = combinedWxElementProps[wxElementKey].uom.split(':')[1]; }
				else { combinedWxElementProps[wxElementKey]['uom'] = null; }
			}
		}
		this._threatMatrixDataset.weatherElements = combinedWxElementProps;
		callback(this);
	}

	get gridX() { return this._pointMetadata.properties.gridX; }
	get gridY() { return this._pointMetadata.properties.gridY; }
	get cwa() { return this._pointMetadata.properties.cwa; }
	get forecastGridDataUrl() { return this._pointMetadata.properties.forecastGridData; }

	/**
	 * Queries the point metadata url from the API and assigns it to the private _pointMetadata property.
	 * @async
	 */
	async queryPointMetadata() {
		var url = this._baseUrl+this._pointMetadataUrl+this._lat+','+this._lon;
		try {
			const response = await this.retryFetch(url, null, this._requestRetryTimeout, this._requestRetryLimit);
			this._pointMetadata = await response.json();
		}
		catch { throw new Error(`Unable to load API Metadata from ${url}`); }
	};
	/**
	 * Queries the raw forecast url from the API and assigns it to the private _rawForecast property.
	 * @async
	 */
	async queryRawForecast() {
		var url = this.forecastGridDataUrl;
		try {
			const response = await this.retryFetch(url, null, this._requestRetryTimeout, this._requestRetryLimit)
			this._rawForecast = await response.json();
		}
		catch { throw new Error(`Unable to load Raw Forecast from ${url}`); }
	}

	/**
	 * The API doesn't really return a useful location, this will build one based on a few properties.
	 * @param {Integer} meters - Distance in meters from nearest city
	 * @param {Integer} degrees - Direction in degrees from nearest city
	 * @param {String} city - Nearest city
	 * @param {String} state - Nearest city's state
	 * @param {Integer} threshold - Distance threshold in meters which when exceeeded will include the "5 miles ESE of" text in the result
	 * @returns {String} - Human readable location represntation of the given properties.
	 */
	buildLocationNameFromPointMetadata(meters,degrees,city,state,threshold = 5000){
		//Only display distance and direction if > than the threshold from city.
		let locationName = ''
		if (meters > threshold) {
			let direction = (degrees) ? UnitConversions['degree_(angle)'].cardinal(degrees) : null;
			//convert our meters to miles, cause 'merica
			let distance = (meters) ? parseInt(UnitConversions.m.mi(meters)) : null;
			locationName+= `${distance}mi ${direction} of `;
		}
		locationName+= `${city}, ${state}`;
		return locationName;
	}

	/**
	 * Utility function to retry fetches multiple times if the query fails the first time.
	 * @async
	 * @param {String} url - Url to fetch
	 * @param {Object} options - Fetch options
	 * @param {Integer} wait - Number of seconds before retrying query
	 * @param {Integer} numTries - Number of tries before ultimately failing query and throwing an error
	 * @returns {Object} - Results of promise if it returns a successful query
	 */
	async retryFetch(url, options, wait, numTries) {
    try {
			let response = await fetch(url, options);
			if (!response.ok) { throw new Error(`Request to ${url} failed with status: ${response.statusText}`); }
      else { return response; }
    } catch(err) {
			if (numTries === 1) { throw err; }
			else {
				await this._sleep(wait);
				return await this.retryFetch(url, options, wait, numTries - 1);
			}
    }
	};
	/**
	 * Utility function to asynchronously sleep with a little promise trickery.
	 * @async
	 * @private
	 * @param {Integer} ms - Milliseconds to sleep
	 */
	async _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
	};

	//Reduction function to concatenate hazard codes into strings.
	getHazardValue(a,b){
		let bParsed = HazardParser.parseAPIHazard(b)
		return Array.from(new Set([...a,bParsed]));
	}

	//Reduction function to concatenate weather objects into single outputs
	getWeatherValue(a,b){
		let combinedWx = a;
		let bParsed = WeatherParser.parseAPIWeather(b)
		//See if there's a higher priority weather that matches the same type.  If there is, replace it.
		if (bParsed){
			let toReplaceIndex = combinedWx.findIndex(current => current.type == bParsed.type)
			if (toReplaceIndex !== -1) {
				if (combinedWx[toReplaceIndex].priority <= bParsed.priority) { combinedWx[toReplaceIndex] = bParsed; }
			}
			else { combinedWx.push(bParsed); }
		}
		return combinedWx;
	}
}






/**
 * AWIPS version of a ThreatMatrixForecast. This class converts a gfe forecast built via the Create_Threat_Matrix smart tool into the common threat matrix forecast data structure
 * @extends ThreatMatrixForecast
 * @param {Object} gfeForecast - A formatted GFE built forecast created by Create_Threat_Matrix.py
 * @property {Object} _gfeForecast - Storage of the gfeForecast given in the constructor
 */
class AWIPSForecast extends ThreatMatrixForecast {
	constructor(gfeForecast) {
		super();

		//Data
		this._gfeForecast = gfeForecast;

	}

	/**
	 * Populate data structure by converting a gfe forecast .json file  to
	 * For constistency with the API forecast which is async, this function must be called after instantiating the object.
	 * @param {function} callback - function to call after query has completed and initialization completed
	 * @param  {...any} args - arguments to pass to the callback function.
	 */
	init(callback,...args) {

		//Initialize our threat matrix data with an empty data set and then merge properties from the gfe dataset.
		this._threatMatrixDataset = this._extend(true,this._threatMatrixDataset,{
			updateTime: this._gfeForecast.updateTime,
			location: {
				geometry: this._gfeForecast?.location?.geometry,
				name: this._gfeForecast?.location?.name,
				timeZone: this._gfeForecast?.location?.timeZone,
				cwa: this._gfeForecast?.location?.cwa,
				elevation: {
					unitCode : this._gfeForecast?.location?.elevation?.unitCode,
					low: this._gfeForecast?.location?.elevation?.low,
					high: this._gfeForecast?.location?.elevation?.high,
					average: this._gfeForecast?.location?.elevation?.average,
				}
			},
		});


		//Loop through our weather element GFE data, and if there's an associated config, attach it.
	 	//If there's not an associated config, the config should be in the GFE object itself.
		//If there's not the correct associated config, don't process the grid
		let combinedWxElementProps = {};
		for (const gfeGridKey in this._gfeForecast.weatherElements) {
			let foundConfigKey = null;
			for(const wxElementKey in this._weatherElementConfig){
				let gfeGrid = this._weatherElementConfig[wxElementKey].gfeGrid;
				if (gfeGrid === gfeGridKey) {
					foundConfigKey = wxElementKey;
					break;
				}
			}
			if (foundConfigKey) { //If we have a matching gfe grid to our wxElementConfig
				combinedWxElementProps[foundConfigKey] = {
					...this._weatherElementConfig[foundConfigKey],
					...this._gfeForecast.weatherElements[gfeGridKey]
				}
				//Make sure the units of measure match the WMO standard. GFE doesn't do this, so we convert.
				combinedWxElementProps[foundConfigKey].uom = this._gfeToWmoUnitMap(combinedWxElementProps[foundConfigKey].uom.toLowerCase());
			}
			else if ( //If we don't have a match in our config, but the weather data is properly configured to add in
				this._gfeForecast.weatherElements[gfeGridKey].hasOwnProperty('uom')
				&& this._gfeForecast.weatherElements[gfeGridKey].hasOwnProperty('combination')
				&& this._gfeForecast.weatherElements[gfeGridKey].hasOwnProperty('name')
				&& this._gfeForecast.weatherElements[gfeGridKey].hasOwnProperty('precision')
			){
				combinedWxElementProps[gfeGridKey] = this._gfeForecast.weatherElements[gfeGridKey];
				//Make sure the units of measure match the WMO standard. GFE doesn't do this, so we convert.
				combinedWxElementProps[gfeGridKey].uom = this._gfeToWmoUnitMap(combinedWxElementProps[gfeGridKey].uom.toLowerCase());
			}
			 //If we don't have a match in our config, and we don't have a proper configuration options in the data either.
			else { console.warn(`Weather Grid ${gfeGridKey} not processed.  Improper or incomplete configuration options are set for it.`)}
		};


		//Add our weather element forecast data to our datastructure.
		this._threatMatrixDataset.weatherElements = combinedWxElementProps;


		//The gfe forecast doesn't have a start/end date for the forecast.  So we calculate our validTimes available in the dataset by looping through all weather elements
		//and parsing out the earliest start and latest end for all grids.
		let datasetLastValidTime = "";
		let datasetFirstValidTime = "A";
		for (const wxElementKey in combinedWxElementProps) {
			//Get the last array date and compare it against all of the others.  Save the one furthest in the future.
			let elementFirstValidTime = combinedWxElementProps[wxElementKey].values[0].validTime;
			if (datasetFirstValidTime > elementFirstValidTime) { datasetFirstValidTime = elementFirstValidTime; }

			//Get the last array date and compare it against all of the others.  Save the one furthest in the future.
			let elementLastValidTime = combinedWxElementProps[wxElementKey].values.slice(-1)[0].validTime;
			if (datasetLastValidTime < elementLastValidTime) { datasetLastValidTime = elementLastValidTime; }
		}
		let datasetStartTime = new ISO8601DurationParser(datasetFirstValidTime).startDate.getTime();
		let datasetFinalTime = new ISO8601DurationParser(datasetLastValidTime).endDate.getTime();

		let datasetHourDuration = (datasetFinalTime - datasetStartTime) / 36e5 ;

		this._threatMatrixDataset.validTimes = new ISO8601DurationCreator(new Date(datasetStartTime),{hour: datasetHourDuration}).iso8601DateString


		callback(this);


	// 	//Initialize our threat matrix data with the merged properties from both APIs
	// 	this._threatMatrixDataset = {
	// 		updateTime: propsRF.updateTime,
	// 		validTimes: propsRF.validTimes,
	// 		location: {
	// 			coordinates: propsPM.relativeLocation.geometry.coordinates,
	// 			name: this.buildLocationNameFromPointMetadata(propsPMLoc.distance.value,propsPMLoc.bearing.value,propsPMLoc.city,propsPMLoc.state),
	// 			timeZone: propsPM.timeZone,
	// 			cwa: propsPM.cwa,
	// 			elevation: propsRF.elevation
	// 		},
	// 		weatherElements : null, //This is just to initialize this property.  Values are set below.
	// 	}
	// 	//Loop through our weather element configuration and see if there's associated data in the rawForecast API
	// 	//If so, populate the weatherElements property in our dataset.
	// 	let combinedWxElementProps = {};
	// 	for (const wxElement in this._weatherElementConfig) {
	// 		if (propsRF.hasOwnProperty(wxElement)) {
	// 			combinedWxElementProps[wxElement] = {
	// 				...this._weatherElementConfig[wxElement],
	// 				...propsRF[wxElement]
	// 			}
	// 		}
	// 	}
	// 	this._threatMatrixDataset.weatherElements = combinedWxElementProps;
	// 	callback(this);
	// }
	}

	//Reduction function to concatenate hazard codes into strings.
	getHazardValue(a,b){
		let bParsed = HazardParser.parseAWIPSHazard(b)
		return Array.from(new Set([...a,bParsed]));
	}

	//Reduction function to concatenate weather objects into single outputs
	getWeatherValue(a,b){
		let combinedWx = a;
		if (b){
			let bParts = b.split('^');
			bParts.forEach(bPart => {
				let bParsed = WeatherParser.parseAWIPSWeather(bPart)
				//See if there's a higher priority weather that matches the same type.  If there is, replace it.
				if (bParsed){
					let toReplaceIndex = combinedWx.findIndex(current => current.type == bParsed.type && current.priority <= bParsed.priority)
					if (toReplaceIndex !== -1) { combinedWx[toReplaceIndex] = bParsed; }
					else { combinedWx.push(bParsed); }
				}
			})
		}
		return combinedWx;
	}

	/**
	 * GFE's data does not conform to the wmo unit spec.  This lookup table allows for consistency when loading GFE data.
	 * @param {String} gfeUnit a unit of measurement specified by gfe.
	 * @returns {String} a wmo-like standardized unit of measurement if available or the original value if not matched
	 */
	_gfeToWmoUnitMap(gfeUnit) {
		let unitMap = {
			'f' : 'degF',
			'ft' : 'ft',
			'count' : '',
			'in' : 'in',
			'%' : 'percent',
			'kts' : 'kt',
			'nmi*hrs^-1*ft' : 'ft_nmi_h-1', //Vent Rate ? What units is this?
			'sm' : 'mi',
			'degree' : 'degree_(angle)',
		}
		if (unitMap.hasOwnProperty(gfeUnit)) { return unitMap[gfeUnit]; }
		else { return gfeUnit; }
	}
}