const perPage = 50;

/**
 * @typedef {{ login: string; html_url: string; avatar_url: string; contributions: number }} Contributor
 */

/**
 * Fetch the contributors of the repository.
 * @param {string} token
 * @returns {Promise<Contributor[]>}
 */
export async function fetchContributors(token) {
    /**
     *
     * @param {number} page
     * @returns Promise<Contributor[]>
     */
    async function fetchPage(page) {
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

        return response.json();
    }

    let contributors = [];

    for (let page = 1; page < 5; page++) {
        const c = await fetchPage(page);
        sortContributorsByContributionsThenLogin(c);
        contributors.push(...c);
        if (c.length < perPage) {
            break;
        }
    }

    return contributors;
}

export function sortContributorsByContributionsThenLogin(contributors) {
    return contributors.sort((a, b) => b.contributions - a.contributions || a.login.localeCompare(b.login));
}
