
import { PsychedelicScene } from "@/components/PsychedelicScene";
import { MushroomMenu } from "@/components/MushroomMenu";
import { Location } from "@/components/Location";
import { SEO, seoConfigs } from "@/components/SEO";
import { MapPin } from 'lucide-react';
import { siFacebook, siInstagram, siGoogle, siApple } from 'simple-icons';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* SEO Component */}
      <SEO {...seoConfigs.homepage} />
      
      {/* Hero Section with 3D Scene */}
      <PsychedelicScene />
      
      {/* Main Content */}
      <main>
        {/* Menu Section */}
        <section id="menu" aria-label="Sacred Mushroom Menu">
          <MushroomMenu />
        </section>
        
        {/* Location Section */}
        <section id="location" aria-label="Store Location and Contact">
          <Location />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-sm py-12 border-t border-white/10" role="contentinfo">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand & Mission */}
            <div className="lg:col-span-2">
              <img 
                src="/mushees logo.png" 
                alt="Mushees Logo" 
                className="h-20 w-auto mb-4"
              />
              <p className="text-purple-300 mb-4 leading-relaxed">
                Journey into the mystical realm of consciousness exploration. We provide premium quality products for your spiritual and therapeutic needs.
              </p>
              <div className="inline-block p-4 rounded-xl bg-purple-900/30 border border-purple-500/30">
                <p className="text-purple-100 font-semibold">🍄 Embrace the journey, respect the medicine 🍄</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Visit Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <a 
                      href="https://maps.google.com/?q=416+W+Huron+St,+Ann+Arbor,+MI+48103"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      <p>416 W Huron St</p>
                      <p>Ann Arbor, MI 48103</p>
                      <p>Suite 21</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Links & Social */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-4">
                {/* Social Links */}
                <div className="space-y-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61575899121353&mibextid=wwXIfr&rdid=f1spfnAE4mQs1Xn7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F168iESgm5T%2F%3Fmibextid%3DwwXIfr#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siFacebook.path} />
                    </svg>
                    <span className="text-sm">@mush.ees</span>
                  </a>
                  <a
                    href="https://www.instagram.com/mush.ees?igsh=MXF3dHhoMTBhM2trbQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siInstagram.path} />
                    </svg>
                    <span className="text-sm">@mush.ees</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-6 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 Mush-ees. All rights reserved.
              </p>
              <div className="text-gray-400 text-sm">
                <span className="text-purple-300">Journey Responsibly</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
