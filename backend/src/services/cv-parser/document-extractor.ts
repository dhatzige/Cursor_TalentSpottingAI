/**
 * Document Extractor
 * 
 * Handles extraction of text from different document formats (PDF, Word)
 */
import fs from 'fs';
import path from 'path';

// Handle non-ESM modules with require()
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text content from a document file based on its extension
 * 
 * @param filePath Path to the document file
 * @returns Extracted text content as string
 */
export async function extractTextFromDocument(filePath: string): Promise<string> {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  try {
    // Extract text based on file type
    if (fileExtension === '.pdf') {
      return await extractTextFromPdf(filePath);
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      return await extractTextFromWord(filePath);
    } else {
      throw new Error('Unsupported file type. Only PDF and Word documents are supported.');
    }
  } catch (error) {
    console.error(`Error extracting text from ${fileExtension} document:`, error);
    throw error;
  }
}

/**
 * Extract text from a PDF file
 */
async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

/**
 * Extract text from a Word document
 */
async function extractTextFromWord(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({
      path: filePath
    });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw error;
  }
}
