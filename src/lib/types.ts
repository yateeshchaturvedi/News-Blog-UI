export interface NewsArticle {
    id: number | string;
    title: string;
    content?: string;
    author?: string;
    status?: string;
    user_id?: number;
    summary?: string;
    full_content?: string;
    imageUrl?: string;
    createdAt?: string;
    created_at?: string;
    updated_at?: string;
    publishedAt?: string;
    category?: string;
    category_name?: string;
}

export interface Blog {
    id: number | string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number | string;
    name: string;
}

export interface LoginResponse {
    token: string;
}
