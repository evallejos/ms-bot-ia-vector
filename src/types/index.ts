export type CFKChunk = {
    title: string;
    url: string;
    date: string;
    content: string;
    content_length: number;
    content_tokens: number;
    embedding: number[];
};

export type CFKJson = {
    cfk: CFKChunk[]
};