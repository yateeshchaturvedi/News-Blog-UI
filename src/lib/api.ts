import { NewsArticle, Blog, Category } from '@/lib/types';

const API_BASE_URL = 'https://news-blog-api-mzxq.onrender.com/';

interface ApiArticle {
    id: number | string;
    title: string;
    author?: string;
    created_by?: string;
    createdBy?: string;
    userId?: string;
    author_name?: string;
    authorName?: string;
    user?: {
        name?: string;
        username?: string;
    };
    username?: string;
    content: string;
    imageUrl: string;
    image_path?: string;
    imagePath?: string;
    created_at: string;
    updated_at: string;
    status?: string;
    user_id?: number;
    category_id: number | null;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}, token?: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = { ...options.headers as Record<string, string> };
    if (options.body) headers['Content-Type'] = 'application/json';
    if (token) {
        const normalizedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        headers['Authorization'] = `Bearer ${normalizedToken}`;
        headers['x-auth-token'] = normalizedToken;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const rawBody = await response.text();
        let errorBody: Record<string, unknown> | null = null;
        try {
            errorBody = rawBody ? JSON.parse(rawBody) : null;
        } catch {
            errorBody = null;
        }
        const errorMessage =
            (errorBody?.msg as string) ||
            (errorBody?.message as string) ||
            (rawBody || '').trim() ||
            `API call failed: ${response.status} ${response.statusText}`;
        console.error('API Error:', { status: response.status, statusText: response.statusText, body: rawBody });
        throw new Error(errorMessage);
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
        const categoryId = article.category_id ?? null;
        const category_name = categoryId ? categoryMap.get(categoryId) || 'general' : 'general';
        const author =
            article.author ||
            article.author_name ||
            article.authorName ||
            article.created_by ||
            article.createdBy ||
            article.userId ||
            article.user?.name ||
            article.user?.username ||
            article.username ||
            (article.user_id ? `User #${article.user_id}` : 'Unknown');

        return {
            id: article.id.toString(),
            title: article.title,
            author,
            summary: article.content ? article.content.substring(0, 100) + '...' : '',
            content: article.content || '',
            full_content: article.content || '',
            imageUrl: article.imageUrl || article.image_path || article.imagePath || '',
            status: article.status || 'PENDING',
            user_id: article.user_id,
            publishedAt: article.created_at,
            category: article.category_id ? article.category_id.toString() : '',
            category_name: category_name,
            created_at: article.created_at,
            updated_at: article.updated_at || article.created_at,
        };
    });
};

export const getNewsArticle = async (id: string | number, token?: string): Promise<NewsArticle | undefined> => {
    try {
        const article = await fetchAPI(`api/news/${encodeURIComponent(String(id))}/`, {}, token) as ApiArticle;
        if (!article) return undefined;
        const author =
            article.author ||
            article.author_name ||
            article.authorName ||
            article.created_by ||
            article.createdBy ||
            article.userId ||
            article.user?.name ||
            article.user?.username ||
            article.username ||
            (article.user_id ? `User #${article.user_id}` : 'Unknown');

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
            author,
            summary: article.content ? article.content.substring(0, 100) + '...' : '',
            content: article.content || '', // Add this line
            full_content: article.content || '',
            imageUrl: article.imageUrl || article.image_path || article.imagePath || '',
            status: article.status || 'PENDING',
            user_id: article.user_id,
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

export const createNewsArticle = async (data: Partial<NewsArticle>, token: string): Promise<NewsArticle> => {
    const payload: Record<string, unknown> = {
        title: data.title,
        content: data.content,
        imagePath: data.imageUrl || null,
        categoryId: Number(data.category),
    };
    return fetchAPI('api/news/', { method: 'POST', body: JSON.stringify(payload) }, token);
};

export const updateNewsArticle = (id: string | number, data: Partial<NewsArticle>, token: string): Promise<NewsArticle> => {
    const payload: Record<string, unknown> = {
        title: data.title,
        content: data.content,
        imagePath: data.imageUrl || null,
        status: data.status || 'PENDING',
    };
    if (data.category) payload.categoryId = Number(data.category);
    return fetchAPI(`api/news/${encodeURIComponent(String(id))}/`, { method: 'PUT', body: JSON.stringify(payload) }, token);
};

export const updateNewsStatusArticle = (
    id: string | number,
    status: 'PENDING' | 'APPROVED',
    token: string
): Promise<NewsArticle> => {
    return fetchAPI(
        `api/news/${encodeURIComponent(String(id))}/status`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        token
    );
};

export const deleteNewsArticle = (id: string | number, token: string): Promise<void> => {
    return fetchAPI(`api/news/${encodeURIComponent(String(id))}/`, { method: 'DELETE' }, token);
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
export const createEditorAccount = (data: { username: string; password: string }) =>
    fetchAPI('api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            ...data,
            role: 'EDITOR',
            roleId: 2,
            role_id: 2,
        }),
    });

// Categories
export const getCategories = (token?: string): Promise<Category[]> => fetchAPI('api/categories/', {}, token);
export const createCategory = (data: Partial<Category>, token: string): Promise<Category> => fetchAPI('api/categories/', { method: 'POST', body: JSON.stringify(data) }, token);

// Contact
export const submitContact = (data: Record<string, unknown>) => fetchAPI('api/contact/', { method: 'POST', body: JSON.stringify(data) });
