export interface Comments {
    kind: RepliesKind;
    data: CommentData;
}

export interface CommentData {
    modhash:  string;
    dist:     number | null;
    children: PurpleChild[];
    after:    null;
    before:   null;
}

export interface PurpleChild {
    kind: ChildKind;
    data: PurpleData;
}

export interface PurpleData {
    approved_at_utc:                  null;
    subreddit:                        Subreddit;
    selftext?:                        string;
    user_reports:                     any[];
    saved:                            boolean;
    mod_reason_title:                 null;
    gilded:                           number;
    clicked?:                         boolean;
    title?:                           string;
    link_flair_richtext?:             FlairRichtext[];
    subreddit_name_prefixed:          SubredditNamePrefixed;
    hidden?:                          boolean;
    pwls?:                            number;
    link_flair_css_class?:            string;
    downs:                            number;
    thumbnail_height?:                number;
    top_awarded_type:                 null;
    parent_whitelist_status?:         string;
    hide_score?:                      boolean;
    media_metadata?:                  MediaMetadata;
    name:                             string;
    quarantine?:                      boolean;
    link_flair_text_color?:           string;
    upvote_ratio?:                    number;
    author_flair_background_color:    null | string;
    subreddit_type:                   SubredditType;
    ups:                              number;
    total_awards_received:            number;
    media_embed?:                     Gildings;
    thumbnail_width?:                 number;
    author_flair_template_id:         null | string;
    is_original_content?:             boolean;
    author_fullname:                  string;
    secure_media?:                    null;
    is_reddit_media_domain?:          boolean;
    is_meta?:                         boolean;
    category?:                        null;
    secure_media_embed?:              Gildings;
    link_flair_text?:                 string;
    can_mod_post:                     boolean;
    score:                            number;
    approved_by:                      null;
    author_premium:                   boolean;
    thumbnail?:                       string;
    edited:                           boolean | number;
    author_flair_css_class:           null;
    author_flair_richtext:            FlairRichtext[];
    gildings:                         Gildings;
    content_categories?:              null;
    is_self?:                         boolean;
    mod_note:                         null;
    created:                          number;
    link_flair_type?:                 AuthorFlairType;
    wls?:                             number;
    removed_by_category?:             null;
    banned_by:                        null;
    author_flair_type:                AuthorFlairType;
    domain?:                          string;
    allow_live_comments?:             boolean;
    selftext_html?:                   string;
    likes:                            null;
    suggested_sort?:                  null;
    banned_at_utc:                    null;
    view_count?:                      null;
    archived:                         boolean;
    no_follow:                        boolean;
    is_crosspostable?:                boolean;
    pinned?:                          boolean;
    over_18?:                         boolean;
    all_awardings:                    AllAwarding[];
    awarders:                         any[];
    media_only?:                      boolean;
    link_flair_template_id?:          string;
    can_gild:                         boolean;
    spoiler?:                         boolean;
    locked:                           boolean;
    author_flair_text:                null | string;
    treatment_tags:                   any[];
    visited?:                         boolean;
    removed_by?:                      null;
    num_reports:                      null;
    distinguished:                    null;
    subreddit_id:                     SubredditID;
    mod_reason_by:                    null;
    removal_reason:                   null;
    link_flair_background_color?:     string;
    id:                               string;
    is_robot_indexable?:              boolean;
    num_duplicates?:                  number;
    report_reasons:                   null;
    author:                           string;
    discussion_type?:                 null;
    num_comments?:                    number;
    send_replies:                     boolean;
    media?:                           null;
    contest_mode?:                    boolean;
    author_patreon_flair:             boolean;
    author_flair_text_color:          AuthorFlairTextColor | null;
    permalink:                        string;
    whitelist_status?:                string;
    stickied:                         boolean;
    url?:                             string;
    subreddit_subscribers?:           number;
    created_utc:                      number;
    num_crossposts?:                  number;
    mod_reports:                      any[];
    is_video?:                        boolean;
    comment_type?:                    null;
    link_id?:                         ID;
    replies?:                         PurpleReplies | string;
    parent_id?:                       ID;
    body?:                            string;
    is_submitter?:                    boolean;
    collapsed?:                       boolean;
    body_html?:                       string;
    collapsed_reason?:                null;
    associated_award?:                null;
    score_hidden?:                    boolean;
    controversiality?:                number;
    depth?:                           number;
    collapsed_because_crowd_control?: null;
}

