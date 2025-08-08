import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Discovery & Strategy",
    description:
      "We start by understanding your vision, analyzing market opportunities, and crafting a strategic roadmap that aligns technology with your business goals.",
  },
  {
    icon: <MapIcon />,
    title: "Design & Architecture",
    description:
      "Our team designs intuitive user experiences and robust system architectures, ensuring scalability, performance, and future-ready solutions.",
  },
  {
    icon: <PlaneIcon />,
    title: "Development & Innovation",
    description:
      "Using cutting-edge technologies and agile methodologies, we build transformative solutions that exceed expectations and set new industry standards.",
  },
  {
    icon: <GiftIcon />,
    title: "Launch & Beyond",
    description:
      "We ensure seamless deployment, provide comprehensive training, and offer ongoing support to help your technology evolve with your business.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How We{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Transform{" "}
        </span>
        Your Ideas Into Reality
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Our proven 4-step process ensures every project delivers exceptional
        results that exceed expectations and drive meaningful business growth.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
