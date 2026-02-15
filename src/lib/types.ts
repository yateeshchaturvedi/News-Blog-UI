export interface NewsArticle {
    id: number;
    title: string;
    content: string;
    author: string;
    imageUrl?: string;
    createdAt: string;
    category: string; 
}

export interface LoginResponse {
    token: string;
}
