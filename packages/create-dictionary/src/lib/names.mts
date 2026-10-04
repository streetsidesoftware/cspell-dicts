/** The package name and dictionary ID: lowercase, with characters other than a-z, 0-9, and "-" replaced by "-". */
export function toPackageName(name: string): string {
    return name.toLowerCase().replaceAll(/[^a-z0-9-]/g, '-');
}

/** A readable name from the directory name: "medical-terms" and "medical_terms" become "Medical Terms". */
export function toFriendlyName(name: string): string {
    return name.split(/[-_]/).map(title).join(' ');
}

/** Upper-case the first letter. */
export function title(s: string): string {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
}
