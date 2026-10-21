# Add two vectors on the GPU with CUDA.jl.
using CUDA

function add_vectors!(c, a, b)
    i = (blockIdx().x - 1) * blockDim().x + threadIdx().x
    if i <= length(c)
        @inbounds c[i] = a[i] + b[i]
    end
    sync_threads()
    return nothing
end

n = 1 << 20
a = CuArray(ones(Float32, n))
b = CuArray(ones(Float32, n))
c = similar(a)

threads = 256
blocks = cld(n, threads)
@cuda threads=threads blocks=blocks add_vectors!(c, a, b)
synchronize()

@show Array(c)[1:4]
