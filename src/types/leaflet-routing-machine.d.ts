declare module 'leaflet' {
	import { LatLngExpression, Control } from 'leaflet';

	namespace Routing {
		function control(options: any): Control;
		function osrmv1(options: any): any;
	}
}

declare module 'leaflet-routing-machine' {
	import * as L from 'leaflet';
	const Routing: typeof L.Routing;
	export default Routing;
}
