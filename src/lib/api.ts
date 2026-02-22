import { NewsArticle, Blog, Category, Advertisement, UserProfile, PaginatedResult, PaginationMeta } from '@/lib/types';
import { createRequestId, logEvent } from '@/lib/observability';

const configuredApiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

const API_BASE_URL = (
    configuredApiBaseUrl ||
    (process.env.NODE_ENV === 'production'
        ? 'https://news-blog-api-mzxq.onrender.com'
        : 'http://localhost:3000')
).replace(/\/+$/, '');

interface ApiArticle {
    id: number | string;
    title: string;
    author?: string;
    created_by?: string;
    createdBy?: string;
    userId?: string;
    author_name?: string;
    author_avatar_url?: string;
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

interface ApiBlog {
    id: number | string;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    created_at?: string;
    updated_at?: string;
}

interface ApiAdvertisement {
    id: number | string;
    title: string;
    imageUrl?: string;
    image_url?: string;
    image_path?: string;
    imagePath?: string;
    linkUrl?: string;
    link_url?: string;
    placement?: string;
    isActive?: boolean;
    is_active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    created_at?: string;
    updated_at?: string;
}

interface ApiUserProfile {
    id: number;
    username: string;
    fullName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    roleId: number;
    roleName?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiPaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}

function stripHtml(content: string): string {
    return content
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

function summarizeContent(content: string, maxLength = 100): string {
    const plain = stripHtml(content || '');
    if (!plain) return '';
    if (plain.length <= maxLength) return plain;
    return `${plain.slice(0, maxLength).trimEnd()}...`;
}

function mapApiArticle(article: ApiArticle, categoryMap: Map<number, string>): NewsArticle {
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
        authorAvatarUrl: article.author_avatar_url || '',
        summary: summarizeContent(article.content || '', 100),
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
}

function mapApiBlog(blog: ApiBlog): Blog {
    return {
        id: blog.id,
        title: blog.title,
        content: blog.content || '',
        createdAt: blog.createdAt || blog.created_at || '',
        updatedAt: blog.updatedAt || blog.updated_at || blog.createdAt || blog.created_at || '',
    };
}

async function fetchAPI(endpoint: string, options: RequestInit = {}, token?: string) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}`;
    const requestId = createRequestId();
    const headers: Record<string, string> = { ...options.headers as Record<string, string> };
    if (options.body) headers['Content-Type'] = 'application/json';
    headers['x-request-id'] = requestId;
    if (token) {
        const normalizedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        headers['Authorization'] = `Bearer ${normalizedToken}`;
        headers['x-auth-token'] = normalizedToken;
    }

    const startedAt = Date.now();
    const response = await fetch(url, { ...options, headers });
    const responseRequestId = response.headers.get('x-request-id') || requestId;

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
        logEvent('error', 'api.request_failed', {
            requestId: responseRequestId,
            url,
            method: options.method || 'GET',
            status: response.status,
            statusText: response.statusText,
            durationMs: Date.now() - startedAt,
        });
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    logEvent('info', 'api.request_completed', {
        requestId: responseRequestId,
        url,
        method: options.method || 'GET',
        status: response.status,
        durationMs: Date.now() - startedAt,
    });
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

    return newsData.map((article: ApiArticle) => mapApiArticle(article, categoryMap));
};

export const getPaginatedNews = async (
    page: number,
    limit = 12,
    status?: 'APPROVED' | 'PENDING',
    token?: string
): Promise<PaginatedResult<NewsArticle>> => {
    const categoryMap = new Map<number, string>();
    try {
        const categoriesData = await fetchAPI('api/categories/', {}, token);
        if (categoriesData && Array.isArray(categoriesData)) {
            categoriesData.forEach((category: { id: number; name: string }) => categoryMap.set(category.id, category.name));
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }

    const statusQuery = status ? `&status=${encodeURIComponent(status)}` : '';
    const response = await fetchAPI(
        `api/news/?page=${Math.max(1, page)}&limit=${Math.max(1, limit)}${statusQuery}`,
        {},
        token
    ) as ApiPaginatedResponse<ApiArticle>;
    const items = Array.isArray(response?.items)
        ? response.items.map((article) => mapApiArticle(article, categoryMap))
        : [];

    return {
        items,
        pagination: response?.pagination || {
            page: Math.max(1, page),
            limit: Math.max(1, limit),
            total: items.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
        },
    };
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
            authorAvatarUrl: article.author_avatar_url || '',
            summary: summarizeContent(article.content || '', 100),
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

    const response = await fetch(`${API_BASE_URL}/api/upload/`, {
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

export const getBlogs = async (token?: string): Promise<Blog[]> => {
    const blogs = await fetchAPI('api/blogs/', {}, token);
    if (!Array.isArray(blogs)) return [];
    return blogs.map((blog: ApiBlog) => mapApiBlog(blog));
};

export const getPaginatedBlogs = async (
    page: number,
    limit = 12,
    status?: 'APPROVED' | 'PENDING',
    token?: string
): Promise<PaginatedResult<Blog>> => {
    const statusQuery = status ? `&status=${encodeURIComponent(status)}` : '';
    const response = await fetchAPI(
        `api/blogs/?page=${Math.max(1, page)}&limit=${Math.max(1, limit)}${statusQuery}`,
        {},
        token
    ) as ApiPaginatedResponse<ApiBlog>;
    const items = Array.isArray(response?.items) ? response.items.map((blog) => mapApiBlog(blog)) : [];

    return {
        items,
        pagination: response?.pagination || {
            page: Math.max(1, page),
            limit: Math.max(1, limit),
            total: items.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
        },
    };
};

// Auth
export const register = (data: Record<string, unknown>) => fetchAPI('api/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data: Record<string, unknown>) => fetchAPI('api/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const createEditorAccount = (
    data: { username: string; password: string; fullName: string; email: string; phone: string },
    token: string
) =>
    fetchAPI('api/auth/register-editor', {
        method: 'POST',
        body: JSON.stringify(data),
    }, token);

export const getMyProfile = async (token: string): Promise<UserProfile> => {
    const profile = await fetchAPI('api/auth/me', {}, token) as ApiUserProfile;
    return {
        id: profile.id,
        username: profile.username,
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        roleId: profile.roleId,
        roleName: profile.roleName || '',
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || '',
    };
};

export const updateMyProfile = (
    data: Pick<UserProfile, 'username' | 'fullName' | 'email' | 'phone'> &
        Partial<Pick<UserProfile, 'bio' | 'avatarUrl'>> & {
            currentPassword?: string;
            newPassword?: string;
        },
    token: string
): Promise<UserProfile> =>
    fetchAPI('api/auth/me', { method: 'PUT', body: JSON.stringify(data) }, token);

// Categories
export const getCategories = (token?: string): Promise<Category[]> => fetchAPI('api/categories/', {}, token);
export const createCategory = (data: Partial<Category>, token: string): Promise<Category> => fetchAPI('api/categories/', { method: 'POST', body: JSON.stringify(data) }, token);
export const updateCategory = (id: string | number, data: Partial<Category>, token: string): Promise<Category> =>
    fetchAPI(`api/categories/${encodeURIComponent(String(id))}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
export const deleteCategory = (id: string | number, token: string): Promise<void> =>
    fetchAPI(`api/categories/${encodeURIComponent(String(id))}/`, { method: 'DELETE' }, token);

// Blogs
export const createBlog = (data: Pick<Blog, 'title' | 'content'>, token: string): Promise<Blog> =>
    fetchAPI('api/blogs/', { method: 'POST', body: JSON.stringify(data) }, token);
export const updateBlog = (id: string | number, data: Pick<Blog, 'title' | 'content'>, token: string): Promise<Blog> =>
    fetchAPI(`api/blogs/${encodeURIComponent(String(id))}/`, { method: 'PUT', body: JSON.stringify(data) }, token);
export const deleteBlog = (id: string | number, token: string): Promise<void> =>
    fetchAPI(`api/blogs/${encodeURIComponent(String(id))}/`, { method: 'DELETE' }, token);

// Advertisements
export const getAdvertisements = async (token?: string): Promise<Advertisement[]> => {
    const endpoints = ['api/advertisements/', 'api/ads/'];
    for (const endpoint of endpoints) {
        try {
            const ads = await fetchAPI(endpoint, {}, token);
            if (!Array.isArray(ads)) return [];
            return ads.map((ad: ApiAdvertisement) => ({
                id: ad.id,
                title: ad.title,
                imageUrl: ad.imageUrl || ad.image_url || ad.image_path || ad.imagePath || '',
                linkUrl: ad.linkUrl || ad.link_url || '',
                placement: ad.placement || 'homepage',
                isActive: ad.isActive ?? ad.is_active ?? true,
                createdAt: ad.createdAt || ad.created_at || '',
                updatedAt: ad.updatedAt || ad.updated_at || '',
            }));
        } catch {
            continue;
        }
    }
    return [];
};

export const createAdvertisement = async (
    data: { title: string; imageUrl?: string; linkUrl?: string; placement?: string; isActive?: boolean },
    token: string
): Promise<Advertisement> => {
    const payload = {
        title: data.title,
        imageUrl: data.imageUrl || null,
        linkUrl: data.linkUrl || null,
        placement: data.placement || 'homepage',
        isActive: data.isActive ?? true,
    };
    try {
        return await fetchAPI('api/advertisements/', { method: 'POST', body: JSON.stringify(payload) }, token);
    } catch {
        return fetchAPI('api/ads/', { method: 'POST', body: JSON.stringify(payload) }, token);
    }
};

export const updateAdvertisement = async (
    id: string | number,
    data: { title: string; imageUrl?: string; linkUrl?: string; placement?: string; isActive?: boolean },
    token: string
): Promise<Advertisement> => {
    const payload = {
        title: data.title,
        imageUrl: data.imageUrl || null,
        linkUrl: data.linkUrl || null,
        placement: data.placement || 'homepage',
        isActive: data.isActive ?? true,
    };
    try {
        return await fetchAPI(`api/advertisements/${encodeURIComponent(String(id))}/`, { method: 'PUT', body: JSON.stringify(payload) }, token);
    } catch {
        return fetchAPI(`api/ads/${encodeURIComponent(String(id))}/`, { method: 'PUT', body: JSON.stringify(payload) }, token);
    }
};

export const deleteAdvertisement = async (id: string | number, token: string): Promise<void> => {
    try {
        await fetchAPI(`api/advertisements/${encodeURIComponent(String(id))}/`, { method: 'DELETE' }, token);
    } catch {
        await fetchAPI(`api/ads/${encodeURIComponent(String(id))}/`, { method: 'DELETE' }, token);
    }
};

// Contact
export const submitContact = (data: Record<string, unknown>) => fetchAPI('api/contact/', { method: 'POST', body: JSON.stringify(data) });
