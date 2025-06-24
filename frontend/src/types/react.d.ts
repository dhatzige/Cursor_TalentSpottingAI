// React type declarations
declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode | undefined }, context?: any): ReactElement<any, any> | null;
  }
  export const Fragment: FC<{ children?: ReactNode; key?: Key | null }>;
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
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
  export function useMemo<T>(factory: () => T, deps: DependencyList): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T>;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  export interface RefObject<T> {
    readonly current: T | null;
  }
  export interface MutableRefObject<T> {
    current: T;
  }
  export type EffectCallback = () => (void | (() => void | undefined));
  export type DependencyList = ReadonlyArray<unknown>;
  
  // React Event types for React 19 compatibility
  export interface SyntheticEvent<T = Element, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: EventTarget;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
  }
  
  export interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {}
  
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }
  
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T, KeyboardEvent> {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  }
  
  // Define missing native types
  type NativeMouseEvent = globalThis.MouseEvent;
  
  export interface MouseEvent<T = Element, E = NativeMouseEvent> extends SyntheticEvent<T, E> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }
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
