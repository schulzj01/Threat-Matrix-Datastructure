//
//
//   Example Threat Matrix Data Structure Format.
//
//
let structure = {
	//The time of the forecast update (From the raw forecast API).
	//Datatype: iso8601 Date
	"updateTime": "2021-05-12T20:02:53+00:00",
	//The valid time range of the forecast (from the raw forecast API)
	//Datatype: iso8601 Date with duration
	"validTimes": "2021-05-12T14:00:00+00:00/P7DT22H",
	//Metadata on the location (areal or point based) that the matrix is displaying data for
	//Datatype: Object
	"location" : {
		//A GeoJSON representation of the location.
		//Datatype: GeoJSON Object
		"geometry" : {
			"type": "Polygon",
			"coordinates": [[[0,1],[1,1],[1,0,][1,1]]]
		},
		//Human readable name of the location. Either pulled from the API or given from a GFE Edit Area name.  Can be empty.
		//Datatype: String
		"name": "7mi W of Pocatello",
		//CWA  Datatype: String
		"cwa": "PIH",
		//Timezone of the location.  Datatype String (Available timezones in name field here: https://github.com/vvo/tzdb/blob/main/raw-time-zones.json)
		"timeZone": "America/Denver", // America/New_York, America/Los_Angeles, America/Anchorage, America/Phoenix, America/Chicago
		//Elevation of the location, Datatype Object
		"elevation": {
			//API default value for elevation units. Datatype: String of WMO Unit Type
			"unitCode": "wmoUnit:m",
			// Elevation in meters above sea level. If this is not a range, just make high and low null and make average the static value. Datatype: Float
			"low" : 1000,
			"high" : 2000,
			"average": 1762.0488
		},
	},
	//Weather element will all be defined under this key.  The raw forecast API keeps them just in the "property" object, but trying to do that with variable available weather elements can be messy on our side.  Best to keep them separate.
	//Datatype: Object
	"weatherElements": {
		//A key for the weather element.  These have to be unique to each weather element.  They do not have to match between the API and AWIPS, and perhaps could just be the Grid ID in AWIPS?
		//Datatype: Object
		"temperature": {
			//Standard unit of measurement. Valid units are defined here: https://codes.wmo.int/common/unit and here: https://api.weather.gov/ontology/unit/
			//Since we're not using standard wmoUnits directly, we'll remove the wmoUnit: code from the API and just leave the unit.
			//Datatype: String of WMO Unit Type
			"uom": "degC",
			//Array of object pairs with the value and the ISO time range of the valid data.
			//Value properties in AWIPS side could be arrays instead of single values if edit areas are larger than a single grid point.
			//Datatype: Array
			"values": [
				//pairs of valid times and values.  //Datatype: Object
				{ "validTime": "2021-05-12T14:00:00+00:00/PT1H", "value": 9.4444444444444446 },
				{ "validTime": "2021-05-12T15:00:00+00:00/PT1H", "value": 12.222222222222221 },
				{ "validTime": "2021-05-12T16:00:00+00:00/PT1H", "value": 13.888888888888889 },
				{ "validTime": "2021-05-12T17:00:00+00:00/PT1H", "value": 14.444444444444445 }
			],
			//A key that tells the front end how to DEFAULT combine values when spanning multiple time steps. This could still be customized by the user on the front end.
			//Possible values ["max","min","range","add","concat","hazardconcat","weatherconcat"].  (This needs manual configuration)
			//weatherconcat and hazard concat are specific to weather and hazard elements respectively, and are tailored to parse the text of the elements in a consistent way.
			//Datatype: String
			"combination" :  "max",
			//The human readable weather element name that would display on the page. (This needs manual configuration)
			//Datatype: String
			"name" : "Temperature",
			//How many decimal places to round the data to if the data is numeric.  Null otherwise. (This needs manual configuration)
			//Datatype: Integer
			"precision" :  0
		}
	}
}