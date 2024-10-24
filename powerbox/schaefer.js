
class catId {
	constructor(id, ext) {
		this.id = id;
		this.ext = ext;
	}
};

class input_base extends catId {
	constructor(nom, min, max, id, ext) {
		super(id, ext)
		this.nom = nom;
		this.min = min;
		this.max = max;
	}
};

class DC extends input_base {
	constructor(nom, min, max, id, ext = null) {
		super(nom, min, max, id, ext);
		this.type = "DC";
		this.typedesc = "DC";
	}
};

class BC extends DC {
	constructor(nom, min, max, id, ext = null) {
		super(nom, min, max, id, ext);
		this.type = "BC";
		this.typedesc = "Battery Charger";
	}
}

class AC extends input_base {
	constructor(nom, low_tol_pc, high_top_pc, id, ext = null) {
		super(nom, nom*(1-low_tol_pc), nom*(1+low_tol_pc), id, ext);
		this.type = "AC";
		this.typedesc = "AC";
		this.PFC = false;
	}
};

class AC_PFC extends AC {
	constructor(nom, low_tol_pc, high_top_pc, id, ext = null) {
		super(nom, low_tol_pc, low_tol_pc, id, ext);
		this.PFC = true;
	}
};

class AC3 extends AC {
	constructor(nom, low_tol_pc, high_top_pc, id, ext = null) {
		super(nom, low_tol_pc, low_tol_pc, id, ext);
		this.type = "AC3";
		this.typedesc = "AC (3 Phase)";
	}
};

function addProjectLine(product_el) {
	console.log("adding to project:", product_el);
	const row = document.createElement("tr");

	const t_item = document.createElement('td');
	row.append(t_item);
	const t_qty = document.createElement('td');
	row.append(t_qty);
	const t_price_euro = document.createElement('td');
	row.append(t_price_euro);
	const t_price_aud = document.createElement('td');
	row.append(t_price_aud);
	
	// item
	t_item.append(product_el.cloneNode(true));

	const qty = document.createElement("input");
	t_qty.append(qty);

	const euro = document.createElement("span");
	t_price_euro.append(euro);

	const aud = document.createElement("span");
	t_price_aud.append(aud);

	// quantity
	qty.type = "number";
	qty.value = 1;
	qty.onclick = () => {
		euro.innerHTML = "&euro;" + product_el.psu.pricing.base_euro;
	}

	document.getElementById("project-table-body").append(row);
}

function addToProject(button) {
	const div = button.parentElement.parentElement;
	document.getElementById("project-table-body").append(
		addProjectLine(div)
	);
}

function unit(type, id, input, output, current, packaging, cooling, options, extra, price) {
	const el = document.createElement('div');
	el.className = "boxed-item";

	const psu = {
		input: Object(input),
		output: Object(output),
		pricing: price,
		series: Number(id)*100,
		options: options,
		type: String(type)
	};
	
	psu.output.current = current;
	
	el.psu = psu;
	
	if ( input.PFC == true ) type += "P";
	el.id = type + " " + id + psu.input.id + psu.output.id;
	
	var ext = "";
	if ( psu.input.ext != null ) ext += psu.input.ext;
	if ( psu.output.ext != null ) ext += psu.output.ext;
	if ( ext.length > 0 ) el.id += " " + ext;
	
	var v_range = "";
	if ( psu.input.type == "DC" ) {
		v_range = psu.input.min + " - " + psu.input.max + " V" + psu.input.type;
	} else {
		v_range = psu.input.nom + " V" + psu.input.type + " [" + psu.input.min + " - " + el.psu.input.max + "]";
	}

	const title = document.createElement('span');
	el.append(title);
	title.className = "boxed-title";
	const addButton = document.createElement("input");
	addButton.type = "button";
	addButton.value = "+";
	addButton.setAttribute("onclick", "addToProject(this)");
	title.appendChild(addButton);
	title.innerHTML += "&nbsp;" + el.id;
	
	const content_el = document.createElement( "div" );
	el.appendChild(content_el);
	content_el.className = "boxed-content";
	content_el.innerHTML = `
		<b>Description:</b>&nbsp;${el.id} - ${el.psu.input.typedesc}/${el.psu.output.typedesc} converter<br>
		<b>Input:</b>&nbsp;${v_range}<br>
		<b>Output:</b>&nbsp;${el.psu.output.nom} V${el.psu.output.type} @ ${el.psu.output.current} A<br>
		<b>Adjustable range:</b>&nbsp;${el.psu.output.min} - ${el.psu.output.max}<br>
		<b>Base price:</b>&nbsp;&euro;${el.psu.pricing.base_euro}<br>
	`;

	for ( var option of psu.options ) {
		option.price = option.pricing(psu);
		if ( option.price == null ) continue;
		content_el.innerHTML += `
			<br><input type="checkbox">&nbsp;&euro;${option.price} - ${option.description}
		`;
	}
	
	return el;
}

