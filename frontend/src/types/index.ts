export interface Project {
    id: number;
    title: string;
    description: string;
    tech_stack: string[];
    live_url: string | null;
    github_url: string | null;
    image: string | null;
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
    detail: string
}

export interface ApiError {
    [key: string]: string[];
}