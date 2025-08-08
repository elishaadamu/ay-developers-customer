import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { LightBulbIcon } from "./Icons";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Website Development Service */}
      <Card className="absolute top-[20px] left-[0px] w-80 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌐 Website Development
          </CardTitle>
          <CardDescription>
            Custom, responsive websites that deliver exceptional user
            experiences and drive business growth.
          </CardDescription>
        </CardHeader>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-3">
            {[
              "📱 Responsive Design",
              "⚡ Fast Loading",
              "🔒 Secure & Reliable",
            ].map((benefit: string) => (
              <span key={benefit} className="flex items-center">
                <Check className="text-green-500 mr-2" />
                <span className="text-sm">{benefit}</span>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* App Development Service */}
      <Card className="absolute right-[50px] top-[20px] w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-4">
          <div className="absolute -top-12 rounded-full w-24 h-24 aspect-square bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center text-4xl">
            📱
          </div>
          <CardTitle className="text-center text-lg">
            Mobile App Development
          </CardTitle>
          <CardDescription className="font-normal text-primary text-center">
            iOS & Android Solutions
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-4">
          <p className="text-sm text-muted-foreground">
            Transform your ideas into powerful mobile experiences. Native &
            cross-platform solutions. 💫
          </p>
        </CardContent>
      </Card>

      {/* AI Solutions Service */}
      <Card className="absolute w-[350px] left-[-20px] bottom-[20px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle className="text-base">🤖 AI-Powered Solutions</CardTitle>
            <CardDescription className="text-sm mt-2">
              Smart automation and predictive analytics that transform business
              operations with cutting-edge AI technology. 🧠✨
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Digital Marketing Service */}
      <Card className="absolute w-[280px]  left-[350px] bottom-[20px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            � Digital Marketing
          </CardTitle>
          <CardDescription className="text-sm">
            Strategic campaigns that amplify your brand and drive measurable
            results. 🎯
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "🎨 Content Creation",
              "📊 Analytics & Insights",
              "🚀 Growth Strategies",
            ].map((feature: string) => (
              <span key={feature} className="flex items-center text-sm">
                <Check className="text-green-500 mr-2 h-4 w-4" />
                {feature}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
