"use client"
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";


export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 400px or near bottom
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      setIsVisible(window.scrollY > 300 || scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <div>
        <Button
        size={"lg"}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-muted/50 p-4 rounded shadow-lg hover:bg-muted/20 border border-emerald-500 transition"
        >
          <ArrowUp size={20} className='text-emerald-400'/>
        </Button>

       
      <Link href={"https://wa.me/qr/PGAM4E6MEV7QI1 "}>
          <i className="fa fa-whatsapp w-14 h-14 fixed bottom-6 left-6 rounded shadow-lg hover:bg-muted/20 border border-emerald-400 transition-all" aria-hidden="true"></i> 
      </Link>
        </div>
      )}
    </>
  );
}
