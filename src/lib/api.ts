import { NewsArticle, Blog, Category } from '@/lib/types';

const API_BASE_URL = 'https://news-blog-api-mzxq.onrender.com/';

interface ApiArticle {
    id: number;
    title: string;
    author: string;
    content: string;
    imageUrl: string;
    created_at: string;
    updated_at: string;
    category_id: string | null;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}, token?: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = { ...options.headers as Record<string, string> };
    if (options.body) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch {
            errorBody = { msg: response.statusText };
        }
        console.error('API Error:', errorBody);
        throw new Error(errorBody.msg || `API call failed: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) return response.json();
    return {};
}

// --- DATA FETCHING LOGIC ---

export const getNews = async (token?: string): Promise<NewsArticle[]> => {
    const categoryMap = new Map<number, string>();
    try {
        const categoriesData = await fetchAPI('api/categories/', {}, token);
        if (categoriesData && Array.isArray(categoriesData)) {
            categoriesData.forEach((category: { id: number; name: string }) => categoryMap.set(category.id, category.name));
        }
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    const newsData = await fetchAPI('api/news/', {}, token);
    if (!newsData || !Array.isArray(newsData)) return [];

    return newsData.map((article: ApiArticle) => {
        const categoryId = article.category_id ? parseInt(article.category_id, 10) : null;
        const category_name = categoryId ? categoryMap.get(categoryId) || 'general' : 'general';

        return {
            id: article.id.toString(),
            title: article.title,
            author: article.author,
            summary: article.content ? article.content.substring(0, 100) + '...' : '',
            content: article.content || '',
            full_content: article.content || '',
            imageUrl: article.imageUrl || '',
            publishedAt: article.created_at,
            category: article.category_id ? article.category_id.toString() : '',
            category_name: category_name,
            created_at: article.created_at,
            updated_at: article.updated_at || article.created_at,
        };
    });
};

export const getNewsArticle = async (id: number, token?: string): Promise<NewsArticle | undefined> => {
    try {
        const article = await fetchAPI(`api/news/${id}/`, {}, token);
        if (!article) return undefined;

        let category_name = 'general';
        if (article.category_id) {
            try {
                const categoryData = await fetchAPI(`api/categories/${article.category_id}/`, {}, token);
                if (categoryData && categoryData.name) {
                    category_name = categoryData.name;
                }
            } catch (catError) {
                console.error(`Could not fetch category for article ${id}:`, catError);
            }
        }

        return {
            id: article.id.toString(),
            title: article.title,
            author: article.author, // Add this line
            summary: article.content ? article.content.substring(0, 100) + '...' : '',
            content: article.content || '', // Add this line
            full_content: article.content || '',
            imageUrl: article.imageUrl || '',
            publishedAt: article.created_at, // Add this line
            category: article.category_id ? article.category_id.toString() : '',
            category_name: category_name,
            created_at: article.created_at,
            updated_at: article.updated_at || article.created_at,
        };
    } catch (error) {
        console.error(`Error fetching news by id ${id}:`, error);
        return undefined;
    }
};

export const createNewsArticle = (data: Partial<NewsArticle>, token: string): Promise<NewsArticle> => {
    return fetchAPI('api/news/', { method: 'POST', body: JSON.stringify(data) }, token);
};

export const updateNewsArticle = (id: number, data: Partial<NewsArticle>, token: string): Promise<NewsArticle> => {
    return fetchAPI(`api/news/${id}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
};

export const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}api/upload/`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Image upload failed');
    }

    const result = await response.json();
    return result.url;
};

export const getBlogs = (token?: string): Promise<Blog[]> => fetchAPI('api/blogs/', {}, token);

// Auth
export const register = (data: Record<string, unknown>) => fetchAPI('api/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data: Record<string, unknown>) => fetchAPI('api/auth/login', { method: 'POST', body: JSON.stringify(data) });

// Categories
export const getCategories = (token?: string): Promise<Category[]> => fetchAPI('api/categories/', {}, token);
export const createCategory = (data: Partial<Category>, token: string): Promise<Category> => fetchAPI('api/categories/', { method: 'POST', body: JSON.stringify(data) }, token);

// Contact
export const submitContact = (data: Record<string, unknown>) => fetchAPI('api/contact/', { method: 'POST', body: JSON.stringify(data) });
