
import React, { useState, useEffect } from 'react';
import type { Book } from './lib/ebook-engine/types';
import FileLoader from './components/reader/FileLoader';
import Reader from './components/reader/Reader';
import { makeBook, UnsupportedTypeError } from './lib/ebook-engine';

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        console.log('[EBookReader] App component mounted.');
    }, []);

    const handleFileSelect = (selectedFile: File) => {
        console.log('[EBookReader] File selected:', selectedFile.name);
        setFile(selectedFile);
    };

    useEffect(() => {
        if (!file) return;

        const loadBook = async () => {
            console.log('[EBookReader] Starting to load book...');
            try {
                const bookInstance = await makeBook(file);
                console.log(`[EBookReader] Book loaded successfully: "${bookInstance.metadata?.title}"`);
                setBook(bookInstance);
            } catch (error) {
                console.error("[EBookReader] Error loading book:", error);
                let message = "Failed to load book. The file format may not be supported or the file may be corrupt.";
                if (error instanceof UnsupportedTypeError) {
                    message = error.message;
                }
                alert(message);
                setFile(null);
                setBook(null); // Also reset book state on error
            }
        };

        loadBook();

    }, [file]);

    if (!book) {
        return <FileLoader onFileSelect={handleFileSelect} />;
    }

    return <Reader book={book} />;
}