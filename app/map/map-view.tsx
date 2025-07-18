'use client';

import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
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

type MetadataValue = string | number | boolean;
type Metadata = Record<string, MetadataValue>;

interface Person {
  id: string;
  first_name: string;
  last_name?: string | null;
  addresses: Address[];
  person_type?: { name: string };
  public_metadata?: Metadata;
}

interface MapViewProps {
  initialPersons: Person[];
}

type Filters = {
  person_type?: string;
  first_name?: string;
  last_name?: string;
  public_metadata?: Record<string, MetadataValue>;
};

type FilterOptions = {
  person_type: string[];
  public_metadata: Record<string, Set<MetadataValue>>;
};

// A more specific type for the object used to build filters
type FilterBuilder = {
  public_metadata?: Record<string, MetadataValue>;
  [key: string]: string | Record<string, MetadataValue> | undefined;
};

const MapView = ({ initialPersons }: MapViewProps) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [allPersons, setAllPersons] = useState<Person[]>(initialPersons);
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(20);
  const [activeFilters, setActiveFilters] = useState<{ field: string; value: string }[]>([]);
  const [newFilter, setNewFilter] = useState<{ field: string; value: string }>({ field: '', value: '' });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ person_type: [], public_metadata: {} });

  useEffect(() => {
    // Update the list of persons
    setAllPersons(initialPersons);

    // Dynamically derive filter options from the data
    const newFilterOptions: { person_type: Set<string>, public_metadata: Record<string, Set<MetadataValue>> } = { person_type: new Set<string>(), public_metadata: {} };
    initialPersons.forEach(person => {
      if (person.person_type?.name) {
        newFilterOptions.person_type.add(person.person_type.name);
      }
      if (person.public_metadata) {
        Object.keys(person.public_metadata).forEach(key => {
          const value = person.public_metadata![key];
          if (value) {
            if (!newFilterOptions.public_metadata[key]) {
              newFilterOptions.public_metadata[key] = new Set();
            }
            newFilterOptions.public_metadata[key].add(value);
          }
        });
      }
    });

    setFilterOptions(prev => ({
      person_type: Array.from(new Set([...prev.person_type, ...newFilterOptions.person_type])),
      public_metadata: {
        ...prev.public_metadata,
        ...Object.keys(newFilterOptions.public_metadata).reduce((acc, key) => {
          acc[key] = new Set([...(prev.public_metadata[key] || []), ...newFilterOptions.public_metadata[key]]);
          return acc;
        }, {} as Record<string, Set<MetadataValue>>)
      }
    }));
  }, [initialPersons]);

  const applyFilters = async (filtersToApply: { field: string; value: string }[]) => {
    const constructedFilters: FilterBuilder = { public_metadata: {} };
    const topLevelFields = ['person_type', 'first_name', 'last_name'];

    filtersToApply.forEach(({ field, value }) => {
      if (topLevelFields.includes(field)) {
        constructedFilters[field] = value;
      } else {
        if (constructedFilters.public_metadata) {
          constructedFilters.public_metadata[field] = value;
        }
      }
    });

    if (constructedFilters.public_metadata && Object.keys(constructedFilters.public_metadata).length === 0) {
      delete constructedFilters.public_metadata;
    }

    setIsLoading(true);
    const newPersons = await getPersons({ limit: loadCount, offset: 0, filters: constructedFilters as Filters });
    setAllPersons(newPersons);
    setIsLoading(false);
  };

  const addFilter = () => {
    if (!newFilter.field || !newFilter.value) return;
    const updatedFilters = [...activeFilters, newFilter];
    setActiveFilters(updatedFilters);
    setNewFilter({ field: '', value: '' });
    applyFilters(updatedFilters);
  };

  const removeFilter = (index: number) => {
    const updatedFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleLoadMore = async () => {
    const constructedFilters: FilterBuilder = { public_metadata: {} };
    const topLevelFields = ['person_type', 'first_name', 'last_name'];

    activeFilters.forEach(({ field, value }) => {
      if (topLevelFields.includes(field)) {
        constructedFilters[field] = value;
      } else {
        if (constructedFilters.public_metadata) {
          constructedFilters.public_metadata[field] = value;
        }
      }
    });

    if (constructedFilters.public_metadata && Object.keys(constructedFilters.public_metadata).length === 0) {
      delete constructedFilters.public_metadata;
    }

    setIsLoading(true);
    const newPersons = await getPersons({ limit: loadCount, offset: allPersons.length, filters: constructedFilters as Filters });
    setAllPersons(prev => [...prev, ...newPersons]);
    setIsLoading(false);
  };

  const resetFilters = () => {
    setActiveFilters([]);
    applyFilters([]);
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
      <div className="absolute top-4 left-4 z-10 w-72">
        {selectedPerson ? (
          // Details Panel
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg relative animate-fade-in">
            <button onClick={() => setSelectedPerson(null)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl">&times;</button>
            <h3 className="font-bold text-lg mb-2 border-b pb-2">{getFullName(selectedPerson)}</h3>
            <div className="space-y-1 text-sm text-gray-700 max-h-80 overflow-y-auto pr-2">
              {selectedPerson.person_type?.name && <p><span className="font-semibold">Type:</span> {selectedPerson.person_type.name}</p>}
              {selectedPerson.addresses[0]?.city && <p><span className="font-semibold">City:</span> {selectedPerson.addresses[0].city}</p>}
              {selectedPerson.addresses[0]?.postal_code && <p><span className="font-semibold">Postal Code:</span> {selectedPerson.addresses[0].postal_code}</p>}
              {selectedPerson.public_metadata && Object.entries(selectedPerson.public_metadata).map(([key, value]) => (
                <p key={key}><span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}</p>
              ))}
            </div>
            <button type="button" className="mt-4 w-full px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Contact Them
            </button>
          </div>
        ) : (
          // Filter Panel
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-lg font-bold mb-2">Filters</h2>
            <div className="space-y-1 mb-3">
              {activeFilters.map((filter, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md text-sm">
                  <span>{filter.field}: <strong>{filter.value}</strong></span>
                  <button onClick={() => removeFilter(index)} className="text-red-500 hover:text-red-700">✖</button>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <select className="w-full p-1 border rounded-md" value={newFilter.field} onChange={(e) => setNewFilter({ field: e.target.value, value: '' })}>
                <option value="">Select Field...</option>
                <option value="person_type">Person Type</option>
                {Object.keys(filterOptions.public_metadata).map(key => <option key={key} value={key}>{key}</option>)}
              </select>
              {newFilter.field && (
                <select className="w-full p-1 border rounded-md" value={newFilter.value} onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}>
                  <option value="">Select Value...</option>
                  {(newFilter.field === 'person_type' ? filterOptions.person_type : Array.from(filterOptions.public_metadata[newFilter.field] || [])).map(val => (
                    <option key={String(val)} value={String(val)}>{String(val)}</option>
                  ))}
                </select>
              )}
              <button onClick={addFilter} className="w-full bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">Add Filter</button>
              <button onClick={resetFilters} className="w-full bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400 mt-1">Reset All Filters</button>
            </div>
            <h2 className="text-lg font-bold mt-4 mb-2">Pagination</h2>
            <p className="text-sm text-gray-700 mb-3">Showing <span className="font-semibold">{allPersons.length}</span> locations.</p>
            <div className="flex items-center space-x-2">
              <input type="number" value={loadCount} onChange={(e) => setLoadCount(Number(e.target.value))} className="w-16 p-1 border rounded-md text-sm" />
              <button onClick={handleLoadMore} disabled={isLoading} className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400">
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </div>
        )}
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
              <button type="button" className="cursor-pointer bg-transparent border-none" onClick={(e) => { e.preventDefault(); setSelectedPerson(person); }}>
                <span role="img" aria-label="marker">📍</span>
              </button>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
};

export default MapView;
