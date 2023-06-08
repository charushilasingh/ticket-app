const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'res', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const responseDir = path.join(__dirname, 'res', 'response');
if (!fs.existsSync(responseDir)) {
    fs.mkdirSync(responseDir, { recursive: true });
}

const ticketList = [];
const responsePath = path.join(responseDir, 'response.json');

initTicketsFromStore();

app.post('/tickets', upload.single('attachment'), (req, res) => {
    const { phoneNumber, title, description } = req.body;

    if (phoneNumber && title) {
        if (isTicketAlreadyExists(phoneNumber, title, description, req.file)) {
            return res.status(200).json({
                message: 'Duplicate ticket cannot be stored.'
            });
        } else {
            createTicket(phoneNumber, title, description, req.file);
        }
    }

    res.status(201).json({ message: 'Ticket stored successfully.' });
});

function initTicketsFromStore() {
    if (fs.existsSync(responsePath)) {
        const fileStats = fs.statSync(responsePath);
        if (fileStats.size > 0) {
            const existingTickets = JSON.parse(fs.readFileSync(responsePath));
            ticketList.push(...existingTickets);
        }
    }
}

function isTicketAlreadyExists(phoneNumber, title, description, attachment) {
    if (ticketList.length > 0) {
        for (const ticket of ticketList) {
            if (
                ticket.phoneNumber === phoneNumber &&
                ticket.title === title &&
                ticket.description === description
            ) {
                if (attachment && ticket.attachment) {
                    if (ticket.attachment === path.join(uploadDir, attachment.originalname)) {
                        return true; // Both have same attachment name
                    }
                } else if (!attachment && !ticket.attachment) {
                    return true; // No attachment but other fields are duplicate 
                }
            }
        }
        return false;
    }
    return false;
}

function createTicket(phoneNumber, title, description, attachment) {
    const ticket = {
        phoneNumber,
        title,
        createdAt: new Date().toISOString(),
        ...(description && { description })
    };

    if (attachment) {
        const originalFileName = attachment.originalname;
        const filePath = path.join(uploadDir, originalFileName);
        fs.writeFileSync(filePath, attachment.buffer);
        ticket.attachment = filePath;
    }

    ticketList.push(ticket);
    saveResponseJSON();
}

function saveResponseJSON() {
    fs.writeFileSync(responsePath, JSON.stringify(ticketList, null, 2));
}

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

