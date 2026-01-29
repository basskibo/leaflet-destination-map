import * as L from 'leaflet';

declare module 'leaflet' {
	namespace Routing {
		interface RoutingControlOptions {
			waypoints?: L.LatLng[];
			router?: any;
			lineOptions?: {
				styles?: Array<{
					color?: string;
					opacity?: number;
					weight?: number;
					dashArray?: string;
				}>;
			};
			createMarker?: (i: number, wp: any) => L.Marker | null;
			routeWhileDragging?: boolean;
			draggableWaypoints?: boolean;
			addWaypoints?: boolean;
			show?: boolean;
		}

		interface RoutingControl extends L.Control {
			setWaypoints(waypoints: L.LatLng[]): void;
		}

		function control(options: RoutingControlOptions): RoutingControl;
		function osrmv1(options: { serviceUrl: string }): any;
	}
}

declare module 'leaflet-routing-machine' {
	import * as L from 'leaflet';
	export default L.Routing;
}
