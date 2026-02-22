export interface NewsArticle {
    id: number | string;
    title: string;
    content?: string;
    author?: string;
    authorAvatarUrl?: string;
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

export interface Advertisement {
    id: number | string;
    title: string;
    imageUrl?: string;
    linkUrl?: string;
    placement?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    token: string;
}

export interface UserProfile {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    bio?: string;
    avatarUrl?: string;
    roleId: number;
    roleName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: PaginationMeta;
}
