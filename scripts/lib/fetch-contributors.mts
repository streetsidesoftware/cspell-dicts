const maxContributors = 500;
const perPage = 50;
const numPages = maxContributors / perPage;

export interface Contributor {
    login: string;
    html_url: string;
    avatar_url: string;
    contributions: number;
    type: 'User' | 'Bot' | string;
}

/**
 * Fetch the contributors of the repository.
 */
export async function fetchContributors(token: string): Promise<Contributor[]> {
    async function fetchPage(page: number): Promise<Contributor[]> {
        const response = await fetch(
            `https://api.github.com/repos/streetsidesoftware/cspell-dicts/contributors?per_page=${perPage}&page=${page}`,
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status} ${response.statusText}`);
        }

        return (await response.json()) as Contributor[];
    }

    const contributors: Contributor[] = [];

    for (let page = 1; page < numPages; page++) {
        const c = await fetchPage(page);
        sortContributorsByContributionsThenLogin(c);
        contributors.push(...c);
        if (c.length < perPage) {
            break;
        }
    }

    return contributors;
}

/**
 * Sort the contributors (in place) by contributions then login.
 */
export function sortContributorsByContributionsThenLogin(contributors: Contributor[]): Contributor[] {
    return contributors.sort((a, b) => b.contributions - a.contributions || a.login.localeCompare(b.login));
}

/**
 * Sort the contributors (in place) by login.
 */
export function sortContributorsByLogin(contributors: Contributor[]): Contributor[] {
    return contributors.sort((a, b) => a.login.localeCompare(b.login));
}

/**
 * Return a normalize the contributor object.
 */
export function normalizeContributor(contributor: Contributor): Contributor {
    return {
        login: contributor.login,
        html_url: contributor.html_url || 'https://api.github.com/users/' + contributor.login,
        avatar_url: contributor.avatar_url || '',
        contributions: contributor.contributions || 0,
        type: contributor.type || 'User',
    };
}

/**
 * Normalize the contributors.
 * Remove any unused fields.
 */
export function normalizeContributors(contributors: Contributor[]): Contributor[] {
    return contributors.map(normalizeContributor);
}
