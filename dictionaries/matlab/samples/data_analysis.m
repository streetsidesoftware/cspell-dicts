% MATLAB Sample: Data Analysis and Statistics
% This script processes a mock dataset of weather observations.

clc; clear; close all;

% Mock Dataset: 7 days of [Min Temp, Max Temp, Rainfall (mm)]
% Rows represent Monday to Sunday
weather_data = [
    12, 22, 0.0;
    14, 25, 1.2;
    15, 21, 5.8;
    11, 18, 12.0;
    9,  16, 0.0;
    10, 20, 0.2;
    13, 24, 0.0
];

% Extract columns using slicing
min_temps = weather_data(:, 1);
max_temps = weather_data(:, 2);
rainfall  = weather_data(:, 3);

% Calculate basic statistics
mean_max = mean(max_temps);
median_min = median(min_temps);
total_rain = sum(rainfall);

fprintf('--- Weather Data Analysis ---\n');
fprintf('Average Max Temperature: %.2f C\n', mean_max);
fprintf('Median Min Temperature: %.2f C\n', median_min);
fprintf('Total Weekly Rainfall: %.2f mm\n', total_rain);

% Logical indexing: Find days where temperature exceeded 22 degrees
warm_days = find(max_temps > 22);
fprintf('Days exceeding 22C (indexed 1-7): %s\n', num2str(warm_days'));
