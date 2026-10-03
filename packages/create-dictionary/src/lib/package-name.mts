/** The package name and dictionary ID: lowercase, with characters other than a-z, 0-9, and "-" replaced by "-". */
export function toPackageName(name: string): string {
    return name.toLowerCase().replaceAll(/[^a-z0-9-]/g, '-');
}