class series extends Array {
	constructor(type, id, input_list, output_list, current_list, packaging, cooling, options, extra, price) {
		super();
		for ( var i_input in input_list ) {
			for ( var i_output in output_list ) {
				const input = input_list[i_input];
				const output = output_list[i_output];
				this.push(unit(type, id, input, output, current_list[i_output], packaging, cooling, options, extra, price));
			}
		}
	}
};

const DC_10_16 = new DC(12, 10, 16, 0);
const DC_18_36 = new DC(24, 18, 36, 2);
const DC_36_75 = new DC(48, 36, 75, 3);
const DC_45_90 = new DC(60, 45, 90, 4);
const DC_80_160 = new DC(120, 80, 160, 5);
const DC_160_320 = new DC(240, 160, 320, 7);
const DC_320_380 = new DC(360, 320, 380, 8, "Z");

const AC_115 = new AC(115, 0.2, 0.2, 6);
const AC_230 = new AC(230, 0.2, 0.15, 8);
const AC_Dual = [ new AC(115, 0.2, 0.2, 9), new AC(230, 0.2, 0.15, 9) ];

const AC3_200 = new AC3(200, 0.2, 0.15, 6, "V");

const PC_115 = new AC_PFC(115, 0.2, 0.2, 6);
const PC_230 = new AC_PFC(230, 0.2, 0.15, 8);

const DC_5 = new DC(5, 4.5, 5.5, 0);
const DC_9 = new DC(9, 8, 10, 1);
const DC_12 = new DC(12, 11, 13, 2);
const DC_15 = new DC(15, 14, 16, 3);
const DC_24 = new DC(24, 23, 26, 4);
const DC_28 = new DC(28, 26, 30, 5);
const DC_48 = new DC(48, 45, 55, 9);
const DC_60 = new DC(60, 58, 68, 6);
const DC_110 = new DC(110, 100, 130, 7);
const DC_220 = new DC(220, 200, 250, 8);

const BC_12 = new BC(12, 12, 16, 1);
const BC_24 = new BC(24, 24, 32, 2);
const BC_48 = new BC(48, 48, 64, 4);
const BC_60 = new BC(60, 60, 80, 6);
const BC_110 = new BC(110, 110, 145, 7);
const BC_220 = new BC(220, 200, 290, 8);

const LPDC_out = [ DC_5, DC_9, DC_12, DC_15, DC_24, DC_28, DC_48, DC_60, DC_110, DC_220 ];
const LPBC_out = [ BC_12, BC_24, BC_48, BC_60, BC_110, BC_220 ];

class PSU_option {
	constructor(designation, description, pricing_fn) {
		this.designation = designation;
		this.description = description;
		this.pricing = pricing_fn;
	}
};

const tropicalProtection = new PSU_option(
	"t", "Tropical Protection",
	function (model) {
		switch ( model.series ) {
			case 200: case 300:
				return 28;
			
			case 500: case 2500:
				return 33;

			case 600: case 2600: case 1200: case 1300: 
			case 1500: case 3500: case 3700:
				return 56;

			case 1600: case 3600: case 3800: case 4500: 
			case 4700:
				return 94;

			case 4800: case 4900: case 5000: case 5100:
			case 5200: case 5300: case 5400: case 5500:
			case 5600: case 5700: case 5800: case 5900:
				return 153;

			case 6200: case 6300: case 6400: case 6500:
			case 6600: case 6700: case 6800:
				return 211;

			default: return null;
		}
	}
);

// ...
const inrushThermistor = new PSU_option(
	"i", "Inrush current limited by thermistor",
	function (model) {
		if ( model.input.type == "DC" ) {
			const current = ( model.output.max * model.output.current / model.input.min ) / 0.8;
			if ( current >= 30 ) return null;
			switch ( model.series ) {
				case 200: case 300: case 500: case 2500:
				case 600: case 2600: case 1200: case 1300: 
				case 1500: case 3500: case 3700:	
					return 12;

				case 1600: case 3600: case 3800: case 4500: 
				case 4700:
					return 16;

				case 4800: case 4900: case 5000: case 5100:
				case 5200: case 5300: case 5400: case 5500:
				case 5600: case 5700: case 5800: case 5900:
					return 23;

				default: return null;
			}
		}

		if ( model.input.type == "AC" ) {
			switch ( model.series ) {
				case 4800: case 5600: case 5700: case 5800:
					return 23;

				default: return null;
			}
		}

		return null;
	}
);

const decouplingDiode = new PSU_option(
	"dd", "Decoupling diode",
	function (model) {
		if ( model.output.current < 5 ) return 16;
		if ( model.output.current < 20 ) return 23;
		if ( model.output.current < 50 ) return 41;
		if ( model.output.current < 70 ) return 59;
		if ( model.output.current < 100 ) return 94;
		if ( model.output.current < 150 ) return 146;
		if ( model.output.current < 200 ) return 186;
		if ( model.output.current < 450 ) return 318;
		
		return null;
	}
);

