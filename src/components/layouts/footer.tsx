"use client";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative pt-20 pb-12" aria-label="Footer Vazzuniverse">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Informasi Perusahaan */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg p-1 shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dstvymie8/image/upload/v1741104560/LOGO_VAZZ_STORE_2_dereyt.webp"
                  alt="Logo Vazzuniverse"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
                  Vazzuniverse
                </h3>
                <p className="text-gray-400 text-sm">
                  Tempat Top-Up Terpercaya Se-Universe
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-purple-500 pl-4">
              Vazzuniverse menyediakan layanan top-up game dengan harga terbaik,
              proses cepat, dan pelayanan 24/7 untuk semua kebutuhan gaming
              Anda.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-purple-500" />
                <span>storevazz09@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-purple-500" />
                <span>{process.env.NEXT_PUBLIC_NOMOR_ADMIN}</span>
              </div>
            </div>
          </div>

          {/* Link Game */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white relative">
              <span className="relative z-10">Game Populer</span>
              <span className="absolute bottom-0 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/order/mobile-legend"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Mobile Legends Bang Bang
                </Link>
              </li>
              <li>
                <Link
                  href="/order/pubg-mobile"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  PUBG Mobile
                </Link>
              </li>
              <li>
                <Link
                  href="/order/free-fire"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Free Fire
                </Link>
              </li>
              <li>
                <Link
                  href="/order/valorant"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Valorant
                </Link>
              </li>
              <li>
                <Link
                  href="/order/genshin-impact"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Genshin Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Link Bantuan */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white relative">
              <span className="relative z-10">Bantuan</span>
              <span className="absolute bottom-0 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/cara-top-up"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Cara Top Up
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="group flex items-center text-gray-400 transition-colors hover:text-white"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white relative">
              <span className="relative z-10">Ikuti Kami</span>
              <span className="absolute bottom-0 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={"/"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-blue-600 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={"https://instagram.com/vazzuniverse.id"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={"https://youtube.com"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-red-600 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-white">Vazzuniverse</span>.
              Seluruh hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/kebijakan-privasi"
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Privasi
              </Link>
              <Link
                href="/syarat-ketentuan"
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
