export declare class Queue<Type = any> {
    /**
     * Maximum array length.
     * To remove all deleted elements and restart queue.
     * O(1) operation until limit. Then O(n) complexity for 'n' elements in queue.
     * Increase this to improve performance.
     * @constant
     */
    private readonly LIMIT;
    private queue;
    private start;
    /**
     * New queue of type <Type>.
     * @param {Type[]} args Optional: Array of arguments to be enqueued.
     * @example myQueue = new Queue<number>(1, 2, 3)
     */
    constructor(...args: Type[]);
    /**
     * Clears the queue
     */
    clear(): void;
    /**
     * Add to end of queue.
     * @param {Type} value Value to add to end of queue.
     * @param {Type[]} values Optional: Value(s) to add to end of queue.
     */
    enqueue(value: Type, ...values: Type[]): void;
    /**
     * Remove from front of queue.
     * @returns {Type} Front of queue. Undefined if queue is empty.
     * @reference shift() can be used but has O(n) complexity: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
     */
    dequeue(): Type | undefined;
    /**
     * Show the front of queue without dequeuing.
     * @returns {Type} Front of queue. Undefined if queue is empty.
     */
    peek(): Type | undefined;
    /**
     * Size of queue.
     * @returns {number} Size of queue.
     */
    get size(): number;
    /**
     * Size of queue.
     * @returns {number} Size of queue.
     */
    getSize(): number;
    /**
     * Queue as string.
     * @returns {string} String representation of queue, eg. "[ 1, 2, 3 ]".
     * @override
     */
    toString(): string;
}
