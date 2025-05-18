/**
 * Type declarations for modules without TypeScript definitions
 */

declare module 'pdf-parse' {
  function parse(dataBuffer: Buffer, options?: any): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;

  export = parse;
}

declare module 'mammoth' {
  export function extractRawText(options: { path: string } | { buffer: Buffer }): Promise<{ value: string, messages: any[] }>;
  export function convertToHtml(options: { path: string } | { buffer: Buffer }): Promise<{ value: string, messages: any[] }>;
}

declare module 'textract' {
  export function fromFileWithPath(
    filePath: string, 
    options: any, 
    callback: (error: Error | null, text: string) => void
  ): void;
}

declare module 'compromise' {
  // Basic compromise declarations
  function nlp(text: string): any;
  export = nlp;
}
