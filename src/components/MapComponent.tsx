import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Organization, Donation, VolunteerProfile } from '../types';

interface MapComponentProps {
  organizations: Organization[];
  donations: Donation[];
  volunteer?: VolunteerProfile;
  selectedDonationId?: string;
  onSelectDonation?: (donationId: string) => void;
  center?: [number, number];
  zoom?: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  organizations,
  donations,
  volunteer,
  selectedDonationId,
  onSelectDonation,
  center = [13.3530, 74.7920], // Campus default (Manipal)
  zoom = 14
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Don't destroy map on every small prop change, just update markers
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. Food Provider Markers (Green Pins)
    const providers = organizations.filter(o => o.type !== 'ngo' && o.type !== 'shelter');
    providers.forEach(p => {
      // Check if provider has active open donation
      const activeDonations = donations.filter(d => d.providerOrgId === p.id && d.status === 'OPEN');
      const hasUrgent = activeDonations.some(d => d.urgency === 'URGENT' || d.urgency === 'CRITICAL');

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-full ${hasUrgent ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'} text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-sm">
              🍲
            </div>
            ${activeDonations.length > 0 ? `
              <span class="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                ${activeDonations.reduce((sum, d) => sum + d.servingsListed, 0)}
              </span>
            ` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([p.lat, p.lng], { icon: customIcon });
      
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; min-width: 180px;">
          <strong style="font-size: 13px; color: #0f172a;">${p.name}</strong>
          <p style="color: #64748b; margin: 2px 0 6px 0;">${p.address}</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 6px; margin-top: 4px;">
            <span style="font-weight: 700; color: #166534;">${activeDonations.length} Active Donation${activeDonations.length === 1 ? '' : 's'}</span>
            ${activeDonations.map(d => `<div style="margin-top: 3px; color: #15803d;">• ${d.foodName} (${d.servingsListed} meals)</div>`).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(layer);
    });

    // 2. NGO Markers (Blue / Purple Pins)
    const ngos = organizations.filter(o => o.type === 'ngo' || o.type === 'shelter');
    ngos.forEach(ngo => {
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-sm">
            🏢
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([ngo.lat, ngo.lng], { icon: customIcon });
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; min-width: 170px;">
          <strong style="font-size: 13px; color: #1e3a8a;">${ngo.name}</strong>
          <p style="color: #64748b; margin: 2px 0 4px 0;">${ngo.address}</p>
          <div style="color: #3b82f6; font-weight: 600;">Capacity: ${ngo.capacityServings || 100} servings/day</div>
          <div style="color: #10b981; font-size: 11px;">✓ Verified Partner NGO</div>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.addTo(layer);
    });

    // 3. Volunteer Marker (Orange Pin)
    if (volunteer && volunteer.available) {
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-sm">
            🚴
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([volunteer.lat, volunteer.lng], { icon: customIcon });
      marker.bindPopup(`
        <div style="font-size: 12px;">
          <strong style="color: #c2410c;">${volunteer.name}</strong>
          <p style="color: #64748b; margin: 2px 0;">Active Campus Volunteer (Radius: ${volunteer.maxDistanceKm}km)</p>
          <span style="color: #16a34a; font-weight: bold;">Status: Available for pickup</span>
        </div>
      `);
      marker.addTo(layer);
    }

  }, [organizations, donations, volunteer]);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-soft">
      {/* Legend Badge */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur px-3 py-2 rounded-xl shadow-card border border-slate-200/80 text-[11px] font-semibold flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Food Provider
        </span>
        <span className="flex items-center gap-1.5 text-blue-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Partner NGO
        </span>
        <span className="flex items-center gap-1.5 text-orange-700">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Volunteer
        </span>
      </div>

      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
