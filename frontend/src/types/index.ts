export interface Project {
    id: number;
    title: string;
    description: string;
    tech_stack: string[];
    live_url: string | null;
    github_url: string | null;
    image_url: string | null;
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export interface ContactResponse {
    detail: string;
}

export interface ApiError {
    [key: string]: string[];
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AdminUser {
    username: string;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

export interface About {
    id: number;
    full_name: string;
    tagline: string;
    bio: string;
    photo: string | null;
    cv: string | null;
    location: string;
    target: string;
    education: string;
    japanese_level: string;
    status: string;
    email: string;
    github_url: string;
    linkedin_url: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    category: string;
    order: number;
}

export interface Experience {
    id: number;
    role: string;
    company: string;
    period: string;
    location: string;
    description: string;
    order: number;
}

export interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date_issued: string;
    credential_url: string | null;
    image: string | null;
    order: number;
}

export interface GalleryImage {
    id: number;
    title: string;
    image: string;
    category: string;
    order: number;
    created_at: string;
}