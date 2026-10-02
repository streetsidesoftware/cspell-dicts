% MATLAB Sample: 2D and 3D Data Visualization
% This script demonstrates how to plot curves, surfaces, and style figures.

clc; clear; close all;

% --- 2D Plotting ---
x = linspace(0, 2*pi, 100);
y1 = sin(x);
y2 = cos(x);

figure('Name', '2D Plots');
plot(x, y1, '-r', 'LineWidth', 2); hold on;
plot(x, y2, '--b', 'LineWidth', 2);
grid on;
title('Sine and Cosine Functions');
xlabel('Angle (radians)');
ylabel('Amplitude');
legend('sin(x)', 'cos(x)');
hold off;

% --- 3D Surface Plotting ---
[X, Y] = meshgrid(-2:0.1:2, -2:0.1:2);
Z = X .* exp(-X.^2 - Y.^2);

figure('Name', '3D Surface');
surf(X, Y, Z);
colorbar;
title('3D Mesh Surface: Z = X * e^{-(X^2 + Y^2)}');
xlabel('X-axis');
ylabel('Y-axis');
zlabel('Z-axis');
shading interp; % Smooth the coloring
