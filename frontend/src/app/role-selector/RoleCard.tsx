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
      className={`${bgColor} p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:scale-105`}
    >
      <div className="w-24 h-24 relative mb-6">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-black dark:text-white drop-shadow-sm">{title}</h3>
      <p className="text-gray-900 dark:text-gray-100 flex-grow font-bold text-base leading-relaxed drop-shadow-sm">{description}</p>
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
