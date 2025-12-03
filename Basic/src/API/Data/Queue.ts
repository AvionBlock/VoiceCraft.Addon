// https://github.com/AndrewKhassapov/queue-ts/blob/main/generic/Queue.ts

export class Queue<Type = any>{

    /**
     * Maximum array length.
     * To remove all deleted elements and restart queue.
     * O(1) operation until limit. Then O(n) complexity for 'n' elements in queue.
     * Increase this to improve performance.
     * @constant
     */
    private readonly LIMIT:number = Number.MAX_SAFE_INTEGER-1;
    
    private queue:Type[] = [];
    private start:number = 0;
    
    /**
     * New queue of type <Type>.
     * @param {Type[]} args Optional: Array of arguments to be enqueued.
     * @example myQueue = new Queue<number>(1, 2, 3)
     */
    constructor(...args:Type[]){
        this.queue = [...args];
        this.start = 0;
    }

    /**
     * Clears the queue
     */
    public clear(): void {
        this.queue = [];
        this.start = 0;
    }
    
    /**
     * Add to end of queue.
     * @param {Type} value Value to add to end of queue.
     * @param {Type[]} values Optional: Value(s) to add to end of queue.
     */
    public enqueue(value:Type, ...values:Type[]):void{
        this.queue.push(value, ...values);
    }
    
    /**
     * Remove from front of queue.
     * @returns {Type} Front of queue. Undefined if queue is empty.
     * @reference shift() can be used but has O(n) complexity: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
     */
    public dequeue():Type | undefined{

        if(this.start < this.queue.length){
            let element:Type = this.queue[this.start];
            delete this.queue[this.start];
            this.start++;
            
            if(this.start >= this.LIMIT){
                let newQueue:Type[] = [];
                for(let i:number = this.LIMIT; i < this.queue.length; i++){
                    newQueue.push(this.queue[i]);
                }
                this.queue = newQueue;
                this.start = 0;
            }
            
            return element;
        }
        return undefined; // Queue is empty.
    }
    
    /**
     * Show the front of queue without dequeuing.
     * @returns {Type} Front of queue. Undefined if queue is empty.
     */
    public peek():Type | undefined{
        if(this.start < this.queue.length){
            return this.queue[this.start];
        }
        return undefined; // Queue is empty.
    }
    
    /**
     * Size of queue.
     * @returns {number} Size of queue.
     */
    public get size():number{
        return this.queue.length - this.start;
    }

    /**
     * Size of queue.
     * @returns {number} Size of queue.
     */
    public getSize():number{
        return this.size;
    }
    
    /**
     * Queue as string.
     * @returns {string} String representation of queue, eg. "[ 1, 2, 3 ]".
     * @override
     */
    public toString():string{
        if(this.start >= this.queue.length){
            return `Empty`;
        }
        
        let asString:string = `[ `;
        for(let i:number = this.start; i < this.queue.length - 1; i++){
            asString += this.queue[i] + `, `;
        }
        asString += this.queue[this.queue.length - 1] + ` ]`;
        return asString;
    }
}