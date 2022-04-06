/**
 *  A weather reference tool to allow both GFE and API based weather types to be referenced by the exact same text.  Note
 * that this currently does not manage the visisbility aspect of the weather types.
 *
 * @author Jeremy.Schulz@noaa.gov
 */

const WeatherParser = {}

/**
 *
 *  Metadata for both awips and awips weather codes.  The goal is to get these values to match up so that no matter what the output of the
 *  weather text will be the same.
 *
 */


WeatherParser.awipsMeta = {
	coverageTypes : {
		patchy : { priority: 0, text: 'Patchy' },
		areas :  { priority: 1, text: 'Areas of' },
		wide :   { priority: 2, text: 'Widespread' },
		iso :    { priority: 0, text: 'Isolated' },
		sct :    { priority: 1, text: 'Scattered'},
		num :    { priority: 2, text: 'Numerous'},
		wide :   { priority: 3, text: 'Widespread'},
		schc :   { priority: 0, text: 'Slight Chance of' },
		chc :    { priority: 1, text: 'Chance of' },
		lkly :   { priority: 2, text: 'Likely' },
		def :    { priority: 3, text: '' },
		ocnl :   { priority: 0, text: 'Occasional' },
		frq :    { priority: 1, text: 'Frequent' },
		brf :    { priority: 2, text: 'Brief' },
		pds :    { priority: 3, text: 'Periods of' },
		inter :  { priority: 4, text: 'Intermittent' },
	},
	intensityTypes : {
		'+' :  { text: 'Severe' },
		'--' : { text: 'Very Light' },
		'-' :  { text: 'Light' },
		'm' :  { text: 'Moderate' },
		'+' :  { text: 'Heavy', }
	},
	weatherTypes : {
		wp : { text : 'Waterspouts' },
		r  : { text : 'Rain' },
		rw : { text : 'Rain Showers' },
		l  : { text : 'Drizzle' },
		zr : { text : 'Freezing Rain' },
		zl : { text : 'Freezing Drizzle' },
		ip : { text : 'Ice Fog' },
		ic : { text : 'Ice Crystals' },
		h  : { text : 'Haze' },
		bs : { text : 'Blowing Snow' },
		bn : { text : 'Blowing Sand' },
		k  : { text : 'Smoke' },
		bd : { text : 'Blowing Dust' },
		fr : { text : 'Frost' },
		zy : { text : 'Freezing Spray' },
		va : { text : 'Volcanic Ash' },
		t  : {
			text : 'Thunderstorms',
			alt: { '+' : { text : 'Severe Thunderstorms'}}
		},
		s  : {
			text : 'Snow',
			alt : { '--' : {text : 'Snow Flurries'}}
		},
		sw : {
			text : 'Snow Showers',
			alt : { '--' : {text : 'Snow Flurries'}}
		},
	}
}

WeatherParser.apiMeta = {
	coverageTypes : {
		patchy :        { priority: 0, text: 'Patchy' },
		areas :         { priority: 1, text: 'Areas of' },
		wide :          { priority: 2, text: 'Widespread' },
		isolated :      { priority: 0, text: 'Isolated' },
		scattered :     { priority: 1, text: 'Scattered'},
		numerous :      { priority: 2, text: 'Numerous'},
		widespread :    { priority: 3, text: 'Widespread'},
		slight_chance : { priority: 0, text: 'Slight Chance of' },
		chance :        { priority: 1, text: 'Chance of' },
		likely :        { priority: 2, text: 'Likely' },
		definite :      { priority: 3, text: '' },
		occasional :    { priority: 0, text: 'Occasional' },
		frequent :      { priority: 1, text: 'Frequent' },
		brief :         { priority: 2, text: 'Brief' },
		periods :       { priority: 3, text: 'Periods of' },
		intermittent :  { priority: 4, text: 'Intermittent' },
	},
	intensityTypes : {
		very_light : { text: 'Very Light', },
		light :      { text: 'Light', },
		heavy :      { text: 'Heavy', },
	},
	weatherTypes : {
		thunderstorms  :   {
			                   text : 'Thunderstorms',
			                   alt : { 'heavy' : {text : 'Severe Thunderstorms'}}
											},
		waterspouts :      { text : 'Waterspouts' },
		rain  :            { text : 'Rain' },
		rain_showers :     { text : 'Rain Showers' },
		drizzle  :         { text : 'Drizzle' },
		freezing_rain :    { text : 'Freezing Rain' },
		freezing_drizzle : { text : 'Freezing Drizzle' },
		snow  :            {
			                    text : 'Snow',
			                    alt : { 'very_light' : {text : 'Snow Flurries'}}
			                 },
		snow_showers :     {
			                   text : 'Snow Showers',
		                     alt : { 'very_light' : {text : 'Snow Flurries'}}
  	                   },
		ice_fog :          { text : 'Ice Fog' },
		ice_crystals :     { text : 'Ice Crystals' },
		haze  :            { text : 'Haze' },
		blowing_snow :     { text : 'Blowing Snow' },
		blowing_sand :     { text : 'Blowing Sand' },
		smoke  :           { text : 'Smoke' },
		blowing_dust :     { text : 'Blowing Dust' },
		frost :            { text : 'Frost' },
		freezing_spray :   { text : 'Freezing Spray' },
		volcanic_ash :     { text : 'Volcanic Ash' }
	}
}

