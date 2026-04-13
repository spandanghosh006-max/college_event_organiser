import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/data/mockData';
import { useUserStore } from '@/hooks/useUserStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, ArrowRight, Calendar } from 'lucide-react';

const SavedEvents = () => {
  const { user, isLoggedIn, notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead } = useUserStore();
  
  const savedEvents = mockEvents.filter(event => 
    user?.savedEvents.includes(event.id)
  );

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Please Log In</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your saved events.
          </p>
          <Link to="/login">
            <Button variant="hero">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isLoggedIn 
        userName={user.name.split(' ')[0]}
        isAdmin={user.role === 'admin'}
      />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl font-bold">Saved Events</h1>
          </div>
          <p className="text-muted-foreground">
            Events you've saved for later. {savedEvents.length} event{savedEvents.length !== 1 ? 's' : ''} saved.
          </p>
        </motion.div>

        {savedEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="flat" className="bg-muted/50">
              <CardContent className="p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Saved Events Yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  When you find events you're interested in, click the save button to add them here for quick access.
                </p>
                <Link to="/events">
                  <Button variant="hero">
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Events
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedEvents;
