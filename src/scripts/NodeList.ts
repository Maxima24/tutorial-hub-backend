import { Logger } from "@nestjs/common"

    const logger = new Logger("NodeELement")
class Node{
    data:number
    next: Node| null
    constructor(data:number){
        this.data = data
        this.next = null
    }

}
class LinkedList{
    head: Node |null
    constructor(){
        this.head = null
    }

    append(data:number):void{
        const newNode = new Node(data)
        if(this.head === null){
            this.head  = newNode
            return
        }
        let current = this.head
        while(current.next !== null){
            current = current.next
        }
        current.next = newNode
    }

    display():void{
        let current = this.head
        while(current !== null){
            process.stdout.write(current.data +"=>")
            current = current.next
        }
        console.log("Null")
    }
}

function addLinkedList(l1:LinkedList, l2:LinkedList){
    const stack1 = []
    const stack2 = []
    let current = l1.head
    let current1 =  l2.head
    let result:Node|null = null
    let carry  = 0 
    while(current !== null ){
        stack1.push(current.data)
        current = current.next
    }
    while(current1 !== null){
        stack2.push(current1.data)
        current1 = current1.next
        }   

        logger.debug(stack1)
        logger.debug(stack2)
        while (stack1.length>0 || stack2.length>0 || carry>0){
            let sum = carry
            if(stack1.length>0){
                sum+= stack1.pop()!
            }
            if(stack2.length >0){
                sum += stack2.pop()!
            }
            carry = Math.floor(sum/10)
            const digit = sum %10
            const newNode = new Node(digit)
            newNode.next = result
            result  = newNode
            logger.debug(result)
        }

}

const list = new LinkedList()
const list2 = new LinkedList()
list.append(1)
list.append(2)
list.append(4)
list2.append(3)
list2.append(4)
list2.append(5)
addLinkedList(list,list2)
list.display()