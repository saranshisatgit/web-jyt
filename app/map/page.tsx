import React from 'react';
import { type Metadata } from 'next'
import { HeroSection } from "@/components/hero-section";
import { Container } from "@/components/container";
import MapView from './map-view';
import { getPersons } from './actions';

export const metadata: Metadata = {
  title: 'Jaal Yantra Textiles - Artisan Map',
  description:
    'Explore our network of talented artisans and technicians across the map.',
}

const MapPage = async () => {
  const persons = await getPersons();
  const headerBlock = {
    content: {
      title: 'Meet Our Artisans',
      subtitle: 'We are proud to work with a diverse and talented network of artisans. Explore the map to see where they are located and learn more about them.',
      announcement: '',
      buttons: [],
    },
  }
  const announcementBlock = { content: { announcement: '' } };

  return (
    <div className="overflow-hidden">
      <HeroSection headerBlock={headerBlock} announcementBlock={announcementBlock} />
      <main>
        <Container>
          <section className="mt-8">
              <div className="h-[600px] w-full overflow-hidden rounded-lg shadow-lg">
                  <MapView initialPersons={persons} />
              </div>
          </section>
        </Container>
      </main>
    </div>
  );
};

export default MapPage;

