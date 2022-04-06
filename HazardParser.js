/**
 *  A hazard reference tool to allow both GFE and API based hazards referenced by the exact same text.
 *
 * @author Jeremy.Schulz@noaa.gov
 */

const HazardParser = {}

/**
 * A list of the hazard phenomena.  If a hazard has a custom name for different sigs, the default is overriden with a property matching
 * the product significance code. If a product name should not append the product significance identifier to the end of it (e.g. Small Craft
 * Advisory for Hazardous Seas), set the ignoreSig flag to not append it.
 */
HazardParser.hazardMeta = {
	af : { default : 'Ashfall' },
	as : { default : 'Air Stagnation' },
	av : { default : 'Avalanche' },
	bh : { default : 'Beach Hazard' },
	bs : { default : 'Blowing Snow' },
	bw : { default : 'Brisk Wind' },
	bz : { default : 'Blizzard' },
	cf : { default : 'Coastal Flood' },
	ds : { default : 'Dust Storm' },
	du : { default : 'Blowing Dust' },
	ec : { default : 'Extreme Cold' },
	eh : { default : 'Excessive Heat' },
	ew : { default : 'Extreme Wind' },
	fa : { default : 'Flood' },
	ff : { default : 'Flash Flood' },
	fg : { default : 'Dense Fog' },
	fl : { default : 'Flood' },
	fr : { default : 'Frost' },
	fw : { default : 'Fire Weather',  w: 'Red Flag' },
	fz : { default : 'Freeze' },
	gl : { default : 'Gale' },
	hf : { default : 'Hurricane Force Wind' },
	hi : { default : 'Hurricane Wind' },
	hs : { default : 'Heavy Snow' },
	ht : { default : 'Heat' },
	hu : { default : 'Hurricane', s: 'Hurricane Local' },
	hw : { default : 'High Wind' },
	hz : { default : 'Hard Freeze' },
	ip : { default : 'Sleet' },
	is : { default : 'Ice Storm' },
	lb : { default : 'Lake Effect Snow and Blowing Snow' },
	le : { default : 'Lake Effect Snow' },
	lo : { default : 'Low Water' },
	ls : { default : 'Lakeshore Flood' },
	lw : { default : 'Lake Wind' },
	ma : { default : 'Marine Weather', s: 'Special Marine' },
	mf : { default : 'Dense Fog' },
	mh : { default : 'Ashfall' },
	ms : { default : 'Dense Smoke' },
	rb : { default : '', y : 'Small Craft Advisory for Rough Bar', ignoreSig : true },
	rp : { default : 'Rip Current' },
	sb : { default : 'Snow and Blowing Snow' },
	sc : { default : 'Small Craft' },
	se : { default : 'Hazardous Seas' },
	si : { default : '', y : 'Small Craft Advisory For Winds', ignoreSig : true  },
	sm : { default : 'Dense Smoke' },
	sn : { default : 'Snow Advisory' },
	sq : { default : 'Snow Squall' },
	sr : { default : 'Storm' },
	ss : { default : 'Storm Surge' },
	su : { default : 'High Surf' },
	sv : { default : 'Severe Thunderstorm' },
	sw : { default : '', y : 'Small Craft Advisory For Hazardous Seas', ignoreSig: true },
	ti : { default : 'Tropical Storm Wind' },
	to : { default : 'Tornado' },
	tr : { default : 'Tropical Storm', s: 'Tropical Storm Local' },
	ts : { default : 'Tsunami' },
	ty : { default : 'Typhoon', s: 'Typhoon Local' },
	up : { default : 'Heavy Freezing Spray', y: 'Freezing Spray' },
	wc : { default : 'Wind Chill' },
	wi : { default : 'Wind' },
	ws : { default : 'Winter Storm' },
	ww : { default : 'Winter Weather' },
	zf : { default : 'Freezing Fog' },
	zr : { default : 'Freezing Rain' },
}

HazardParser.hazardSigs = {
	s : 'Statement',
	y : 'Advisory',
	a : 'Watch',
	w : 'Warning'
}
/**
 * Convert the hazard codes into the text of what the product actually is.
 * @param {String} phe - Event phenomena code
 * @param {String} sig - Event significance code
 * @returns
 */
HazardParser.parseHazard = function(phe,sig) {
	phe = phe.toLowerCase();
	sig = sig.toLowerCase();
	if (this.hazardMeta.hasOwnProperty(phe) && this.hazardSigs.hasOwnProperty(sig)) {
		let hMeta = this.hazardMeta[phe];
		let hText = '';
		if (hMeta.ignoreSig) { hText = this.hazardMeta[phe][sig]; }
		else {
			if (hMeta.hasOwnProperty(phe)) { hText = hMeta[phe] }
			else { hText = hMeta.default; }
			hText += ` ${this.hazardSigs[sig]}`
		}
		return hText;
	}
	else {
		console.error(`Hazard ${phe} with type ${sig} not a recognized hazard type`);
		return '';
	}
}
/**
 * Parses out an a GFE hazard code into hazard text.
 * @param {String} - A GFE hazard code e.g. 'WI.Y' or 'AV.A'
 * @return {String} - A text representation of the hazard
 */
HazardParser.parseAWIPSHazard = function(hazard){
	let [phe, sig] = hazard.toLowerCase().split('.')
	if (phe && sig) { return this.parseHazard(phe,sig) }
	else {return ''; }
}

/**
 * Parses out an API Hazard object into text.
 * @param {Object} - A NWS API hazard object
 * @return {String} - A text representation of the hazard
 * Example API hazard object:
 * { "phenomenon": "HW",
 * "significance": "W",
 * "event_number": null }
 */
HazardParser.parseAPIHazard = function(hazard){
	if (hazard.phenomenon && hazard.significance){
		return this.parseHazard(hazard.phenomenon,hazard.significance);
	}
	else { return ''; }
}
