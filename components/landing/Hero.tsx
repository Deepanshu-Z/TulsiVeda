import { ArrowDownRight, Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import nutrivya from "@/public/nutrivya.png";
import Link from "next/link";
interface Hero3Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
    rating?: number;
  };
}

const Hero = ({
  heading = "Ayurvedic Nutrition, Built for Modern Lifestyles",
  description = "Thoughtfully formulated with traditional Ayurvedic ingredients to support daily nutrition, consistency, and an active way of living.",
  buttons = {
    primary: {
      text: "Shop Now",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "Get Started",
      url: "https://www.shadcnblocks.com",
    },
  },
  reviews = {
    count: 200,
    rating: 5,
    avatars: [
      {
        src: "https://randomuser.me/api/portraits/men/61.jpg",
        alt: "Avatar 1",
      },
      {
        src: "https://randomuser.me/api/portraits/women/64.jpg",
        alt: "Avatar 2",
      },
      {
        src: "https://randomuser.me/api/portraits/women/67.jpg",
        alt: "Avatar 3",
      },
      {
        src: "https://randomuser.me/api/portraits/women/69.jpg",
        alt: "Avatar 4",
      },
      {
        src: "https://randomuser.me/api/portraits/women/72.jpg",
        alt: "Avatar 5",
      },
    ],
  },
}: Hero3Props) => {
  return (
    <section className="mx-10 pt-20 ">
      <div className=" grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex flex-col items-center text-center max-w-3xl lg:items-start lg:text-left">
          <h1 className="my-6 text-pretty text-2xl font-bold md:text-3xl lg:text-4xl xl:text-7xl">
            {heading}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
            {description}
          </p>
          <div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
            <span className="inline-flex items-center -space-x-4">
              {reviews.avatars.map((avatar, index) => (
                <Avatar key={index} className="size-12 border">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                </Avatar>
              ))}
            </span>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="size-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="mr-1 font-semibold">
                  {reviews.rating?.toFixed(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-left font-medium">
                from {reviews.count}+ reviews
              </p>
            </div>
          </div>
          <div className=" flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            <Link href="/shop/categories">
              <Button className=" cursor-pointer ">Shop now</Button>
            </Link>
          </div>
        </div>
        <div className="flex">
          <img
            src="https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765780802/1_1_kzyejq.png"
            alt="placeholder hero"
            className="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
