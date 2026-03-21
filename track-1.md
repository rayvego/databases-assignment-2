## Design and Implementation of Scalable Database Applications with Distributed Data Management

## 1. Introduction and motivation

This Track is designed to bridge the gap between theoretical software design and practical system implementation. The primary objective is to build a robust, database-driven software system while gaining a deep understanding of how real-world applications handle data storage, consistency, and scalability. Students will move beyond basic application development to master the integration of advanced data structures, transaction management, and distributed systems concepts.

## Structure of document:

- Part 1: Project Phase

Technical project phases covering UML design, database modelling, indexing, transactions, and sharding.

## · Part 2: Evaluation

Assessment methodology, performance metrics, and viva-based evaluation framework.

- Part 3: Expected outcomes

Functionality, design, performance, optimisation, coverage of failure scenarios.

- Part 4: Course Project statements

Real-world problem domains, existing limitations, and motivation for database-driven solutions.

## 2. Project Phase

## Assignment 1: Database and UML Development

This assignment involves conducting a detailed requirement analysis of the selected problem statement to clearly define system scope and functionality. A system architecture will be designed using standard UML diagrams to model structural and behavioural aspects of the application. Based on this design, a normalised relational database schema will be developed, specifying entities, relationships, primary and foreign keys, and integrity constraints to ensure an efficient and consistent data model.

## Learning Objectives:

- System Modelling: Transforming real-world requirements into formal technical models.
- Architectural Design: Understanding data and control flow within a complete software system.
- Database Normalisation: Applying principles from 1NF to 3NF to reduce redundancy and dependencies.
- Schema Mapping: Converting object-oriented class diagrams into relational database tables.

## Assignment 2: Application and B+ Tree Development

This assignment requires the development of core backend application logic along with a custom B+ Tree indexing structure implemented from scratch. The B+ Tree will function as a high-performance indexing layer for critical attributes such as User IDs, Order Timestamps, or Transaction Logs. The application must integrate this index to support efficient search and range query operations, demonstrating the practical impact of data structures on system performance.

## Learning Objectives:

- Indexing Internals: Understanding how database indexes enable fast data retrieval.
- Algorithmic Implementation: Implementing B+ Trees to support logarithmic-time operations.
- Query Optimisation: Demonstrating performance gains of indexed access over linear scanning.
- System Integration: Linking low-level data structures with high-level application logic.

## Assignment 3: ACID Testing on the Application and B+ Tree

This assignment focuses on evaluating the system under concurrent workloads to validate ACID properties (Atomicity, Consistency, Isolation, Durability). Simulated multi-user scenarios will be created to test simultaneous read, write, and update operations. Special attention will be given to maintaining consistency between the main database and the custom B+ Tree index during transaction rollbacks, crashes, or partial failures.

## Learning Objectives:

- Transaction Management: Designing operations that either complete fully or revert safely.
- Concurrency Control: Applying locking and synchronisation mechanisms to prevent conflicts.
- Data Integrity: Ensuring alignment between database records and index structures.
- Crash Recovery: Studying mechanisms that guarantee data persistence after failures.

## Assignment 4: Sharding of the Developed Application

This assignment involves implementing logical data partitioning (sharding) across multiple simulated nodes or tables. A suitable Shard Key (such as Region, User ID, or Hash value) will be selected, and application logic will be modified to correctly route queries to the appropriate shard. The exercise simulates real-world distributed database systems that scale horizontally to handle large datasets.

## Learning Objectives:

- Horizontal Scaling: Distinguishing between vertical and horizontal system expansion.
- Sharding Strategies: Applying range-based, directory-based, and hash-based partitioning.
- Distributed Query Routing: Locating data across multiple partitions efficiently.
- Scalability Trade-offs: Analysing consistency, availability, and partition tolerance in distributed systems.

## 3. Evaluation Plan

The proposed system will be evaluated along the following dimensions:

- Correctness and Design Quality: Accuracy of requirement analysis, UML modelling, schema normalisation, and alignment between application logic and database design.
- Indexing and Transactional Behaviour: Proper implementation of the B+ Tree indexing structure and validation of ACID properties under concurrent access and failure conditions.

- Scalability and Performance: Impact of indexing and sharding on query latency, throughput, and system overhead compared to baseline approaches.

