// Type definitions for @testing-library/react and related packages
declare module '@testing-library/react' {
  // Import React types
  import { ReactElement } from 'react';
  
  // Core render function
  export function render(
    ui: ReactElement,
    options?: any
  ): RenderResult;

  // Query variants
  export const screen: {
    getByText: (text: string | RegExp, options?: any) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: any) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement;
    getByTestId: (testId: string, options?: any) => HTMLElement;
    queryByText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByLabelText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByTestId: (testId: string, options?: any) => HTMLElement | null;
    findByText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByRole: (role: string, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByLabelText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByPlaceholderText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByTestId: (testId: string, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    getAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByRole: (role: string, options?: any) => HTMLElement[];
    getAllByLabelText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByTestId: (testId: string, options?: any) => HTMLElement[];
    queryAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    queryAllByRole: (role: string, options?: any) => HTMLElement[];
    queryAllByLabelText: (text: string | RegExp, options?: any) => HTMLElement[];
    queryAllByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement[];
    queryAllByTestId: (testId: string, options?: any) => HTMLElement[];
    findAllByText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByRole: (role: string, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByLabelText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByPlaceholderText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByTestId: (testId: string, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
  };

  // Render result
  export interface RenderResult {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: HTMLElement | HTMLElement[]) => void;
    rerender: (ui: ReactElement) => void;
    unmount: () => boolean;
    asFragment: () => DocumentFragment;
    findByText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByRole: (role: string, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByLabelText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByPlaceholderText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findByTestId: (testId: string, options?: any, waitForOptions?: any) => Promise<HTMLElement>;
    findAllByText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByRole: (role: string, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByLabelText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByPlaceholderText: (text: string | RegExp, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    findAllByTestId: (testId: string, options?: any, waitForOptions?: any) => Promise<HTMLElement[]>;
    getByText: (text: string | RegExp, options?: any) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: any) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement;
    getByTestId: (testId: string, options?: any) => HTMLElement;
    getAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByRole: (role: string, options?: any) => HTMLElement[];
    getAllByLabelText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByTestId: (testId: string, options?: any) => HTMLElement[];
    queryByText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByLabelText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByTestId: (testId: string, options?: any) => HTMLElement | null;
    queryAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    queryAllByRole: (role: string, options?: any) => HTMLElement[];
    queryAllByLabelText: (text: string | RegExp, options?: any) => HTMLElement[];
    queryAllByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement[];
    queryAllByTestId: (testId: string, options?: any) => HTMLElement[];
  }

  // Event firing utilities
  export const fireEvent: {
    click: (element: HTMLElement) => boolean;
    change: (element: HTMLElement, options: { target: { value: any } }) => boolean;
    submit: (element: HTMLElement) => boolean;
    focus: (element: HTMLElement) => boolean;
    blur: (element: HTMLElement) => boolean;
    keyDown: (element: HTMLElement, options: any) => boolean;
    keyUp: (element: HTMLElement, options: any) => boolean;
    keyPress: (element: HTMLElement, options: any) => boolean;
    mouseDown: (element: HTMLElement) => boolean;
    mouseUp: (element: HTMLElement) => boolean;
    mouseMove: (element: HTMLElement) => boolean;
    mouseOver: (element: HTMLElement) => boolean;
    mouseOut: (element: HTMLElement) => boolean;
  };

  // Wait functions
  export function waitFor<T>(
    callback: () => T | Promise<T>,
    options?: { timeout?: number; interval?: number }
  ): Promise<T>;
  
  export function waitForElementToBeRemoved<T>(
    callback: T | (() => T),
    options?: { timeout?: number; interval?: number }
  ): Promise<void>;
}

// Extended Jest matchers from @testing-library/jest-dom
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveStyle(css: string | object): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number): R;
      toBeChecked(): R;
      toBeRequired(): R;
    }
  }
}

// Type definitions for @testing-library/user-event
declare module '@testing-library/user-event' {
  const userEvent: {
    setup(options?: any): UserEvent;
    clear: (element: HTMLElement) => void;
    click: (element: HTMLElement) => void;
    dblClick: (element: HTMLElement) => void;
    type: (element: HTMLElement, text: string, options?: any) => void;
    keyboard: (text: string) => void;
    upload: (element: HTMLElement, file: File | File[]) => void;
    hover: (element: HTMLElement) => void;
    unhover: (element: HTMLElement) => void;
    paste: (element: HTMLElement, text: string) => void;
    tab: (options?: { shift?: boolean }) => void;
    selectOptions: (element: HTMLElement, values: string | string[]) => void;
  };
  
  interface UserEvent {
    clear: (element: HTMLElement) => Promise<void>;
    click: (element: HTMLElement) => Promise<void>;
    dblClick: (element: HTMLElement) => Promise<void>;
    type: (element: HTMLElement, text: string, options?: any) => Promise<void>;
    keyboard: (text: string) => Promise<void>;
    upload: (element: HTMLElement, file: File | File[]) => Promise<void>;
    hover: (element: HTMLElement) => Promise<void>;
    unhover: (element: HTMLElement) => Promise<void>;
    paste: (element: HTMLElement, text: string) => Promise<void>;
    tab: (options?: { shift?: boolean }) => Promise<void>;
    selectOptions: (element: HTMLElement, values: string | string[]) => Promise<void>;
  }
  
  export default userEvent;
}

// Define Jest extended matchers
declare module '@testing-library/jest-dom' {}
