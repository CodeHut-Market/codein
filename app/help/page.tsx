import { Book, HelpCircle, Mail, MessageCircle, Search } from 'lucide-react';

export default function Help() {
  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "You can sign up using your email address or GitHub account. Click 'Get Started' and follow the simple registration process."
        },
        {
          question: "Is CodeHut free to use?",
          answer: "Yes! CodeHut offers a generous free tier that includes uploading, browsing, and downloading code snippets. Premium features are available for advanced users."
        },
        {
          question: "How do I upload my first code snippet?",
          answer: "After signing in, click the 'Upload' button in the navigation. Add your code, description, tags, and choose visibility settings."
        }
      ]
    },
    {
      title: "Using CodeHut",
      faqs: [
        {
          question: "How do I search for specific code snippets?",
          answer: "Use our advanced search with filters for language, tags, popularity, and date. You can also browse by categories or use our AI-powered search suggestions."
        },
        {
          question: "Can I organize my snippets into collections?",
          answer: "Yes! Create collections to organize your snippets by project, technology, or any custom category. Collections can be public or private."
        },
        {
          question: "How does the favoriting system work?",
          answer: "Click the heart icon on any snippet to add it to your favorites. You can access all your favorites from your dashboard for quick reference."
        }
      ]
    },
    {
      title: "Account & Settings",
      faqs: [
        {
          question: "How do I change my profile information?",
          answer: "Go to Settings > Profile to update your name, bio, avatar, and other profile details. Changes are saved automatically."
        },
        {
          question: "Can I make my profile private?",
          answer: "Yes, you can control your profile visibility in Settings > Privacy. You can also set individual snippets as private or unlisted."
        },
        {
          question: "How do I delete my account?",
          answer: "In Settings > Account, you'll find the option to delete your account. This action is permanent and will remove all your data."
        }
      ]
    }
  ];

  const quickLinks = [
    { title: "User Guide", description: "Complete guide to using CodeHut", icon: Book },
    { title: "API Documentation", description: "Integrate CodeHut into your workflow", icon: Book },
    { title: "Community Forum", description: "Connect with other developers", icon: MessageCircle },
    { title: "Status Page", description: "Check system status and uptime", icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <HelpCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions, learn how to use CodeHut effectively, or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full px-6 py-4 pl-12 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-center mb-4">
                  <link.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{link.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{link.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-card border rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-6">{category.title}</h3>
                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-l-4 border-primary pl-6">
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get help via email</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </div>

            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Chat with our team</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">Ask the community</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                Join Discord
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Average response time: <strong>2 hours</strong> • Available 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Watch step-by-step video guides for all CodeHut features
              </p>
              <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                Watch Tutorials →
              </button>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Developer Blog</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with the latest features, tips, and best practices
              </p>
              <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                Read Blog →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}