Evaluation will follow predefined rubrics for each assignment, with a viva conducted after every assignment.

Note: Separate documents will be shared for each assignment and evaluation.

## 4. Expected Outcomes

By the end of Track 1, the project is expected to achieve the following outcomes:

- A well-structured system design based on requirement analysis
- UML modelling, and normalised relational schemas.
- A functional application
- A custom B+ Tree indexing mechanism for efficient data retrieval.
- A robust system demonstrating ACID compliance under concurrent and failure scenarios.
- A sharded data architecture illustrating principles of distributed databases and horizontal scalability.
- A scalable database-driven application capable of handling real-world complexities.

## Course Project Statements

## 1. FreshWash - Laundry Management System

Problem Statement: Most local and medium-scale laundry services rely on manual record-keeping, phone calls, and paper bills to manage customer orders, pickups, and deliveries. This results in misplaced orders, incorrect billing, missed pickup schedules, and poor tracking of customer history. Customers often face delays, lost garments, and unclear payment details, while shop owners struggle to monitor daily operations and pending payments. As customer volume increases, managing laundry operations without a proper system becomes inefficient and error-prone. This creates a service quality gap, as customers do not receive reliable, transparent laundry services.

Current Solutions: Many laundry shops use handwritten registers, Excel sheets, or basic billing software to track orders and payments. Some mobile apps offer limited features, such as order booking or digital receipts. Still, they often fail to integrate pickup scheduling, item-wise order tracking, payment management, and delivery status into a single platform. These systems also lack proper customer history management and feedback analysis, making it difficult to improve service quality. As a result, existing solutions do not fully address the operational and customer service challenges faced by modern laundry businesses.

## 2. ShuttleGo - Shuttle Management System

Problem Statement: Many institutional, corporate, and city shuttle services operate using static schedules, manual booking methods, and paper-based ticketing. Passengers often lack real-time bus availability information, leading to overcrowding or empty seats, while authorities struggle to obtain accurate data on demand patterns. Missed bookings and last-minute cancellations disrupt seat planning, resulting in financial losses and inconvenience for both operators and travellers. Drivers also face difficulty in verifying tickets quickly, which increases boarding time and causes delays. Overall, the absence of a centralised digital system leads to inefficient fleet utilisation, a poor passenger experience, and limited operational transparency.

Current Solutions: Most shuttle services rely on basic transport apps, printed tickets, or manual attendance sheets to manage passenger bookings. Some mobile applications allow users to view schedules and reserve seats. Still, they typically lack real-time vehicle tracking, automated penalty handling for no-shows, and accurate demand analysis, which are essential for effective route optimisation. Ticket verification is often done manually or via simple QR scanning, with limited integration with booking records. These systems provide limited historical travel data and offer little insight to authorities for improving service planning and efficiency.

## 3. Dispensary Management System

Problem Statement: In educational institutions and workplace campuses, dispensaries handle a large number of patients daily; however, most still rely on paper files, manual registers, and

verbal communication to manage medical records, appointments, and medicine stocks. This leads to incomplete or lost student health histories, untracked allergies, delayed emergency response, and poor coordination between doctors and staff. In critical cases, the lack of real-time tracking and quick access to patient data can delay treatment and increase the risk of health complications. Additionally, medicine shortages often go unnoticed until it is too late, affecting the quality of care provided.

Current Solutions: Many dispensaries utilise basic hospital management software or simple spreadsheet-based systems to store patient information and dispense medications. Some clinics utilise appointment booking tools; however, these are typically not integrated with patient medical records, doctor schedules, or inventory systems. Emergency cases are typically handled manually via phone calls and physical registers, without any real-time monitoring or escalation mechanisms. These systems also lack intelligent stock alerts, medication-use analytics, and data-driven insights into patient health trends, making it difficult for administrators to improve healthcare delivery and preparedness.

## 4. FixIIT - Maintenance Portal

