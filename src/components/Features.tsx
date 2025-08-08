import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartIcon, LightBulbIcon, PlaneIcon } from "./Icons";

interface FeatureProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const features: FeatureProps[] = [
  {
    title: "Cutting-Edge Technology",
    description:
      "We leverage the latest technologies including AI, machine learning, and cloud computing to create solutions that are not just current, but future-ready.",
    icon: <PlaneIcon />,
  },
  {
    title: "User-Centric Design",
    description:
      "Every interface we create prioritizes user experience, ensuring intuitive navigation, accessibility, and engagement that drives real business results.",
    icon: <ChartIcon />,
  },
  {
    title: "AI-Powered Solutions",
    description:
      "From intelligent automation to predictive analytics, our AI implementations transform how businesses operate and make data-driven decisions.",
    icon: <LightBulbIcon />,
  },
];

const featureList: string[] = [
  "Mobile-First Design",
  "AI Integration",
  "Cloud Infrastructure",
  "Real-time Analytics",
  "Secure Architecture",
  "API Development",
  "Cross-Platform",
  "Performance Optimized",
  "Scalable Solutions",
  "24/7 Support",
  "Custom Development",
  "Modern Frameworks",
];

export const Features = () => {
  return (
    <section id="features" className="container py-12 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Powerful{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Technology Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, icon }: FeatureProps) => (
          <Card key={title} className="h-full">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/20 p-4 rounded-2xl w-fit mb-4">
                {icon}
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
