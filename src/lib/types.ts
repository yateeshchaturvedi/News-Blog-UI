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
    status?: string;
    authorName?: string;
    authorAvatarUrl?: string;
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

export interface InterviewQuestion {
    id: number | string;
    question: string;
    answer: string;
    category?: string | null;
    isPublished?: boolean;
    authorName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    ip_address?: string | null;
    user_agent?: string | null;
    is_spam: boolean;
    moderation_reason?: string | null;
    status: 'NEW' | 'REVIEWED' | 'RESOLVED';
    reviewed_at?: string | null;
    reviewed_by?: number | null;
    review_notes?: string | null;
    created_at: string;
}

export interface AuditLogItem {
    id: number;
    actor_user_id?: number | null;
    actor_role_id?: number | null;
    action: string;
    entity_type: string;
    entity_id?: string | null;
    before_state?: unknown;
    after_state?: unknown;
    request_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
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
