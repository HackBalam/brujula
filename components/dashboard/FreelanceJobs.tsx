"use client";

import { Monitor, Star, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  budget: string;
  isVerified: boolean;
  rating: number;
  location: string;
  deadline: string;
  tags: string[];
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Desarrollar Landing Page en React",
    budget: "$500 - $800 USD",
    isVerified: true,
    rating: 5,
    location: "Remoto",
    deadline: "7 días",
    tags: ["React", "Tailwind", "NextJS"],
  },
  {
    id: "2",
    title: "App Móvil con React Native",
    budget: "$1,200 - $2,000 USD",
    isVerified: true,
    rating: 4.8,
    location: "Remoto",
    deadline: "14 días",
    tags: ["React Native", "TypeScript", "Firebase"],
  },
  {
    id: "3",
    title: "Smart Contract en Solidity",
    budget: "$800 - $1,500 USD",
    isVerified: true,
    rating: 4.9,
    location: "Remoto",
    deadline: "10 días",
    tags: ["Solidity", "Web3", "Ethereum"],
  },
];

function JobCard({ job }: { job: Job }) {
  return (
    <Card className="bg-[#111111] border-[#262626] border-l-4 border-l-[#A4D900] p-6 hover:border-[#A4D900] hover:shadow-[0_0_20px_rgba(164,217,0,0.15),0_8px_16px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#A4D900]/20">
          <Monitor className="w-6 h-6 text-[#A4D900]" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
          <p className="text-xl font-bold text-[#A4D900] mb-3">{job.budget}</p>

          <div className="flex items-center gap-4 mb-4 text-sm">
            {job.isVerified && (
              <span className="flex items-center gap-1 text-[#34D399]">
                <CheckCircle2 className="w-4 h-4" />
                Cliente verificado
              </span>
            )}
            <span className="flex items-center gap-1 text-[#FCD34D]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(job.rating) ? "fill-current" : "opacity-30"
                  }`}
                />
              ))}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-[#737373]">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Entrega: {job.deadline}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-[#1A1A1A] border-[#262626] text-[#A4D900] hover:bg-[#A4D900] hover:text-black transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full sm:w-auto border-[#A4D900] text-[#A4D900] hover:bg-[#A4D900] hover:text-black glow-green-subtle"
          >
            Ver Detalle
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function FreelanceJobs() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="gradient-text-lime">Trabajos Destacados Para Ti</span>
        </h2>
        <Button
          variant="link"
          className="text-[#A4D900] hover:text-[#B8E816] p-0 h-auto font-medium"
        >
          Ver todos <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