const LP_option_list = [
	tropicalProtection,
	// ...
	inrushThermistor,
	decouplingDiode
];

var product_list = [];

// CH/CP/BP 200
const cx200_dimensions = {
	euro: { height: 3, width: 10, depth: 165, weight: 0.7 },
	rack: null,
	wall: null,
	chassis: { height: 138, width: 76, depth: 195, weight: 1.05 },
	DIN: { height: 109, width: 76, depth: 193.5, weight: 1.0 }
};

product_list.push([
	// DC/DC
	new series("CH", 2, 
		[ DC_18_36, DC_36_75, DC_45_90, DC_80_160, DC_160_320, DC_320_380 ],
		[ DC_5, DC_9, DC_12, DC_15, DC_24, DC_28, DC_48, DC_60 ],
		[ 20, 15, 12, 10, 6, 5, 3, 2.3 ],
		cx200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 398 }
	),
	// AC/DC
	new series("C", 2, 
		[ PC_115, PC_230 ],
		[ DC_5, DC_9, DC_12, DC_15, DC_24, DC_28, DC_48, DC_60 ],
		[ 20, 15, 12, 10, 6, 5, 3, 2.3 ],
		cx200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 398 }
	),
	// AC/Batt. Charger
	new series("B", 2,
		[ PC_115, PC_230 ],
		[ BC_12, BC_24, BC_48, BC_60 ],
		[ 10, 5, 2.6, 2 ],
		cx200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 398 }
	)
].flat());

// C/B 1200
const c1200_dimensions = {
	euro: { height: 6, width: 10, depth: 164, weight: 1.7 },
	rack: null,
	wall: { height: 360, width: 140, depth: 260, weight: 4.7 },
	chassis: { height: 295, width: 65, depth: 172.5, weight: 2.1 },
	DIN: null
};
product_list.push([
	// 10-16v
	new series("C", 12, 
		[DC_10_16], 
		LPDC_out, 
		[20, 12, 10, 8, 5, 4, 2.4, 2, 1, 0.5], 
		c1200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 451 }
	),

	// 18-36v
	new series("C", 12, 
		[DC_18_36], 
		LPDC_out, 
		[25, 15, 12.5, 10, 6, 5, 3, 2.5, 1.2, 0.6], 
		c1200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 451 }
	),

	new series("C", 12, 
		[DC_36_75, DC_45_90, DC_80_160, DC_160_320, DC_320_380, AC_115, AC_230], 
		LPDC_out, 
		[30, 18, 15, 12, 7.5, 6.5, 3.6, 3, 1.5, 0.8], 
		c1200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 451 }
	),

	new series("B", 12, 
		[AC_115, AC_230], 
		LPBC_out, 
		[12, 6, 3, 2.6, 1.4, 0.7], 
		c1200_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 451 }
	),
].flat());

	// C/B 500
const c500_dimensions = {
	euro: { height: 3, width: 21, depth: 166.5, weight: 1.7 },
	rack: null,
	wall: { height: 220, width: 140, depth: 180, weight: 3.2 },
	chassis: { height: 135, width: 125, depth: 205, weight: 2.1 },
	DIN: { height: 106, width: 125, depth: 200, weight: 2.05 }
};
product_list.push([
	// 10-16v
	new series("C", 5,
		[ DC_10_16 ],
		LPDC_out,
		[ 25, 17, 14, 11, 7, 6, 3.5, 3, 1.5, 0.8 ],
		c500_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 476 }
	),

	// 18-36v
	new series("C", 5,
		[ DC_18_36 ],
		LPDC_out,
		[ 30, 20, 16, 13,8, 7, 4, 3.5, 1.8, 0.9 ],
		c500_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 476 }
	),

	new series("C", 5,
		[ DC_36_75, DC_45_90, DC_80_160, DC_160_320, DC_320_380 ],
		LPDC_out,
		[ 35, 25, 20, 16, 10 ,8.5, 4.5, 3.7, 2, 1 ],
		c500_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 476 }
	),
	
	new series("C", 5,
		[ AC_115, AC_230, AC3_200 ],
		LPDC_out,
		[ 35, 25, 20, 16, 10 ,8.5, 4.5, 3.7, 2, 1 ],
		c500_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 476 }
	),

	new series("B", 5,
		[ AC_115, AC_230, AC3_200 ],
		LPBC_out,
		[ 16, 8, 4, 3.2, 2, 1 ],
		c500_dimensions, // packaging
		{}, // cooling
		LP_option_list,
		{}, // extra
		{ base_euro: 476 }
	),
].flat());

product_list = product_list.flat();

Object.freeze(product_list);

