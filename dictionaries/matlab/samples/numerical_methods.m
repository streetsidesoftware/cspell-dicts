% MATLAB Sample: Numerical Methods (Solving an ODE)
% This script uses ode45 to solve a standard first-order differential equation.
% Equation: dy/dt = -2*y + sin(t), with initial condition y(0) = 1.

clc; clear; close all;

% Define the time span for simulation
tspan = [0 10];

% Define initial condition
y0 = 1;

% Solve the ODE using ode45
% The ODE function is passed as an anonymous function @(t,y)
[t, y] = ode45(@(t,y) -2*y + sin(t), tspan, y0);

% Plot the numerical solution
figure;
plot(t, y, '-o', 'MarkerSize', 4, 'LineWidth', 1.5);
grid on;
title('Numerical Solution of dy/dt = -2y + sin(t)');
xlabel('Time t');
ylabel('Solution y(t)');
