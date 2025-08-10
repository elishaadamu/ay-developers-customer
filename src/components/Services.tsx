import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  MagnifierIcon,
  WalletIcon,
  ChartIcon,
  LightBulbIcon,
  GiftIcon,
} from "./Icons";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Website Development",
    description:
      "Custom, responsive websites that deliver exceptional user experiences and drive business growth through innovative design and cutting-edge technology.",
    icon: <ChartIcon />,
  },
  {
    title: "App Development",
    description:
      "Native and cross-platform mobile applications that transform ideas into powerful, user-friendly solutions for iOS and Android platforms.",
    icon: <WalletIcon />,
  },
  {
    title: "Hosting Services",
    description:
      "Reliable, scalable hosting solutions with 99.9% uptime, advanced security, and lightning-fast performance for your digital presence.",
    icon: <MagnifierIcon />,
  },
  {
    title: "Digital Marketing",
    description:
      "Strategic digital marketing campaigns that amplify your brand reach, engage target audiences, and drive measurable business results across all platforms.",
    icon: <LightBulbIcon />,
  },
  {
    title: "Content Creation",
    description:
      "Compelling visual and written content that tells your brand story, engages audiences, and builds lasting connections with your customers.",
    icon: <GiftIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-12 sm:py-12" id="services">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Our Core{" "}
          </span>
          Services
        </h2>

        <p className="text-muted-foreground text-xl mt-4 mb-8 max-w-3xl mx-auto">
          From AI-powered tools to immersive platforms, we develop products that
          are not only functional — but transformative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceList.map(({ icon, title, description }: ServiceProps) => (
          <Card key={title} className="h-full">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto bg-primary/20 p-4 rounded-2xl w-fit">
                {icon}
              </div>
              <div>
                <CardTitle className="text-xl mb-2">{title}</CardTitle>
                <CardDescription className="text-md">
                  {description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
