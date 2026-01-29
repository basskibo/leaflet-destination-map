import * as L from 'leaflet';

declare module 'leaflet' {
	namespace Control {
		interface LocateOptions {
			setView?: boolean | string;
			flyTo?: boolean;
			watch?: boolean;
			setMarkerStyle?: L.PathOptions;
			drawCircle?: boolean;
			drawMarker?: boolean;
			markerClass?: any;
			markerStyle?: L.PathOptions;
			circleStyle?: L.PathOptions;
			followCircleStyle?: L.PathOptions;
			followMarkerStyle?: L.PathOptions;
			icon?: string;
			iconLoading?: string;
			iconElementTag?: string;
			circlePadding?: [number, number];
			onLocationError?: (error: any, control: Locate) => void;
			onLocationOutsideMapBounds?: (control: Locate, event: any) => void;
			showPopup?: boolean;
			strings?: {
				title?: string;
				metersUnit?: string;
				feetUnit?: string;
				popup?: string;
				outsideMapBoundsMsg?: string;
				permissionDeniedMsg?: string;
				locateOptions?: {
					maxZoom?: number;
					watch?: boolean;
					setView?: boolean;
					enableHighAccuracy?: boolean;
					timeout?: number;
					maximumAge?: number;
				};
			};
			locateOptions?: {
				maxZoom?: number;
				watch?: boolean;
				setView?: boolean;
				enableHighAccuracy?: boolean;
				timeout?: number;
				maximumAge?: number;
			};
		}

		class Locate extends L.Control {
			constructor(options?: LocateOptions);
			start(): void;
			stop(): void;
			setView(): void;
		}
	}

	namespace control {
		function locate(options?: Control.LocateOptions): Control.Locate;
	}
}

