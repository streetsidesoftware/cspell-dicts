#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
use feature qw(say state);

# Count the words in each line of the data section.
sub count_words {
    my ($line) = @_;
    chomp $line;
    my @words = split /\s+/, $line;
    return wantarray ? @words : scalar @words;
}

sub describe {
    my ($count) = @_;
    if ($count == 0) {
        return 'empty';
    }
    elsif ($count < 5) {
        return 'short';
    }
    return 'long' unless $count < 20;
    return 'medium';
}

sub counter {
    state $calls = 0;
    return ++$calls;
}

my %totals;
local $| = 1;

while (my $line = <DATA>) {
    next if $line =~ /^\s*$/;
    my $count = count_words($line);
    $totals{ describe($count) }++;
    counter();
}

foreach my $kind (sort keys %totals) {
    printf "%-8s %3d\n", $kind, $totals{$kind};
}

my $joined = join ', ', map { lcfirst uc $_ } reverse sort keys %totals;
say sprintf('Kinds: %s', $joined);

open my $fh, '<', $0 or die "Cannot open $0: $!";
binmode $fh, ':encoding(UTF-8)';
my $first = readline $fh;
close $fh;

eval { die "stop\n" };
warn "Caught: $@" if $@;

my @parts = unpack 'A3 A3', 'abcdef';
my $stamp = localtime time;
say "Read $first at $stamp" if defined $first && exists $totals{short};

__DATA__
The quick brown fox jumps over the lazy dog
Perl makes easy things easy

and hard things possible
