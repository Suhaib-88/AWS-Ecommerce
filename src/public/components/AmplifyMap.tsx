import React, { useEffect, useRef, useState } from 'react';
import mapbox from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchAuthSession } from 'aws-amplify/auth';
import Location from "@/location/Location";
import { signRequest } from '../../util/signer';

const resourceName = import.meta.env.VITE_LOCATION_RESOURCE_NAME;
const locationApi = new Location();

interface AmplifyMapProps {
  devicePositions: [number, number][];
  routes: [number, number][][];
  storePosition: [number, number];
  zoom: number;
}

const AmplifyMap: React.FC<AmplifyMapProps> = ({
  devicePositions = [],
  routes = [],
  storePosition = [0, 0],
  zoom = 14,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapbox.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [creds, setCreds] = useState<any>(null);

  useEffect(() => {
    const getCreds = async () => {
      const { credentials } = await fetchAuthSession();
      setCreds(credentials);
    };

    getCreds();
  }, []);

  useEffect(() => {
    if (creds && mapContainerRef.current) {
      const mapInstance = new mapbox.Map({
        attributionControl: false,
        center: storePosition,
        container: mapContainerRef.current,
        transformRequest: transformMapboxRequest,
        style: `geo://${resourceName}`,
        zoom: zoom,
      });

      mapInstance.once('load', () => {
        setMapLoaded(true);
        mapInstance.resize();
        loadGeofence(mapInstance);
        renderCustomerPositions(mapInstance);
        renderStorePosition(mapInstance);
        renderCustomerRoutes(mapInstance);
      });

      setMap(mapInstance);
    }
  }, [creds, storePosition, zoom]);

  useEffect(() => {
    if (mapLoaded) {
      renderCustomerPositions(map);
    }
  }, [devicePositions]);

  useEffect(() => {
    if (mapLoaded) {
      renderStorePosition(map);
    }
  }, [storePosition]);

  const transformMapboxRequest = (url: string, resourceType: string) => {
    let newUrl = url;
    const resourceTypeAccept: Record<string, string> = {
      Style: 'application/json',
      Tile: 'application/octet-stream',
      SpriteImage: 'image/webp,*/*',
      Glyphs: 'application/octet-stream',
    };
    const headers = {
      accept: resourceTypeAccept[resourceType] || 'application/json',
    };

    if (resourceType === 'Style' && newUrl.startsWith('geo://')) {
      const [, resourceName] = newUrl.split('geo://');
      newUrl = `https://maps.geo.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/maps/v0/maps/${resourceName}/style-descriptor`;
    }

    if (!newUrl.includes('amazonaws.com')) {
      return {
        url: newUrl,
        headers,
      };
    }

    const signedRequest = signRequest(
      { headers, method: 'GET', url: new URL(newUrl) },
      {
        credentials: creds,
        signingRegion: import.meta.env.VITE_AWS_REGION,
        signingService: 'geo',
      }
    );

    return {
      url: newUrl,
      headers: signedRequest.headers,
    };
  };

  const loadGeofence = async (mapInstance: mapbox.Map) => {
    const geofences = await locationApi.getGeofences();
    const source = mapInstance.getSource('geofences') as mapbox.GeoJSONSource;

    if (source && !geofences.length) {
      mapInstance.removeLayer('geofences');
      mapInstance.removeSource('geofences');
      return;
    }

    const data = {
      type: 'FeatureCollection',
      features: geofences.Entries.map((feature: any) => ({
        id: feature.GeofenceId,
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: feature.Geometry.Polygon,
        },
        properties: {},
      })),
    };

    if (source) {
      source.setData(data);
    } else {
      mapInstance.addSource('geofences', { type: 'geojson', data });
      mapInstance.addLayer({
        id: 'geofences',
        filter: ['==', '$type', 'Polygon'],
        paint: { 'fill-color': '#0073bb', 'fill-opacity': 0.15 },
        source: 'geofences',
        type: 'fill',
      });
    }
  };

  const renderCustomerPositions = (mapInstance: mapbox.Map | null) => {
    if (!mapInstance || !mapInstance.isStyleLoaded() || !devicePositions.length) {
      return;
    }
    const source = mapInstance.getSource('devices') as mapbox.GeoJSONSource;
    if (source && !devicePositions) {
      mapInstance.removeLayer('devices');
      mapInstance.removeSource('devices');
      return;
    }

    const data = {
      type: 'FeatureCollection',
      features: devicePositions.map((position) => ({
        geometry: {
          coordinates: position,
          type: 'Point',
        },
        type: 'Feature',
      })),
    };

    if (source) {
      source.setData(data);
    } else {
      mapInstance.addSource('devices', { type: 'geojson', data });
      mapInstance.addLayer({
        id: 'devices',
        paint: { 'circle-radius': 12, 'circle-color': '#B42222' },
        source: 'devices',
        type: 'circle',
      });
    }
  };

  const renderStorePosition = (mapInstance: mapbox.Map | null) => {
    if (!mapInstance) {
      return;
    }
    const source = mapInstance.getSource('stores') as mapbox.GeoJSONSource;
    if (source && storePosition) {
      mapInstance.removeLayer('stores');
      mapInstance.removeSource('stores');
      return;
    }

    const data = {
      type: 'Feature',
      geometry: {
        coordinates: storePosition,
        type: 'Point',
      },
    };
    if (source) {
      source.setData(data);
    } else {
      mapInstance.addSource('stores', { type: 'geojson', data });
      mapInstance.addLayer({
        id: 'stores',
        paint: { 'circle-radius': 12, 'circle-color': '#2242b4' },
        source: 'stores',
        type: 'circle',
      });
    }
  };

  const renderCustomerRoutes = (mapInstance: mapbox.Map | null) => {
    if (!mapInstance || !routes.length) {
      return;
    }
    const source = mapInstance.getSource('routes') as mapbox.GeoJSONSource;
    if (source && routes) {
      mapInstance.removeLayer('routes');
      mapInstance.removeSource('routes');
      return;
    }

    const data = {
      type: 'FeatureCollection',
      features: routes.map((route) => ({
        geometry: {
          coordinates: route,
          type: 'LineString',
        },
        type: 'Feature',
      })),
    };
    if (source) {
      source.setData(data);
    } else {
      mapInstance.addSource('routes', { type: 'geojson', data });
      mapInstance.addLayer({
        id: 'routes',
        paint: { 'line-color': '#49b03e', 'line-width': 2 },
        source: 'routes',
        type: 'line',
      });
    }
  };

  return <div id="mapContainer" ref={mapContainerRef} className="large-map"></div>;
};

export default AmplifyMap;