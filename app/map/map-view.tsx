'use client';

import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import { getPersons } from './actions';
import 'mapbox-gl/dist/mapbox-gl.css';

// IMPORTANT: Replace this with your actual Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

interface Address {
  latitude: number;
  longitude: number;
  city?: string;
  postal_code?: string;
}

interface Person {
  id: string;
  first_name: string;
  last_name?: string | null;
  addresses: Address[];
}

interface MapViewProps {
  initialPersons: Person[];
}

const MapView = ({ initialPersons }: MapViewProps) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [allPersons, setAllPersons] = useState<Person[]>(initialPersons);
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(20);

  useEffect(() => {
    setAllPersons(initialPersons);
  }, [initialPersons]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const newPersons = await getPersons({ limit: loadCount, offset: allPersons.length });
    setAllPersons(prev => [...prev, ...newPersons]);
    setIsLoading(false);
  };

  // Custom styles for the map controls to make them a floating card
  const navControlStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: '5px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  };
  const [viewport, setViewport] = useState({
    latitude: 28.6139, // Default to New Delhi
    longitude: 77.2090,
    zoom: 4,
  });

  const getFullName = (person: Person) => {
    return `${person.first_name} ${person.last_name && person.last_name !== 'null' ? person.last_name : ''}`.trim();
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-64">
        <h2 className="text-lg font-bold mb-2">Controls</h2>
        <p className="text-sm text-gray-700 mb-3">Showing <span className="font-semibold">{allPersons.length}</span> locations.</p>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="number" 
              value={loadCount} 
              onChange={(e) => setLoadCount(Number(e.target.value))}
              className="w-16 p-1 border rounded-md text-sm"
            />
            <button 
              onClick={handleLoadMore} 
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        </div>
      </div>
      <Map
          {...viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={evt => setViewport(evt.viewState)}
        >
          <NavigationControl style={navControlStyle} />
          {allPersons.map(person => {
            const firstAddress = person.addresses?.[0];
            if (!firstAddress) return null;

            return (
              <Marker key={person.id} latitude={firstAddress.latitude} longitude={firstAddress.longitude}>
                <button
                  type="button"
                  className="cursor-pointer bg-transparent border-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPerson(person);
                  }}
                >
                  <span role="img" aria-label="marker">📍</span>
                </button>
              </Marker>
            );
          })}

          {selectedPerson && selectedPerson.addresses?.[0] && (
            <Popup
              latitude={selectedPerson.addresses[0].latitude}
              longitude={selectedPerson.addresses[0].longitude}
              onClose={() => setSelectedPerson(null)}
              closeOnClick={false}
              anchor="top"
            >
              <div className="p-2">
                <h3 className="font-bold text-md">{getFullName(selectedPerson)}</h3>
                <button 
                  type="button"
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Contact them
                </button>
              </div>
            </Popup>
          )}
        </Map>
    </div>
  );
};

export default MapView;
