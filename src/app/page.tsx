import ClientApp from "@/components/ClientApp";
import placesData from "@/data/places.json";
import type { Place } from "@/types";

export default function Page() {
  const places = placesData as Place[];
  return <ClientApp initialPlaces={places} />;
}
