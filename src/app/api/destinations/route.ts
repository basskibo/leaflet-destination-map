import { NextResponse } from 'next/server';

// Mock data for destinations
const destinations = [
	{ name: "Paris", lat: 48.8566, lon: 2.3522 },
	{ name: "New York", lat: 40.7128, lon: -74.0060 },
	{ name: 'Novi Sad', lat: 45.2398, lon: 19.8227},
	{ name: 'Novi Sad 2', lat: 45.2388, lon: 19.4267},
	{ name: "Tokyo", lat: 35.6762, lon: 139.6503 },
	{ name: "Bangkok", lat: 13.6854, lon: 100.6114 },
];

// This will handle GET requests to /api/destinations
export async function GET() {
  return NextResponse.json(destinations);
}
