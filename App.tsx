import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import LedgerView from './components/LedgerView';
import AccountSelector from './components/AccountSelector';
import { Transaction, AccountBook, ActivityLogEntry, BookType } from './types';

const App: React.FC = () => {
    const [accountBooks, setAccountBooks] = useState<AccountBook[]>([]);
    const [activeAccountBookId, setActiveAccountBookId] = useState<string | null>(null);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

    // Load data from localStorage on initial render
    useEffect(() => {
        try {
            const savedBooks = localStorage.getItem('accountBooks');
            const savedActiveId = localStorage.getItem('activeAccountBookId');
            const savedLog = localStorage.getItem('activityLog');
            
            if (savedBooks) {
                let books = JSON.parse(savedBooks) as AccountBook[];
                // Data migration for older versions without bookType
                books = books.map(book => ({ ...book, bookType: book.bookType || BookType.GENERAL }));

                setAccountBooks(books);
                if (savedActiveId) {
                    const activeId = JSON.parse(savedActiveId);
                    if (books.some(b => b.id === activeId)) {
                        setActiveAccountBookId(activeId);
                    } else if (books.length > 0) {
                        setActiveAccountBookId(books[0].id);
                    }
                } else if (books.length > 0) {
                    setActiveAccountBookId(books[0].id);
                }
            }

            if (savedLog) {
                setActivityLog(JSON.parse(savedLog));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    // Persist data to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('accountBooks', JSON.stringify(accountBooks));
            if (activeAccountBookId) {
                localStorage.setItem('activeAccountBookId', JSON.stringify(activeAccountBookId));
            } else {
                localStorage.removeItem('activeAccountBookId');
            }
            localStorage.setItem('activityLog', JSON.stringify(activityLog));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [accountBooks, activeAccountBookId, activityLog]);

    const activeBook = accountBooks.find(b => b.id === activeAccountBookId);

    const handleAddAccountBook = (name: string, currency: string, bookType: BookType) => {
        const newBook: AccountBook = { id: crypto.randomUUID(), name, currency, transactions: [], bookType };
        const newBooks = [...accountBooks, newBook];
        setAccountBooks(newBooks);
        if (!activeAccountBookId || accountBooks.length === 0) {
            setActiveAccountBookId(newBook.id);
        }
    };
    
    const handleSelectAccountBook = (id: string) => {
        setActiveAccountBookId(id);
    };

    const handleAddTransactionsBatch = (transactions: Omit<Transaction, 'id'>[], source: 'voice' | 'receipt') => {
        if (!activeAccountBookId || !activeBook) return;

        const newTransactions = transactions.map(t => ({ ...t, id: crypto.randomUUID() }));

        const newActivityEntry: ActivityLogEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            source,
            transactions: newTransactions
        };

        setActivityLog([newActivityEntry, ...activityLog].slice(0, 20)); // Keep log size manageable

        const updatedBooks = accountBooks.map(book => {
            if (book.id === activeAccountBookId) {
                return { ...book, transactions: [...newTransactions, ...book.transactions] };
            }
            return book;
        });
        setAccountBooks(updatedBooks);
    };

    const handleUpdateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
        if (!activeAccountBookId) return;
        const updatedBooks = accountBooks.map(book => {
            if (book.id === activeAccountBookId) {
                const newTransactions = book.transactions.map(tx => tx.id === id ? { ...updatedTransaction, id } : tx);
                return { ...book, transactions: newTransactions };
            }
            return book;
        });
        setAccountBooks(updatedBooks);
    };

    const handleDeleteTransaction = (id: string) => {
        if (!activeAccountBookId) return;
        const updatedBooks = accountBooks.map(book => {
            if (book.id === activeAccountBookId) {
                return { ...book, transactions: book.transactions.filter(tx => tx.id !== id) };
            }
            return book;
        });
        setAccountBooks(updatedBooks);
    };
    
    const handleClearActivityLog = () => {
      setActivityLog([]);
    };

    return (
        <div className="bg-background text-gray-200 min-h-screen flex flex-col font-sans">
            <Header />
            <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
                <AccountSelector 
                    accountBooks={accountBooks}
                    activeBookId={activeAccountBookId}
                    onAddBook={handleAddAccountBook}
                    onSelectBook={handleSelectAccountBook}
                />
                
                {activeBook ? (
                    <>
                        <Summary 
                            transactions={activeBook.transactions} 
                            currency={activeBook.currency} 
                            bookType={activeBook.bookType}
                        />
                        <Dashboard 
                            onAddTransactionsBatch={handleAddTransactionsBatch}
                            activityLog={activityLog}
                            onClearActivityLog={handleClearActivityLog}
                            activeBook={activeBook}
                        />
                        <LedgerView 
                            transactions={activeBook.transactions} 
                            onUpdateTransaction={handleUpdateTransaction}
                            onDeleteTransaction={handleDeleteTransaction}
                            currency={activeBook.currency}
                            bookType={activeBook.bookType}
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-dark-gray rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Welcome to Accountant.ai</h2>
                        <p className="text-gray-400">Create an account book to get started.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;