// Type definitions for Jest global variables
declare global {
  const jest: {
    fn: <T = any>(implementation?: (...args: any[]) => T) => jest.Mock<T>;
    mock: (moduleName: string, factory?: any) => void;
    spyOn: (object: any, methodName: string) => jest.SpyInstance;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
  };
  
  namespace jest {
    interface Mock<T = any> {
      (...args: any[]): T;
      mockImplementation: (fn: (...args: any[]) => T) => Mock<T>;
      mockReturnValue: (value: T) => Mock<T>;
      mockResolvedValue: (value: Promise<T> | T) => Mock<T>;
      mockRejectedValue: (value: Error | any) => Mock<T>;
      mockReturnThis: () => Mock<T>;
      mockReturnedValueOnce: (value: T) => Mock<T>;
      mockClear: () => void;
      mockReset: () => void;
      mockRestore: () => void;
      getMockName: () => string;
      mockName: string;
      mock: {
        calls: any[][];
        instances: T[];
        results: any[];
      };
    }
    
    interface SpyInstance<T = any> extends Mock<T> {
      mockRestore: () => void;
    }
  }
  
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function expect<T>(actual: T): {
    toBe: (expected: T) => void;
    toEqual: (expected: any) => void;
    toStrictEqual: (expected: any) => void;
    toBeDefined: () => void;
    toBeUndefined: () => void;
    toBeNull: () => void;
    toBeTruthy: () => void;
    toBeFalsy: () => void;
    toBeGreaterThan: (expected: number) => void;
    toBeGreaterThanOrEqual: (expected: number) => void;
    toBeLessThan: (expected: number) => void;
    toBeLessThanOrEqual: (expected: number) => void;
    toBeCloseTo: (expected: number, numDigits?: number) => void;
    toContain: (expected: any) => void;
    toContainEqual: (expected: any) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledTimes: (expected: number) => void;
    toHaveBeenCalledWith: (...args: any[]) => void;
    toHaveBeenNthCalledWith: (nthCall: number, ...args: any[]) => void;
    toHaveBeenLastCalledWith: (...args: any[]) => void;
    toHaveProperty: (keyPath: string | string[], value?: any) => void;
    toMatch: (expected: string | RegExp) => void;
    toMatchObject: (expected: object) => void;
    toMatchSnapshot: (propertyMatchers?: object, hint?: string) => void;
    toThrow: (expected?: string | Error | RegExp) => void;
    resolves: any;
    rejects: any;
    not: any;
  };
}

export {};
