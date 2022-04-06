const wxElementConfig = {
	"temperature": {
		"gfeGrid": "T",
		"combination": "max",
		"name": "Temperature",
		"precision": 0
	},
	"skyCover": {
		"gfeGrid": "Sky",
		"combination": "max",
		"name": "Sky Cover",
		"precision": 0
	},
	"dewpoint": {
		"gfeGrid": "Td",
		"combination": "min",
		"name": "Dew Point",
		"precision": 0
	},
	"maxTemperature": {
		"gfeGrid": "MaxT",
		"combination": "max",
		"name": "Maximum Temperature",
		"precision": 0
	},
	"minTemperature": {
		"gfeGrid": "MinT",
		"combination": "min",
		"name": "Minimum Temperature",
		"precision": 0
	},
	"relativeHumidity": {
		"gfeGrid": "RH",
		"combination": "min",
		"name": "Relative Humidity",
		"precision": 0
	},
	"maxRelativeHumidity": {
		"gfeGrid": "MaxRH",
		"combination": "max",
		"name": "Maximum Relative Humidity",
		"precision": 0
	},
	"minRelativeHumidity": {
		"gfeGrid": "MinRH",
		"combination": "min",
		"name": "Minimum Relative Humidity",
		"precision": 0
	},
	"apparentTemperature": {
		"gfeGrid": "ApparentT",
		"combination": "max",
		"name": "Apparent Temperature",
		"precision": 0
	},
	"heatIndex": {
		"gfeGrid": "HeatIndex",
		"combination": "max",
		"name": "Heat Index",
		"precision": 0
	},
	"windChill": {
		"gfeGrid": "WindChill",
		"combination": "min",
		"name": "Wind Chill",
		"precision": 0
	},
	"windDirection": {
		"gfeGrid": "WindDirection",
		"combination": "range",
		"name": "Wind Direction",
		"precision": 0
	},
	"windSpeed": {
		"gfeGrid": "WindSpeed",
		"combination": "max",
		"name": "Wind Speed",
		"precision": 0
	},
	"windGust": {
		"gfeGrid": "WindGust",
		"combination": "max",
		"name": "Wind Gust Speed",
		"precision": 0
	},
	"weather": {
		"gfeGrid": "Wx",
		"combination": "weatherconcat",
		"name": "Weather Conditions",
		"precision": null
	},
	"hazards": {
		"gfeGrid": "Hazards",
		"combination": "hazardconcat",
		"name": "NWS Hazardous Weather Products",
		"precision": null
	},
	"probabilityOfPrecipitation": {
		"gfeGrid": "PoP",
		"combination": "max",
		"name": "Probability of Precipitation",
		"precision": 0
	},
	"quantitativePrecipitation": {
		"gfeGrid": "QPF",
		"combination": "add",
		"name": "Liquid Precipitation Amount",
		"precision": 2
	},
	"iceAccumulation": {
		"gfeGrid": "IceAccum",
		"combination": "add",
		"name": "Ice Accumulation",
		"precision": 2
	},
	"snowfallAmount": {
		"gfeGrid": "SnowAmt",
		"combination": "add",
		"name": "Snow Accumulation",
		"precision": 1
	},
	"snowLevel": {
		"gfeGrid": "SnowLevel",
		"combination": "min",
		"name": "Snow Level",
		"precision": 0
	},
	"ceilingHeight": {
		"gfeGrid": "CigHgt",
		"combination": "min",
		"name": "Ceiling Height",
		"precision": 0
	},
	"visibility": {
		"gfeGrid": "Vsby",
		"combination": "min",
		"name": "Visibility",
		"precision": 0
	},
	"probabilityOfThunder": {
		"gfeGrid": "PotThunder",
		"combination": "max",
		"name": "Probability of Thunder",
		"precision": 0
	},
	"potentialOf15mphWinds": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 15mph Wind Speeds",
		"precision": 0
	},
	"potentialOf25mphWinds": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 25mph Wind Speeds",
		"precision": 0
	},
	"potentialOf35mphWinds": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 35mph Wind Speeds",
		"precision": 0
	},
	"potentialOf45mphWinds": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 45mph Wind Speeds",
		"precision": 0
	},
	"potentialOf20mphWindGusts": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 20mph Wind Gusts",
		"precision": 0
	},
	"potentialOf30mphWindGusts": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 30mph Wind Gusts",
		"precision": 0
	},
	"potentialOf40mphWindGusts": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 40mph Wind Gusts",
		"precision": 0
	},
	"potentialOf50mphWindGusts": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 50mph Wind Gusts",
		"precision": 0
	},
	"potentialOf60mphWindGusts": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of > 60mph Wind Gusts",
		"precision": 0
	},
	"stability": {
		"gfeGrid": "Stability",
		"combination": "max",
		"name": "Stability",
		"precision": 0
	},
	"redFlagThreatIndex": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Red Flag Threat Index",
		"precision": 0
	},
	"dispersionIndex": {
		"gfeGrid": "",
		"combination": "max",
		"name": "",
		"precision": 0
	},
	"transportWindSpeed": {
		"gfeGrid": "TransWindSpeed",
		"combination": "min",
		"name": "Transport Wind Speed",
		"precision": 0
	},
	"transportWindDirection": {
		"gfeGrid": "TransWindDirection",
		"combination": "range",
		"name": "Transport Wind Direction",
		"precision": 0
	},
	"mixingHeight": {
		"gfeGrid": "MixHgt",
		"combination": "min",
		"name": "Mixing Height",
		"precision": 0
	},
	"hainesIndex": {
		"gfeGrid": "Haines",
		"combination": "max",
		"name": "Haines Index",
		"precision": 0
	},
	"lightningActivityLevel": {
		"gfeGrid": "LAL",
		"combination": "max",
		"name": "Lightning Activity Level",
		"precision": 0
	},
	"twentyFootWindSpeed": {
		"gfeGrid": "Wind20ftSpeed",
		"combination": "max",
		"name": "Twenty Foot Wind Speed",
		"precision": 0
	},
	"twentyFootWindDirection": {
		"gfeGrid": "Wind20ftDirection",
		"combination": "range",
		"name": "Twenty Foot Wind Direction",
		"precision": 0
	},
	"grasslandFireDangerIndex": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Grassland Fire Danger Index",
		"precision": 0
	},
	"davisStabilityIndex": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Davis Stability Index",
		"precision": 0
	},
	"atmosphericDispersionIndex": {
		"gfeGrid": "",
		"combination": "min",
		"name": "Atmospheric Dispersion Index",
		"precision": 0
	},
	"lowVisibilityOccurrenceRiskIndex": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Low Visibility Occurrence Risk Index (LVORI)",
		"precision": 0
	},
	"pressure": {
		"gfeGrid": "",
		"combination": "min",
		"name": "Pressure",
		"precision": 0
	},
	"probabilityOfTropicalStormWinds": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of Tropical Storm Strength Winds",
		"precision": 0
	},
	"probabilityOfHurricaneWinds": {
		"gfeGrid": "",
		"combination": "max",
		"name": "Probability of Hurricane Strength Winds",
		"precision": 0
	},
	"waveHeight": {
		"gfeGrid": "WaveHeight",
		"combination": "max",
		"name": "Wave Height",
		"precision": 1
	},
	"wavePeriod": {
		"gfeGrid": "Period",
		"combination": "max",
		"name": "Primary Wave Period",
		"precision": 1
	},
	"primarySwellHeight": {
		"gfeGrid": "Swell",
		"combination": "range",
		"name": "Primary Swell Height",
		"precision": 1
	},
	"primarySwellDirection": {
		"gfeGrid": "Swell",
		"combination": "range",
		"name": "Primary Swell Direction",
		"precision": 0
	},
	"secondarySwellHeight": {
		"gfeGrid": "Swell2",
		"combination": "range",
		"name": "Secondary Swell Height",
		"precision": 1
	},
	"secondarySwellDirection": {
		"gfeGrid": "Swell2",
		"combination": "range",
		"name": "Secondary Swell Direction",
		"precision": 0
	},
	"wavePeriod2": {
		"gfeGrid": "T",
		"combination": "max",
		"name": "Secondary Wave Period",
		"precision": 1
	},
	"windWaveHeight": {
		"gfeGrid": "Period2",
		"combination": "max",
		"name": "Wind Wave Height",
		"precision": 1
	}
}
