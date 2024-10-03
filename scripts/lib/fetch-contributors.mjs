// @ts-check

const maxContributors = 500;
const perPage = 50;
const numPages = maxContributors / perPage;

/**
 * @typedef {{ login: string; html_url: string; avatar_url: string; contributions: number, type: 'User' | 'Bot' | string }} Contributor
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

    /** @type {Contributor[]} */
    let contributors = [];

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
 * @param {Contributor[]} contributors
 * @returns {Contributor[]}
 */
export function sortContributorsByContributionsThenLogin(contributors) {
    return contributors.sort((a, b) => b.contributions - a.contributions || a.login.localeCompare(b.login));
}

/**
 * Sort the contributors (in place) by login.
 * @param {Contributor[]} contributors
 * @returns {Contributor[]}
 */
export function sortContributorsByLogin(contributors) {
    return contributors.sort((a, b) => a.login.localeCompare(b.login));
}

/**
 * Return a normalize the contributor object.
 * @param {Contributor} contributor
 * @returns {Contributor}
 */
export function normalizeContributor(contributor) {
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
 * @param {Contributor[]} contributors
 * @returns {Contributor[]}
 */
export function normalizeContributors(contributors) {
    return contributors.map(normalizeContributor);
}
