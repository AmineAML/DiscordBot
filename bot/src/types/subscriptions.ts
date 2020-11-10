export interface Subscriptions {
    total:      number;
    data:       Data[];
    pagination: Pagination;
}

interface Data {
    topic:      string;
    callback:   string;
    expires_at: Date;
}

interface Pagination {
}