/**
 * A template object to hold the outputted weather type from this parser.
 * @param priority - A numeric priority of the coverage
 * @param text - A text representation that combines coverage, weather, and intensity
 * @param type - A text representation that combines intensity and weather.  Used in conjunction with priority to help filter out
 * similar weather types.
 */
WeatherParser.parsedWeather = {
	priority : 0,
	text : null,
	type : null,
}


/**
 * Convert the weather properties into an actual human readable weather text.
 * @param {String} coverage - Weather 'coverage' code
 * @param {String} weather - Actual weather type code
 * @param {String} intensity - Weather 'intensity' code
 * @param {Object} meta - Metadata object used to propertly parse
 * @returns {Object} - A object representation of the weather based on the parsedWeather template.
 */
WeatherParser.parseWeather = function(coverage,weather,intensity,meta) {
	//The weather text always have to have content, but coverage and intensity may be null, so we have to check.
	weather = weather.toLowerCase()
	coverage = (coverage) ? coverage.toLowerCase() : coverage;
	intensity = (intensity) ? intensity.toLowerCase() : intensity;
	let parsedWeather = Object.create(this.parsedWeather);

	//Parse out our weather text, and throw an error if it's not recognized.
	let weatherText;
	if (meta.weatherTypes.hasOwnProperty(weather)) {
		weatherText = meta.weatherTypes[weather].text;
	}
	else {
		console.error(`Weather '${weather}' not a recognized weather type`);
		return parsedWeather;
	}

	//Handle combining the weather and intensity labels into a .type property to allow combining consistent types later
	if (meta.intensityTypes.hasOwnProperty(intensity)) {
		let intensityWxOverride = false;
		if (meta.weatherTypes[weather].hasOwnProperty('alt') && meta.weatherTypes[weather].alt.hasOwnProperty(intensity)) {
			parsedWeather.type = meta.weatherTypes[weather].alt[intensity].text;
		}
		else {
			let intensityText = meta.intensityTypes[intensity].text;
			parsedWeather.type = `${intensityText} ${weatherText}` };
	}
	else { parsedWeather.type = weatherText; }

	//Handle the coverage labels and assign to the .text property (What the users will see)
	if (meta.coverageTypes.hasOwnProperty(coverage)){
		let coverageText = meta.coverageTypes[coverage].text;
		let coveragePriority = meta.coverageTypes[coverage].priority;
		parsedWeather.text  = `${coverageText} ${parsedWeather.type}`;
		parsedWeather.priority = coveragePriority;
	}
	else { parsedWeather.text = parsedWeather.type; }

	return parsedWeather;
}
/**
 * Parses out an a GFE weather code.  Note that this currently only parses out single weathers from GFE, and doesn't parse ones
 * that are delimited with the ^
 * @param {String} - A GFE hazard code e.g. 'WI.Y' or 'AV.A'
 * @return {Object} - A parsedWeather object.
 */
WeatherParser.parseAWIPSWeather = function(weatherObj){
	let weatherParts = weatherObj.toLowerCase().split(':')
	let meta = this.awipsMeta;
	//Create a test to determine AWIPS null values and then assign them to null if needed.
	let nullRegex = new RegExp('\<no.*\>');
	let [coverage, weather, intensity] = weatherParts.map(value => {
		return (nullRegex.test(value)) ? null : value
	})
	if (weather) { return this.parseWeather(coverage,weather,intensity,meta) }
	else { return null; }
}

/**
 * Parses out an aan API weather object
 * @param {Object} - Any weather object returned from the weather.gov API.
 * @return {Object} - A parsedWeather object.
 */
WeatherParser.parseAPIWeather = function(weatherObj){
	if (weatherObj.weather){
		let meta = this.apiMeta;
		return this.parseWeather(weatherObj.coverage,weatherObj.weather,weatherObj.intensity,meta);
	}
	else { return null; }
}
