import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { mockUser } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { departments, categories, academicYears } from '@/types/event';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Upload, 
  Link2, 
  AlertCircle,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminCreateEvent = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    onlineLink: '',
    category: '',
    priority: 'medium',
    registrationDeadline: '',
    capacity: ''
  });

  const toggleDepartment = (dept: string) => {
    if (dept === 'All Departments') {
      setSelectedDepartments(['All Departments']);
    } else {
      setSelectedDepartments(prev => {
        const filtered = prev.filter(d => d !== 'All Departments');
        if (filtered.includes(dept)) {
          return filtered.filter(d => d !== dept);
        }
        return [...filtered, dept];
      });
    }
  };

  const toggleYear = (year: string) => {
    if (year === 'All Years') {
      setSelectedYears(['All Years']);
    } else {
      setSelectedYears(prev => {
        const filtered = prev.filter(y => y !== 'All Years');
        if (filtered.includes(year)) {
          return filtered.filter(y => y !== year);
        }
        return [...filtered, year];
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Event Created!",
      description: "Your event has been created and notifications sent to relevant users.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn isAdmin userName={mockUser.name.split(' ')[0]} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Create New Event</h1>
            <p className="text-muted-foreground">
              Fill in the details below to create a new event. Relevant users will be notified automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Event title and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Annual Tech Fest 2026"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the event, its purpose, and what attendees can expect..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority Level *</Label>
                    <Select 
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-priority-high" />
                            High - Instant notification
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-priority-medium" />
                            Medium - Dashboard + email
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-priority-low" />
                            Low - Dashboard only
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date, Time & Venue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Date, Time & Venue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Event Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Registration Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                  <Checkbox
                    id="isOnline"
                    checked={isOnline}
                    onCheckedChange={(checked) => setIsOnline(checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="isOnline" className="cursor-pointer">This is an online event</Label>
                    <p className="text-xs text-muted-foreground">Check if the event will be conducted virtually</p>
                  </div>
                </div>

                {isOnline ? (
                  <div className="space-y-2">
                    <Label htmlFor="onlineLink">Meeting Link *</Label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="onlineLink"
                        type="url"
                        placeholder="https://zoom.us/j/..."
                        value={formData.onlineLink}
                        onChange={(e) => setFormData(prev => ({ ...prev, onlineLink: e.target.value }))}
                        className="h-11 pl-10"
                        required={isOnline}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="venue"
                        placeholder="e.g., Main Auditorium, Block A"
                        value={formData.venue}
                        onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                        className="h-11 pl-10"
                        required={!isOnline}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="h-11 w-48"
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>Only users matching these criteria will be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Departments *</Label>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((dept) => (
                      <Badge
                        key={dept}
                        variant={selectedDepartments.includes(dept) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => toggleDepartment(dept)}
                      >
                        {selectedDepartments.includes(dept) && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Years *</Label>
                  <div className="flex flex-wrap gap-2">
                    {academicYears.map((year) => (
                      <Badge
                        key={year}
                        variant={selectedYears.includes(year) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => toggleYear(year)}
                      >
                        {selectedYears.includes(year) && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {year}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Upload event posters, PDFs, or other documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
                <Plus className="h-5 w-5" />
                Create Event
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto">
                Save as Draft
              </Button>
              <p className="text-xs text-muted-foreground sm:ml-auto">
                Notifications will be sent based on priority level
              </p>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminCreateEvent;
