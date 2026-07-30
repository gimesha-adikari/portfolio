const USER = process.env.GITHUB_USERNAME!;
const TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
};

if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
}

export type GithubProfile = {
    login: string;
    name: string;
    avatar: string;
    bio: string;
    location: string | null;
    company: string | null;
    blog: string | null;
    followers: number;
    following: number;
    publicRepos: number;
    createdAt: string;
    profileUrl: string;
};

export async function fetchGithubProfile(): Promise<GithubProfile> {
    const res = await fetch(
        `https://api.github.com/users/${USER}`,
        {
            headers,
            next: {
                revalidate: 3600,
            },
        },
    );

    if (!res.ok)
        throw new Error("Failed to load github profile");

    const user = await res.json();

    return {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio,
        location: user.location,
        company: user.company,
        blog: user.blog,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        createdAt: user.created_at,
        profileUrl: user.html_url,
    };
}