% MATLAB Sample: Basic Signal Processing & FFT
% This script generates a noisy signal and extracts its frequency components.

clc; clear; close all;

% Sampling parameters
Fs = 1000;            % Sampling frequency (Hz)
T = 1/Fs;             % Sampling period
L = 1500;             % Length of signal
t = (0:L-1)*T;        % Time vector

% Form a signal containing two sinusoids (50 Hz and 120 Hz)
S = 0.7*sin(2*pi*50*t) + sin(2*pi*120*t);

% Corrupt the signal with zero-mean white noise
X = S + 2*randn(size(t));

% Compute the Fourier Transform
Y = fft(X);

% Compute the two-sided spectrum P2. Then compute the single-sided spectrum P1
P2 = abs(Y/L);
P1 = P2(1:L/2+1);
P1(2:end-1) = 2*P1(2:end-1);

% Define the frequency domain f
f = Fs*(0:(L/2))/L;

% Plot the results
figure;
subplot(2,1,1);
plot(1000*t(1:50), X(1:50));
title('Signal Corrupted with Zero-Mean Random Noise');
xlabel('t (milliseconds)');
ylabel('X(t)');
grid on;

subplot(2,1,2);
plot(f, P1, 'LineWidth', 1.5);
title('Single-Sided Amplitude Spectrum of X(t)');
xlabel('f (Hz)');
ylabel('|P1(f)|');
grid on;
