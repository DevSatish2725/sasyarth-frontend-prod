import { X } from "lucide-react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  height?: string;
  closeMap?: () => void;
}

export default function GoogleMap({
  longitude,
  latitude,
  height = "100vh",
  closeMap,
}: GoogleMapProps) {
  const mapUrl = `https://www.google.com/maps?q=${longitude},${latitude}&z=15&output=embed`;

  return (
    <div
      className="w-full overflow-hidden fixed top-0 left-0 z-50 bg-white"
      style={{ height }}
    >
      <div className="flex items-center justify-between bg-white p-2">
        <p>Farmer location</p>
        <X onClick={closeMap} />
      </div>
      <div style={{ height: `calc(${height} - 40px)` }} className="w-full">
        <iframe
          title="Farmer location"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
