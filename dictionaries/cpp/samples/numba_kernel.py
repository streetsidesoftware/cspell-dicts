"""Add two vectors on the GPU with Numba's CUDA target."""

import numpy as np
from numba import cuda


@cuda.jit
def add_kernel(x, y, out):
    index = cuda.threadIdx.x + cuda.blockIdx.x * cuda.blockDim.x
    stride = cuda.blockDim.x * cuda.gridDim.x
    for i in range(index, x.shape[0], stride):
        out[i] = x[i] + y[i]
    cuda.syncthreads()


def main():
    count = 1 << 20
    x = cuda.to_device(np.ones(count, dtype=np.float32))
    y = cuda.to_device(np.ones(count, dtype=np.float32))
    out = cuda.device_array_like(x)

    threads_per_block = 256
    blocks = (count + threads_per_block - 1) // threads_per_block
    add_kernel[blocks, threads_per_block](x, y, out)
    cuda.synchronize()

    print(out.copy_to_host()[:4])


if __name__ == "__main__":
    main()
