## Classes

<dl>
<dt><a href="#ThreatMatrixForecast">ThreatMatrixForecast</a></dt>
<dd><p>Abstract class to allow combination of both API and AWIPS endpoints and manage the threat matrix data structure
This class shouldn&#39;t be instantiated directly.</p>
</dd>
<dt><a href="#APIForecast">APIForecast</a> ⇐ <code><a href="#ThreatMatrixForecast">ThreatMatrixForecast</a></code></dt>
<dd><p>API version of a ThreatMatrixForecast.  Give it a lat/lon via the constructor, and call the init method to instantiate.</p>
</dd>
<dt><a href="#AWIPSForecast">AWIPSForecast</a> ⇐ <code><a href="#ThreatMatrixForecast">ThreatMatrixForecast</a></code></dt>
<dd><p>AWIPS version of a ThreatMatrixForecast. This class converts a gfe forecast built via the Create_Threat_Matrix smart tool into the common threat matrix forecast data structure</p>
</dd>
</dl>

<br /><br />
<a name="ThreatMatrixForecast"></a>

## *ThreatMatrixForecast*
Abstract class to allow combination of both API and AWIPS endpoints and manage the threat matrix data structure
This class shouldn't be instantiated directly.

**Kind**: global abstract class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| this._threatMatrixDataset | <code>Object</code> | The threat matrix dataset.  Other datsets can be populated by extending this class to fit into this format |
| this._weatherElementConfig | <code>Object</code> | The config file that controls weather elements. Currently hosted in wxElementConfig.js. This file needs to be included in the html before this one. |
| this._unitConversions | <code>Object</code> | Default unit conversions that should be used when loading a threat matrix |
| this._validCombinationTypes | <code>Array.&lt;String&gt;</code> | An array of different possible weather element data combination types available. ['min','max','range','concat','add'] |


