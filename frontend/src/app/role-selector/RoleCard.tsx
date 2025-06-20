import Image from 'next/image';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  link?: string;
  bgColor?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export default function RoleCard({
  title,
  description,
  icon,
  link,
  bgColor = 'bg-white',
  onSelect,
  disabled,
}: RoleCardProps) {
  const content = (
    <div
      className={`${bgColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center h-full`}
    >
      <div className="w-20 h-20 relative mb-4">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  );

  if (onSelect) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="text-left w-full h-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {content}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to register as a {title}? This choice cannot be
              easily changed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onSelect}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return link ? <Link href={link}>{content}</Link> : content;
}
