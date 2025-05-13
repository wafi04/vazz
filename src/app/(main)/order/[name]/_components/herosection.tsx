import Image from "next/image";
import type { Category } from "@/types/category";

export function HeroSection({ category }: { category: Category }): JSX.Element {
  return (
    <div className="w-full mb-10 border-b-2 border-blue-900/50">
      <div className="relative w-full h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>

        {/* Background Image */}
        <Image
          src={category.bannerLayanan}
          alt={category.nama}
          fill
          className="object-cover w-full  -z-10"
          priority
        />
      </div>

      {/* Section Bawah */}
      <div
        className="relative "
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 30px, rgba(255, 86, 0, 0) 30px, rgba(255, 86, 0, 0) 60px)",
        }}
      >
        <div className="container mx-auto md:max-w-7xl md:px-0 px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo Card */}
            <div
              className="relative w-[200px] h-[200px] -mt-32 rounded-2xl overflow-hidden  shadow-2xl "
              style={{
                transform: "perspective(1000px) rotateY(15deg) rotateX(5deg)",
                transition: "transform 0.5s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform =
                  "perspective(1000px) rotateY(5deg) rotateX(2deg)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform =
                  "perspective(1000px) rotateY(15deg) rotateX(5deg)")
              }
            >
              <Image
                src={category.thumbnail}
                alt={category.nama}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Info */}
            <div className="text-white flex-1 py-6 ">
              <h1 className="text-xl font-bold uppercase text-white">
                {category.nama}
              </h1>
              <p className="text-blue-300 mt-1 text-sm">
                {category.subNama || category.tipe}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-6 ">
                <div className="flex items-center gap-2  py-2">
                  <span className="text-yellow-400 text-lg">⚡</span>
                  <span className="text-sm">Proses Cepat</span>
                </div>
                <div className="flex items-center gap-2 py-2">
                  <span className="text-blue-300 text-lg">💬</span>
                  <span className="text-sm">Layanan Chat 24/7</span>
                </div>
                <div className="flex items-center gap-2  py-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm">Pembayaran Aman!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
