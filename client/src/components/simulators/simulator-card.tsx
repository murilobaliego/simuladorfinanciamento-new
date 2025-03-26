import { Link } from "wouter";

interface SimulatorCardProps {
  title: string;
  description: string;
  path: string;
  imageSrc: string;
  imageAlt: string;
}

export default function SimulatorCard({ 
  title, 
  description, 
  path, 
  imageSrc, 
  imageAlt 
}: SimulatorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-36 bg-neutral-200 relative overflow-hidden">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-primary mb-2">{title}</h3>
        <p className="text-neutral-700 mb-4">{description}</p>
        <Link href={path} className="inline-block text-primary hover:text-primary-dark font-medium transition-colors">
          Simular agora
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