export interface AllAwarding {
    giver_coin_reward:                    number;
    subreddit_id:                         null;
    is_new:                               boolean;
    days_of_drip_extension:               number;
    coin_price:                           number;
    id:                                   string;
    penny_donate:                         number;
    coin_reward:                          number;
    icon_url:                             string;
    days_of_premium:                      number;
    icon_height:                          number;
    tiers_by_required_awardings:          null;
    resized_icons:                        ResizedIcon[];
    icon_width:                           number;
    static_icon_width:                    number;
    start_date:                           null;
    is_enabled:                           boolean;
    awardings_required_to_grant_benefits: null;
    description:                          string;
    end_date:                             null;
    subreddit_coin_reward:                number;
    count:                                number;
    static_icon_height:                   number;
    name:                                 string;
    resized_static_icons:                 ResizedIcon[];
    icon_format:                          string;
    award_sub_type:                       string;
    penny_price:                          number;
    award_type:                           string;
    static_icon_url:                      string;
}

export interface ResizedIcon {
    url:    string;
    width:  number;
    height: number;
}

export interface FlairRichtext {
    e: AuthorFlairType;
    t: string;
}

export enum AuthorFlairType {
    Richtext = "richtext",
    Text = "text",
}

export enum AuthorFlairTextColor {
    Dark = "dark",
}

export interface Gildings {
}

export enum ID {
    T3J21736 = "t3_j21736",
}

export interface MediaMetadata {
    "5zkig6tlx3q51": The5Zkig6Tlx3Q51;
}

export interface The5Zkig6Tlx3Q51 {
    status: string;
    e:      string;
    m:      string;
    p:      S[];
    s:      S;
    id:     string;
}

export interface S {
    y: number;
    x: number;
    u: string;
}

export interface PurpleReplies {
    kind: RepliesKind;
    data: FluffyData;
}

export interface FluffyData {
    modhash:  string;
    dist:     null;
    children: FluffyChild[];
    after:    null;
    before:   null;
}

export interface FluffyChild {
    kind: ChildKind;
    data: TentacledData;
}

export interface TentacledData {
    total_awards_received:           number;
    approved_at_utc:                 null;
    comment_type:                    null;
    awarders:                        any[];
    mod_reason_by:                   null;
    banned_by:                       null;
    ups:                             number;
    author_flair_type:               AuthorFlairType;
    removal_reason:                  null;
    link_id:                         ID;
    author_flair_template_id:        null | string;
    likes:                           null;
    replies:                         FluffyReplies | string;
    user_reports:                    any[];
    saved:                           boolean;
    id:                              string;
    banned_at_utc:                   null;
    mod_reason_title:                null;
    gilded:                          number;
    archived:                        boolean;
    no_follow:                       boolean;
    author:                          string;
    can_mod_post:                    boolean;
    send_replies:                    boolean;
    parent_id:                       string;
    score:                           number;
    author_fullname:                 string;
    report_reasons:                  null;
    approved_by:                     null;
    all_awardings:                   any[];
    subreddit_id:                    SubredditID;
    collapsed:                       boolean;
    body:                            string;
    edited:                          boolean;
    author_flair_css_class:          null;
    is_submitter:                    boolean;
    downs:                           number;
    author_flair_richtext:           FlairRichtext[];
    author_patreon_flair:            boolean;
    body_html:                       string;
    gildings:                        Gildings;
    collapsed_reason:                null | string;
    associated_award:                null;
    stickied:                        boolean;
    author_premium:                  boolean;
    subreddit_type:                  SubredditType;
    can_gild:                        boolean;
    top_awarded_type:                null;
    author_flair_text_color:         AuthorFlairTextColor | null;
    score_hidden:                    boolean;
    permalink:                       string;
    num_reports:                     null;
    locked:                          boolean;
    name:                            string;
    created:                         number;
    subreddit:                       Subreddit;
    author_flair_text:               AuthorFlairText | null;
    treatment_tags:                  any[];
    created_utc:                     number;
    subreddit_name_prefixed:         SubredditNamePrefixed;
    controversiality:                number;
    depth:                           number;
    author_flair_background_color:   null;
    collapsed_because_crowd_control: null;
    mod_reports:                     any[];
    mod_note:                        null;
    distinguished:                   null;
}

export enum AuthorFlairText {
    CNNDeC2ItC2JpN1EnC2 = "cn (n) de (c2) it (c2) jp (n1) en (c2)",
    EnNFrB2SPA2 = "en N | fr B2 | sp A2",
    SPANEngC1C2JpN2 = "spa (N) - eng (C1-C2) - jp (N2)",
}

export interface FluffyReplies {
    kind: RepliesKind;
    data: StickyData;
}

export interface StickyData {
    modhash:  string;
    dist:     null;
    children: TentacledChild[];
    after:    null;
    before:   null;
}

export interface TentacledChild {
    kind: ChildKind;
    data: IndigoData;
}

