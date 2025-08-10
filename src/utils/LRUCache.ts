// // utils/LRUCache.ts
// class Node<K, V> {
//   key: K;
//   value: V;
//   prev: Node<K, V> | null;
//   next: Node<K, V> | null;

//   constructor(key: K, value: V) {
//     this.key = key;
//     this.value = value;
//     this.prev = null;
//     this.next = null;.
//   }
// }

// export class LRUCache<K, V> {
//   private capacity: number;
//   private map: Map<K, Node<K, V>>;
//   private head: Node<K, V>;
//   private tail: Node<K, V>;

//   constructor(capacity: number) {
//     this.capacity = capacity;
//     this.map = new Map();

//     // Dummy head and tail
//     this.head = new Node<K, V>({} as K, {} as V);
//     this.tail = new Node<K, V>({} as K, {} as V);
//     this.head.next = this.tail;
//     this.tail.prev = this.head;
//   }

//   private removeNode(node: Node<K, V>) {
//     const prev = node.prev!;
//     const next = node.next!;
//     prev.next = next;
//     next.prev = prev;
//   }

//   private addNodeAtHead(node: Node<K, V>) {
//     node.next = this.head.next;
//     node.prev = this.head;
//     this.head.next!.prev = node;
//     this.head.next = node;
//   }

//   get(key: K): V | undefined {
//     const node = this.map.get(key);
//     if (!node) return undefined;
//     this.removeNode(node);
//     this.addNodeAtHead(node);
//     return node.value;
//   }

//   set(key: K, value: V): void {
//     if (this.map.has(key)) {
//       const node = this.map.get(key)!;
//       node.value = value;
//       this.removeNode(node);
//       this.addNodeAtHead(node);
//     } else {
//       if (this.map.size >= this.capacity) {
//         const lruNode = this.tail.prev!;
//         this.removeNode(lruNode);
//         this.map.delete(lruNode.key);
//       }
//       const newNode = new Node(key, value);
//       this.addNodeAtHead(newNode);
//       this.map.set(key, newNode);
//     }
//   }

//   has(key: K): boolean {
//     return this.map.has(key);
//   }
// }

class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null;
  next: LRUNode<K, V> | null;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache<K, V> {
  private capacity: number;
  private map: Map<K, LRUNode<K, V>>;
  private head:LRUNode<K,V>;
  private tail:LRUNode<K,V>;
    constructor(capacity){
        this.capacity = capacity;
        this.map = new Map();
        this.head = new LRUNode<K,V>({} as K,{} as V);
        this.tail = new LRUNode<K,V>({} as K,{} as V);
        this.head.next = this.tail;
        this.tail = this.head;
    }
}
