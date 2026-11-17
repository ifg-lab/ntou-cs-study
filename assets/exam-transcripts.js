"use strict";

// Source rows follow the original question numbers, with bonus questions omitted.
// P: printed points; A: printed subquestion; C: code/table; D: prompt after the figure or code.
const examTranscripts = {
  "2018-quiz2": String.raw`
5|A process is said to be I/O-bounded if it requires a lot of I/O operations, whereas a process that consists of mostly computations within the CPU/memory system is said to be CPU-bounded. If both a CPU-bounded process and an I/O-bounded process are waiting for a time slice, which should be given priority? Why?
5|How does direct memory access (DMA) work?
20|Consider the following CISC assembly code and the number of clock cycles used.
C| (5 cycles) add R1, R2, R3\n (3 cycles) mov R4, R6\n (3 cycles) mov R5, R7\n (2 cycles) xor R1, R4, R5\n (7 cycles) mul R1, R4, R1\n (5 cycles) add R1, R1, R5
A|5|If no speedup technology is used, what is the total time required (in clock cycles) for this program to be executed?
A|5|Please explain what is data hazard in pipelining processors?
A|5|If we use simple pipelining with 1 stage per clock cycle, what is the running time of this program (disregarding all data dependencies)?
A|5|If a two-way dispatch (2 instructions at a time) superscalar architecture is used, what is the best attainable speed (disregarding all data dependencies)?
10|Consider the following memory layout.
C|Offset  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F\n0x00   a4 4c 59 6d 14 b7 d4 a3 57 68 a3 70 c5 40 a0 1f\n0x10   38 eb 99 5f bb c5 99 70 a4 d0 08 06 de 40 2f 37\n0x20   81 39 eb 2a e4 98 0c c4 52 83 c9 25 0b e4 0d 10\n0x30   0d d7 6d 89 cb 21 ec e3 a0 d5 4a da 69 87 19 ca\n0x40   f4 96 9b 48 66 6a d1 ac 0d e0 72 98 61 7c 85 70
A|5|What is the value in 32-bits at memory location 0x2A if big endian encoding (as in Motorola CPUs) is used?
A|5|What is the value in 32-bits at memory location 0x2A if little endian encoding (as in Intel CPUs) is used?
5|What is a kernel of an operating system?
5|Modern operating systems usually support advanced features such as load balancing and scaling. Can you explain what is load balancing and scaling?
10|For a single-core single CPU machine, how can one simulate a multiprocessing environment.
5|What is the difference between virtual memory and main memory?
10|What is deadlock in an operating system? What is starvation? Please give an example for each.
5|What is a preemptive process?
10|How long will it take for a 1GBPS network transfer a 2GB file under theoretical maximum speed?
5|Please explain the difference between a parallel communication channel vs a serial communication channel.
10|High definition video can be delivered at a rate of 30 frames per second (fps) where each frame has a resolution of 1920 x 1080 pixels using 24 bits per pixel. Can an uncompressed video stream of this format be sent over a USB 1.1 serial port? USB 2.0 serial port? USB 3.0 serial port? (Note: The maximum speeds of USB 1.1, USB 2.0, and USB 3.0 serial ports are 12Mbps, 480Mbps, and 5Gbps respectively.)
`,
  "2022-quiz1": String.raw`
10|Consider the following digital circuit:
F|logic
A|5|Tabulate the truth table for the above circuit.
A|5|Using any means, minimize the above circuit into the most simple form.
5|Suppose we use simple JK-flip flops to construct computer memory. Let us assume that each JK flip flop requires 4-NAND gates to implement. If we want 2GB of memory, how many NAND gates are required?
5|The term volatile memory is commonly used in describing memory. What are these types of memory?
5|Please explain what are EEPROM and EEPRAM.
10|John von-Neumann wrote a incomplete draft “First Draft of a Report on the EDVAC” which brought out the concept of stored-program computers. Briefly describe this concept.
10|Number systems in modern computers uses binary representation. Please interpret the following data:
A|5|What is the decimal value of B6ₕ if it is stored in a char data type?
A|5|What is the decimal value of B6ₕ if it is stored in a unsigned char data type?
10|Consider a 8-bit floating point number with the following specs (conforming to IEEE754):\ns eee mmmm\nwhere s is the sign bit, eee is the exponent in excess-3 representation, and mmmm is the mantissa. We will use the declaration float8 in our program to represent this type of data. Consider the following code:
C|#include <stdio.h>\nint main( void )\n{\n    float8 a = 0.2;\n    float8 b = a+a;\n    printf( "Value: %f\\n", b );\n    return 0;\n}
D|What is the final output of this program?
10|Explain the what is overflow, underflow, and truncation of data.
15|Suppose a hard drive is advertised with the following parameters: 5 platters, 400 cylinders, 24 sectors per track, and 512 bytes per sector.
A|5|What is the capacity of this hard drive?
A|5|If the drive rotates at 7200 RPM, how much data can be transferred (maximum, in theory) per second?
A|5|In theory (not considering file structures), if we have an RGB Full-HD image (1920x1080 in size), how many images can be stored on this hard drive?
10|Suppose we are transferring a 8-bit information through an unstable network channel, using even parity of 0’s as the 9th bit.
A|5|If we receive 010100110, 100000011, 111000101, and 000011000. Which of the information are incorrect, i.e., transferred with error?
A|5|By identifying the incorrect information from the previous question. It is guaranteed that the rest of the information are 100% correct?
10|Please explain what is run-length encoding. Does it always produce results as expected?
`,
  "2025-midterm": String.raw`
10|Memory modules are important components in modern computers (or devices). Please explain the following terms classifying memory module types.
A|3|What is a DRAM?
A|3|What is a EEPROM?
A|4|What is a flash memory?
10|Consider a 8-bit floating point number with the following specs (conforming to IEEE754):\ns eee mmmm\nwhere s is the sign bit, eee is the exponent in excess representation (hint: excess value - 3 = original value), and mmmm is the mantissa. Suppose we want to calculate √2 − √3 by using the following C-like code (where float8 represents the data type of 8-bit-floating point number as described above):
C|float8 a = 1.4142135; \\ sqrt(2)\nfloat8 b = 1.7320508; \\ sqrt(3)\nfloat8 c = a - b;\n\nprintf( "%f", c );
D|What is the final value of the variable c?
10|What is the difference between a bitmap image and a vector image?
10|Originally, there are 6 characters A, B, C, D, E, F which requires 3-bits for each character, please use Huffman encoding method to encode/compress the following string
C|ECBDAEDACEDCCBBFDEEEACFDCBCECDAF
D|into a binary string. (The solution may not be unique)
A|5|Please create the Huffman tree and the corresponding encoding for each character.
A|5|What is the final encoding string in binary?
10|Suppose we have a 5-drive RAID5. In a disaster, we have one hard drive failing. The remaining drives contains the following information: 11001010, 11001110, 10010110, and 01010110. Please recover the data of the lost drive?
5|What is central processing unit (CPU) and the three major components within it?
5|Communication between devices can be in parallel or in serial mode. What is the difference between these two modes? In addition, we see universal serial bus (USB) devices all around, give your opinion (technically) why we don’t see universal parallel bus (UPB) used.
5|Suppose our CPU has four phases (fetch, decode, execute, and store). By using pipelining technology, what is the speed increase compared to not using pipelining technology if 10 instructions are executed?
10|Consider the following memory layout of Brooksheer’s virtual machine.
C|Registers R0 R1 R2 R3 R4 R5 R6 R7 R8 R9 R10 PC\nValue     00 3e 59 00 00 9a f8 00 00 00  13 22\n\nOffset  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F\n0x00   a4 4c 59 6d 14 b7 d4 a3 57 68 a3 70 c5 40 a0 1f\n0x10   38 eb 99 5f bb c5 99 70 a4 d0 08 06 3e 40 2f 37\n0x20   81 39 23 3b 12 1c 50 23 30 4a c0 00 e4 0d 10 12\n0x30   0d d7 6d 89 cb 21 ec e3 a0 d5 4a da 69 87 19 ca\n0x40   f4 96 9b 48 66 6a d1 ac 0d e0 12 98 61 7c 85 70\n\nExecuting the program according to the PC register yeilds the following commands:\n233B ; Load (hex) value 3b into R3\n121E ; Load value at location 1C into R2\n5023 ; Add R2, R3 as integers, put result into R0\n304A ; Store value in R0 into location 4A\nC000 ; Halt
A|5|Suppose the program counter register (PC) is 0x22, if we start the execution of the program, what is the final result of the registers R0, R2, R3, PC?
A|5|Using the same memory layout after executing the above code, what is the result of a 4-byte integer encoding using big endian and little endian representation beginning at address 0x4A?
5|List at least 5 major functions of an operating system.
5|Explain the term multiprogramming and how is it implemented in operating systems.
5|List at least 2 jobs that are not preemptive in operating system tasks.
10|Explain the following terms:
A|5|Integrated VGA and discrete VGA.
A|5|DDR (Double data rate), dual channel, and quad channel
`,
  "2025-quiz2": String.raw`
10|Explain how the virtual memory management (VMM) system work.
10|What is a boot loader?
10|What is the job of the schedular and dispatcher in operating systems?
10|Please explain what is direct memory access (DMA)?
5|If you have a 12Gbps SAS hard disk drive ready to send data through a very high speed 10GBps internet connection, and the backbone of your motherboard supports up to 8Gbps. If you have a file that is 1.5GB in size on the hard disk drive, in theory, what is the minimal time required for this file to be transferred from the HD over the internet to another computer?
10|Can you explain what is deadlocks and starvation phenomena in operating systems?
10|We know that operating systems can process multiple jobs a time. Please state the primary difference between multitasking and multiprogramming (time-sharing).
10|Communication between computers must adhere to some protocols.
A|5|What is CSMA/CD and briefly describe how does it work?
A|5|Can you explain what is the hidden terminal problem of wireless networks and what protocol is used to resolve this problem?
15|Explain the following network devices:
A|3|Router.
A|3|Bridge.
A|3|NICs.
A|3|Firewall.
A|3|DHCP service.
10|How many network addresses are there in IPv4 and IPv6?
10|If you are a software developer who wants to distribute a large update of your software to millions of customer. Which model, the client-server or P2P, would you use to deliver your software and explain why.
10|Name three types of common cloud computing service models and briefly explain what each model does.
`,
  "2025-quiz3": String.raw`
10|Designing algorithms to be efficient is an art and the use cases should be considered. Please create a tactic to solve the following problem in a most efficient manner: Find the largest element in a list of 1 million numbers. In what conditions would you use brute-force search algorithms versus sorting and searching algorithms? Explain your approaches (Hint: Find the threshold of the algorithms).
10|Consider the following list of names: [Amelia, Ava, Benjamin, Charlotte, David, Elijah, Emma, Ethan, Evelyn, Harper, Isabella, James, Liam, Lucas, Mason, Mia, Noah, Oliver, Olivia, Peter, Sophia, Tuvoc, William, Xavier], if we are to use binary search algorithm to find the name Oliver, please tabulate the list of names left for each iteration of your binary search. (You may decide your own boundary conditions, i.e., floor or ceiling operator, for the search algorithm, but be consistent).
10|Given the following problem: 100 people standing in a circle in order 1 to 100. No. 1 has a sword. He kills the next person (i.e., No. 2) and gives the sword to the next (i.e., No. 3). All people do the same until only 1 survives. Which number survives at the last?\nThe solution proposed to the problem is coded in C++ as below. Can you explain how the algorithm works and who is the last survivor?
F|josephus
C|#include <bits/stdc++.h>\nusing namespace std;\nint main()\n{\n    int person = 100;\n    vector<int> a(person);\n    for (int i = 0; i < person; i++)\n        a[i] = i + 1;\n    int pos = 0;\n    while (a.size() > 1) {\n        pos++;\n        pos %= a.size();\n        a.erase(a.begin() + pos);\n    }\n    cout << a[0];\n    return 0;\n}
10|Find the minimum spanning tree of the following undirected weighted graph.
F|mst-quiz
10|Explain the difference between the while-loop structure versus the do–while loop structure.
10|The translation process of a computer program contains briefly the following steps: Lexical analyzer, parser, and code generator. Please explain what each step does.
10|Please explain what is cross-compiling.
10|C language stores array in a row major fashion. Consider the following code, what is the result of executing this program? (Hint: the program declares a 2D array data, and the printf functions access it as an 1D array, by casting the data pointer int** into int*.
C|#include <stdio.h>\n\nint data[10][20];\n\nint main( void )\n{\n    int a;\n    for( a = 0; a < 200; a++ )\n        data[a/20][a%20] = a*2;\n    printf( "%d\\n", ((int *)data)[87] );\n}
10|Context free grammars (CFG) defines a computer language. Suppose we have the following CFG rules where Expression represents the start of a program.
C|Expression -> Term | Term OP1 Expression\nTerm -> Factor | Factor OP2 Term\nFactor -> x | y | z\nOP1 -> + | -\nOP2 -> * | /
D|Given a string x * y + x * z, please derive the corresponding parse tree.
10|Is HTML a programming language? Please explain why or why not?
`,
  "2025-final": String.raw`
10|We know that operating systems can process multiple jobs a time. Please state the primary difference between multitasking and multiprogramming (time-sharing).
10|Explain how the virtual memory management (VMM) system work.
10|Communication between computers must adhere to some protocols.
A|5|What is CSMA/CD and briefly describe how does it work?
A|5|Can you explain what is the hidden terminal problem of wireless networks and what protocol is used to resolve this problem?
10|Designing algorithms to be efficient is an art and the use cases should be considered. Please create a tactic to solve the following problem in a most efficient manner: Find the largest element in a list of 1 million numbers. In what conditions would you use brute-force search algorithms versus sorting and searching algorithms? Explain your approaches (Hint: Find the threshold of the algorithms).
10|The translation process of a computer program contains briefly the following steps: Lexical analyzer, parser, and code generator. Please explain what each step does.
10|C language stores array in a row major fashion. Consider the following code, what is the result of executing this program? (Hint: the program declares a 2D array data, and the printf functions access it as an 1D array, by casting the data pointer int** into int*.
C|#include <stdio.h>\n\nint data[10][20];\n\nint main( void )\n{\n    int a;\n    for( a = 0; a < 200; a++ )\n        data[a/20][a%20] = a*2;\n    printf( "%d\\n", ((int *)data)[50] );\n}
10|In terms of the relations shown below, what is the appearance of the relation FINAL after executing each of these instructions:
C|A relation          B relation\nL  M  N             X  Y\nX  P  1             9  7\nY  Q  7             4  3\nZ  R  6
A|5|FINAL ← SELECT from B where X = 9
A|5|FINAL ← SELECT from A where L = Z
10|The limitations of a distributed databases can be described using the CAP theorem, namely, consistency, availability, partition tolerance. Please explain each factor and why can’t all three properties be satisfied at the same time.
10|A database may use hashing to index its data to increase search efficiency. Consider the following data that are to be stored into a database. What will the final structure look like if we use a hashing key of 7? The data to be inserted is 9, 12, 5, 2, 88, 23, 55, 72, 21, 67, 22, 7, 13, 4.
10|Given the following undirected graph. Please find the minimum spanning tree of the graph and compute the minimum cost.
F|mst-final
15|Consider the following binary tree.
F|bst
A|3|What is the result using inorder traversal on this tree?
A|3|What is the result using postorder traversal on this tree?
A|3|What is the predecessors of the node 90?
A|3|What is the height of this tree (0-indexed)?
A|3|If this tree is in a binary search tree (BST) form. If we want to insert a node 70, where will it be in the tree?
`,
  "2026-quiz1": String.raw`
10|John von-Neumann wrote a incomplete draft “First Draft of a Report on the EDVAC” which brought out the concept of stored-program computers. Briefly describe this concept.
10|Given a boolean function (or a circuit), F = AB + ABC̄ + ĀBC + CD, where F is the output and A, B, C is the input, answer the following sub-questions.
A|5|Please tabulate the truth table for the circuit.
A|5|Simplify the above function into a sum of product form either using boolean algebra deduction or the K-map method.
10|Describe the difference between the following types of memory: ROM, EPROM, and EEPROM.
10|Suppose we have the following C program. What is the output of this program?\n(HINT: short int is 16-bit, 2’s compliment will be required)
C|#include <stdio.h>\n\nint main( void ) {\n    short int c = 0x7FFF;\n    c = c + 0x2;\n    printf( "%d\\n", c );\n    return 0;\n}
10|Consider a 8-bit floating point number with the following specs (conforming to IEEE754):\ns eee mmmm\nwhere s is the sign bit, eee is the exponent in excess-3 representation (hint: excess value - 3 == original value), and mmmm is the mantissa. Suppose we want to store a decimal number 0.3 using 8-bit IEEE754 floating number, what is the result if we convert the resulting 8-bit floating point back to decimal?
10|Originally, there are 6 characters A, B, C, D, E which requires 3-bits for each character, please use Huffman encoding method to encode/compress the following string, which originally requires 25 × 3 bits,
C|BCDECEEEEAACABECCEDCDDEEE
D|into a binary string. (The solution may not be unique)
A|5|Please create the Huffman tree and the corresponding encoding for each character.
A|5|What is the length of the final encoded string in binary?
10|What is CISC and RISC architecture? List the differences between them and write an example processor for each architecture?
10|Machine instructions are usually classified into 3 categories: Data Transfer, Arithmetic/Logic, and Control. Briefly describe what each category of the instructions do.
10|What is the program counter register (PC) and the instruction register (IR) in CPUs?
10|Suppose we have a 4-drive RAID5. In a disaster, we lost some blocks on each drive. Luckily, no 2 drives have the same blocks destroyed, so the data can be recovered. Please recover the data blocks indicated with a *.
C|Drive 1: 0*110101\nDrive 2: *10*111*\nDrive 3: 10*1*110\nDrive 4: 01010**0
`,
  "2026-quiz2": String.raw`
10|Consider the following memory and register layout, execute the following program stored in the virtual machine.
C|Registers R0 R1 R2 R3 R4 R5 R6 R7 R8 R9 R10 PC\nValue     00 3e 59 00 00 9a f8 00 00 00  13 22\n\nOffset  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F\n0x00   a4 4c 59 6d 14 b7 d4 a3 57 68 0a 70 c5 40 a0 1f\n0x10   38 eb 99 5f bb c5 99 70 a4 d0 08 06 de 40 2f 37\n0x20   81 39 20 00 11 0a 22 00 23 ff b1 32 52 21 51 13\n0x30   b0 2a 32 4f c0 00 ec e3 a0 d5 4a da 69 87 19 ca\n0x40   05 04 9b 48 66 6a d1 ac 0d e0 72 98 61 7c 85 70\n\nOpcode  Assembly Syntax  Machine Code\n1       LOAD R, [XY]    1RXY  load memory cell XY into R\n2       LOAD R, XY      2RXY  load immediate XY into R\n3       STORE R, [XY]   3RXY  store R into memory cell XY\n4       MOVE R, S       40RS  copy R into S\n5       ADD R, S, T     5RST  two’s-complement addition\n6       ADDF R, S, T    6RST  floating-point addition\n7       OR R, S, T      7RST  bitwise OR\n8       AND R, S, T     8RST  bitwise AND\n9       XOR R, S, T     9RST  bitwise XOR\nA       ROTATE R, X     AR0X  rotate R right X steps\nB       JUMP R, XY      BRXY  jump to XY when R equals R0\nC       HALT            C000  halt execution
A|5|Please decode the machine language into assembly code.
A|5|What is the final value stored in memory address 0x4f?
10|Consider the following assembly code and the number of clock cycles used.
C|(5 cycles) add R1, R2, R3\n(5 cycles) mov R4, R1\n(4 cycles) mov R5, R7\n(8 cycles) mul R4, R4, R5\n(5 cycles) add R1, R1, R5
A|5|If no speedup technology is used, what is the total time required (in clock cycles) for this program to be executed?
A|5|If we use simple pipelining with 1 stage per clock cycle, what is the running time of this program (disregarding all data dependencies)?
10|Suppose the transmission speed of USB hard drives to the main memory is as follows. The hard drive supports 6Gb/s transfer speed, USB-C supports 10Gb/s transfer speed, and the chipset supports 12Gb/s transfer speed. If we are to transfer 1 terabytes of data from the hard drive to the memory under this configuration, how much time (assuming maximum transfer speed on all devices) is required?
10|Please explain the difference between Memory-Mapped I/O and DMA.
10|Please explain what are parallel communication and serial communication. Which and why is the mainstream communication method currently used now?
10|What is handshaking in hardware (or software) device communication?
10|List 3 functions that a operating system should have.
10|An operation system can issue interrupts to programs to force context switching as shown in the figure below.
F|timeline
A|5|What happens if we decrease the time slice allocated for executing the processes? What happens if we increase the time slice?
A|5|Suppose there are two processes. The time required for storing the process state and restoring the process state is 10ms each. Assume that the time slice allocated for each process is 500ms. What percent of the computation time is wasted on context switching? How about decreasing the time slice to 100ms?
20|Explain or describe the following terms:
A|5|Multiprogramming.
A|5|Preemptive processes.
A|5|Kernel.
A|5|Timesharing operation systems.
`
};
