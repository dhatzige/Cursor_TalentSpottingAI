// React type declarations
declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode | undefined }, context?: any): ReactElement<any, any> | null;
  }
  export type ReactNode = 
    | ReactElement 
    | string 
    | number 
    | Iterable<ReactNode> 
    | ReactPortal 
    | boolean 
    | null 
    | undefined;
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null);
  export type Key = string | number;
  export type ReactPortal = any;
  export interface ReactPortal {
    key: Key | null;
    children: ReactNode;
  }
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  export type EffectCallback = () => (void | (() => void | undefined));
  export type DependencyList = ReadonlyArray<unknown>;
}

// Next.js modules
declare module 'next/link' {
  import { ReactNode } from 'react';
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children?: ReactNode;
  }
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    prefetch: (url: string) => void;
    back: () => void;
    forward: () => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

// Update ButtonProps interface to include onClick
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  fullWidth?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

// Update DashboardLayoutProps to make children flexible
interface DashboardLayoutProps {
  children?: React.ReactNode;
  title: string;
  userRole: 'admin' | 'student' | 'employer' | 'university';
}
