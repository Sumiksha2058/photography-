import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Soul Lens Photography</h1>
          <p className="text-lg text-gray-600">
            Capturing life's most precious moments with passion and creativity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Soul Lens Photography was founded with a simple mission: to capture the authentic emotions and beautiful moments that make life special. With years of experience in professional photography, we bring technical expertise combined with artistic vision to every project.
            </p>
            <p className="text-gray-600 mb-4">
              We believe that photography is more than just taking pictures—it's about telling stories, preserving memories, and celebrating the people and moments that matter most. Every photograph we create is a testament to our commitment to excellence and our passion for our craft.
            </p>
            <p className="text-gray-600">
              Whether it's a wedding, maternity session, or special event, we approach each project with dedication, creativity, and a genuine desire to exceed expectations.
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
            <ul className="space-y-4">
              {[
                "Professional expertise with years of experience",
                "Artistic vision combined with technical excellence",
                "Personalized approach to every project",
                "High-quality editing and post-processing",
                "Timely delivery of final photographs",
                "Competitive pricing and flexible packages",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 font-bold mr-3">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Photographer",
                role: "Lead Photographer",
                description: "Specializing in capturing authentic emotions and candid moments",
              },
              {
                name: "Editor",
                role: "Post-Processing Expert",
                description: "Bringing photos to life through professional editing and enhancement",
              },
              {
                name: "Creative Director",
                role: "Vision & Concept",
                description: "Ensuring every project aligns with your unique vision and style",
              },
            ].map((member, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-red-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Happy Clients" },
              { number: "10+", label: "Years Experience" },
              { number: "1000+", label: "Events Covered" },
              { number: "100%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-red-500 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