export interface IndigoData {
    total_awards_received:           number;
    approved_at_utc:                 null;
    comment_type:                    null;
    awarders:                        any[];
    mod_reason_by:                   null;
    banned_by:                       null;
    ups:                             number;
    author_flair_type:               AuthorFlairType;
    removal_reason:                  null;
    link_id:                         ID;
    author_flair_template_id:        null | string;
    likes:                           null;
    replies:                         TentacledReplies | string;
    user_reports:                    any[];
    saved:                           boolean;
    id:                              string;
    banned_at_utc:                   null;
    mod_reason_title:                null;
    gilded:                          number;
    archived:                        boolean;
    no_follow:                       boolean;
    author:                          string;
    can_mod_post:                    boolean;
    created_utc:                     number;
    send_replies:                    boolean;
    parent_id:                       string;
    score:                           number;
    author_fullname:                 string;
    report_reasons:                  null;
    approved_by:                     null;
    all_awardings:                   any[];
    subreddit_id:                    SubredditID;
    body:                            string;
    edited:                          boolean;
    author_flair_css_class:          null;
    is_submitter:                    boolean;
    downs:                           number;
    author_flair_richtext:           FlairRichtext[];
    author_patreon_flair:            boolean;
    body_html:                       string;
    gildings:                        Gildings;
    collapsed_reason:                null;
    associated_award:                null;
    stickied:                        boolean;
    author_premium:                  boolean;
    subreddit_type:                  SubredditType;
    can_gild:                        boolean;
    top_awarded_type:                null;
    author_flair_text_color:         AuthorFlairTextColor | null;
    score_hidden:                    boolean;
    permalink:                       string;
    num_reports:                     null;
    locked:                          boolean;
    name:                            string;
    created:                         number;
    subreddit:                       Subreddit;
    author_flair_text:               null | string;
    treatment_tags:                  any[];
    collapsed:                       boolean;
    subreddit_name_prefixed:         SubredditNamePrefixed;
    controversiality:                number;
    depth:                           number;
    author_flair_background_color:   null | string;
    collapsed_because_crowd_control: null;
    mod_reports:                     any[];
    mod_note:                        null;
    distinguished:                   null;
}

export interface TentacledReplies {
    kind: RepliesKind;
    data: IndecentData;
}

export interface IndecentData {
    modhash:  string;
    dist:     null;
    children: StickyChild[];
    after:    null;
    before:   null;
}

export interface StickyChild {
    kind: ChildKind;
    data: HilariousData;
}

export interface HilariousData {
    total_awards_received:           number;
    approved_at_utc:                 null;
    comment_type:                    null;
    awarders:                        any[];
    mod_reason_by:                   null;
    banned_by:                       null;
    ups:                             number;
    author_flair_type:               AuthorFlairType;
    removal_reason:                  null;
    link_id:                         ID;
    author_flair_template_id:        null | string;
    likes:                           null;
    replies:                         string;
    user_reports:                    any[];
    saved:                           boolean;
    id:                              string;
    banned_at_utc:                   null;
    mod_reason_title:                null;
    gilded:                          number;
    archived:                        boolean;
    no_follow:                       boolean;
    author:                          string;
    can_mod_post:                    boolean;
    send_replies:                    boolean;
    parent_id:                       string;
    score:                           number;
    author_fullname:                 string;
    report_reasons:                  null;
    approved_by:                     null;
    all_awardings:                   any[];
    subreddit_id:                    SubredditID;
    body:                            string;
    edited:                          boolean;
    downs:                           number;
    author_flair_css_class:          null | string;
    is_submitter:                    boolean;
    collapsed:                       boolean;
    author_flair_richtext:           FlairRichtext[];
    author_patreon_flair:            boolean;
    body_html:                       string;
    gildings:                        Gildings;
    collapsed_reason:                null | string;
    associated_award:                null;
    stickied:                        boolean;
    author_premium:                  boolean;
    subreddit_type:                  SubredditType;
    can_gild:                        boolean;
    top_awarded_type:                null;
    author_flair_text_color:         AuthorFlairTextColor | null;
    score_hidden:                    boolean;
    permalink:                       string;
    num_reports:                     null;
    locked:                          boolean;
    name:                            string;
    created:                         number;
    subreddit:                       Subreddit;
    author_flair_text:               null | string;
    treatment_tags:                  any[];
    created_utc:                     number;
    subreddit_name_prefixed:         SubredditNamePrefixed;
    controversiality:                number;
    depth:                           number;
    author_flair_background_color:   null | string;
    collapsed_because_crowd_control: null;
    mod_reports:                     any[];
    mod_note:                        null;
    distinguished:                   null;
}

export enum Subreddit {
    Languagelearning = "languagelearning",
}

export enum SubredditID {
    T52Rjsc = "t5_2rjsc",
}

export enum SubredditNamePrefixed {
    RLanguagelearning = "r/languagelearning",
}

export enum SubredditType {
    Public = "public",
}

export enum ChildKind {
    T1 = "t1",
    T3 = "t3",
}

export enum RepliesKind {
    Listing = "Listing",
}