* *[ThreatMatrixForecast](#ThreatMatrixForecast)*
    * *[.weatherElements](#ThreatMatrixForecast+weatherElements) ⇒ <code>Array</code>*
    * *[.getValidStartTimeISOString()](#ThreatMatrixForecast+getValidStartTimeISOString) ⇒ <code>String</code>*
    * *[.getValidEndTimeISOString()](#ThreatMatrixForecast+getValidEndTimeISOString) ⇒ <code>String</code>*
    * *[.getForecastData()](#ThreatMatrixForecast+getForecastData) ⇒ <code>Object</code>*
    * *[.getFullDataset()](#ThreatMatrixForecast+getFullDataset) ⇒ <code>Object</code>*
    * *[.getValidWeatherElements()](#ThreatMatrixForecast+getValidWeatherElements) ⇒ <code>Array</code>*
    * *[.changeCombination(wxElement, combinationType)](#ThreatMatrixForecast+changeCombination)*
    * *[.convertTemp(toUnit)](#ThreatMatrixForecast+convertTemp)*
    * *[.convertWind(toUnit)](#ThreatMatrixForecast+convertWind)*
    * *[.convertPrecip(toUnit)](#ThreatMatrixForecast+convertPrecip)*
    * *[.convertDistance(toUnit)](#ThreatMatrixForecast+convertDistance)*
    * *[.convertDirection(toUnit)](#ThreatMatrixForecast+convertDirection)*
    * *[.getLocation()](#ThreatMatrixForecast+getLocation) ⇒ <code>Object</code>*

<a name="ThreatMatrixForecast+weatherElements"></a>

### *threatMatrixForecast.weatherElements ⇒ <code>Array</code>*
Shortcut to get our weather elements easier.

**Kind**: instance property of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>Array</code> - - An array of weather element keys.  Keys can be used as a wxelements filter in getForecastData()  
<a name="ThreatMatrixForecast+getValidStartTimeISOString"></a>

### *threatMatrixForecast.getValidStartTimeISOString() ⇒ <code>String</code>*
Shortcut to get the earliest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>String</code> - - ISO String of the starting time of the dataset.  
<a name="ThreatMatrixForecast+getValidEndTimeISOString"></a>

### *threatMatrixForecast.getValidEndTimeISOString() ⇒ <code>String</code>*
Shortcut to get the latest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>String</code> - - ISO String of the starting time of the dataset.  
<a name="ThreatMatrixForecast+getForecastData"></a>

### *threatMatrixForecast.getForecastData() ⇒ <code>Object</code>*
Generates the weather element forecast data based on a set of filters.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>Object</code> - - Threat matrix data structure formatted weather  

| Param | Type | Description |
| --- | --- | --- |
| filters.start | <code>Date</code> | The time to begin the forecast data.  Defaults to current time if not set |
| filters.end | <code>Date</code> | Time to end the forecast data.   Defaults to 8 days in the future if not set |
| filters.periodicity | <code>Integer</code> | Number of hours between each valid time returned.  Defaults to 24 hours if not set |
| filters.wxelements | <code>Array</code> | Weather element keys to include in the filtered list.   Defaults to all weather elements if not set |

<a name="ThreatMatrixForecast+getFullDataset"></a>

### *threatMatrixForecast.getFullDataset() ⇒ <code>Object</code>*
Shortcut to quickly query the entire data structure.  Mainly used for debugging purposes.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>Object</code> - - Entire threat matrix data structure  
<a name="ThreatMatrixForecast+getValidWeatherElements"></a>

### *threatMatrixForecast.getValidWeatherElements() ⇒ <code>Array</code>*
A list of all valid weather element keys The key is deemed "valid" if data values are available in the data structure)

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>Array</code> - - Valid weather element data keys  
<a name="ThreatMatrixForecast+changeCombination"></a>

### *threatMatrixForecast.changeCombination(wxElement, combinationType)*
Changes the combination property for a weather element.  This will allow the data structure output to customize how to combine values over long time periods
For example, in the winter, combining temperature by using a minimum would be more preferable than in the summer when you would combine it by maximum.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Todo**

- [ ] - Add this to demo


| Param | Type | Description |
| --- | --- | --- |
| wxElement | <code>\*</code> | Weather element type to change. Possible values can be found via getValidWeatherElements() |
| combinationType | <code>\*</code> | Type of combination to set.  Possible values are in _validCombinationTypes |

<a name="ThreatMatrixForecast+convertTemp"></a>

### *threatMatrixForecast.convertTemp(toUnit)*
Convert temperature values in data to the specified wmo unit.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>degF</code> | wmo unit type to convert to. Possible values : 'degF','degC','K' |

<a name="ThreatMatrixForecast+convertWind"></a>

### *threatMatrixForecast.convertWind(toUnit)*
Convert wind values in data to the specified wmo unit.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>mi_h-1</code> | wmo unit type to convert to. Possible values : 'km_h-1','kt','mi_h-1','m_s-1' |

<a name="ThreatMatrixForecast+convertPrecip"></a>

### *threatMatrixForecast.convertPrecip(toUnit)*
Convert precipitation values in data to the specified wmo unit.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>in</code> | wmo unit type to convert to. Possible values : 'mm','in'] |

<a name="ThreatMatrixForecast+convertDistance"></a>

### *threatMatrixForecast.convertDistance(toUnit)*
Convert distance values in data to the specified wmo unit.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>ft</code> | wmo unit type to convert to. Possible values : 'm','mi','km','ft' |

<a name="ThreatMatrixForecast+convertDirection"></a>

### *threatMatrixForecast.convertDirection(toUnit)*
Convert direction values in data to the specified wmo unit.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>cardinal</code> | wmo unit type to convert to. Possible values : 'degree_(angle)','cardinal' |

<a name="ThreatMatrixForecast+getLocation"></a>

### *threatMatrixForecast.getLocation() ⇒ <code>Object</code>*
A shortcut to get the threat matrix data structure location information direction.

**Kind**: instance method of [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Returns**: <code>Object</code> - - Location portion of threat matrix data strucutre  

<br /><br />
<a name="APIForecast"></a>

## APIForecast ⇐ [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)
API version of a ThreatMatrixForecast.  Give it a lat/lon via the constructor, and call the init method to instantiate.

**Kind**: global class  
**Extends**: [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| this._baseUrl | <code>String</code> | Base URL of the weather.gov API |
| this._pointMetadataUrl | <code>String</code> | Metadata URL endpoint for the weather.gov API |
| this._rawForecastUrl | <code>String</code> | Raw forecast URL endpoint for the weather.gov API |
| this._requestRetryLimit | <code>Integer</code> | Number of times to retry a query to the API before failing.  This helps us overcome the known issues with the API's 500 errors. |
| this._requestRetryTimeout | <code>Integer</code> | The delay between retry queries to the API in ms. |
| this._pointMetadata | <code>Object</code> | The results from the metadata query |
| this._rawForecast | <code>Object</code> | The results from the raw forecast query |


* [APIForecast](#APIForecast) ⇐ [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)
    * [new APIForecast(lat, lon)](#new_APIForecast_new)
    * [.weatherElements](#ThreatMatrixForecast+weatherElements) ⇒ <code>Array</code>
    * [.init(callback, ...args)](#APIForecast+init)
    * [.queryPointMetadata()](#APIForecast+queryPointMetadata)
    * [.queryRawForecast()](#APIForecast+queryRawForecast)
    * [.buildLocationNameFromPointMetadata(meters, degrees, city, state, threshold)](#APIForecast+buildLocationNameFromPointMetadata) ⇒ <code>String</code>
    * [.retryFetch(url, options, wait, numTries)](#APIForecast+retryFetch) ⇒ <code>Object</code>
    * [.getValidStartTimeISOString()](#ThreatMatrixForecast+getValidStartTimeISOString) ⇒ <code>String</code>
    * [.getValidEndTimeISOString()](#ThreatMatrixForecast+getValidEndTimeISOString) ⇒ <code>String</code>
    * [.getForecastData()](#ThreatMatrixForecast+getForecastData) ⇒ <code>Object</code>
    * [.getFullDataset()](#ThreatMatrixForecast+getFullDataset) ⇒ <code>Object</code>
    * [.getValidWeatherElements()](#ThreatMatrixForecast+getValidWeatherElements) ⇒ <code>Array</code>
    * [.changeCombination(wxElement, combinationType)](#ThreatMatrixForecast+changeCombination)
    * [.convertTemp(toUnit)](#ThreatMatrixForecast+convertTemp)
    * [.convertWind(toUnit)](#ThreatMatrixForecast+convertWind)
    * [.convertPrecip(toUnit)](#ThreatMatrixForecast+convertPrecip)
    * [.convertDistance(toUnit)](#ThreatMatrixForecast+convertDistance)
    * [.convertDirection(toUnit)](#ThreatMatrixForecast+convertDirection)
    * [.getLocation()](#ThreatMatrixForecast+getLocation) ⇒ <code>Object</code>

<a name="new_APIForecast_new"></a>

### new APIForecast(lat, lon)

| Param | Type | Description |
| --- | --- | --- |
| lat | <code>Float</code> | Latitude to query from API |
| lon | <code>Float</code> | Longitude to query from API |

<a name="ThreatMatrixForecast+weatherElements"></a>

### apiForecast.weatherElements ⇒ <code>Array</code>
Shortcut to get our weather elements easier.

**Kind**: instance property of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>weatherElements</code>](#ThreatMatrixForecast+weatherElements)  
**Returns**: <code>Array</code> - - An array of weather element keys.  Keys can be used as a wxelements filter in getForecastData()  
<a name="APIForecast+init"></a>

### apiForecast.init(callback, ...args)
Populate data structure by combining data from both API endpoints into the threat matrix data structure.
This function must be called after instantiating the object.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | function to call after query has completed and initialization completed |
| ...args | <code>any</code> | arguments to pass to the callback function. |

<a name="APIForecast+queryPointMetadata"></a>

### apiForecast.queryPointMetadata()
Queries the point metadata url from the API and assigns it to the private _pointMetadata property.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
<a name="APIForecast+queryRawForecast"></a>

### apiForecast.queryRawForecast()
Queries the raw forecast url from the API and assigns it to the private _rawForecast property.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
<a name="APIForecast+buildLocationNameFromPointMetadata"></a>

### apiForecast.buildLocationNameFromPointMetadata(meters, degrees, city, state, threshold) ⇒ <code>String</code>
The API doesn't really return a useful location, this will build one based on a few properties.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Returns**: <code>String</code> - - Human readable location represntation of the given properties.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| meters | <code>Integer</code> |  | Distance in meters from nearest city |
| degrees | <code>Integer</code> |  | Direction in degrees from nearest city |
| city | <code>String</code> |  | Nearest city |
| state | <code>String</code> |  | Nearest city's state |
| threshold | <code>Integer</code> | <code>5000</code> | Distance threshold in meters which when exceeeded will include the "5 miles ESE of" text in the result |

<a name="APIForecast+retryFetch"></a>

### apiForecast.retryFetch(url, options, wait, numTries) ⇒ <code>Object</code>
Utility function to retry fetches multiple times if the query fails the first time.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Returns**: <code>Object</code> - - Results of promise if it returns a successful query  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Url to fetch |
| options | <code>Object</code> | Fetch options |
| wait | <code>Integer</code> | Number of seconds before retrying query |
| numTries | <code>Integer</code> | Number of tries before ultimately failing query and throwing an error |

<a name="ThreatMatrixForecast+getValidStartTimeISOString"></a>

### apiForecast.getValidStartTimeISOString() ⇒ <code>String</code>
Shortcut to get the earliest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>getValidStartTimeISOString</code>](#ThreatMatrixForecast+getValidStartTimeISOString)  
**Returns**: <code>String</code> - - ISO String of the starting time of the dataset.  
<a name="ThreatMatrixForecast+getValidEndTimeISOString"></a>

### apiForecast.getValidEndTimeISOString() ⇒ <code>String</code>
Shortcut to get the latest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>getValidEndTimeISOString</code>](#ThreatMatrixForecast+getValidEndTimeISOString)  
**Returns**: <code>String</code> - - ISO String of the starting time of the dataset.  
<a name="ThreatMatrixForecast+getForecastData"></a>

### apiForecast.getForecastData() ⇒ <code>Object</code>
Generates the weather element forecast data based on a set of filters.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>getForecastData</code>](#ThreatMatrixForecast+getForecastData)  
**Returns**: <code>Object</code> - - Threat matrix data structure formatted weather  

| Param | Type | Description |
| --- | --- | --- |
| filters.start | <code>Date</code> | The time to begin the forecast data.  Defaults to current time if not set |
| filters.end | <code>Date</code> | Time to end the forecast data.   Defaults to 8 days in the future if not set |
| filters.periodicity | <code>Integer</code> | Number of hours between each valid time returned.  Defaults to 24 hours if not set |
| filters.wxelements | <code>Array</code> | Weather element keys to include in the filtered list.   Defaults to all weather elements if not set |

<a name="ThreatMatrixForecast+getFullDataset"></a>

### apiForecast.getFullDataset() ⇒ <code>Object</code>
Shortcut to quickly query the entire data structure.  Mainly used for debugging purposes.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>getFullDataset</code>](#ThreatMatrixForecast+getFullDataset)  
**Returns**: <code>Object</code> - - Entire threat matrix data structure  
<a name="ThreatMatrixForecast+getValidWeatherElements"></a>

### apiForecast.getValidWeatherElements() ⇒ <code>Array</code>
A list of all valid weather element keys The key is deemed "valid" if data values are available in the data structure)

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>getValidWeatherElements</code>](#ThreatMatrixForecast+getValidWeatherElements)  
**Returns**: <code>Array</code> - - Valid weather element data keys  
<a name="ThreatMatrixForecast+changeCombination"></a>

### apiForecast.changeCombination(wxElement, combinationType)
Changes the combination property for a weather element.  This will allow the data structure output to customize how to combine values over long time periods
For example, in the winter, combining temperature by using a minimum would be more preferable than in the summer when you would combine it by maximum.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>changeCombination</code>](#ThreatMatrixForecast+changeCombination)  
**Todo**

- [ ] - Add this to demo


| Param | Type | Description |
| --- | --- | --- |
| wxElement | <code>\*</code> | Weather element type to change. Possible values can be found via getValidWeatherElements() |
| combinationType | <code>\*</code> | Type of combination to set.  Possible values are in _validCombinationTypes |

<a name="ThreatMatrixForecast+convertTemp"></a>

### apiForecast.convertTemp(toUnit)
Convert temperature values in data to the specified wmo unit.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>convertTemp</code>](#ThreatMatrixForecast+convertTemp)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>degF</code> | wmo unit type to convert to. Possible values : 'degF','degC','K' |

<a name="ThreatMatrixForecast+convertWind"></a>

### apiForecast.convertWind(toUnit)
Convert wind values in data to the specified wmo unit.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>convertWind</code>](#ThreatMatrixForecast+convertWind)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>mi_h-1</code> | wmo unit type to convert to. Possible values : 'km_h-1','kt','mi_h-1','m_s-1' |

<a name="ThreatMatrixForecast+convertPrecip"></a>

### apiForecast.convertPrecip(toUnit)
Convert precipitation values in data to the specified wmo unit.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>convertPrecip</code>](#ThreatMatrixForecast+convertPrecip)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>in</code> | wmo unit type to convert to. Possible values : 'mm','in'] |

<a name="ThreatMatrixForecast+convertDistance"></a>

### apiForecast.convertDistance(toUnit)
Convert distance values in data to the specified wmo unit.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>convertDistance</code>](#ThreatMatrixForecast+convertDistance)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>ft</code> | wmo unit type to convert to. Possible values : 'm','mi','km','ft' |

<a name="ThreatMatrixForecast+convertDirection"></a>

### apiForecast.convertDirection(toUnit)
Convert direction values in data to the specified wmo unit.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>convertDirection</code>](#ThreatMatrixForecast+convertDirection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>cardinal</code> | wmo unit type to convert to. Possible values : 'degree_(angle)','cardinal' |

<a name="ThreatMatrixForecast+getLocation"></a>

### apiForecast.getLocation() ⇒ <code>Object</code>
A shortcut to get the threat matrix data structure location information direction.

**Kind**: instance method of [<code>APIForecast</code>](#APIForecast)  
**Overrides**: [<code>getLocation</code>](#ThreatMatrixForecast+getLocation)  
**Returns**: <code>Object</code> - - Location portion of threat matrix data strucutre  

<br /><br />
<a name="AWIPSForecast"></a>

## AWIPSForecast ⇐ [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)
AWIPS version of a ThreatMatrixForecast. This class converts a gfe forecast built via the Create_Threat_Matrix smart tool into the common threat matrix forecast data structure

**Kind**: global class  
**Extends**: [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _gfeForecast | <code>Object</code> | Storage of the gfeForecast given in the constructor |


* [AWIPSForecast](#AWIPSForecast) ⇐ [<code>ThreatMatrixForecast</code>](#ThreatMatrixForecast)
    * [new AWIPSForecast(gfeForecast)](#new_AWIPSForecast_new)
    * [.weatherElements](#ThreatMatrixForecast+weatherElements) ⇒ <code>Array</code>
    * [.init(callback, ...args)](#AWIPSForecast+init)
    * [.getValidStartTimeISOString()](#ThreatMatrixForecast+getValidStartTimeISOString) ⇒ <code>String</code>
    * [.getValidEndTimeISOString()](#ThreatMatrixForecast+getValidEndTimeISOString) ⇒ <code>String</code>
    * [.getForecastData()](#ThreatMatrixForecast+getForecastData) ⇒ <code>Object</code>
    * [.getFullDataset()](#ThreatMatrixForecast+getFullDataset) ⇒ <code>Object</code>
    * [.getValidWeatherElements()](#ThreatMatrixForecast+getValidWeatherElements) ⇒ <code>Array</code>
    * [.changeCombination(wxElement, combinationType)](#ThreatMatrixForecast+changeCombination)
    * [.convertTemp(toUnit)](#ThreatMatrixForecast+convertTemp)
    * [.convertWind(toUnit)](#ThreatMatrixForecast+convertWind)
    * [.convertPrecip(toUnit)](#ThreatMatrixForecast+convertPrecip)
    * [.convertDistance(toUnit)](#ThreatMatrixForecast+convertDistance)
    * [.convertDirection(toUnit)](#ThreatMatrixForecast+convertDirection)
    * [.getLocation()](#ThreatMatrixForecast+getLocation) ⇒ <code>Object</code>

<a name="new_AWIPSForecast_new"></a>

### new AWIPSForecast(gfeForecast)

| Param | Type | Description |
| --- | --- | --- |
| gfeForecast | <code>Object</code> | A formatted GFE built forecast created by Create_Threat_Matrix.py |

<a name="ThreatMatrixForecast+weatherElements"></a>

### awipsForecast.weatherElements ⇒ <code>Array</code>
Shortcut to get our weather elements easier.

**Kind**: instance property of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>weatherElements</code>](#ThreatMatrixForecast+weatherElements)  
**Returns**: <code>Array</code> - - An array of weather element keys.  Keys can be used as a wxelements filter in getForecastData()  
<a name="AWIPSForecast+init"></a>

### awipsForecast.init(callback, ...args)
Populate data structure by converting a gfe forecast .json file  to 
For constistency with the API forecast which is async, this function must be called after instantiating the object.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | function to call after query has completed and initialization completed |
| ...args | <code>any</code> | arguments to pass to the callback function. |

<a name="ThreatMatrixForecast+getValidStartTimeISOString"></a>

### awipsForecast.getValidStartTimeISOString() ⇒ <code>String</code>
Shortcut to get the earliest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>getValidStartTimeISOString</code>](#ThreatMatrixForecast+getValidStartTimeISOString)  
**Returns**: <code>String</code> - - ISO String of the starting time of the dataset.  
<a name="ThreatMatrixForecast+getValidEndTimeISOString"></a>

### awipsForecast.getValidEndTimeISOString() ⇒ <code>String</code>
Shortcut to get the latest time that the data is valid for.  Note that this is different than validTimes which is an 8601 duration.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>getValidEndTimeISOString</code>](#ThreatMatrixForecast+getValidEndTimeISOString)  
**Returns**: <code>String</code> - - ISO String of the starting time of the dataset.  
<a name="ThreatMatrixForecast+getForecastData"></a>

### awipsForecast.getForecastData() ⇒ <code>Object</code>
Generates the weather element forecast data based on a set of filters.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>getForecastData</code>](#ThreatMatrixForecast+getForecastData)  
**Returns**: <code>Object</code> - - Threat matrix data structure formatted weather  

| Param | Type | Description |
| --- | --- | --- |
| filters.start | <code>Date</code> | The time to begin the forecast data.  Defaults to current time if not set |
| filters.end | <code>Date</code> | Time to end the forecast data.   Defaults to 8 days in the future if not set |
| filters.periodicity | <code>Integer</code> | Number of hours between each valid time returned.  Defaults to 24 hours if not set |
| filters.wxelements | <code>Array</code> | Weather element keys to include in the filtered list.   Defaults to all weather elements if not set |

<a name="ThreatMatrixForecast+getFullDataset"></a>

### awipsForecast.getFullDataset() ⇒ <code>Object</code>
Shortcut to quickly query the entire data structure.  Mainly used for debugging purposes.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>getFullDataset</code>](#ThreatMatrixForecast+getFullDataset)  
**Returns**: <code>Object</code> - - Entire threat matrix data structure  
<a name="ThreatMatrixForecast+getValidWeatherElements"></a>

### awipsForecast.getValidWeatherElements() ⇒ <code>Array</code>
A list of all valid weather element keys The key is deemed "valid" if data values are available in the data structure)

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>getValidWeatherElements</code>](#ThreatMatrixForecast+getValidWeatherElements)  
**Returns**: <code>Array</code> - - Valid weather element data keys  
<a name="ThreatMatrixForecast+changeCombination"></a>

### awipsForecast.changeCombination(wxElement, combinationType)
Changes the combination property for a weather element.  This will allow the data structure output to customize how to combine values over long time periods
For example, in the winter, combining temperature by using a minimum would be more preferable than in the summer when you would combine it by maximum.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>changeCombination</code>](#ThreatMatrixForecast+changeCombination)  
**Todo**

- [ ] - Add this to demo


| Param | Type | Description |
| --- | --- | --- |
| wxElement | <code>\*</code> | Weather element type to change. Possible values can be found via getValidWeatherElements() |
| combinationType | <code>\*</code> | Type of combination to set.  Possible values are in _validCombinationTypes |

<a name="ThreatMatrixForecast+convertTemp"></a>

### awipsForecast.convertTemp(toUnit)
Convert temperature values in data to the specified wmo unit.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>convertTemp</code>](#ThreatMatrixForecast+convertTemp)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>degF</code> | wmo unit type to convert to. Possible values : 'degF','degC','K' |

<a name="ThreatMatrixForecast+convertWind"></a>

### awipsForecast.convertWind(toUnit)
Convert wind values in data to the specified wmo unit.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>convertWind</code>](#ThreatMatrixForecast+convertWind)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>mi_h-1</code> | wmo unit type to convert to. Possible values : 'km_h-1','kt','mi_h-1','m_s-1' |

<a name="ThreatMatrixForecast+convertPrecip"></a>

### awipsForecast.convertPrecip(toUnit)
Convert precipitation values in data to the specified wmo unit.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>convertPrecip</code>](#ThreatMatrixForecast+convertPrecip)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>in</code> | wmo unit type to convert to. Possible values : 'mm','in'] |

<a name="ThreatMatrixForecast+convertDistance"></a>

### awipsForecast.convertDistance(toUnit)
Convert distance values in data to the specified wmo unit.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>convertDistance</code>](#ThreatMatrixForecast+convertDistance)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>ft</code> | wmo unit type to convert to. Possible values : 'm','mi','km','ft' |

<a name="ThreatMatrixForecast+convertDirection"></a>

### awipsForecast.convertDirection(toUnit)
Convert direction values in data to the specified wmo unit.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>convertDirection</code>](#ThreatMatrixForecast+convertDirection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| toUnit | <code>String</code> | <code>cardinal</code> | wmo unit type to convert to. Possible values : 'degree_(angle)','cardinal' |

<a name="ThreatMatrixForecast+getLocation"></a>

### awipsForecast.getLocation() ⇒ <code>Object</code>
A shortcut to get the threat matrix data structure location information direction.

**Kind**: instance method of [<code>AWIPSForecast</code>](#AWIPSForecast)  
**Overrides**: [<code>getLocation</code>](#ThreatMatrixForecast+getLocation)  
**Returns**: <code>Object</code> - - Location portion of threat matrix data strucutre  
