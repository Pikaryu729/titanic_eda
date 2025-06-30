"use client";
import { useState, useEffect } from "react";
import { PieChart } from "@/components/PieChart";
import SurvivalPredictForm from "@/components/SurvivalPredictForm";
import { Loader2, Ship, Users, TrendingUp } from "lucide-react";
import { PieChartData } from "@/types/piechart";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sexFilter = searchParams.get("sex") || "all";
  const pClassFilter = searchParams.get("p_class") || "all";
  const [chartData, setChartData] = useState<PieChartData | null>(null);
  const [loading, setLoading] = useState(false);

  const parseClass = (pClass: string) => {
    if (pClass == "1") {
      return "first";
    } else if (pClass == "2") {
      return "second";
    } else {
      return "third";
    }
  };

  const handleSexChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("sex");
    } else {
      params.set("sex", value);
    }

    params.set("sex", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handlePClassChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("p_class");
    } else {
      params.set("p_class", value);
    }

    params.set("p_class", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (sexFilter !== "all") params.append("sex", sexFilter);
        if (pClassFilter !== "all") params.append("p_class", pClassFilter);
        const response = await fetch(
          `http://150.136.59.52/api/survivors?${params.toString()}`
        );
        const result = await response.json();

        const survival_rate = result.survival_rate;

        // Transform backend data to PieChart format
        const transformedData: PieChartData = {
          Survived: survival_rate.toFixed(2),
          Died: Number((100 - survival_rate).toFixed(2)),
        };
        console.log(transformedData);

        setChartData(transformedData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sexFilter, pClassFilter]);

  // Calculate survival rate for display
  const survivalRate = chartData?.Survived;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Ship className="w-12 h-12 text-blue-300" />
              <Badge variant="secondary" className="text-sm font-medium">
                Historical Analysis
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Titanic Survival
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent block">
                Data Analysis
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Explore the survival patterns of passengers aboard the RMS Titanic
              through interactive data visualization
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Controls Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Users className="w-6 h-6 text-blue-600" />
              Filter Analysis
            </CardTitle>
            <CardDescription className="text-lg">
              Select demographic group to analyze survival rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-64 flex justify-center gap-10">
                <Select value={pClassFilter} onValueChange={handlePClassChange}>
                  <SelectTrigger className="h-12 text-lg font-medium">
                    <SelectValue placeholder="Select passenger class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-lg">
                      All Passengers
                    </SelectItem>
                    <SelectItem value="1" className="text-lg">
                      💸 First Class Passengers
                    </SelectItem>
                    <SelectItem value="2" className="text-lg">
                      Second Class Passengers
                    </SelectItem>
                    <SelectItem value="3" className="text-lg">
                      Third Class Passengers
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sexFilter} onValueChange={handleSexChange}>
                  <SelectTrigger className="h-12 text-lg font-medium">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-lg">
                      All Passengers
                    </SelectItem>
                    <SelectItem value="male" className="text-lg">
                      👨 Male Passengers
                    </SelectItem>
                    <SelectItem value="female" className="text-lg">
                      👩 Female Passengers
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Survival Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-slate-800">
                {loading ? (
                  <Loader2 className="animate-spin w-12 h-12 mx-auto" />
                ) : (
                  `${survivalRate}%`
                )}
              </div>
              <p className="text-lg text-slate-600 capitalize">
                {sexFilter == "all" ? "Male and Female" : sexFilter}{" "}
                {pClassFilter ? parseClass(pClassFilter) : ""} class passengers
                who survived
              </p>
            </CardContent>
          </Card>

          {/* Chart Card */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl capitalize">
                {sexFilter == "all" ? "Male and Female" : sexFilter}{" "}
                {pClassFilter ? parseClass(pClassFilter) : ""} class passenger
                Survival Distribution
              </CardTitle>
              <CardDescription className="text-base">
                Visual breakdown of survival vs. casualties
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
                  <p className="text-slate-600">Loading survival data...</p>
                </div>
              ) : chartData ? (
                <div className="w-full max-w-md">
                  <PieChart data={chartData} />
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 shadow-lg border-0 ">
          <CardTitle className="text-center text-4xl">
            Would you have survived?
          </CardTitle>
          <CardContent>
            <SurvivalPredictForm />
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                About This Analysis
              </h3>
              <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
                This visualization presents survival data from the RMS Titanic
                disaster of April 15, 1912. The data reveals significant
                differences in survival rates between demographic groups,
                highlighting the social dynamics and maritime protocols of the
                early 20th century.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
