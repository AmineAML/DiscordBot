export interface Posts {
    kind: string;
    data: PostsData;
}

export interface PostsData {
    modhash:  string;
    dist:     number;
    children: Child[];
    after:    string;
    before:   null;
}

export interface Child {
    kind: Kind;
    data: ChildData;
}

export interface ChildData {
    approved_at_utc:               null;
    subreddit:                     Subreddit;
    selftext:                      string;
    author_fullname:               string;
    saved:                         boolean;
    mod_reason_title:              null;
    gilded:                        number;
    clicked:                       boolean;
    title:                         string;
    link_flair_richtext:           LinkFlairRichtext[];
    subreddit_name_prefixed:       SubredditNamePrefixed;
    hidden:                        boolean;
    pwls:                          number;
    link_flair_css_class:          string;
    downs:                         number;
    thumbnail_height:              number | null;
    top_awarded_type:              null;
    hide_score:                    boolean;
    media_metadata?:               { [key: string]: MediaMetadatum };
    name:                          string;
    quarantine:                    boolean;
    link_flair_text_color:         LinkFlairTextColor;
    upvote_ratio:                  number;
    author_flair_background_color: null;
    subreddit_type:                SubredditType;
    ups:                           number;
    total_awards_received:         number;
    media_embed:                   MediaEmbed;
    thumbnail_width:               number | null;
    author_flair_template_id:      null | string;
    is_original_content:           boolean;
    user_reports:                  any[];
    secure_media:                  Media | null;
    is_reddit_media_domain:        boolean;
    is_meta:                       boolean;
    category:                      null;
    secure_media_embed:            MediaEmbed;
    link_flair_text:               string;
    can_mod_post:                  boolean;
    score:                         number;
    approved_by:                   null;
    author_premium:                boolean;
    thumbnail:                     string;
    edited:                        boolean | number;
    author_flair_css_class:        null;
    author_flair_richtext:         AuthorFlairRichtext[];
    gildings:                      Gildings;
    content_categories:            null;
    is_self:                       boolean;
    mod_note:                      null;
    created:                       number;
    link_flair_type:               AuthorFlairType;
    wls:                           number;
    removed_by_category:           null;
    banned_by:                     null;
    author_flair_type:             AuthorFlairType;
    domain:                        Domain;
    allow_live_comments:           boolean;
    selftext_html:                 null | string;
    likes:                         null;
    suggested_sort:                null | string;
    banned_at_utc:                 null;
    view_count:                    null;
    archived:                      boolean;
    no_follow:                     boolean;
    is_crosspostable:              boolean;
    pinned:                        boolean;
    over_18:                       boolean;
    all_awardings:                 AllAwarding[];
    awarders:                      any[];
    media_only:                    boolean;
    link_flair_template_id:        string;
    can_gild:                      boolean;
    spoiler:                       boolean;
    locked:                        boolean;
    author_flair_text:             null | string;
    treatment_tags:                any[];
    visited:                       boolean;
    removed_by:                    null;
    num_reports:                   null;
    distinguished:                 null;
    subreddit_id:                  SubredditID;
    mod_reason_by:                 null;
    removal_reason:                null;
    link_flair_background_color:   LinkFlairBackgroundColor;
    id:                            string;
    is_robot_indexable:            boolean;
    report_reasons:                null;
    author:                        string;
    discussion_type:               null;
    num_comments:                  number;
    send_replies:                  boolean;
    whitelist_status:              WhitelistStatus;
    contest_mode:                  boolean;
    mod_reports:                   any[];
    author_patreon_flair:          boolean;
    author_flair_text_color:       null | string;
    permalink:                     string;
    parent_whitelist_status:       WhitelistStatus;
    stickied:                      boolean;
    url:                           string;
    subreddit_subscribers:         number;
    created_utc:                   number;
    num_crossposts:                number;
    media:                         Media | null;
    is_video:                      boolean;
    post_hint?:                    string;
    url_overridden_by_dest?:       string;
    preview?:                      Preview;
    poll_data?:                    PollData;
}

export interface AllAwarding {
    giver_coin_reward:                    number | null;
    subreddit_id:                         null;
    is_new:                               boolean;
    days_of_drip_extension:               number;
    coin_price:                           number;
    id:                                   string;
    penny_donate:                         number | null;
    award_sub_type:                       string;
    coin_reward:                          number;
    icon_url:                             string;
    days_of_premium:                      number;
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
    icon_format:                          null | string;
    icon_height:                          number;
    penny_price:                          number | null;
    award_type:                           string;
    static_icon_url:                      string;
}

export interface ResizedIcon {
    url:    string;
    width:  number;
    height: number;
}

export interface AuthorFlairRichtext {
    e:  string;
    t?: string;
    a?: string;
    u?: string;
}

export enum AuthorFlairType {
    Richtext = "richtext",
    Text = "text",
}

export enum Domain {
    ArstechnicaCOM = "arstechnica.com",
    IReddIt = "i.redd.it",
    SelfLanguagelearning = "self.languagelearning",
    YoutubeCOM = "youtube.com",
}

export interface Gildings {
}

export enum LinkFlairBackgroundColor {
    The0A006A = "#0a006a",
}

export interface LinkFlairRichtext {
    e: AuthorFlairType;
    t: string;
}

export enum LinkFlairTextColor {
    Light = "light",
}

export interface Media {
    type:   Domain;
    oembed: Oembed;
}

export interface Oembed {
    provider_url:     string;
    version:          string;
    title:            string;
    type:             string;
    thumbnail_width:  number;
    height:           number;
    width:            number;
    html:             string;
    author_name:      string;
    provider_name:    string;
    thumbnail_url:    string;
    thumbnail_height: number;
    author_url:       string;
}

export interface MediaEmbed {
    content?:          string;
    width?:            number;
    scrolling?:        boolean;
    height?:           number;
    media_domain_url?: string;
}

export interface MediaMetadatum {
    status: Status;
    e:      E;
    m:      M;
    p:      S[];
    s:      S;
    id:     string;
}

export enum E {
    Image = "Image",
}

export enum M {
    ImageJpg = "image/jpg",
}

export interface S {
    y: number;
    x: number;
    u: string;
}

export enum Status {
    Valid = "valid",
}

export enum WhitelistStatus {
    AllAds = "all_ads",
}

export interface PollData {
    user_won_amount:      null;
    resolved_option_id:   null;
    total_vote_count:     number;
    user_selection:       null;
    is_prediction:        boolean;
    voting_end_timestamp: number;
    options:              Option[];
    total_stake_amount:   null;
}

export interface Option {
    text: string;
    id:   string;
}

export interface Preview {
    images:  Image[];
    enabled: boolean;
}

export interface Image {
    source:      ResizedIcon;
    resolutions: ResizedIcon[];
    variants:    Gildings;
    id:          string;
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

export enum Kind {
    T3 = "t3",
}
