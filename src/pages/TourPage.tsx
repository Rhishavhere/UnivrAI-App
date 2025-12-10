import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, ChevronRight } from 'lucide-react';
import { campusInfo } from '@/data/students';
import Layout from '@/components/Layout';

const TourPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-4 space-y-6 pb-20">
        <div className="text-center mb-6 mt-28">
          <h2 className="text-2xl font-bold text-foreground mb-1">Campus Tour</h2>
          <p className="text-muted-foreground text-sm">
            Explore our beautiful campus
          </p>
        </div>

        {/* Virtual Tour Banner */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground border-0">
          <h3 className="text-xl font-bold mb-2">Virtual Campus Tour</h3>
          <p className="text-sm opacity-90 mb-4">
            Discover the best spots on campus with our AI-powered tour guide
          </p>
          <p className="text-xs opacity-75">
            Ask me about any location using the voice assistant on the Home page!
          </p>
        </Card>

        {/* Tour Spots */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            Must-Visit Spots
          </h3>
          <div className="space-y-3">
            {campusInfo.tourSpots.map((spot, index) => (
              <Card
                key={index}
                className="p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                        {index + 1}
                      </span>
                      {spot.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{spot.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tour Tips */}
        <Card className="p-6 bg-gradient-to-br from-secondary/50 to-background border-l-4 border-l-accent">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
             <span className="text-2xl">💡</span> Tour Tips
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Start your tour at the Main Entrance Gate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Best time to visit: Early morning or evening</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Use the voice assistant to get detailed information about each location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Don't miss the Innovation Lab and Sports Complex</span>
            </li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};

export default TourPage;
