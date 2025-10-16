import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { campusInfo, classesInfo } from '@/data/students';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InfoPage: React.FC = () => {

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const current = days[new Date().getDay()];

  return (
    <Layout>
      <div className="p-4 space-y-6 pb-20">
        <div className="text-center mb-6 mt-28">
          <h2 className="text-2xl font-bold text-foreground mb-1">Campus Info</h2>
          <p className="text-muted-foreground text-sm">
            Everything you need to know about campus
          </p>
        </div>

        {/* Classes Section with Tabs */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Classes
          </h3>
          <Tabs defaultValue={current} className="w-full">
            <TabsList className="grid w-full grid-cols-6 sm:grid-cols-6">
              {/* Create a tab trigger for each day */}
              {Object.keys(classesInfo.classes).map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Create the content panel for each day */}
            {Object.values(classesInfo.classes).map((dayInfo) => (
              <TabsContent key={dayInfo.day} value={dayInfo.day}>
                <div className="space-y-3 pt-4">
                  {dayInfo.subjects.length > 0 ? (
                    dayInfo.subjects.map((subject, index) => (
                      <Card key={`${dayInfo.day}-${index}`} className="p-4 bg-card border-border">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{subject.name}</h4>
                              <p className="text-sm text-muted-foreground">{subject.code}</p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">{subject.instructor}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {subject.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {subject.room}
                          </p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground pt-4">No classes scheduled for today.</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Events Section */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {campusInfo.events.map((event, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                <p className="text-sm text-foreground mb-2">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Facilities Section */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Facilities
          </h3>
          <div className="space-y-3">
            {campusInfo.facilities.map((facility, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">{facility.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {facility.timings}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {facility.location}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default InfoPage;