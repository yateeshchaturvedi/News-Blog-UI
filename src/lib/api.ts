import { NewsArticle, Blog, Category, Advertisement } from '@/lib/types';

const API_BASE_URL = 'http://localhost:3000/';

interface AuthData {
    username: string;
    password: string
}

interface ContactData {
    name: string;
    email: string;
    message: string;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}, token?: string) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        ...options.headers,
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store' // Force fresh data on every request
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        console.error('API Error:', errorBody);
        throw new Error(errorBody.message || `API call failed: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return {};
}

// Auth
export const register = (data: AuthData) => fetchAPI('api/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data: AuthData) => fetchAPI('api/auth/login', { method: 'POST', body: JSON.stringify(data) });

// News
export const getNews = (token?: string): Promise<NewsArticle[]> => fetchAPI('api/news/', {}, token);
export const getNewsById = (id: string, token?: string): Promise<NewsArticle> => fetchAPI(`api/news/${id}/`, {}, token);
export const createNews = (data: Partial<NewsArticle>, token: string): Promise<NewsArticle> => fetchAPI('api/news/', { method: 'POST', body: JSON.stringify(data) }, token);
export const updateNews = (id: string, data: Partial<NewsArticle>, token: string): Promise<NewsArticle> => fetchAPI(`api/news/${id}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
export const deleteNews = (id: string, token: string): Promise<void> => fetchAPI(`api/news/${id}/`, { method: 'DELETE' }, token);

// Categories
export const getCategories = (token?: string): Promise<Category[]> => fetchAPI('api/categories/', {}, token);
export const getCategoryById = (id: string, token?: string): Promise<Category> => fetchAPI(`api/categories/${id}/`, {}, token);
export const createCategory = (data: Partial<Category>, token: string): Promise<Category> => fetchAPI('api/categories/', { method: 'POST', body: JSON.stringify(data) }, token);
export const updateCategory = (id: string, data: Partial<Category>, token: string): Promise<Category> => fetchAPI(`api/categories/${id}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
export const deleteCategory = (id: string, token: string): Promise<void> => fetchAPI(`api/categories/${id}/`, { method: 'DELETE' }, token);

// Blogs
export const getBlogs = (token?: string): Promise<Blog[]> => fetchAPI('api/blogs/', {}, token);
export const getBlogById = (id: string, token?: string): Promise<Blog> => fetchAPI(`api/blogs/${id}/`, {}, token);
export const createBlog = (data: Partial<Blog>, token: string): Promise<Blog> => fetchAPI('api/blogs/', { method: 'POST', body: JSON.stringify(data) }, token);
export const updateBlog = (id: string, data: Partial<Blog>, token: string): Promise<Blog> => fetchAPI(`api/blogs/${id}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
export const deleteBlog = (id: string, token: string): Promise<void> => fetchAPI(`api/blogs/${id}/`, { method: 'DELETE' }, token);

// Advertisements
export const getAdvertisements = (token?: string): Promise<Advertisement[]> => fetchAPI('api/advertisements/', {}, token);
export const getAdvertisementById = (id: string, token?: string): Promise<Advertisement> => fetchAPI(`api/advertisements/${id}/`, {}, token);
export const createAdvertisement = (data: Partial<Advertisement>, token: string): Promise<Advertisement> => fetchAPI('api/advertisements/', { method: 'POST', body: JSON.stringify(data) }, token);
export const updateAdvertisement = (id: string, data: Partial<Advertisement>, token: string): Promise<Advertisement> => fetchAPI(`api/advertisements/${id}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
export const deleteAdvertisement = (id: string, token: string): Promise<void> => fetchAPI(`api/advertisements/${id}/`, { method: 'DELETE' }, token);

// Contact
export const submitContact = (data: ContactData) => fetchAPI('api/contact/', { method: 'POST', body: JSON.stringify(data) });