Problem Statement: On large campuses, in hostels, offices, and institutions, maintenance issues such as electrical faults, plumbing leaks, or internet failures are usually reported by phone, handwritten complaints, or informal messages. This often results in lost or ignored requests, unclear responsibility, and long resolution times. Users have no way to track the status of their complaints, while maintenance teams struggle to prioritise urgent issues and measure their own performance. The lack of transparency and accountability leads to repeated complaints, inefficient resource utilisation, and dissatisfaction among both residents and staff. Current Solutions: Many organisations still rely on manual complaint registers, email chains, or basic ticketing tools to manage maintenance requests. While some software allows online complaint submission, it usually lacks automated work order assignment, real-time status updates, and integrated performance analytics. Notifications are often sent manually or not at all, leaving users unaware of progress. These systems also provide limited reporting on response times, technician efficiency, and recurring issues, making it difficult for management to identify bottlenecks and improve maintenance operations.

## 5. GateGuard - Entry Gate Management System

Problem Statement: In campuses, residential complexes, and corporate facilities, entry and exit management is often handled by security personnel using handwritten logs or verbal verification. This manual process is slow, error-prone, and vulnerable to security breaches, as unauthorised visitors or vehicles can enter without proper tracking. During peak hours, long queues form at gates, causing congestion and increasing the risk of missed or incorrect entries. Additionally, authorities lack real-time visibility into who is on the premises, making it difficult to respond to emergencies or monitor occupancy levels effectively.

Current Solutions: Many facilities use basic access cards, visitor registers, or simple

gate management software to control entry. Some systems support QR codes or RFID cards, but they usually focus only on authentication and do not provide integrated vehicle tracking, real-time occupancy monitoring, or detailed traffic analytics. Visitor pre-registration is often handled through separate systems or manual approvals, leading to delays at the gate. These fragmented solutions provide limited insight into peak-hour traffic, security risks, and overall gate performance, reducing their effectiveness in managing large-scale or high-security environments.

## 6. SafeDocs - Secure PDF Management System

Problem Statement: Organisations handle large volumes of sensitive PDF documents, including legal files, financial reports, academic records, and internal policies. Still, these are often stored in shared folders, email attachments, or unsecured cloud drives. This makes documents vulnerable to unauthorised access, accidental deletion, data leaks, and compliance violations. There is little visibility into who accessed which file, when, or what actions were performed. As a result, organisations face serious risks related to data security, privacy, and regulatory compliance.

Current Solutions: Most organisations utilise generic cloud storage platforms, such as Google Drive, Dropbox, or email systems, to share and store PDF documents. While these platforms provide basic access control and sharing features, they lack fine-grained permission settings such as view-only, edit, or delete restrictions at the document level. File access logging and audit trails are either limited or difficult to analyse, resulting in weak security monitoring. Additionally, these systems lack effective mechanisms to reject or block unwanted or maliciously shared files, leaving users exposed to document spam and security threats.

## 7. CallHub - Phone Directory Management System

Problem Statement: In large institutions and organisations, contact information for students, faculty, and staff is often scattered across multiple spreadsheets, paper directories, or personal contact lists. This makes it difficult to quickly find the right person, especially in urgent or emergency situations. Sensitive contact details may be exposed to unauthorised users, raising concerns about privacy and security. Moreover, there is no clear way to track how frequently the directory is used or which departments are most contacted, limiting the ability to improve communication efficiency.

Current Solutions: Most organisations rely on printed directories, basic online lists, or simple database applications to store phone numbers and email addresses. Some systems offer basic search functions, but they usually lack advanced filtering by department, role, or responsibility. Role-based access control is rarely implemented, leaving sensitive contacts either overexposed or difficult to protect. These systems also do not provide meaningful usage analytics, making it hard for administrators to understand communication patterns or optimise information accessibility.

## 8. Campus Trading Application

Problem Statement: In college and university campuses, students frequently buy and sell items such as books, electronics, furniture, and accessories. Still, these transactions are usually conducted through informal WhatsApp groups, social media posts, or notice boards. This makes it challenging to verify sellers, track transactions, or ensure safe and fair trading. Fake listings, unresponsive sellers, and a lack of trust often lead to wasted time and financial loss. Additionally, there is no organised way to analyse trading activity or understand which products are in high demand on campus.

Current Solutions: Students typically use general-purpose platforms, such as WhatsApp, Facebook Marketplace, or OLX, to trade items. While these platforms enable posting and searching for products, they are not explicitly designed for a campus environment and do not provide user verification, transaction tracking, or integrated communication features. Rating and review systems are either absent or limited to campus users, which reduces their credibility. These platforms also do not provide administrators or student bodies with analytics to understand buying and selling trends within the campus community.

