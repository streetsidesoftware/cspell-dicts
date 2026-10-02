% MATLAB Sample: Linear Algebra & Matrix Operations
% This script demonstrates matrix creation, transposition, multiplication, 
% and solving systems of linear equations.

clc; clear; close all;

fprintf('--- Matrix Operations ---\n');
% Create a 3x3 matrix A and 3x1 vector b
A = [4, 1, -1; 
     1, 3,  2; 
     -1, 2,  5];
b = [6; 4; 2];

% 1. Determinant and Inverse
det_A = det(A);
inv_A = inv(A);
fprintf('Determinant of A: %.4f\n', det_A);

% 2. Solving Ax = b using the efficient backslash operator (mldivide)
x = A \ b;
disp('Solution vector x for Ax = b:');
disp(x);

% 3. Eigenvalues and Eigenvectors
[V, D] = eig(A);
disp('Eigenvalues (diagonal of D):');
disp(diag(D));
