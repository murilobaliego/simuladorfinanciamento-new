import { Link } from "wouter";

interface SimulatorCardProps {
  title: string;
  description: string;
  path: string;
  imageSrc: string;
  imageAlt: string;
  badge?: string;
}

export default function SimulatorCard({ 
  title, 
  description, 
  path,
  imageSrc,
  imageAlt,
  badge
}: SimulatorCardProps) {
  return (
    <Link href={path}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col relative">
        {badge && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {badge}
            </span>
          </div>
        )}
        <div className="h-48 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
            {title}
            {badge && <span className="ml-2 bg-green-500 text-white text-xs px-1 rounded font-bold">{badge}</span>}
          </h3>
          <p className="text-neutral-600 text-sm flex-1">{description}</p>
          <div className="mt-4">
            <span className="inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary/20 group-hover:bg-primary/20">
              Simular agora
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}