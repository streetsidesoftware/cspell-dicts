// Sum an array on the GPU with a block-level reduction.
// Build with: nvcc -O2 -o reduce reduce.cu

#include <cstdio>
#include <cuda_fp16.h>
#include <cuda_runtime.h>

#define CHECK(call)                                                                     \
    do {                                                                                \
        cudaError_t err = (call);                                                       \
        if (err != cudaSuccess) {                                                       \
            std::printf("CUDA error: %s\n", cudaGetErrorString(err));                   \
            return 1;                                                                   \
        }                                                                               \
    } while (0)

__constant__ float scale;
__managed__ unsigned int launches = 0;

__device__ __forceinline__ float warpSum(float value) {
    for (int offset = warpSize / 2; offset > 0; offset /= 2) {
        value += __shfl_down_sync(0xffffffff, value, offset);
    }
    return value;
}

__global__ void __launch_bounds__(256) sumKernel(const float *__restrict__ input, float *total, int count) {
    __shared__ float partial[32];

    int index = blockIdx.x * blockDim.x + threadIdx.x;
    int stride = gridDim.x * blockDim.x;
    float value = 0.0f;
    for (int i = index; i < count; i += stride) {
        value += __ldg(&input[i]) * scale;
    }

    value = warpSum(value);
    int lane = threadIdx.x % warpSize;
    int warp = threadIdx.x / warpSize;
    if (lane == 0) {
        partial[warp] = value;
    }
    __syncthreads();

    if (warp == 0) {
        value = lane < blockDim.x / warpSize ? partial[lane] : 0.0f;
        value = warpSum(value);
        if (lane == 0) {
            atomicAdd(total, value);
            atomicAdd(&launches, 1u);
        }
    }
}

__host__ __device__ __half toHalf(float value) {
    return __float2half(value);
}

int main() {
    const int count = 1 << 20;
    const float one = 1.0f;

    int devices = 0;
    CHECK(cudaGetDeviceCount(&devices));
    CHECK(cudaSetDevice(0));

    float *hostInput = nullptr;
    CHECK(cudaMallocHost(&hostInput, count * sizeof(float)));
    for (int i = 0; i < count; ++i) {
        hostInput[i] = 1.0f;
    }

    float *input = nullptr;
    float *total = nullptr;
    CHECK(cudaMalloc(&input, count * sizeof(float)));
    CHECK(cudaMallocManaged(&total, sizeof(float)));
    CHECK(cudaMemset(total, 0, sizeof(float)));
    CHECK(cudaMemcpyToSymbol(scale, &one, sizeof(float)));

    cudaStream_t stream;
    cudaEvent_t start, stop;
    CHECK(cudaStreamCreate(&stream));
    CHECK(cudaEventCreate(&start));
    CHECK(cudaEventCreate(&stop));

    CHECK(cudaMemcpyAsync(input, hostInput, count * sizeof(float), cudaMemcpyHostToDevice, stream));
    CHECK(cudaEventRecord(start, stream));
    dim3 block(256);
    dim3 grid((count + block.x - 1) / block.x);
    sumKernel<<<grid, block, 0, stream>>>(input, total, count);
    CHECK(cudaGetLastError());
    CHECK(cudaEventRecord(stop, stream));
    CHECK(cudaStreamSynchronize(stream));
    CHECK(cudaDeviceSynchronize());

    std::printf("Sum: %f after %u launch(es)\n", *total, launches);

    CHECK(cudaFree(input));
    CHECK(cudaFree(total));
    CHECK(cudaFreeHost(hostInput));
    return 0;
}
