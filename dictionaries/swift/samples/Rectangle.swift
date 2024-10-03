struct Rectangle {
    var x: Double
    var y: Double
    var width: Double
    var height: Double

    init(unsafeFromPointer pointer: UnsafeBufferPointer<Double>) {
        x = pointer[0]
        y = pointer[1]
        width = pointer[2]
        height = pointer[3]
    }

    init(unsafeFromPointer pointer: UnsafePointer<Self>) {
        self = pointer.pointee
    }

    func unsafeToPointer(_ pointer: UnsafeMutableBufferPointer<Double>, at index: Int) {
        pointer[index] = x
        pointer[index + 1] = y
        pointer[index + 2] = width
        pointer[index + 3] = height
    }
}
