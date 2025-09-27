import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Status() {
  const services = [
    { name: 'Website', status: 'operational', uptime: '99.98%' },
    { name: 'API', status: 'operational', uptime: '99.95%' },
    { name: 'Database', status: 'operational', uptime: '99.99%' },
    { name: 'File Storage', status: 'operational', uptime: '99.97%' },
    { name: 'Search', status: 'operational', uptime: '99.94%' },
    { name: 'Authentication', status: 'operational', uptime: '99.99%' }
  ];

  const incidents = [
    {
      date: 'March 15, 2024',
      time: '14:30 UTC',
      status: 'resolved',
      title: 'Brief API slowdown resolved',
      description: 'Some users experienced slower API response times. Issue was resolved by scaling infrastructure.'
    },
    {
      date: 'March 10, 2024', 
      time: '09:15 UTC',
      status: 'resolved',
      title: 'Scheduled maintenance completed',
      description: 'Database maintenance completed successfully with no service disruption.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'outage': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'outage': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Activity className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            System Status
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-xl text-green-600 font-semibold">All Systems Operational</span>
          </div>
          <p className="text-muted-foreground">
            Real-time status of CodeHut services and infrastructure
          </p>
        </div>
      </section>

      {/* Overall Metrics */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.98%</div>
              <div className="text-muted-foreground">Uptime (30 days)</div>
            </div>
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">124ms</div>
              <div className="text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-muted-foreground">Active Incidents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Service Status</h2>
          <div className="bg-card border rounded-lg overflow-hidden">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-6 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <span className={`text-sm capitalize ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{service.uptime}</div>
                  <div className="text-xs text-muted-foreground">30-day uptime</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Recent Incidents</h2>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">{incident.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{incident.date}</span>
                        <span>•</span>
                        <span>{incident.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Resolved
                  </span>
                </div>
                <p className="text-muted-foreground">{incident.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="text-primary hover:text-primary/80 transition-colors">
              View All Incidents →
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to get notified about service updates and maintenance windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}