## 9. GranthPath - Library Management System

Problem Statement: Many libraries, especially in educational institutions, still rely on manual registers or partially computerised systems to manage book inventories, issue and return records, and fine calculations. This leads to misplaced books, incorrect due dates, and errors in fine computation. Students often do not know whether a book is available or reserved, resulting in repeated visits and wasted time. The lack of integration with digital libraries and automated notifications also causes users to miss due dates, leading to unnecessary fines and dissatisfaction.

Current Solutions: Some libraries use basic library management software or spreadsheet-based systems to record book details and borrowing history. While these systems can handle issue and return operations, they often lack real-time inventory updates, online reservation features, and seamless integration with digital library resources. Fine calculations are often handled manually or through simple rules, which can lead to inconsistencies. Automated reminders, whether via email or mobile notifications, are either limited or unavailable, thereby reducing the effectiveness of these solutions.

## 10. CheckInOut - Hostel Management System

Problem Statement: In hostels and student accommodations, room allocation, check-in, and check-out processes are often managed using paper forms, registers, or disconnected software systems. This leads to confusion about room availability, incorrect occupancy records, and delays during admission or departure periods. Hostel administrators struggle to track who is currently staying in which room, making it challenging to manage security, maintenance, and capacity planning. During peak times, such as the beginning or end of academic terms, these

inefficiencies result in long queues, errors, and poor student experience.

Current Solutions: Most hostels use manual record-keeping or basic hostel management software to handle room assignments and resident details. Some systems offer digital check-in and check-out, but they often fail to provide real-time occupancy monitoring or automated room allocation based on availability and student preferences. Reporting features are typically limited, making it challenging for administrators to analyse capacity utilisation or plan for future accommodation needs. As a result, existing solutions do not fully support efficient, data-driven hostel management.

## 11. Olympia Track - Sports Management System

Problem Statement: Many schools, colleges, and sports clubs still rely on manual registers, simple spreadsheets, or disconnected tools to manage their sports activities. Because information about event schedules, team members, equipment, and player performance is stored in different places, it leads to problems such as scheduling clashes, unreturned equipment, and incorrect records of who participated. Coaches and administrators also struggle to track a player's improvement over time. As sports programs expand, managing everything manually becomes disorganized, resulting in wasted time and missed opportunities for athlete development.

Current Solutions: Currently, most organisations use basic tools, such as Excel sheets, paper notebooks, or general-purpose software, to track schedules and players. While some apps allow event calendar creation, they often lack essential features such as tracking equipment inventory or analysing player performance in detail. These systems do not provide real-time updates on athlete participation or the use of sports gear. As a result, existing solutions often fail to provide a comprehensive and organised approach to managing modern sports operations effectively.

## 12. StayEase - Hostel Management System

Problem Statement: Hostel management in many colleges and schools is still done using manual registers or separate, unconnected tools. This makes key tasks, such as room assignments, fee payments, and student complaints, slow and error-prone. Wardens often struggle to determine which rooms are occupied, fail to address maintenance issues in a timely manner, and struggle to keep track of visitors and hostel property. Meanwhile, students are frustrated by delayed responses to their complaints and confusion about room allocation and pending fees. As the number of students increases, running a hostel without a proper central system results in disorganised administration and dissatisfied students.

Current Solutions: Currently, most hostels rely on paper records, Excel spreadsheets, or basic software to manage their daily operations. While some systems assist with specific Assignments, such as room booking or fee collection, they rarely integrate everything. They often miss essential features, such as a digital complaint box, visitor entry logs, automatic fee reminders, and tracking the condition of hostel furniture. These incomplete solutions do not provide a real-time view of what is happening in the hostel. As a result, existing methods fail to

make hostel management efficient, transparent, or organised.

## 13. QuickBites - Food Delivery System

Problem Statement: Modern food delivery apps handle a vast number of orders every day, requiring instant updates and accurate menu information. However, many platforms struggle with problems like delayed order status updates, incorrect menu listings, and slow app performance during busy hours (peak times). This usually happens because the background database systems cannot retrieve data quickly enough. Customers often feel uncertain about the status of their order, while restaurants encounter issues with incorrect orders or inadequate stock management. As the number of users grows, traditional data-handling methods fail to deliver the speed and reliability required for a seamless delivery experience.

