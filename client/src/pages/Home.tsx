import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const featuredPhotosQuery = trpc.photos.featured.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20"></div>
          </div>

          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Capturing Moments,<br />Creating Memories
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Professional photography that tells your unique story
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gallery">
                <a>
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                    View Portfolio
                  </Button>
                </a>
              </Link>
              <Link href="/contact">
                <a>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                    Book a Session
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Photos Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Recent Works</h2>
              <p className="text-lg text-gray-600">Explore our latest collection of stunning photography projects</p>
            </div>

            {featuredPhotosQuery.isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-red-500" size={32} />
              </div>
            ) : featuredPhotosQuery.data && featuredPhotosQuery.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredPhotosQuery.data.map((photo: any) => (
                  <div
                    key={photo.id}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition h-64"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-end p-4">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition">
                        <h3 className="font-semibold text-lg">{photo.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No featured photos yet. Check back soon!</p>
              </div>
            )}

            <div className="text-center">
              <Link href="/gallery">
                <a>
                  <Button variant="default" className="bg-red-500 hover:bg-red-600">
                    View All Gallery <ArrowRight className="ml-2" size={18} />
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-lg text-gray-600">Comprehensive photography solutions for every occasion</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Wedding Photography",
                  description: "Capture the magic of your special day with artistic vision and technical excellence.",
                  icon: "💍",
                },
                {
                  title: "Maternity Photography",
                  description: "Professional portraits that capture your essence and celebrate this beautiful journey.",
                  icon: "👶",
                },
                {
                  title: "Event Photography",
                  description: "Document celebrations and special occasions with creativity and attention to detail.",
                  icon: "🎉",
                },
              ].map((service, index) => (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-red-500 to-red-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Create Something Beautiful?</h2>
            <p className="text-xl text-red-100 mb-8">
              Let's work together to capture your most precious moments
            </p>
            <Link href="/contact">
              <a>
                <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                  Get in Touch
                </Button>
              </a>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
