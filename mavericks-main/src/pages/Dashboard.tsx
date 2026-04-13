import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import AttendanceTracker from '@/components/AttendanceTracker';
import { mockEvents } from '@/data/mockData';
import { useUserStore } from '@/hooks/useUserStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Bell, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bookmark
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isLoggedIn, 
    notifications, 
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    login
  } = useUserStore();
  
  // Auto-login for demo purposes if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      login({
        name: 'Alex Johnson',
        email: 'alex@university.edu',
        department: 'Computer Science',
        year: '3rd Year',
        role: 'student',
        interests: ['Technology', 'Placements', 'Workshops'],
        attendance: 78,
      });
    }
  }, [isLoggedIn, login]);

  // Use a default user for display if not yet loaded
  const displayUser = user || {
    name: 'Guest',
    department: 'Computer Science',
    year: '3rd Year',
    interests: ['Technology'],
    savedEvents: [],
    registeredEvents: [],
    attendance: 78,
    role: 'student' as const,
  };
  
  // Filter events based on user profile
  const relevantEvents = mockEvents.filter(event => 
    event.departments.includes(displayUser.department) || 
    event.departments.includes('All Departments')
  );

  const highPriorityEvents = relevantEvents.filter(e => e.priority === 'high');
  const upcomingEvents = relevantEvents.slice(0, 4);

  const quickStats = [
    { label: 'Upcoming Events', value: relevantEvents.length, icon: Calendar, color: 'text-primary' },
    { label: 'High Priority', value: highPriorityEvents.length, icon: Bell, color: 'text-priority-high' },
    { label: 'Registered', value: displayUser.registeredEvents?.length || 0, icon: CheckCircle2, color: 'text-success' },
    { label: 'Saved', value: displayUser.savedEvents?.length || 0, icon: Bookmark, color: 'text-warning' }
  ];

  const firstName = displayUser.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isLoggedIn 
        userName={firstName}
        isAdmin={displayUser.role === 'admin'}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground">
                You have {highPriorityEvents.length} high-priority events requiring attention
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="category" className="px-3 py-1">
                {displayUser.department}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                {displayUser.year}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats + Attendance */}
        <div className="grid lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {quickStats.map((stat) => (
              <Card key={stat.label} variant="gradient" className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-background ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <AttendanceTracker 
              attendance={displayUser.attendance || 78}
              eventsAttended={Math.round((displayUser.attendance || 78) * 15 / 100)}
              totalEvents={15}
            />
          </motion.div>
        </div>

        {/* High Priority Alert */}
        {highPriorityEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-priority-high/30 bg-priority-high/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-priority-high text-white animate-pulse-soft">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-priority-high">Attention Required</h3>
                    <p className="text-sm text-muted-foreground">
                      {highPriorityEvents.length} high-priority event{highPriorityEvents.length !== 1 ? 's' : ''} need your attention
                    </p>
                  </div>
                  <Link to="/events">
                    <Button variant="destructive" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Notifications */}
        {unreadNotificationsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8"
          >
            <Card variant="flat" className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Recent Notifications
                  </h3>
                  <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                    Mark all as read
                  </Button>
                </div>
                <div className="space-y-2">
                  {notifications.filter(n => !n.read).slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id}
                      className="flex items-start gap-3 p-2 rounded-lg bg-background/50 cursor-pointer hover:bg-background/80 transition-colors"
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Events Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Events For You</h2>
            </div>
            <Link to="/events">
              <Button variant="ghost" size="sm">
                View All Events
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        {/* Personalization Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card variant="flat" className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Personalized For You</h3>
                  <p className="text-sm text-muted-foreground">
                    Events are filtered based on your department ({displayUser.department}), 
                    year ({displayUser.year}), and interests ({displayUser.interests?.join(', ') || 'Not set'}). 
                    Update your profile to see different events.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
