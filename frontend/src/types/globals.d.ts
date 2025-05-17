// Type declarations for JSX
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Type declarations for Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Type declarations for DashboardLayout component
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole: 'admin' | 'student' | 'employer' | 'university';
}
