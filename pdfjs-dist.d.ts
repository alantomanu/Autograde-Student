   // pdfjs-dist.d.ts
   declare module 'pdfjs-dist/build/pdf' {
    export const GlobalWorkerOptions: {
        workerSrc: string;
    };
    export class PDFDocumentProxy {
        // Define methods and properties as needed
        getPage(pageNumber: number): Promise<PDFPageProxy>;
        // Add other methods as needed
    }
    export class PDFPageProxy {
        // Define methods and properties as needed
        getTextContent(): Promise<unknown>; // Use unknown instead of any
        // Add other methods as needed
    }
    export function getDocument(url: string): Promise<PDFDocumentProxy>;
    // Add other exports as needed
}