import Hero from "@/components/landing/Hero";
import SingleProduct from "@/components/shopping/SingleProduct";
import Testimonial from "@/components/landing/Testimonial";
import Image from "next/image";
import Products from "@/components/landing/Products";
import Integrations from "@/components/landing/Integrations";
import Features from "@/components/landing/Features";
import Categories from "@/components/landing/Categories";
import HeroSlider from "../../components/landing/HeroSlider";
import FilterProducts from "@/components/landing/FilterProducts";

export default function Home() {
  return (
    <div>
      {/* <Hero /> */}
      <HeroSlider />
      <FilterProducts />
      <Features />
      <Products />
      {/* <Categories /> */}
      <Testimonial />
    </div>
  );
}
