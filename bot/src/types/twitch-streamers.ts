export interface UsersStreaming {
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id:            string;
    user_id:       string;
    user_name:     string;
    game_id:       string;
    type:          string;
    title:         string;
    viewer_count:  number;
    started_at:    Date;
    language:      string;
    thumbnail_url: string;
    tag_ids:       string[];
}

export interface Pagination {
}