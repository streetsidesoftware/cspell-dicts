<?php

declare(strict_types=1);

namespace Library\Catalog;

use InvalidArgumentException;
use JsonSerializable;

/**
 * A book in a small library catalog.
 */
final class Book implements JsonSerializable
{
    public function __construct(
        private readonly string $title,
        private readonly string $author,
        private readonly int $year,
        private array $tags = [],
    ) {
        if (trim($title) === '') {
            throw new InvalidArgumentException('A book needs a title.');
        }
    }

    public function addTag(string $tag): void
    {
        $tag = strtolower(trim($tag));
        if (!in_array($tag, $this->tags, true)) {
            $this->tags[] = $tag;
        }
    }

    public function jsonSerialize(): array
    {
        return [
            'title' => $this->title,
            'author' => $this->author,
            'year' => $this->year,
            'tags' => $this->tags,
        ];
    }
}

function loadBooks(string $filename): array
{
    if (!is_readable($filename)) {
        return [];
    }

    $rows = json_decode(file_get_contents($filename), true, 512, JSON_THROW_ON_ERROR);
    $books = array_map(
        static fn (array $row): Book => new Book($row['title'], $row['author'], (int) $row['year']),
        $rows,
    );

    usort($books, static fn (Book $a, Book $b): int => strcmp(json_encode($a), json_encode($b)));

    return $books;
}

$books = loadBooks(__DIR__ . '/books.json');
printf("Found %d books.\n", count($books));
echo htmlspecialchars(json_encode($books, JSON_PRETTY_PRINT), ENT_QUOTES, 'UTF-8'), PHP_EOL;
