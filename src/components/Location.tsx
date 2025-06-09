import { MapPin } from 'lucide-react';
import { siFacebook, siInstagram, siGoogle, siApple } from 'simple-icons';

export const Location = () => {
  return (
    <section id="location" className="py-20 px-4 min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/40 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent"></div>
      
      {/* Subtle animated background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Visit Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find us in the heart of Ann Arbor for your consciousness exploration needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Information */}
          <div className="flex flex-col space-y-8">
            <div className="bg-purple-900/20 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-white mb-6">Contact Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Address</h4>
                    <p className="text-gray-300">
                      416 W Huron St<br />
                      Ann Arbor, MI 48103<br />
                      Suite 21
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siFacebook.path} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Facebook</h4>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61575899121353&mibextid=wwXIfr&rdid=f1spfnAE4mQs1Xn7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F168iESgm5T%2F%3Fmibextid%3DwwXIfr#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      @mush.ees
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siInstagram.path} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Instagram</h4>
                    <a 
                      href="https://www.instagram.com/mush.ees?igsh=MXF3dHhoMTBhM2trbQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      @mush.ees
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/20 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">Hours & Info</h3>
              <div className="space-y-3 text-gray-300">
                <p>🕐 <strong className="text-white">Hours:</strong> 12pm-7pm Wed-Sun</p>
                <p>🔞 <strong className="text-white">Age Requirement:</strong> 21+ only</p>
                <p>🆔 <strong className="text-white">ID Required:</strong> Valid government ID</p>
                <p>💵 <strong className="text-white">Payment:</strong> Cash only</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-purple-900/20 rounded-2xl p-8 border border-white/10 backdrop-blur-sm flex flex-col">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">Find Us</h3>
            <div className="flex-1 rounded-lg overflow-hidden mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2952.1234567890123!2d-83.7430!3d42.2808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883cae5c2b1234567%3A0x1234567890abcdef!2s416%20W%20Huron%20St%2C%20Ann%20Arbor%2C%20MI%2048103!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&theme=dark"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mushees Location - 416 W Huron St, Ann Arbor, MI 48103"
              ></iframe>
            </div>
            <div className="text-center space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://maps.google.com/?q=416+W+Huron+St,+Ann+Arbor,+MI+48103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d={siGoogle.path} />
                  </svg>
                  <span>Google Maps</span>
                </a>
                <a
                  href="https://maps.apple.com/?address=416%20W%20Huron%20St,%20Ann%20Arbor,%20MI%20%2048103,%20United%20States&ll=42.281862,-83.752936&q=416%20W%20Huron%20St"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d={siApple.path} />
                  </svg>
                  <span>Apple Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 