Current Solutions: Currently, most food delivery platforms allow users to order and track food through mobile apps or websites. These systems generally employ standard methods for storing and retrieving data, which work well for small numbers but often slow down when too many people use the app simultaneously. While the app interface may display alerts, the backend system usually lags in updating real-time information. Most existing solutions do not use optimised data structures-specifically, they lack custom B+ Tree indexing to speed up data searches. As a result, current systems are often not scalable or fast enough to support high-performance food delivery operations.

## 14. ScholarEase - Scholarship &amp; Stipend Management System

Problem Statement: Many colleges and government offices still manage scholarships and stipends using manual paperwork or separate computer files that don't talk to each other. This makes the process confusing for students, who struggle to apply, verify their eligibility, or determine when they will receive their money. Administrators find it difficult to manually verify essential details, such as family income, grades (CPI), and category certificates, which often leads to long delays and mistakes. Without a central system, it is also hard to track how funds are being used, increasing the chance of errors or misuse. As the number of applicants grows, this manual process becomes too slow, messy, and complicated to monitor effectively.

Current Solutions: Currently, most institutions rely on manual checking, Excel sheets, or simple websites that only allow students to fill out forms. While some portals accept online applications, they often lack advanced features such as automatic eligibility checks, real-time fund tracking, or detailed reports. These systems rarely give administrators a clear picture of how funds are distributed or which students are still waiting for payments based on their academic performance. As a result, existing solutions fail to make the scholarship process transparent, fast, and accurate for everyone involved.

## 15. ShopStop - Outlet Management System

Problem Statement: Many retail shops still depend on manual records or separate, unconnected software to manage their stock, sales, suppliers, and staff details. This often leads to problems such as running out of popular items (stock shortages), ordering excessive quantities of unwanted items, errors in calculating staff salaries, and difficulty in tracking regular customers for rewards. Shop owners struggle to see their current stock levels in real time or to manage supplier orders efficiently. Customers also face long waits at billing counters and limited payment choices. As a business grows, managing a shop without a single, integrated system becomes messy and error-prone.

Current Solutions: Currently, most shops use basic billing software, Excel sheets, or various tools to manage inventory and staff. While some systems can handle billing and digital payments, they often fail to update stock levels automatically or integrate with supplier orders and staff attendance. Customer loyalty programs (points and rewards) are usually managed manually or in a separate app, making them hard to track. As a result, existing solutions fail to provide an "all-in-one" system that makes running a modern shop easy and efficient.

## 16. CareerTrack - Placement Management System

Problem Statement: Colleges must manage placement drives involving hundreds of students and numerous recruiting companies, often relying on cumbersome spreadsheets, emails, and manual coordination. This makes it very difficult to track which students are eligible for which job, schedule interviews without conflicts, and keep accurate records of placement statistics. Students often face confusion about their interview timings or eligibility requirements, while placement officers struggle to gather feedback or assess the effectiveness of the recruitment process. As the number of students and companies grows, this manual approach leads to miscommunication and inefficiency, reducing the overall success of the placement drive.

Current Solutions: Currently, most colleges use simple websites, Excel sheets, or general college software (ERP) to handle placement data. While these systems can store student profiles and company details, they often lack "smart" features such as automatically filtering eligible students, scheduling interviews, or generating detailed reports. Communication between students, recruiters, and the placement team is still primarily conducted manually through email. As a result, existing solutions fail to provide the automated tools and data insights needed to make the campus recruitment process smooth and effective.

## 17. Dinewell - Mess Management System

Problem Statement: Mess and canteen operations in hostels and colleges are often managed manually, leading to problems such as poor meal planning, food waste, and billing errors. Administrators struggle to track daily food consumption, manage grocery expenses, handle various staff responsibilities, and collect outstanding payments from students. On the other hand, students face inconvenience because they often have to pay in cash, are unsure about

the daily menu, and sometimes find errors in their monthly bills. As the number of students increases, running the mess without proper data results in more food waste and higher operating costs.

