import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Star, Twitter, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const imageLinks = [
  { src: "camera.jpg",alt: 'camera', href: "/items?category=9" },
  { src: "calculator.jpg", alt: 'calculator', href: "/items?category=8" },
  { src: "ps.jpg", alt: 'ps5', href: "/items?category=10" },
  { src: "cycle.jpg", alt: 'cycle', href: "/items?category=5" },
];

export default function Home() {
  return (
    <div className="min-h-screen  font-sans text-neutral-900 mt-20  bg-gradient-to-b from-white via-blue-100 to-white ">
      {/* Rental Categories */}
      <section className="grid sm:grid-cols-2 gap-12 md:gap-0  items-start mb-12 p-6">
        <div className=" md:p-10 md:px-35 ">
          <h2 className="text-4xl mb-6 ">Rent anything in minutes</h2>
          <div className=" border rounded-lg p-8 shadow mt-12 ">
            <h1 className="text-gray-700 text-xl mb-4">What you are looking for?</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 gap-x-5 md:gap-4 mt-8">
              <Link href={'/items?category=2'}>
                <div className="bg-slate-200 md:px-11 md:py-4 flex items-center p-11 h-20 rounded-xl cursor-pointer hover:opacity-80">
                  <img src="/book.png" alt="book" />
                </div>
                <p className="text-xs mt-2 flex justify-center">Books & Nobel</p>
              </Link>

              <Link href={'/items?category=7'}>
                <div className="bg-slate-200 md:px-9 md:py-4 flex items-center p-11 h-20 rounded-xl cursor-pointer hover:opacity-80">
                  <img src="/arduino.png" alt="arduino" />
                </div>
                <p className="text-xs mt-2 flex justify-center">Electronics Item</p>
              </Link>


              <Link href={'/items?category=9'}>
                <div className="bg-slate-200 md:px-11 md:py-4 flex items-center p-11 h-20 rounded-xl cursor-pointer hover:opacity-80">
                  <img src="/camera.png" alt="camera" />
                </div>
                <p className="text-xs mt-2 flex justify-center">Camera</p>
              </Link>

              <Link href={'/items?category=5'} className="block md:hidden">
                <div className="bg-slate-200 md:px-15 md:py-4 flex items-center p-11 h-20 rounded-xl cursor-pointer hover:opacity-80">
                  <img src="/cycle.png" alt="cycle" />
                </div>
                <p className="text-xs mt-2 flex justify-center">Cycle</p>
              </Link>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <Link href={'/items?category=5'} className="md:block hidden">
              <div className="bg-slate-200 md:p-4 flex justify-between  p-11 h-20 rounded-xl cursor-pointer hover:opacity-80 ">
                <p className="text-xs  flex items-center">Cycle</p>
                <img src="/cycle.png" alt="cycle" />
              </div>
              </Link >
              <Link href={'/items?category=10'}>
              <div className="bg-slate-200 flex justify-between p-1 md:p-2 h-20 rounded-xl cursor-pointer hover:opacity-80">
                <p className="text-xs md:p-2 p-2 flex items-center">Gaming Consoles</p>
                <img src="/ps5.png" alt="ps5" />
              </div>
              </Link>

              <Link href={'/items?category=8'}>
              <div className="bg-slate-200 flex justify-between p-3 md:p-4 h-20 rounded-xl cursor-pointer hover:opacity-80">
                <p className="text-xs   flex items-center">Exam-Essentials</p>
                <img src="/calculator.png" alt="calculator" />
              </div>
              </Link>

              <Link href={'/items?category=6'}>
              <div className="bg-slate-200 flex justify-between p-3 md:p-4 h-20 rounded-xl cursor-pointer hover:opacity-80">
                <p className="text-xs  flex items-center">Tech-Releated</p>
                <img src="/pendrive.png" alt="pendrive" />
              </div>
              </Link>

            </div>

          </div>

          <div className="items-center flex justify-center gap-12 mt-15">
            <div className="flex gap-4 items-center" >
              <Star strokeWidth={1.3} className="w-8 h-8 font-light"/>
              <h1 className="text-xl"><p>4.8</p>
              <p className="text-sm font-light">Custormer Rating*</p>
              </h1>
            </div>

            <div className="flex gap-4 items-center">
              <Users strokeWidth={1.3} className="w-8 h-8 font-light"/>
              <h1 className="text-xl"><p>5+</p>
              <p className="text-sm font-light">Users locally*</p>
              </h1>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-4  ">
          {imageLinks.map((item, i) => (
            
            <Link href={`${item.href}`} key={i} className=" overflow-hidden rounded-xl h-fit cursor-pointer">
            <Image
              key={i}
              src={`/${item.src}`}
              width={1000}
              height={1000}
              alt={item.alt}
              className="rounded-xl border  border-neutral-200 bg-neutral-50 object-cover transition-transform duration-400 hover:scale-110 "
            />
            </Link>
          ))}
        </div>
      </section>
      {/* Hero Section */}
      <section className="grid sm:grid-cols-3 gap-6 mb-20 px-5">
      <Link href={'/login'} className="bg-black text-white rounded-xl p-8 relative ">
          <span className="absolute top-2 left-2 bg-green-500 text-xs px-2 py-0.5 rounded-full">Limited Offer</span>
          <p className="text-lg mb-4">Cycles & Cameras starting ₹99/day</p>
          <Button className="text-black bg-white hover:bg-gray-300 cursor-pointer">Get Started</Button>
        </Link>
        <Link href={'/items'} className="bg-black text-white border  rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Rent gadgets for every need</h2>
          <Button className="text-black bg-white hover:bg-gray-300 cursor-pointer">Explore Now</Button>
        </Link>
        <Link href={'/items?category=10'} className="bg-black text-white border  rounded-2xl p-6">
          <p className="text-lg mb-4">Top-rated PS5 & gaming consoles</p>
          <Button className="text-black bg-white hover:bg-gray-300 cursor-pointer">Rent Now</Button>
        </Link>
        
      </section>

      {/* Footer */}
      <footer className="bg-slate-200  pt-10 pb-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo/Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="Logo" className="w-20" />
              <span className="font-bold text-lg">RentalApp</span>
            </div>
            <p className="text-xs text-neutral-500">Rent anything, anytime.</p>
          </div>
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li><a href="#">About us</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
          {/* For customers */}
          <div>
            <h3 className="font-semibold mb-2">For customers</h3>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li><a href="#">Categories</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h3 className="font-semibold mb-2">Social</h3>
            <div className="flex space-x-4">
              {/* Example SVG icons */}
            <Twitter/>
            <Instagram/>
            <Linkedin/>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-xs text-neutral-500">
          © 2024 RentalApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}