import {
  BatteryCharging,
  Flame,
  GitPullRequest,
  HeartPulse,
  Layers,
  Leaf,
  RadioTower,
  ShieldCheck,
  SquareKanban,
  TrendingUp,
  WandSparkles,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Integrations from "./Integrations";

interface Feature {
  heading: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature43Props {
  title?: string;
  features?: Feature[];
}

const Features = ({
  title = "Ayurvedic support for weight and wellness",
  features = [
    {
      heading: "Metabolism Support",
      description:
        "Formulated with traditional Ayurvedic ingredients such as Ashwagandha, Pipli, and Vidanga to support metabolism and daily energy as part of an active lifestyle.",
      icon: <Flame className="size-6" />,
    },
    {
      heading: "Nutrition for Healthy Weight",
      description:
        "Includes Shatavari, Amla, and Gokhru to support nourishment, appetite, and overall body maintenance when combined with proper diet and training.",
      icon: <TrendingUp className="size-6" />,
    },
    {
      heading: "Ayurvedic Ingredients",
      description:
        "Made with carefully selected Ayurvedic herbs traditionally used to support overall wellness and daily nutrition.",
      icon: <Leaf className="size-6" />,
    },
    {
      heading: "Strength & Recovery Support",
      description:
        "Designed to support stamina, recovery, and physical performance as part of a consistent fitness routine.",
      icon: <Activity className="size-6" />,
    },
    {
      heading: "Digestive Support",
      description:
        "Traditional ingredients like Pipli and Vidanga are included to support digestion and nutrient absorption.",
      icon: <HeartPulse className="size-6" />,
    },
    {
      heading: "Clean & Transparent Formula",
      description:
        "No steroids or synthetic additives. Designed to support long-term consistency when used responsibly.",
      icon: <ShieldCheck className="size-6" />,
    },
  ],
}: Feature43Props) => {
  return (
    <section className="pt-20 w-full pb-2">
      <div className="w-full">
        {title && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-pretty text-4xl font-medium lg:text-5xl">
              {title}
            </h2>
          </div>
        )}
        <img
          className="w-full"
          src="https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765791840/Untitled-design-_76_1312_vry854.webp"
          alt="ingredients image"
        />

        {/* <Integrations /> */}

        <div className="pl-15 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col">
              <div className="bg-accent mb-5 flex size-16 items-center justify-center rounded-full">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.heading}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
