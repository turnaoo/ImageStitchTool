export namespace main {
	
	export class ImageInfo {
	    path: string;
	    name: string;
	    width: number;
	    height: number;
	    timestamp: number;
	    data?: number[];
	    dataBase64?: string;
	
	    static createFrom(source: any = {}) {
	        return new ImageInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.name = source["name"];
	        this.width = source["width"];
	        this.height = source["height"];
	        this.timestamp = source["timestamp"];
	        this.data = source["data"];
	        this.dataBase64 = source["dataBase64"];
	    }
	}
	export class LayoutConfig {
	    type: string;
	    cols: number;
	    rows: number;
	    spacing: number;
	    padding: number;
	    cornerRadius: number;
	    bgType: string;
	    bgSolidColor: string;
	    bgGradientFrom: string;
	    bgGradientTo: string;
	    bgBlur: number;
	    fitType: string;
	
	    static createFrom(source: any = {}) {
	        return new LayoutConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.cols = source["cols"];
	        this.rows = source["rows"];
	        this.spacing = source["spacing"];
	        this.padding = source["padding"];
	        this.cornerRadius = source["cornerRadius"];
	        this.bgType = source["bgType"];
	        this.bgSolidColor = source["bgSolidColor"];
	        this.bgGradientFrom = source["bgGradientFrom"];
	        this.bgGradientTo = source["bgGradientTo"];
	        this.bgBlur = source["bgBlur"];
	        this.fitType = source["fitType"];
	    }
	}
	export class Position {
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	
	    static createFrom(source: any = {}) {
	        return new Position(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.width = source["width"];
	        this.height = source["height"];
	    }
	}
	export class PosterTemplate {
	    name: string;
	    layout: LayoutConfig;
	    positions: Position[];
	
	    static createFrom(source: any = {}) {
	        return new PosterTemplate(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.layout = this.convertValues(source["layout"], LayoutConfig);
	        this.positions = this.convertValues(source["positions"], Position);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

