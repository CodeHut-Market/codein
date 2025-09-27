import { ArrowRight, Briefcase, Clock, MapPin, Star, Users } from 'lucide-react';

export default function Careers() {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      experience: "5+ years",
      featured: true
    },
    {
      id: 2,
      title: "DevOps Engineer",
      department: "Infrastructure", 
      location: "Remote",
      type: "Full-time",
      experience: "3+ years"
    },
    {
      id: 3,
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "New York, NY / Remote",
      type: "Full-time", 
      experience: "4+ years"
    },
    {
      id: 4,
      title: "Community Manager",
      department: "Community",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years"
    }
  ];

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Industry-leading compensation packages with equity options"
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance, dental, vision, and wellness stipends"
    },
    {
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and home office stipends"
    },
    {
      title: "Learning & Growth",
      description: "$2000 annual learning budget for conferences, courses, and books"
    },
    {
      title: "Paid Time Off",
      description: "Unlimited PTO policy with minimum 3 weeks encouraged"
    },
    {
      title: "Top Equipment",
      description: "Latest MacBook Pro, monitor, and any tools you need to be productive"
    }
  ];

  const values = [
    {
      title: "Developer-First",
      description: "We're built by developers, for developers. Every decision prioritizes the developer experience."
    },
    {
      title: "Open & Transparent",
      description: "We believe in open communication, transparent processes, and sharing knowledge freely."
    },
    {
      title: "Quality Over Quantity",
      description: "We focus on building the best possible product rather than rushing features to market."
    },
    {
      title: "Community Driven",
      description: "Our community guides our direction. We listen, respond, and build together."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Briefcase className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Help us build the future of code sharing and empower millions of developers worldwide. 
            Join a team that's passionate about creating amazing developer experiences.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-muted-foreground">Employee Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className={`bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                job.featured ? 'ring-2 ring-primary' : ''
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      {job.featured && (
                        <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 md:mb-0">
                      <span className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.department}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <span>Apply Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Don't see a perfect fit?</p>
            <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
              Send Us Your Resume
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join CodeHut?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-background p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-primary mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shape the Future?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join us in building the platform that empowers developers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              View All Openings
            </button>
            <button className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Learn About Our Culture
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}