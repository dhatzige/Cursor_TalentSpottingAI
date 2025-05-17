// Reference: Role_selector.jpg
import Link from 'next/link';
import Image from 'next/image';

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  bgColor?: string;
}

export default function RoleCard({ 
  title, 
  description, 
  icon, 
  link,
  bgColor = 'bg-white'
}: RoleCardProps) {
  return (
    <Link href={link}>
      <div className={`${bgColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center max-w-xs mx-auto`}>
        <div className="w-20 h-20 relative mb-4">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
