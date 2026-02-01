import { NewsArticle, Blog, Category, Advertisement } from '@/lib/types';

const API_BASE_URL = 'https://news-blog-api-mzxq.onrender.com/';

async function fetchAPI(endpoint: string, options: RequestInit = {}, token?: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = { ...options.headers as Record<string, string> };
    if (options.body) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        let errorBody;
        try { errorBody = await response.json(); } catch (e) { errorBody = { message: response.statusText }; }
        console.error('API Error:', errorBody);
        throw new Error(errorBody.message || `API call failed: ${response.statusText}`);
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
            categoriesData.forEach(category => categoryMap.set(category.id, category.name));
        }
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    const newsData = await fetchAPI('api/news/', {}, token);
    if (!newsData || !Array.isArray(newsData)) return [];

    return newsData.map(article => {
        const categoryId = article.category_id ? parseInt(article.category_id, 10) : null;
        const category_name = categoryId ? categoryMap.get(categoryId) || 'general' : 'general';

        return {
            id: article.id.toString(),
            title: article.title,
            summary: article.content ? article.content.substring(0, 100) + '...' : '',
            full_content: article.content || '',
            imageUrl: article.imageUrl || '',
            category: article.category_id ? article.category_id.toString() : '',
            category_name: category_name,
            created_at: article.created_at,
            updated_at: article.updated_at || article.created_at,
        };
    });
};

export const getNewsById = async (id: string, token?: string): Promise<NewsArticle | undefined> => {
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
            summary: article.content ? article.content.substring(0, 100) + '...' : '',
            full_content: article.content || '',
            imageUrl: article.imageUrl || '',
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

export const getBlogs = (token?: string): Promise<Blog[]> => fetchAPI('api/blogs/', {}, token);

// Auth
export const register = (data: any) => fetchAPI('api/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data: any) => fetchAPI('api/auth/login', { method: 'POST', body: JSON.stringify(data) });

// Categories
export const getCategories = (token?: string): Promise<Category[]> => fetchAPI('api/categories/', {}, token);
export const createCategory = (data: Partial<Category>, token: string): Promise<Category> => fetchAPI('api/categories/', { method: 'POST', body: JSON.stringify(data) }, token);

// Contact
export const submitContact = (data: any) => fetchAPI('api/contact/', { method: 'POST', body: JSON.stringify(data) });
