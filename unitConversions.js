/**
 * This is a quick and dirty conversion library to switch between the met units.  This could be expanded out, but it was left to really only
 * handle most of the stuff available in the API and units they could reasonably be expected to convert to.
 * 
 * The property vaules are derived from the WMO Unit registry: https://codes.wmo.int/common/unit.  While there are not units listed for american units
 * in that standard.  I've modeled what they would be called after their WMO counterparts.
 * 
 * No checking for null or NaN values done in this code. Sanitize yo stuff!
 * 
 * Usage : UnitConversions.fromUnit.toUnit
 * Example : To convert 30 degrees celcius to farenheit.
 *           let C = 30; 
 *           let F = UnitConversions.degC.degF(C)
 */

const UnitConversions = {
	/*round : function(value, precision) {
		let multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
	},*/
	//Temperature
	degC : {
		degF : function(v) { return (v * 1.8) + 32; },
		K    : function(v) { return v + 273; },
		degC : function(v) { return v; }
	},
	degF : {
		degC : function(v) { return (v - 32) / 1.8; },
		K    : function(v) { return (this.degC(v)) + 273;  },
		degF : function(v) { return v; }
	},
	K : {
		degC : function(v) { return v - 273; },
		degF : function(v) { return this.degC(v) * 1.8 + 32; },
		K    : function(v) { return v; }
	},
	m : {
		ft : function(v) { return v / 0.3048; },
		mi : function(v) { return this.ft(v) / 5280; },
		km : function(v) { return v / 1000; },
		m  : function(v) { return v; },
	},
	ft : {
		m : function(v) { return v * 0.3048 ; },
		mi : function(v) { return v / 5280; },
		km : function(v) { return this.m(v) / 1000; },
		ft : function(v) { return v; },		
	},
	mi : {
		m : function(v) { return this.ft(v) * 0.3048 ; },
		ft : function(v) { return v * 5280; },
		km : function(v) { return this.m(v) / 1000; },
		mi : function(v) { return v; },		
	},
	km : {
		m : function(v) { return v * 1000 ; },
		ft : function(v) { return this.m(v) / 0.3048; },
		mi : function(v) { return this.ft(v) / 5280; },
		km : function(v) { return v; },		
	},	
	mm : {
		cm : function(v) { return v / 10; },
		in : function(v) { return v / 25.4; },
		mm : function(v) { return v; }		
	},
	cm : {
		mm : function(v) { return v * 10; },
		in : function(v) { return v / 2.54; },
		cm : function(v) { return v; }		
	},
	in : {
		mm : function(v) { return v * 25.4; },
		cm : function(v) { return v * 2.54; },
		in : function(v) { return v; }		
	},
	'km_h-1' : { 
		kt       : function(v) { return v / 1.852 ; },
		'mi_h-1' : function(v) { return UnitConversions.km.mi(v); },	
		'm_s-1'  : function(v) { return v / 3.6 ; },	
		'km_h-1' : function(v) { return v; },
	},
	'm_s-1' : { 
		kt       : function(v) { return this['km_h-1'](v) / 1.852 ; },
		'mi_h-1' : function(v) { return v / 0.44704; },	
		'km_h-1' : function(v) { return v * 3.6; },	
		'm_s-1'  : function(v) { return v; },
	},
	'kt' : { 
		'm_s-1'  : function(v) { return this['km_h-1'](v) / 3.6 ; },
		'mi_h-1' : function(v) { return UnitConversions.km.mi(this['km_h-1'](v)); },	
		'km_h-1' : function(v) { return v * 1.852; },	
		kt       : function(v) { return v; },
	},
	'mi_h-1' : { 
		'm_s-1'  : function(v) { return this['km_h-1'](v) / 3.6 ; },
		kt       : function(v) { return this['km_h-1'](v) / 1.852; },	
		'km_h-1' : function(v) { return UnitConversions.mi.km(v); },	
		'mi_h-1' : function(v) { return v; },
	},	
	'degree_(angle)' : { //TODO  Go back the other way? 
		cardinal: function(v) {
			let val = Math.floor((v / 22.5) + 0.5);
			let arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
			return arr[(val % 16)];
		},
		'degree_(angle)' : function(v) { return v;  }
	},
	/**
	 * Function to verify all calculations of a the unit conversion
	 * @param {Number} v - value to convert
	 */
	runUnitTests : function(v = 1) {
		let output = `Running all UnitConversions tests for value: ${v}\n`
		for (const key in UnitConversions) { 
			if (key !== 'runUnitTests') {
				for (const subkey in UnitConversions[key]) { 
					let converted = UnitConversions[key][subkey](v)
					output+= `Converting ${v} ${key} to ${subkey}: ${converted}\n`;
				}
			}
		}
		return output;
	},
}