Current Solutions: Currently, most mess facilities rely on paper registers, Excel sheets, or simple billing computers to track meals and payments. While some places use digital menus or QR codes for payment, these systems often fail to connect with the inventory (stock) or track how much food is being wasted. They lack "smart" features that inform managers about daily expenses, supplier costs, or trends in leftover food. As a result, existing solutions fail to make mess management efficient, transparent, and eco-friendly.

## 18. College Social Media Platform

Problem Statement: Colleges and universities often lack their own private social network where students and faculty can share updates, ideas, and announcements in a safe environment. Relying on public social media platforms (such as Instagram or Twitter) creates problems because these platforms are open to everyone, leading to privacy risks, distractions, and potential misuse. In an academic setting, there is currently no central way to verify that users are actual students, monitor inappropriate posts, or record user activity. This makes it challenging to maintain a healthy and accountable digital community on campus.

Current Solutions: Currently, most colleges rely on public platforms like WhatsApp groups, Twitter, and Instagram for communication. However, these apps are not designed for schools; they allow anyone to join, have limited moderation tools, and do not connect with official college ID systems. While they enable basic features like posting, liking, and commenting, they lack the specific controls an institution needs, such as internal reporting of harmful content or verifying user identities. As a result, existing solutions fail to provide a secure, controlled, and campus-focused networking experience.

## 19. College Cab Sharing Portal

Problem Statement: Students travelling to and from college often struggle with high travel costs and limited public transport options. Trying to share rides using informal methods, such as WhatsApp groups, is messy-it leads to confusion, double bookings, sudden cancellations, and safety concerns because you cannot verify who you are traveling with. There is no proper system to check available rides in real time, prevent too many people from booking the same seat, or keep a history of past trips. This makes travel planning stressful, expensive, and inefficient for students.

Current Solutions: Currently, most students rely on WhatsApp groups, college notice boards, or general taxi apps that aren't designed for student carpooling. These methods lack essential safety features, such as verifying that the passenger is actually a student from the same college. They also fail to handle crucial tasks, such as automatically removing old ride requests or strictly limiting the number of seats. While general apps work for solo rides, they don't support campus-specific routes or track shared college trips. As a result, existing solutions fail to offer a

safe, organised, and budget-friendly way for students to share rides.

## 20. Multi-Course Attendance Management Portal

Problem Statement: In many colleges and universities, tracking attendance for different subjects is still done using paper registers or separate computer files. This makes the process very slow and often leads to mistakes. Teachers often find it challenging to manage attendance across multiple classes, avoid duplicate entries, and address student requests to correct errors. On the other hand, students often cannot see their updated attendance records in real time and only find out they have an attendance shortage when it is too late. As the number of courses and students grows, relying on these manual methods becomes messy, unreliable, and stressful for everyone.

Current Solutions: Currently, most institutions use physical registers, Excel sheets, or basic attendance software. These tools often work well for a single class but struggle when managing data across multiple courses. They usually lack "smart" features, such as automatically warning students about low attendance or preventing unauthorised changes to the records. Furthermore, if a student wants to correct an attendance mistake, they typically have to speak with the teacher in person or send an email, which can lead to delays and record mismatches. As a result, existing systems fail to provide an effective, secure, and organised way to track attendance across all subjects.

## 21. Blind Drop - Privacy-Focused File Transfer Portal

Problem Statement: Transferring files from public computers (such as those found in libraries, colleges, or cybercafes) to personal devices is often risky and inconvenient. If a user logs into their Email, Google Drive, or WhatsApp Web on a public computer to send a file, they risk having their password stolen or forgetting to log out. Using USB drives is also dangerous because they can easily spread viruses. There is a strong need for a way to transfer files quickly and securely without requiring sign-in, account creation, or leaving any trace of the file on the public device. Current Solutions: Currently, most people rely on cloud storage services (such as Drive or Dropbox) or messaging apps to transfer files, but all of these require logging in with personal credentials, which is unsafe on shared computers. While some temporary file-sharing websites exist, they often keep files on their servers for days or generate links that anyone can access if they check the browser history. These solutions usually lack strict privacy controls, such as automatically deleting the file immediately after it is downloaded. As a result, existing methods fail to provide a safe, login-free, and private way to move files between devices.