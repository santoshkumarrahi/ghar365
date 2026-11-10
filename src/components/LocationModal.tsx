import React, { useState } from 'react';
import { MapPin, X, Check, Building2, Compass, AlertTriangle } from 'lucide-react';
import { PAKISTAN_LOCATIONS } from '../data/pakistanLocations';
import { useApp } from '../context/AppContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { selectedProvince, selectedCity, selectedArea, setLocation, settings } = useApp();

  const [province, setProvince] = useState(selectedProvince);
  const [district, setDistrict] = useState('Tharparkar');
  const [city, setCity] = useState(selectedCity);
  const [area, setArea] = useState(selectedArea);

  if (!isOpen) return null;

  const currentProvinceData = PAKISTAN_LOCATIONS.find((p) => p.name === province) || PAKISTAN_LOCATIONS[0];
  const allDistricts = currentProvinceData.districts;
  const currentDistrictData = allDistricts.find((d) => d.name === district) || allDistricts[0];
  const allCities = currentDistrictData?.cities || [];
  const currentCityData = allCities.find((c) => c.name === city) || allCities[0];
  const allAreas = currentCityData?.areas || [];

  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const pData = PAKISTAN_LOCATIONS.find((p) => p.name === newProv);
    if (pData && pData.districts.length > 0) {
      const dData = pData.districts[0];
      setDistrict(dData.name);
      if (dData.cities.length > 0) {
        const cData = dData.cities[0];
        setCity(cData.name);
        if (cData.areas.length > 0) {
          setArea(cData.areas[0]);
        }
      }
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const dData = currentProvinceData.districts.find((d) => d.name === newDist);
    if (dData && dData.cities.length > 0) {
      const cData = dData.cities[0];
      setCity(cData.name);
      if (cData.areas.length > 0) {
        setArea(cData.areas[0]);
      }
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const cData = allCities.find((c) => c.name === newCity);
    if (cData && cData.areas.length > 0) {
      setArea(cData.areas[0]);
    }
  };

  const handleConfirm = () => {
    setLocation(province, city, area);
    onClose();
  };

  // Check if chosen city is Mithi vs other
  const isIntercityNotice = city.toLowerCase() !== 'mithi' && !settings.intercityEnabled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#126B45] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F2B84B]" />
            <h3 className="font-bold text-lg">Select Your Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-gray-600">
            Ghar365 connects you with verified neighborhood shops in your city. Select your exact location to see available local sellers.
          </p>

          {/* Quick select buttons for quick testing */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">
              Quick Test Locations:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setProvince('Sindh');
                  setDistrict('Tharparkar');
                  setCity('Mithi');
                  setArea('Shahi Bazaar');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                  city === 'Mithi'
                    ? 'bg-emerald-50 text-[#126B45] border-[#126B45] font-semibold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Mithi (Tharparkar) [Active Hub]
              </button>
              <button
                type="button"
                onClick={() => {
                  setProvince('Sindh');
                  setDistrict('Karachi Central & South');
                  setCity('Karachi');
                  setArea('Clifton Block 2');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                  city === 'Karachi'
                    ? 'bg-emerald-50 text-[#126B45] border-[#126B45] font-semibold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Karachi (Test Local Delivery Block)
              </button>
            </div>
          </div>

          {/* Province */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">1. Province / Region</label>
            <select
              value={province}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126B45] text-sm"
            >
              {PAKISTAN_LOCATIONS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">2. District</label>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126B45] text-sm"
            >
              {allDistricts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">3. City / Town</label>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126B45] text-sm"
            >
              {allCities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Town / Area */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">4. Local Area / Neighborhood</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126B45] text-sm"
            >
              {allAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {isIntercityNotice && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Local Delivery Notice:</strong> You selected <strong>{city}</strong>. Mithi shopkeepers cannot deliver across cities while intercity delivery is turned off by Super Admin.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#126B45] text-white rounded-lg text-sm font-semibold hover:bg-[#0e5235] transition flex items-center gap-1.5 shadow"
          >
            <Check className="w-4 h-4" /> Save Location
          </button>
        </div>
      </div>
    </div>
  );
};
