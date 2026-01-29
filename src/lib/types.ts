export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
}

export interface Blog {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Advertisement {
    id: string;
    title: string;
    image: string;
    link: string;
}
