export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    full_content: string;
    imageUrl: string;
    category: string; // Holds the category ID from the API
    category_name?: string; // Will be populated with the category name
    created_at: string;
    updated_at: string;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Advertisement {
    id: string;
    company: string;
    imageUrl: string;
    link: string;
    createdAt: string;
    updatedAt: string;
}
